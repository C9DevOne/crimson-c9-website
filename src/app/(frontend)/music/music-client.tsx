"use client";

import DecryptedText from "@/components/ui/decrypted_text";
import Image from "next/image";
import { FaSoundcloud, FaSpotify, FaYoutube } from "react-icons/fa";
import { ReleaseItem } from "@/types/cms";

export default function MusicClient({ releases }: { releases: ReleaseItem[] }) {
  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col">
      {/* Header */}
      <div className="mx-auto w-full max-w-5xl px-6 pt-12 pb-8 text-center">
        <h1 className="text-brand-crimson mb-4 text-4xl font-extrabold tracking-wider uppercase md:text-6xl">
          <DecryptedText
            text="RELEASES & PODCASTS"
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
        <p className="mx-auto max-w-xl text-xs tracking-widest text-zinc-400 uppercase md:text-sm">
          Listen to latest Crimson C9 tracks, EPs, and Spitfire Techno Podcast episodes.
        </p>
      </div>

      {/* Grid */}
      <div className="mx-auto w-full max-w-5xl flex-1 px-6 pb-20">
        {releases.length > 0 ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {releases.map((release) => (
              <div
                key={release.id}
                className="group hover:border-brand-crimson/60 relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 transition"
              >
                <div className="relative mb-4 aspect-square w-full overflow-hidden rounded-xl bg-zinc-950">
                  <Image
                    src={release.coverArtUrl}
                    alt={release.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="text-brand-crimson absolute top-3 left-3 rounded-md bg-black/80 px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase backdrop-blur-sm">
                    {release.type.replace("-", " ")}
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="group-hover:text-brand-crimson text-xl font-bold tracking-tight text-white transition-colors">
                    {release.title}
                  </h3>
                  <p className="text-xs text-zinc-400">
                    {release.artists.length > 0 ? release.artists.join(", ") : "Crimson C9"}
                  </p>
                  {release.releaseDate && (
                    <p className="font-mono text-[11px] text-zinc-500">
                      {new Date(release.releaseDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  )}
                </div>

                {/* Social/Stream Links */}
                <div className="mt-4 flex items-center gap-3 border-t border-zinc-800/80 pt-3 text-zinc-400">
                  {release.soundcloudUrl && (
                    <a
                      href={release.soundcloudUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-colors hover:text-[#ff5500]"
                      title="SoundCloud"
                    >
                      <FaSoundcloud size={20} />
                    </a>
                  )}
                  {release.spotifyUrl && (
                    <a
                      href={release.spotifyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-colors hover:text-[#1db954]"
                      title="Spotify"
                    >
                      <FaSpotify size={18} />
                    </a>
                  )}
                  {release.youtubeUrl && (
                    <a
                      href={release.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-colors hover:text-[#ff0000]"
                      title="YouTube"
                    >
                      <FaYoutube size={18} />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center text-sm tracking-widest text-zinc-500 uppercase">
            No releases uploaded yet.
          </div>
        )}
      </div>
    </div>
  );
}
