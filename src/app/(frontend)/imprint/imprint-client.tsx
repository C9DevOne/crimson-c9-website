"use client";

import { ImprintData } from "@/types/cms";

/**
 * Legally required publisher details (§ 5 DDG, formerly § 5 TMG).
 *
 * The § 18 Abs. 2 MStV "responsible for content" entry was removed at Aaron's request
 * (CRI-22). That clause applies to journalistic-editorial offerings; a collective's own
 * site publishing only its own information is not obviously one, and the representative
 * named below carries the § 5 DDG duty either way. Worth confirming in TIC-31.
 *
 * **Source of truth: `c9-tickets/src/content/legal.ts`**, confirmed by Aaron on
 * 16 Nov 2026. Duplicated rather than imported because the two apps deploy independently
 * and nothing is shared between them; if either changes, change both. The ticket shop's
 * Impressum uses `tickets@crimsonc9.com` as its contact address, this one uses
 * `hello@crimsonc9.com` — that difference is deliberate, not drift.
 *
 * ⚠️ Still unchecked by a lawyer. TIC-31 ("Legal texts final + external check") is open,
 * and these are the drafts from TIC-25. Accurate, but not reviewed.
 */
const PUBLISHER = {
  legalName: "CrimsonC9",
  /**
   * § 5 DDG wants the natural person behind the name. Naming them as the representative
   * rather than folding them into the legal name satisfies that and reads better
   * (Aaron, CRI-22).
   */
  representedBy: "Aaron Sergeev",
  /** Street, postcode + city, country — one entry per line. */
  addressLines: ["Gottschalkstr. 20", "13359 Berlin", "Deutschland"],
  /**
   * Deliberately none (Aaron, 16 Nov 2026). § 5 DDG requires a means of "fast electronic
   * contact and direct communication" — an answered email address satisfies that, and case
   * law has not read it as compelling a phone number. So this renders as nothing at all
   * rather than as an unfinished marker.
   */
  phone: null as string | null,
  /** Not registered — an Einzelunternehmen below the Kaufmann threshold has no HR entry. */
  registerEntry: "",
  /** No USt-IdNr.: small-business rule below, § 19 UStG. */
  vatId: "",
  /** Required on invoices and conventional in the Impressum where § 19 is claimed. */
  smallBusinessNote: "Gemäß § 19 UStG wird keine Umsatzsteuer berechnet.",
};

/**
 * Renders a value, or an unmistakable marker when one is missing.
 *
 * Kept even though every field is now filled: it is what stops a future blank from
 * shipping silently. A field that is absent *by design* (the phone) is not routed through
 * this — it is simply not rendered, because marking a deliberate choice as "pending" is
 * how a correct Impressum gets "fixed" into an incorrect one.
 */
function Value({ children }: { children?: string }) {
  if (children && children.trim()) return <>{children}</>;

  return (
    <span className="border-glow-crimson/50 text-glow-crimson ml-1 border px-2 py-0.5 text-[0.65rem] font-semibold tracking-[0.18em] uppercase">
      Pending — to be completed
    </span>
  );
}

export default function ImprintClient({ data }: { data: ImprintData }) {
  const hasAddress = PUBLISHER.addressLines.length > 0;

  return (
    <div className="flex min-h-full flex-col">
      <div className="mx-auto w-full max-w-3xl px-5 pt-36 pb-10 md:px-8">
        <h1 className="type-display-sm">IMPRINT / IMPRESSUM</h1>
      </div>

      <div className="mx-auto w-full max-w-3xl flex-1 px-5 pb-24 md:px-8">
        <div className="type-body space-y-7 pt-10">
          <section>
            <h2 className="type-label mb-4">Publisher</h2>
            <p className="text-foreground text-lg font-semibold">
              <Value>{PUBLISHER.legalName}</Value>
            </p>
            <div className="mt-3 space-y-0.5">
              {hasAddress ? (
                PUBLISHER.addressLines.map((line) => <p key={line}>{line}</p>)
              ) : (
                <p>
                  <Value />
                </p>
              )}
            </div>
            <p className="mt-4 text-sm">
              Represented by: <Value>{PUBLISHER.representedBy}</Value>
            </p>
          </section>

          <section className="border-hairline border-t pt-8">
            <h2 className="type-label mb-4">Contact</h2>
            <p className="text-sm">
              Email:{" "}
              <a href={`mailto:${data.contactEmail}`} className="link-underline text-foreground">
                {data.contactEmail}
              </a>
            </p>
            {PUBLISHER.phone && <p className="mt-1 text-sm">Phone: {PUBLISHER.phone}</p>}
          </section>

          {(PUBLISHER.registerEntry || PUBLISHER.vatId) && (
            <section className="border-hairline border-t pt-8">
              <h2 className="type-label mb-4">Registration</h2>
              {PUBLISHER.registerEntry && <p className="text-sm">{PUBLISHER.registerEntry}</p>}
              {PUBLISHER.vatId && <p className="mt-1 text-sm">VAT ID: {PUBLISHER.vatId}</p>}
            </section>
          )}

          <section className="border-hairline border-t pt-8">
            <h2 className="type-label mb-4">VAT</h2>
            <p className="text-sm">{PUBLISHER.smallBusinessNote}</p>
          </section>

          <section className="border-hairline border-t pt-8">
            <h2 className="type-label mb-4">Dispute resolution</h2>
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
