"use client";

import DecryptedText from "@/components/ui/decrypted_text";
import {
  FaInstagram,
  FaSoundcloud,
  FaYoutube,
  FaSpotify,
  FaWhatsapp,
  FaTicketAlt,
} from "react-icons/fa";
import { ConnectData } from "@/types/cms";

export default function ConnectClient({ data }: { data: ConnectData }) {
  const socialLinks = [
    {
      name: "Instagram",
      url: data.instagram,
      icon: FaInstagram,
      color: "hover:text-[#e1306c]",
    },
    {
      name: "SoundCloud",
      url: data.soundcloud,
      icon: FaSoundcloud,
      color: "hover:text-[#ff5500]",
    },
    {
      name: "YouTube",
      url: data.youtube,
      icon: FaYoutube,
      color: "hover:text-[#ff0000]",
    },
    {
      name: "Spotify",
      url: data.spotify,
      icon: FaSpotify,
      color: "hover:text-[#1db954]",
    },
    {
      name: "WhatsApp Community",
      url: data.whatsappCommunity,
      icon: FaWhatsapp,
      color: "hover:text-[#25d366]",
    },
    {
      name: "Resident Advisor",
      url: data.residentAdvisor,
      icon: FaTicketAlt,
      color: "hover:text-yellow-400",
    },
  ].filter((item) => Boolean(item.url));

  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col">
      {/* Header */}
      <div className="mx-auto w-full max-w-4xl px-6 pt-16 pb-8 text-center">
        <h1 className="text-brand-crimson mb-4 text-4xl font-extrabold tracking-wider uppercase md:text-6xl">
          <DecryptedText
            text="CONNECT & COMMUNITY"
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
          Join our channels, WhatsApp community, or reach out for bookings & collaborations.
        </p>
      </div>

      {/* Main Grid */}
      <div className="mx-auto w-full max-w-4xl flex-1 space-y-12 px-6 pb-20">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Social Channels */}
          <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-8">
            <h2 className="text-brand-crimson mb-6 text-xs font-bold tracking-widest uppercase">
              Official Channels
            </h2>
            <div className="space-y-4">
              {socialLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.name}
                    href={item.url!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`hover:border-brand-crimson/50 flex items-center gap-4 rounded-xl border border-zinc-800/80 bg-zinc-950 p-4 transition duration-300 ${item.color}`}
                  >
                    <Icon size={24} />
                    <span className="text-sm font-semibold tracking-wide">{item.name}</span>
                  </a>
                );
              })}
            </div>
          </div>

          {/* Direct Outreach */}
          <div className="flex flex-col justify-between rounded-3xl border border-zinc-800 bg-zinc-900/40 p-8">
            <div>
              <h2 className="text-brand-crimson mb-6 text-xs font-bold tracking-widest uppercase">
                Inquiries & Collaborations
              </h2>
              <p className="mb-6 text-sm leading-relaxed text-zinc-300">
                Whether you are looking to book our resident artists, organize a collaborative
                event, or volunteer with the collective — drop us a message.
              </p>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
              <span className="text-xs font-semibold tracking-widest text-zinc-500 uppercase">
                Email Address
              </span>
              <p className="text-brand-crimson mt-1 text-lg font-bold">{data.contactEmail}</p>
              <a
                href={`mailto:${data.contactEmail}`}
                className="bg-brand-crimson hover:bg-brand-crimson/80 mt-4 inline-block rounded-full px-6 py-2.5 text-xs font-bold tracking-wider text-white uppercase transition-colors"
              >
                Send Email
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
