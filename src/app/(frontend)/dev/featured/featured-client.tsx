"use client";

import DecryptedText from "@/components/ui/decrypted_text";
import Image from "next/image";
import { FaSoundcloud, FaSpotify, FaCalendarAlt, FaUser } from "react-icons/fa";
import { FeaturedData } from "@/types/cms";

export default function FeaturedClient({ data }: { data: FeaturedData }) {
  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col">
      {/* Dev Environment Banner */}
      <div className="bg-brand-crimson/20 border-brand-crimson/40 text-brand-crimson border-b px-4 py-2 text-center font-mono text-xs tracking-widest uppercase">
        DEV ONLY — Homepage Featured Global Preview
      </div>

      {/* Hero Preview Section */}
      <div className="mx-auto w-full max-w-4xl px-6 pt-12 pb-8 text-center">
        <h1 className="text-brand-crimson mb-4 text-4xl font-extrabold tracking-wider uppercase md:text-6xl">
          <DecryptedText
            text={data.heroHeadline || "CHANGE THROUGH MUSIC"}
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
          {data.heroSubtext || "Techno music collective based in Aachen, Cologne, and Berlin."}
        </p>
      </div>

      {/* Spotlight Cards */}
      <div className="mx-auto w-full max-w-5xl flex-1 space-y-12 px-6 pb-20">
        <h2 className="border-b border-zinc-800 pb-2 text-xs font-bold tracking-widest text-zinc-500 uppercase">
          Curated CMS Spotlight
        </h2>

        <div className="grid gap-8 md:grid-cols-3">
          {/* Featured Artist */}
          <div className="flex flex-col justify-between rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
            <div>
              <div className="text-brand-crimson mb-4 flex items-center gap-2 text-xs font-bold tracking-widest uppercase">
                <FaUser /> Featured Artist
              </div>
              {data.featuredArtist ? (
                <div className="space-y-4">
                  <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-zinc-950">
                    <Image
                      src={data.featuredArtist.imageUrl}
                      alt={data.featuredArtist.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{data.featuredArtist.name}</h3>
                    <p className="text-xs text-zinc-400">
                      {data.featuredArtist.role || "Resident Artist"}
                    </p>
                    {data.featuredArtist.bio && (
                      <p className="mt-2 line-clamp-3 text-xs text-zinc-400">
                        {data.featuredArtist.bio}
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <p className="py-8 text-center text-xs text-zinc-500 italic">
                  No artist set in Homepage Featured global.
                </p>
              )}
            </div>
          </div>

          {/* Featured Event */}
          <div className="flex flex-col justify-between rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
            <div>
              <div className="text-brand-crimson mb-4 flex items-center gap-2 text-xs font-bold tracking-widest uppercase">
                <FaCalendarAlt /> Featured Event
              </div>
              {data.featuredEvent ? (
                <div className="space-y-4">
                  <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-zinc-950">
                    <Image
                      src={data.featuredEvent.imageUrl}
                      alt={data.featuredEvent.title}
                      fill
                      className="object-cover"
                    />
                    <div className="bg-brand-crimson absolute top-2 right-2 rounded-full px-2.5 py-0.5 text-[10px] font-bold text-white uppercase">
                      {data.featuredEvent.status}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{data.featuredEvent.title}</h3>
                    <p className="text-xs text-zinc-400">
                      {data.featuredEvent.venue || "TBA"} —{" "}
                      {data.featuredEvent.city || "Aachen / Cologne / Berlin"}
                    </p>
                    <p className="mt-1 font-mono text-[11px] text-zinc-500">
                      {new Date(data.featuredEvent.date).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="py-8 text-center text-xs text-zinc-500 italic">
                  No event set in Homepage Featured global.
                </p>
              )}
            </div>
          </div>

          {/* Featured Release */}
          <div className="flex flex-col justify-between rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
            <div>
              <div className="text-brand-crimson mb-4 flex items-center gap-2 text-xs font-bold tracking-widest uppercase">
                <FaSoundcloud /> Featured Release
              </div>
              {data.featuredRelease ? (
                <div className="space-y-4">
                  <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-zinc-950">
                    <Image
                      src={data.featuredRelease.coverArtUrl}
                      alt={data.featuredRelease.title}
                      fill
                      className="object-cover"
                    />
                    <div className="text-brand-crimson absolute top-2 left-2 rounded-md bg-black/80 px-2 py-0.5 text-[10px] font-bold uppercase">
                      {data.featuredRelease.type.replace("-", " ")}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{data.featuredRelease.title}</h3>
                    <div className="mt-3 flex items-center gap-3 text-zinc-400">
                      {data.featuredRelease.soundcloudUrl && (
                        <a
                          href={data.featuredRelease.soundcloudUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-[#ff5500]"
                        >
                          <FaSoundcloud size={18} />
                        </a>
                      )}
                      {data.featuredRelease.spotifyUrl && (
                        <a
                          href={data.featuredRelease.spotifyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-[#1db954]"
                        >
                          <FaSpotify size={16} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="py-8 text-center text-xs text-zinc-500 italic">
                  No release set in Homepage Featured global.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
