"use client";

import DecryptedText from "@/components/ui/decrypted_text";
import { TermsData } from "@/types/cms";

export default function TermsClient({ data }: { data: TermsData }) {
  return (
    <div className="flex min-h-screen flex-col bg-[#0a0a0a] text-white">
      {/* Header */}
      <div className="mx-auto w-full max-w-4xl px-6 pt-16 pb-8 text-center">
        <h1 className="text-brand-crimson mb-4 text-4xl font-extrabold tracking-wider uppercase md:text-6xl">
          <DecryptedText
            text="TERMS & CONDITIONS"
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
          Guidelines and terms governing the {data.siteName} platform & community.
        </p>
      </div>

      {/* Main Content */}
      <div className="mx-auto w-full max-w-3xl flex-1 space-y-6 px-6 pb-20">
        <div className="space-y-6 rounded-3xl border border-zinc-800 bg-zinc-900/40 p-8 text-sm text-zinc-300 md:p-12">
          <div>
            <h2 className="text-brand-crimson mb-2 text-xs font-bold tracking-widest uppercase">
              1. General Terms
            </h2>
            <p className="text-xs leading-relaxed text-zinc-400">
              Welcome to {data.siteName}. By accessing our digital services, event ticketing
              portals, or community channels, you agree to comply with our community standards and
              respect our culture of inclusion and respect.
            </p>
          </div>

          <div className="border-t border-zinc-800/80 pt-6">
            <h2 className="text-brand-crimson mb-2 text-xs font-bold tracking-widest uppercase">
              2. Code of Conduct
            </h2>
            <p className="text-xs leading-relaxed text-zinc-400">
              Crimson C9 maintains a zero-tolerance policy for discrimination, harassment, or unsafe
              behavior across all our physical events and digital spaces.
            </p>
          </div>

          <div className="border-t border-zinc-800/80 pt-6">
            <h2 className="mb-2 text-xs font-bold tracking-widest text-zinc-500 uppercase">
              3. Questions & Legal Contact
            </h2>
            <p className="text-xs leading-relaxed text-zinc-400">
              For any legal or contractual inquiries, please contact:{" "}
              <a
                href={`mailto:${data.contactEmail}`}
                className="text-brand-crimson font-medium hover:underline"
              >
                {data.contactEmail}
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
