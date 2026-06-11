"use client";

import CircularGallery from "@/components/ui/circular-gallery";
import DecryptedText from "@/components/ui/decrypted_text";

const ARTISTS = [
  { image: "https://picsum.photos/seed/techno1/800/600?grayscale", text: "KRYPTON" },
  { image: "https://picsum.photos/seed/techno2/800/600?grayscale", text: "VESTA" },
  { image: "https://picsum.photos/seed/techno3/800/600?grayscale", text: "SOLIS" },
  { image: "https://picsum.photos/seed/techno4/800/600?grayscale", text: "AETHER" },
  { image: "https://picsum.photos/seed/techno5/800/600?grayscale", text: "CHRONOS" },
  { image: "https://picsum.photos/seed/techno6/800/600?grayscale", text: "NOVA" },
  { image: "https://picsum.photos/seed/techno7/800/600?grayscale", text: "ZEPHYR" },
  { image: "https://picsum.photos/seed/techno8/800/600?grayscale", text: "LYRA" },
];

export default function ArtistsPage() {
  return (
    <div className="flex min-h-[85vh] flex-col items-center justify-center bg-[#0a0a0a] text-white">
      {/* Page Header */}
      <div className="z-10 mt-8 mb-4 max-w-2xl px-4 text-center">
        <h1 className="text-brand-crimson mb-2 text-4xl font-extrabold tracking-widest uppercase md:text-5xl">
          <DecryptedText
            text="Meet the C9 Family"
            speed={80}
            animateOn="view"
            revealDirection="center"
          />
        </h1>
        <p className="mx-auto max-w-lg text-sm tracking-wider text-neutral-400 uppercase">
          Residents and guests shaping the sound of Aachen, Cologne, and Berlin.
        </p>
      </div>

      {/* Gallery Container */}
      <div className="relative h-[60vh] min-h-[500px] w-full flex-1 md:h-[65vh]">
        <CircularGallery
          items={ARTISTS}
          bend={3}
          textColor="#dc143c"
          borderRadius={0.05}
          scrollSpeed={2}
          scrollEase={0.05}
        />
      </div>
    </div>
  );
}
