"use client";

import DecryptedText from "@/components/ui/decrypted_text";
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
      <div className="mx-auto w-full max-w-4xl px-6 pt-16 pb-8 text-center">
        <h1 className="text-brand-accent font-display mb-4 text-3xl tracking-[0.12em] uppercase md:text-5xl">
          <DecryptedText
            text="TERMS & PRIVACY"
            speed={100}
            maxIterations={20}
            sequential={true}
            animateOn="hover"
            revealDirection="center"
            className="text-brand-accent"
            encryptedClassName="text-foreground/20"
          />
        </h1>
        <p className="font-ui text-muted-foreground mx-auto max-w-lg text-xs tracking-widest uppercase">
          Terms of use and data protection for {data.siteName}
        </p>
      </div>

      <div className="mx-auto w-full max-w-3xl flex-1 px-6 pb-20">
        <div className="glass-panel font-body text-foreground/80 space-y-7 rounded-3xl p-8 text-base md:p-12">
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
              <a
                href={`mailto:${data.contactEmail}`}
                className="text-brand-accent font-medium hover:underline"
              >
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
            <Section title="4. Privacy — what we collect">
              <p className="mb-4">
                <strong className="text-foreground font-semibold">The contact form.</strong> When
                you send us a message, the name, email address, enquiry type and message you entered
                are delivered to us as an email. They are not stored in any database. We use them
                for one thing: replying to you.
              </p>
              <ul className="text-muted-foreground mb-4 space-y-1.5 text-sm">
                <li>
                  <span className="text-foreground/90">Legal basis:</span> your consent, GDPR Art.
                  6(1)(a) — which is why the form asks for it explicitly.
                </li>
                <li>
                  <span className="text-foreground/90">Retention:</span> kept in our mailbox while
                  we deal with your enquiry, then deleted once there&apos;s no reason to keep it.
                </li>
                <li>
                  <span className="text-foreground/90">Sharing:</span> not sold, and not passed to
                  anyone beyond the service providers listed below.
                </li>
              </ul>
              <p>
                <strong className="text-foreground font-semibold">Nothing else.</strong> We set no
                cookies, run no analytics and use no third-party trackers or advertising. If you
                never use the form, we collect nothing about you at all.
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
            <p className="text-destructive-foreground bg-destructive/20 mt-4 rounded-xl px-4 py-3 text-xs leading-relaxed">
              To be completed before launch: whether a data processing agreement is in place with
              Hetzner, Cloudflare and Zoho. The regions above are stated; the agreements are what
              still need confirming, and this section has to be reviewed by a human before it is
              relied on.
            </p>
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
              <a
                href={`mailto:${data.contactEmail}`}
                className="text-brand-accent font-medium hover:underline"
              >
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
    <section className="border-foreground/10 border-t pt-6 first:border-t-0 first:pt-0">
      <h2 className="text-brand-accent font-ui mb-3 text-xs font-semibold tracking-[0.25em] uppercase">
        {title}
      </h2>
      <div className="leading-relaxed">{children}</div>
    </section>
  );
}
