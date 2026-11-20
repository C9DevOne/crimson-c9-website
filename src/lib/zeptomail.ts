/**
 * ZeptoMail (Zoho) HTTP API, EU data centre.
 *
 * Adapted from the same transport in C9DevOne/c9-tickets (`src/lib/email/zeptomail.ts`),
 * which is where the awkward details were found: Hetzner blocks outbound SMTP ports, so an
 * HTTP API is the only option; the Zoho UI shows the token already prefixed with
 * "Zoho-enczapikey" and people paste it either way; and the EU endpoint is a different host
 * from the documented default.
 *
 * Copied rather than shared because the two repos deploy independently — a private npm
 * package for sixty lines would be more machinery than the duplication costs. If a third
 * app needs it, that calculation changes.
 *
 * Trimmed against the tickets version: no inline images, and no permanent-vs-retryable
 * error distinction, because there is no send queue here to retry from. The caller reports
 * failure to the visitor instead.
 */

const DEFAULT_URL = "https://api.zeptomail.eu/v1.1/email";

export type OutgoingEmail = {
  to: string;
  subject: string;
  text: string;
  /** Sets the inbox's reply target, so replying answers the enquirer and not our own sender. */
  replyTo?: { address: string; name?: string };
};

/** Parses `Name <addr@host>` into ZeptoMail's sender shape; a bare address is fine too. */
function parseSender(from: string): { name?: string; address: string } {
  const match = from.match(/^\s*(.*?)\s*<([^>]+)>\s*$/);
  return match ? { name: match[1], address: match[2] } : { address: from.trim() };
}

/**
 * Sends one email. Resolves on success and rejects with a readable message otherwise —
 * `src/lib/email.ts` is what turns that into a result the route can report.
 */
export async function sendViaZeptoMail(
  email: OutgoingEmail,
  {
    token = process.env.ZEPTOMAIL_TOKEN,
    from = process.env.EMAIL_FROM || "CrimsonC9 <noreply@crimsonc9.com>",
    url = process.env.ZEPTOMAIL_API_URL || DEFAULT_URL,
    fetchImpl = fetch,
  } = {},
): Promise<void> {
  if (!token) throw new Error("ZEPTOMAIL_TOKEN is not set");

  const response = await fetchImpl(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      // Accept the token with or without the prefix the Zoho UI displays.
      Authorization: token.startsWith("Zoho-enczapikey") ? token : `Zoho-enczapikey ${token}`,
    },
    body: JSON.stringify({
      from: parseSender(from),
      to: [{ email_address: { address: email.to } }],
      subject: email.subject,
      textbody: email.text,
      reply_to: email.replyTo
        ? [{ address: email.replyTo.address, name: email.replyTo.name }]
        : undefined,
      track_clicks: false,
      track_opens: false,
    }),
    // Without this a hung connection would hold the request open until the platform's own
    // timeout, long after the visitor has given up on the form.
    signal: AbortSignal.timeout(20_000),
  });

  if (response.ok) return;

  // The body carries the actual reason (unverified sender domain, bad recipient, bad token),
  // and it is the first thing worth seeing in the log. Capped so a stray HTML error page
  // can't flood it.
  const body = (await response.text().catch(() => "")).slice(0, 500);
  throw new Error(`ZeptoMail ${response.status}: ${body}`);
}
