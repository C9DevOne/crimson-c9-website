"use client";

import DecryptedText from "@/components/ui/decrypted_text";
import { ImprintData } from "@/types/cms";

export default function ImprintClient({ data }: { data: ImprintData }) {
  return (
    <div className="flex min-h-screen flex-col bg-[#0a0a0a] text-white">
      {/* Header */}
      <div className="mx-auto w-full max-w-4xl px-6 pt-16 pb-8 text-center">
        <h1 className="text-brand-crimson mb-4 text-4xl font-extrabold tracking-wider uppercase md:text-6xl">
          <DecryptedText
            text="IMPRINT / IMPRESSUM"
            speed={100}
            maxIterations={20}
            sequential={true}
            animateOn="hover"
            revealDirection="center"
            className="text-brand-crimson"
            encryptedClassName="text-white/20"
            useRandomColors={true}
          />
        </h1>
        <p className="mx-auto max-w-lg text-xs tracking-widest text-zinc-400 uppercase md:text-sm">
          Legal information according to § 5 TMG / DDG
        </p>
      </div>

      {/* Main Content */}
      <div className="mx-auto w-full max-w-3xl flex-1 space-y-6 px-6 pb-20">
        <div className="space-y-6 rounded-3xl border border-zinc-800 bg-zinc-900/40 p-8 text-sm text-zinc-300 md:p-12">
          <div>
            <h2 className="text-brand-crimson mb-2 text-xs font-bold tracking-widest uppercase">
              Publisher Information
            </h2>
            <p className="text-base font-bold text-white">{data.siteName}</p>
            <p className="text-xs text-zinc-400">{data.tagline}</p>
            <p className="mt-2 text-zinc-400">Aachen / Cologne / Berlin, Germany</p>
          </div>

          <div className="border-t border-zinc-800/80 pt-6">
            <h3 className="mb-2 text-xs font-bold tracking-widest text-zinc-500 uppercase">
              Contact
            </h3>
            <p>
              Email:{" "}
              <a
                href={`mailto:${data.contactEmail}`}
                className="text-brand-crimson font-medium hover:underline"
              >
                {data.contactEmail}
              </a>
            </p>
          </div>

          <div className="border-t border-zinc-800/80 pt-6">
            <h3 className="mb-2 text-xs font-bold tracking-widest text-zinc-500 uppercase">
              Dispute Resolution & Liability
            </h3>
            <p className="text-xs leading-relaxed text-zinc-400">
              The European Commission provides a platform for online dispute resolution (OS). We are
              neither obligated nor willing to participate in dispute resolution proceedings before
              a consumer arbitration board.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
