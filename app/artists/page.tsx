"use client";

import CircularGallery from "@/components/ui/circular-gallery";
import DecryptedText from "@/components/ui/decrypted_text";
import { useIsMobile } from "@/components/ui/hooks/use-mobile";

const ARTISTS = [
  {
    image: "https://picsum.photos/seed/techno1/800/600?grayscale",
    text: "KRYPTON",
    subtitle: "Resident / Founder",
    description:
      "Deep, driving industrial sounds exploring the boundary between shadows and light.",
    instagram: "https://instagram.com",
    soundcloud: "https://soundcloud.com",
  },
  {
    image: "https://picsum.photos/seed/techno2/800/600?grayscale",
    text: "VESTA",
    subtitle: "Resident DJ",
    description: "Hypnotic patterns, atmospheric textures, and trippy modular grooves.",
    instagram: "https://instagram.com",
    soundcloud: "https://soundcloud.com",
  },
  {
    image: "https://picsum.photos/seed/techno3/800/600?grayscale",
    text: "SOLIS",
    subtitle: "Co-Founder / Live Act",
    description: "Fast-paced synth melodies and raw hardware drums made for dark warehouses.",
    instagram: "https://instagram.com",
    soundcloud: "https://soundcloud.com",
  },
  {
    image: "https://picsum.photos/seed/techno4/800/600?grayscale",
    text: "AETHER",
    subtitle: "Resident DJ",
    description: "Deep-ambient openings and raw experimental soundscapes.",
    instagram: "https://instagram.com",
    soundcloud: "https://soundcloud.com",
  },
  {
    image: "https://picsum.photos/seed/techno5/800/600?grayscale",
    text: "CHRONOS",
    subtitle: "Resident DJ",
    description: "90s techno nostalgia blended with contemporary high-energy grooves.",
    instagram: "https://instagram.com",
    soundcloud: "https://soundcloud.com",
  },
  {
    image: "https://picsum.photos/seed/techno6/800/600?grayscale",
    text: "NOVA",
    subtitle: "Resident DJ",
    description: "Ethereal melodies backed by punchy, low-end driven rhythms.",
    instagram: "https://instagram.com",
    soundcloud: "https://soundcloud.com",
  },
  {
    image: "https://picsum.photos/seed/techno7/800/600?grayscale",
    text: "ZEPHYR",
    subtitle: "Guest DJ",
    description: "Acid basslines and uplifting vocal chops for early-morning dancers.",
    instagram: "https://instagram.com",
    soundcloud: "https://soundcloud.com",
  },
  {
    image: "https://picsum.photos/seed/techno8/800/600?grayscale",
    text: "LYRA",
    subtitle: "Guest DJ",
    description: "Psychedelic progressions and high-tempo ambient techno sets.",
    instagram: "https://instagram.com",
    soundcloud: "https://soundcloud.com",
  },
];

export default function ArtistsPage() {
  const isMobile = useIsMobile();

  return (
    <div className="flex min-h-[85vh] flex-col items-center justify-center bg-[#0a0a0a] text-white">
      {/* Page Header */}
      <div className="z-10 mt-4 mb-2 max-w-2xl px-4 text-center md:mt-8 md:mb-4">
        <h1 className="text-brand-crimson mb-2 text-3xl font-extrabold tracking-widest uppercase md:text-5xl">
          <DecryptedText
            text="Meet the C9 Family"
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
        <p className="mx-auto max-w-lg text-xs tracking-wider text-neutral-400 uppercase md:text-sm">
          Residents and guests shaping the sound of Aachen, Cologne, and Berlin.
        </p>
      </div>

      {/* Gallery Container */}
      <div className="relative h-[85vh] min-h-[450px] w-full flex-1 md:h-[90vh] md:min-h-[700px]">
        <CircularGallery
          items={ARTISTS}
          bend={isMobile ? 5 : 5.5}
          textColor="#dc143c"
          borderRadius={0.05}
          scrollSpeed={isMobile ? 1.5 : 2}
          scrollEase={0.05}
        />
      </div>
    </div>
  );
}
