"use client";

import CircularGallery from "@/components/ui/circular-gallery";
import DecryptedText from "@/components/ui/decrypted_text";
import { useIsMobile } from "@/components/ui/hooks/use-mobile";

type ArtistItem = {
  image: string;
  text: string;
  subtitle: string;
  description: string;
  instagram?: string;
  soundcloud?: string;
};

export default function ArtistsClient({ artists }: { artists: ArtistItem[] }) {
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
        {artists.length > 0 ? (
          <CircularGallery
            items={artists}
            bend={isMobile ? 5 : 5.5}
            textColor="#dc143c"
            borderRadius={0.05}
            scrollSpeed={isMobile ? 1.5 : 2}
            scrollEase={0.05}
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <p className="text-neutral-500">No artists found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
