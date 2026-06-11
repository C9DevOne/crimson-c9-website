"use client";

import CircularGallery from "@/components/ui/circular-gallery";
import DecryptedText from "@/components/ui/decrypted_text";
// move to backend later
const ARTISTS = [
  {
    image: "https://picsum.photos/seed/techno3/800/600?grayscale",
    text: "SOLIS",
    subtitle: "Co-Founder / Live Act",
    description: "Fast-paced synth melodies and raw hardware drums made for dark warehouses.",
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
