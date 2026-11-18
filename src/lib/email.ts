/**
 * Outbound email. Currently one job: tell us when somebody submits the landing page's
 * collaboration form, so an enquiry can't sit unread in the CMS indefinitely.
 *
 * The hard rule in here is that **nothing in this file ever throws.** It's called from a
 * Payload `afterChange` hook, and an exception thrown there propagates out of the write
 * and fails the request — which would mean a transient mail outage made the form look
 * broken to the visitor, after their message had already been saved. A missed
 * notification is a small problem; a form that rejects submissions is a real one.
 */

import { Resend } from "resend";

import type { CollaborationRequest } from "@/payload-types";

/**
 * Sender address. Resend only accepts a `from` on a domain verified in the account, so
 * this is env-driven — a wrong default here fails every send with a 403 that looks like a
 * code bug. See `.env.example`.
 */
const FROM = process.env.RESEND_FROM || "CrimsonC9 <noreply@crimsonc9.com>";

/** Where enquiries are sent. Overridable so a preview deploy can route mail elsewhere. */
const NOTIFY = process.env.C9_NOTIFY_EMAIL || "hello@crimsonc9.com";

/** Human-readable enquiry labels for the subject line. */
const TYPE_LABELS: Record<CollaborationRequest["type"], string> = {
  booking: "Booking",
  collaboration: "Collaboration",
  volunteer: "Volunteer",
  other: "General",
};

export async function sendCollaborationNotification(doc: CollaborationRequest): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;

  // No key configured — local dev, or a deploy where the secret hasn't been set yet. Log
  // loudly enough to be noticed and carry on; the submission is already stored either way.
  if (!apiKey) {
    console.warn(
      `[collaboration-requests] RESEND_API_KEY not set — no email sent for submission #${doc.id} from ${doc.name}. Read it in the CMS.`,
    );
    return;
  }

  const label = TYPE_LABELS[doc.type] ?? "Enquiry";

  try {
    const resend = new Resend(apiKey);

    // `replyTo` is the useful part: hitting reply in the inbox answers the sender directly,
    // rather than replying to our own noreply address.
    const { error } = await resend.emails.send({
      from: FROM,
      to: NOTIFY,
      replyTo: doc.email,
      subject: `[${label}] New enquiry from ${doc.name}`,
      text: [
        `${label} enquiry via crimsonc9.com`,
        "",
        `Name:    ${doc.name}`,
        `Email:   ${doc.email}`,
        `Type:    ${doc.type}`,
        `Sent:    ${doc.submittedAt ?? doc.createdAt}`,
        "",
        "Message:",
        doc.message,
        "",
        "—",
        `Manage this enquiry in the CMS: /admin/collections/collaboration-requests/${doc.id}`,
      ].join("\n"),
    });

    // The SDK resolves with `{ data, error }` instead of rejecting, so an API-level
    // failure is invisible unless `error` is checked explicitly.
    if (error) {
      console.error(
        `[collaboration-requests] Resend rejected the notification for submission #${doc.id}:`,
        error.message,
      );
    }
  } catch (error) {
    // Network failure, DNS, a bad key shape — anything the SDK does throw on.
    console.error(
      `[collaboration-requests] Failed to send notification for submission #${doc.id}:`,
      error instanceof Error ? error.message : error,
    );
  }
}
