"use client";

import DecryptedText from "@/components/ui/decrypted_text";
import { FaWhatsapp, FaEnvelope } from "react-icons/fa";
import { SupportData } from "@/types/cms";

export default function SupportClient({ data }: { data: SupportData }) {
  return (
    <div className="flex min-h-screen flex-col bg-[#0a0a0a] text-white">
      {/* Header */}
      <div className="mx-auto w-full max-w-4xl px-6 pt-16 pb-8 text-center">
        <h1 className="text-brand-crimson mb-4 text-4xl font-extrabold tracking-wider uppercase md:text-6xl">
          <DecryptedText
            text="COMMUNITY SUPPORT"
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
          Need assistance with tickets, event access, or community guidelines? We are here to help.
        </p>
      </div>

      {/* Main Content */}
      <div className="mx-auto w-full max-w-3xl flex-1 space-y-6 px-6 pb-20">
        <div className="space-y-6 rounded-3xl border border-zinc-800 bg-zinc-900/40 p-8">
          <h2 className="text-brand-crimson text-xs font-bold tracking-widest uppercase">
            {data.siteName} Support Channels
          </h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <a
              href={`mailto:${data.contactEmail}`}
              className="hover:border-brand-crimson/50 flex flex-col justify-between rounded-2xl border border-zinc-800 bg-zinc-950 p-6 transition"
            >
              <FaEnvelope size={24} className="text-brand-crimson mb-4" />
              <div>
                <span className="text-xs font-semibold tracking-wider text-zinc-500 uppercase">
                  Email Support
                </span>
                <p className="mt-1 text-sm font-bold text-white">{data.contactEmail}</p>
              </div>
            </a>

            {data.whatsappCommunity && (
              <a
                href={data.whatsappCommunity}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:border-brand-crimson/50 flex flex-col justify-between rounded-2xl border border-zinc-800 bg-zinc-950 p-6 transition"
              >
                <FaWhatsapp size={24} className="mb-4 text-[#25d366]" />
                <div>
                  <span className="text-xs font-semibold tracking-wider text-zinc-500 uppercase">
                    Community Help
                  </span>
                  <p className="mt-1 text-sm font-bold text-white">Join WhatsApp Chat</p>
                </div>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
