"use client";

import DecryptedText from "@/components/ui/decrypted_text";
import { FaEnvelope, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { ContactData } from "@/types/cms";

export default function ContactClient({ data }: { data: ContactData }) {
  return (
    <div className="flex min-h-screen flex-col bg-[#0a0a0a] text-white">
      {/* Header */}
      <div className="mx-auto w-full max-w-4xl px-6 pt-16 pb-8 text-center">
        <h1 className="text-brand-crimson mb-4 text-4xl font-extrabold tracking-wider uppercase md:text-6xl">
          <DecryptedText
            text="CONTACT US"
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
          {data.siteName} — {data.tagline}
        </p>
      </div>

      {/* Main Content */}
      <div className="mx-auto w-full max-w-3xl flex-1 space-y-8 px-6 pb-20">
        <div className="space-y-8 rounded-3xl border border-zinc-800 bg-zinc-900/40 p-8 md:p-12">
          <div className="flex items-center gap-4">
            <div className="bg-brand-crimson/20 text-brand-crimson flex h-12 w-12 items-center justify-center rounded-2xl">
              <FaEnvelope size={22} />
            </div>
            <div>
              <h2 className="text-xs font-bold tracking-widest text-zinc-500 uppercase">
                General & Booking Inquiries
              </h2>
              <a
                href={`mailto:${data.contactEmail}`}
                className="hover:text-brand-crimson text-xl font-bold text-white transition-colors"
              >
                {data.contactEmail}
              </a>
            </div>
          </div>

          <div className="grid gap-4 border-t border-zinc-800/80 pt-8 sm:grid-cols-2">
            {data.instagram && (
              <a
                href={data.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:border-brand-crimson/50 flex items-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-950 p-4 transition"
              >
                <FaInstagram size={20} className="text-[#e1306c]" />
                <span className="text-sm font-medium">Direct Message on Instagram</span>
              </a>
            )}

            {data.whatsappCommunity && (
              <a
                href={data.whatsappCommunity}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:border-brand-crimson/50 flex items-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-950 p-4 transition"
              >
                <FaWhatsapp size={20} className="text-[#25d366]" />
                <span className="text-sm font-medium">Join WhatsApp Community</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
