/**
 * Collaboration enquiries from the landing page form.
 *
 * This replaces Payload's REST endpoint, which used to serve this same path via the
 * `(payload)/api/[...slug]` catch-all. The URL is deliberately unchanged so the form did
 * not have to move with it, and so it moves back without a client change when the
 * collection returns.
 *
 * With no database in v1 the email is the only copy of an enquiry, which drives two
 * decisions here that would otherwise look over-careful:
 *
 *  - A failed send returns an error instead of a cheerful 201. The visitor has to know the
 *    message did not arrive, because the mailto link under the form is their fallback.
 *  - The endpoint is rate limited. It sends mail on an unauthenticated POST, so without a
 *    limit it is a way to flood the inbox and burn the mail provider's quota.
 */

import { NextResponse } from "next/server";

import {
  sendCollaborationNotification,
  type CollaborationSubmission,
  type EnquiryType,
} from "@/lib/email";

const ENQUIRY_TYPES: readonly EnquiryType[] = [
  "collaboration",
  "music-label",
  "booking",
  "support",
  "other",
];

/**
 * Field caps. The form itself is bounded, so anything past these is a direct POST rather
 * than a visitor — reject instead of relaying it into an inbox.
 */
const LIMITS = { name: 200, email: 320, message: 5000 } as const;

const RATE_LIMIT = { max: 5, windowMs: 10 * 60 * 1000 } as const;

/**
 * Fixed-window counter, per IP, in memory.
 *
 * In memory is the right size for this: one container, one process, and an enquiry form
 * nobody submits twice a day. It resets on deploy, and it would need to move to a shared
 * store the moment this runs more than one instance — noted here because that is exactly
 * the kind of thing that silently stops working after a scale-up.
 */
const hits = new Map<string, { count: number; resetAt: number }>();

/**
 * Counts *attempted sends*, not requests — deliberately split into a check and a record.
 *
 * Counting every request looks equivalent and is not: four typos in the email field would
 * then lock a genuine visitor out for the rest of the window, which is a worse failure than
 * the one being defended against. A request that never sends mail costs nothing worth
 * rationing, so only a request that reaches the mail provider is recorded — including a failed one,
 * since the outbound call is the cost being rationed.
 */
function overSendLimit(ip: string): boolean {
  const entry = hits.get(ip);
  return entry !== undefined && entry.resetAt > Date.now() && entry.count >= RATE_LIMIT.max;
}

function recordSend(ip: string): void {
  const now = Date.now();

  // Opportunistic cleanup; the map would otherwise grow for the life of the process.
  if (hits.size > 1000) {
    for (const [key, entry] of hits) if (entry.resetAt <= now) hits.delete(key);
  }

  const entry = hits.get(ip);
  if (!entry || entry.resetAt <= now) {
    hits.set(ip, { count: 1, resetAt: now + RATE_LIMIT.windowMs });
    return;
  }

  entry.count += 1;
}

/** Matches the error shape the form already parses: `{ errors: [{ message }] }`. */
function fail(message: string, status: number) {
  return NextResponse.json({ errors: [{ message }] }, { status });
}

function clientIp(request: Request): string {
  // Caddy sets X-Forwarded-For; the left-most entry is the original client.
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || "unknown";
}

export async function POST(request: Request) {
  const ip = clientIp(request);

  if (overSendLimit(ip)) {
    return fail("Too many messages from this address. Please try again later.", 429);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return fail("Could not read that request.", 400);
  }

  if (typeof body !== "object" || body === null) {
    return fail("Could not read that request.", 400);
  }

  const raw = body as Record<string, unknown>;
  const text = (value: unknown) => (typeof value === "string" ? value.trim() : "");

  // Honeypot. The form never posts this field, so anything in it arrived from a script.
  // Answer 201 rather than rejecting — a visible rejection just tells a bot what to fix.
  if (text(raw.website)) return NextResponse.json({ ok: true }, { status: 201 });

  const name = text(raw.name);
  const email = text(raw.email);
  const type = text(raw.type);
  const message = text(raw.message);

  if (!name || !email || !type || !message) {
    return fail("Please fill in every field.", 400);
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return fail("That doesn't look like a valid email address.", 400);
  }
  if (!ENQUIRY_TYPES.includes(type as EnquiryType)) {
    return fail("Pick what this is about.", 400);
  }
  if (name.length > LIMITS.name || email.length > LIMITS.email || message.length > LIMITS.message) {
    return fail("That message is too long to send.", 400);
  }

  const submission: CollaborationSubmission = {
    name,
    email,
    type: type as EnquiryType,
    message,
    submittedAt: new Date().toISOString(),
  };

  const result = await sendCollaborationNotification(submission);

  recordSend(ip);

  if (!result.ok) {
    // The enquiry is in the container log (see logUndelivered) but the visitor cannot know
    // that, so tell them plainly and let them fall back to the address under the form.
    return fail("We couldn't send that just now — please email us directly instead.", 502);
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
