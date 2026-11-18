"use client";

import DecryptedText from "@/components/ui/decrypted_text";
import { ImprintData } from "@/types/cms";

/**
 * Legally required publisher details (§ 5 DDG, formerly § 5 TMG; § 18 Abs. 2 MStV).
 *
 * ⚠️ INCOMPLETE — these must be filled in before the site can be considered compliant.
 * They are deliberately left blank rather than guessed: an Impressum with an invented or
 * approximated address is worse than an obviously unfinished one, because it reads as
 * compliant while not being so. "Aachen / Cologne / Berlin, Germany" (what this page said
 * previously) is not a valid address for this purpose — § 5 requires a full postal address
 * a letter could actually be delivered to.
 *
 * Anything left empty renders as a visible PENDING marker. That is intentional and should
 * stay that way until the real values land — a silent dash would hide the gap.
 */
const PUBLISHER = {
  /** Full legal name. A person's name if unincorporated, or the registered entity name. */
  legalName: "",
  /** Street, postcode, city — one entry per line. */
  addressLines: [] as string[],
  /** § 18 Abs. 2 MStV — person responsible for editorial content, with their address. */
  responsibleForContent: "",
  /** Phone number. Not strictly mandatory alongside email, but standard practice. */
  phone: "",
  /** e.g. "Vereinsregister Aachen, VR 1234" — only if actually registered. */
  registerEntry: "",
  /** USt-IdNr., only if one has been issued. */
  vatId: "",
};

/** Renders a value, or an unmistakable marker when it hasn't been supplied yet. */
function Value({ children }: { children?: string }) {
  if (children && children.trim()) return <>{children}</>;

  return (
    <span className="text-destructive-foreground bg-destructive/30 rounded px-1.5 py-0.5 text-xs font-bold tracking-widest uppercase">
      Pending — to be completed
    </span>
  );
}

export default function ImprintClient({ data }: { data: ImprintData }) {
  const hasAddress = PUBLISHER.addressLines.length > 0;

  return (
    <div className="flex min-h-full flex-col">
      <div className="mx-auto w-full max-w-4xl px-6 pt-16 pb-8 text-center">
        <h1 className="text-brand-accent font-display mb-4 text-3xl tracking-[0.12em] uppercase md:text-5xl">
          <DecryptedText
            text="IMPRINT / IMPRESSUM"
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
          Legal information according to § 5 DDG
        </p>
      </div>

      <div className="mx-auto w-full max-w-3xl flex-1 px-6 pb-20">
        <div className="glass-panel font-body text-foreground/80 space-y-7 rounded-3xl p-8 text-base md:p-12">
          <section>
            <h2 className="text-brand-accent font-ui mb-3 text-xs font-semibold tracking-[0.25em] uppercase">
              Publisher
            </h2>
            <p className="text-foreground text-lg font-semibold">
              <Value>{PUBLISHER.legalName || data.siteName}</Value>
            </p>
            <p className="text-muted-foreground text-sm">{data.tagline}</p>
            <div className="mt-3 space-y-0.5">
              {hasAddress ? (
                PUBLISHER.addressLines.map((line) => <p key={line}>{line}</p>)
              ) : (
                <p>
                  <Value />
                </p>
              )}
            </div>
          </section>

          <section className="border-foreground/10 border-t pt-6">
            <h2 className="font-ui text-muted-foreground mb-3 text-xs font-semibold tracking-[0.25em] uppercase">
              Responsible for content
            </h2>
            <p className="text-sm">
              § 18 Abs. 2 MStV — <Value>{PUBLISHER.responsibleForContent}</Value>
            </p>
          </section>

          <section className="border-foreground/10 border-t pt-6">
            <h2 className="font-ui text-muted-foreground mb-3 text-xs font-semibold tracking-[0.25em] uppercase">
              Contact
            </h2>
            <p className="text-sm">
              Email:{" "}
              <a
                href={`mailto:${data.contactEmail}`}
                className="text-brand-accent font-medium hover:underline"
              >
                {data.contactEmail}
              </a>
            </p>
            <p className="mt-1 text-sm">
              Phone: <Value>{PUBLISHER.phone}</Value>
            </p>
          </section>

          {(PUBLISHER.registerEntry || PUBLISHER.vatId) && (
            <section className="border-foreground/10 border-t pt-6">
              <h2 className="font-ui text-muted-foreground mb-3 text-xs font-semibold tracking-[0.25em] uppercase">
                Registration
              </h2>
              {PUBLISHER.registerEntry && <p className="text-sm">{PUBLISHER.registerEntry}</p>}
              {PUBLISHER.vatId && <p className="mt-1 text-sm">VAT ID: {PUBLISHER.vatId}</p>}
            </section>
          )}

          <section className="border-foreground/10 border-t pt-6">
            <h2 className="font-ui text-muted-foreground mb-3 text-xs font-semibold tracking-[0.25em] uppercase">
              Dispute resolution
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              The European Commission provides a platform for online dispute resolution. We are
              neither obliged nor willing to participate in dispute resolution proceedings before a
              consumer arbitration board.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
