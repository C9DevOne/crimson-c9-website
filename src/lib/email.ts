/**
 * Outbound email. Currently one job: deliver the landing page's collaboration enquiries.
 *
 * **This used to be a notification; it is now the delivery mechanism.** While Payload was
 * wired up, the enquiry was written to the `collaboration-requests` collection and this
 * email was a convenience on top — so the rule was that nothing in here could ever throw,
 * because a mail outage must not fail a write that had already succeeded.
 *
 * With the database decoupled for v1 there is no row. The email *is* the record, so a
 * failure has to be reported rather than swallowed: the visitor needs to know their message
 * did not arrive, so they can use the address printed under the form instead.
 *
 * It still never throws — it reports through its return value. That keeps it safe to call
 * from a Payload `afterChange` hook unchanged when the collection comes back, where a thrown
 * error would propagate out of the write.
 *
 * Delivery goes through ZeptoMail (see `./zeptomail.ts`). This was Resend first; it moved
 * because the ticket shop already sends through ZeptoMail with `crimsonc9.com` verified
 * there, and a second provider on the same domain means a second set of DKIM/SPF records
 * and a second place to look when mail does not arrive — for the one email this file sends.
 */

import { sendViaZeptoMail } from "./zeptomail";

/** Where enquiries are sent. Overridable so a staging deploy can route mail elsewhere. */
const NOTIFY = process.env.C9_NOTIFY_EMAIL || "hello@crimsonc9.com";

export type EnquiryType = "collaboration" | "music-label" | "booking" | "support" | "other";

/**
 * Deliberately structural rather than importing `CollaborationRequest` from
 * `@/payload-types`: this file should not depend on the CMS being wired up. A Payload doc
 * satisfies this shape as-is, so the `afterChange` hook keeps compiling either way.
 */
export type CollaborationSubmission = {
  id?: string | number;
  name: string;
  email: string;
  type: EnquiryType;
  message: string;
  submittedAt?: string | null;
  createdAt?: string | null;
};

export type DeliveryResult = { ok: true } | { ok: false; reason: "not-configured" | "failed" };

/** Human-readable enquiry labels for the subject line. */
const TYPE_LABELS: Record<EnquiryType, string> = {
  collaboration: "Collaboration",
  "music-label": "Music / Label",
  booking: "Booking",
  support: "Support",
  other: "Other",
};

/**
 * Logs an enquiry in full so it is recoverable from the container logs when mail fails.
 * Without a database this is the only other copy that exists.
 */
function logUndelivered(submission: CollaborationSubmission, why: string): void {
  console.error(
    [
      `[collaboration] UNDELIVERED (${why}) — recover this from the log:`,
      `  name:    ${submission.name}`,
      `  email:   ${submission.email}`,
      `  type:    ${submission.type}`,
      `  sent:    ${submission.submittedAt ?? submission.createdAt ?? new Date().toISOString()}`,
      `  message: ${submission.message.replace(/\n/g, "\n           ")}`,
    ].join("\n"),
  );
}

export async function sendCollaborationNotification(
  submission: CollaborationSubmission,
): Promise<DeliveryResult> {
  if (!process.env.ZEPTOMAIL_TOKEN) {
    logUndelivered(submission, "ZEPTOMAIL_TOKEN not set");
    return { ok: false, reason: "not-configured" };
  }

  const label = TYPE_LABELS[submission.type] ?? "Enquiry";
  const sent = submission.submittedAt ?? submission.createdAt ?? new Date().toISOString();

  try {
    // `replyTo` is the useful part: hitting reply in the inbox answers the sender directly,
    // rather than replying to our own noreply address.
    await sendViaZeptoMail({
      to: NOTIFY,
      replyTo: { address: submission.email, name: submission.name },
      subject: `[${label}] New enquiry from ${submission.name}`,
      text: [
        `${label} enquiry via crimsonc9.com`,
        "",
        `Name:  ${submission.name}`,
        `Email: ${submission.email}`,
        `Type:  ${submission.type}`,
        `Sent:  ${sent}`,
        "",
        "Message:",
        submission.message,
        "",
        "—",
        "Reply directly to this email to answer the sender.",
      ].join("\n"),
    });

    return { ok: true };
  } catch (error) {
    // Everything lands here: a non-2xx from ZeptoMail, a network failure, the 20s timeout.
    // Unlike the Resend SDK this replaced, a rejected send actually rejects, so there is no
    // second success path to check.
    logUndelivered(submission, error instanceof Error ? error.message : String(error));
    return { ok: false, reason: "failed" };
  }
}
