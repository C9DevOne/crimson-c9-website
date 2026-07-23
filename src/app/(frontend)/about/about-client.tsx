"use client";

import DecryptedText from "@/components/ui/decrypted_text";
import { AboutData } from "@/types/cms";

export default function AboutClient({ data }: { data: AboutData }) {
  return (
    <div className="flex min-h-screen flex-col bg-[#0a0a0a] text-white">
      {/* Header */}
      <div className="mx-auto w-full max-w-4xl px-6 pt-16 pb-12 text-center">
        <h1 className="text-brand-crimson mb-4 text-4xl font-extrabold tracking-wider uppercase md:text-6xl">
          <DecryptedText
            text={`ABOUT ${data.siteName.toUpperCase()}`}
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
        <p className="mx-auto max-w-lg text-sm leading-relaxed tracking-widest text-zinc-400 uppercase">
          {data.tagline}
        </p>
      </div>

      {/* Main Content Card */}
      <div className="mx-auto w-full max-w-3xl flex-1 space-y-12 px-6 pb-20">
        <div className="space-y-8 rounded-3xl border border-zinc-800 bg-zinc-900/40 p-8 backdrop-blur-sm md:p-12">
          <div>
            <h2 className="text-brand-crimson mb-2 text-xs font-bold tracking-widest uppercase">
              Our Vision
            </h2>
            <p className="text-lg leading-relaxed font-light text-zinc-300">
              {data.metaDescription ||
                "Crimson C9 is a Techno music collective grounded in the philosophy of Change Through Music. Based in Aachen, Cologne, and Berlin, we bridge underground soundscapes, immersive 2D/3D visual experiences, and real-world community."}
            </p>
          </div>

          <div className="grid gap-6 border-t border-zinc-800/80 pt-8 sm:grid-cols-2">
            <div>
              <h3 className="mb-1 text-xs font-bold tracking-widest text-zinc-500 uppercase">
                Resident Collective
              </h3>
              <p className="text-3xl font-extrabold text-white">{data.artistCount} Artists</p>
              {data.artistNames.length > 0 && (
                <p className="mt-2 text-xs text-zinc-400">{data.artistNames.join(" · ")}</p>
              )}
            </div>
            <div>
              <h3 className="mb-1 text-xs font-bold tracking-widest text-zinc-500 uppercase">
                Locations
              </h3>
              <p className="text-xl font-bold text-white">Aachen · Cologne · Berlin</p>
              <p className="mt-2 text-xs text-zinc-400">Germany</p>
            </div>
          </div>

          <div className="border-t border-zinc-800/80 pt-8">
            <h3 className="mb-2 text-xs font-bold tracking-widest text-zinc-500 uppercase">
              Get In Touch
            </h3>
            <a
              href={`mailto:${data.contactEmail}`}
              className="text-brand-crimson text-base font-semibold hover:underline"
            >
              {data.contactEmail}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
