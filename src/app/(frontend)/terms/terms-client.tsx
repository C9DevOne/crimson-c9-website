"use client";

import { TermsData } from "@/types/cms";

/**
 * Terms, plus the privacy notice the landing page's contact form depends on.
 *
 * Worth being clear about what is and isn't legally load-bearing here. Terms/AGB are not
 * generally required for an informational site like this one. A **privacy notice is** —
 * GDPR Art. 13 obliges us to tell people what happens to their data at the point we
 * collect it, and the landing page collects a name, an email, and a message. So the
 * privacy section below is the part that actually closes a legal gap, and the consent
 * checkbox on the form links straight to it.
 *
 * Conventionally this lives at its own `/privacy` route rather than inside Terms. Putting
 * it here keeps this change to the two routes that were already agreed on; splitting it
 * out is worth doing properly later.
 *
 * ⚠️ The processor list in § 5 names the services this site is actually built on, but the
 * hosting regions have not been verified — see the note in that section.
 */
export default function TermsClient({ data }: { data: TermsData }) {
  return (
    <div className="flex min-h-full flex-col">
      <div className="mx-auto w-full max-w-3xl px-5 pt-36 pb-10 md:px-8">
        <h1 className="type-display-sm mb-4">TERMS & PRIVACY</h1>
        <p className="type-label">Terms of use and data protection for {data.siteName}</p>
      </div>

      <div className="mx-auto w-full max-w-3xl flex-1 px-5 pb-24 md:px-8">
        <div className="type-body space-y-7 pt-10">
          <Section title="1. General">
            <p>
              By using {data.siteName}&apos;s website and community channels you agree to the terms
              set out here, and to our community standards — we expect everyone involved to treat
              other people decently.
            </p>
          </Section>

          <Section title="2. Code of conduct">
            <p>
              {data.siteName} has a zero-tolerance policy for discrimination, harassment, and unsafe
              behaviour, at our events and in our digital spaces alike. If something happens, tell
              us at{" "}
              <a href={`mailto:${data.contactEmail}`} className="link-underline text-foreground">
                {data.contactEmail}
              </a>
              .
            </p>
          </Section>

          <Section title="3. Content">
            <p>
              Music, artwork, photography and video on this site belong to their respective
              creators. Don&apos;t reuse it commercially without asking first.
            </p>
          </Section>

          {/* Anchor target for the consent checkbox on the landing page form. */}
          <div id="privacy" className="scroll-mt-8">
            <Section title="4. Privacy / Data Collection">
              {/* Shortened to this single statement at Aaron's request, 2026-11-26. What
                  it replaced set out the contact form's legal basis (GDPR Art. 6(1)(a)),
                  its retention and the sharing position — the Art. 13 information duty
                  that applies because the form does collect personal data, even though
                  nothing is stored in a database. Section 6 still carries the rights, and
                  section 5 still names the processors, so that duty is partly met
                  elsewhere; the specifics of the form are not. Flagged to Aaron and
                  tracked with the external legal check, TIC-31. */}
              <p>
                We don&apos;t use any third-party trackers or cookies and don&apos;t store any of
                your information in our database.
              </p>
            </Section>
          </div>

          <Section title="5. Service providers">
            <p className="mb-3">
              We use a small number of providers to run this site. They process data only on our
              instructions:
            </p>
            <ul className="text-muted-foreground space-y-1.5 text-sm">
              <li>
                <span className="text-foreground/90">Hetzner Online GmbH</span> — the server this
                site runs on, located in Germany
              </li>
              <li>
                <span className="text-foreground/90">Cloudflare</span> — domain name service, which
                tells your browser where to find this site
              </li>
              <li>
                <span className="text-foreground/90">Zoho (ZeptoMail)</span> — delivers the
                notification email when you submit the form, via its EU data centre
              </li>
            </ul>
          </Section>

          <Section title="6. Your rights">
            <p className="mb-3">
              Under the GDPR you can ask us to show you the data we hold about you, correct it,
              delete it, or restrict what we do with it. You can withdraw consent at any time — that
              doesn&apos;t affect anything done before you withdrew it. You can also complain to a
              data protection authority.
            </p>
            <p>
              For any of the above, write to{" "}
              <a href={`mailto:${data.contactEmail}`} className="link-underline text-foreground">
                {data.contactEmail}
              </a>
              .
            </p>
          </Section>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-hairline border-t pt-8 first:border-t-0 first:pt-0">
      <h2 className="type-label mb-4">{title}</h2>
      <div className="leading-relaxed">{children}</div>
    </section>
  );
}
