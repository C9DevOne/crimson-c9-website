import Script from "next/script";
import { RiInstagramLine, RiSoundcloudLine } from "react-icons/ri";
import Image from "next/image";

// Temporary Ticket Portal: only the homepage is active. The shared Navbar,
// Sidebar, and Footer are removed in layout.tsx. All other routes are disabled
// by renaming their folders with a `_` prefix (Next.js private folders).
// See AI_CONTEXT.md for details.

export const metadata = {
  title: "Ticket Portal | CrimsonC9",
};

export default function Page() {
  return (
    <>
      {/* Full-viewport portal background — dynamically covers/crops per device */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <Image
          src="/key_portal_background_169.png"
          alt=""
          fill
          className="dream-bg object-cover"
          priority
          aria-hidden="true"
        />
        <div className="dream-overlay" />
        <div className="dream-shimmer" />
        <div className="dream-vignette" />
        <div className="dream-pulse" />
      </div>

      {/* Ticket Portal content sits directly on the page */}
      <div className="relative z-10 flex min-h-svh flex-col items-center justify-start gap-8 px-6 pt-8 pb-12">
        <Image
          src="/crimson_logo_black.png"
          alt="CrimsonC9"
          width={144}
          height={144}
          className="h-24 w-auto md:h-36"
          style={{ filter: "drop-shadow(0 0 24px var(--foreground))" }}
          priority
        />

        <div className="flex w-full max-w-3xl flex-col gap-3 text-center md:gap-4">
          <h1 className="neon-text text-4xl font-bold tracking-widest md:text-6xl">
            Bunker Dreams
          </h1>
          <p className="glow-text-accent pt-2 text-center font-[family-name:var(--font-ui)] text-3xl font-bold tracking-wide text-[var(--glow-accent)] md:pt-4 md:text-4xl">
            Welcome To The Official Bunker Dreams Ticket Portal
          </p>
        </div>

        <div className="flex w-full max-w-2xl flex-col gap-3">
          <p className="glow-text w-full text-left font-[family-name:var(--font-ui)] text-xl font-bold text-[var(--foreground)] md:text-2xl">
            Buy Your Personal Dream-Key Below:
          </p>
          <div className="ticket-glass w-full p-1">
            <div
              className="ot-iframe"
              data-ot-url="https://shop.weeztix.com/0bf26a79-697a-11f1-8e27-d65b0659bc31"
              data-ot-guid="0bf26a79-697a-11f1-8e27-d65b0659bc31"
            />
          </div>
        </div>
        <Script
          className="rounded-3xl"
          src="https://v1.widget.shop.weeztix.com/injector.js"
          strategy="afterInteractive"
        />

        <div className="flex items-center gap-10">
          <a
            href="https://instagram.com/crimsonc9"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--glow-accent)] transition-colors duration-300 hover:text-[var(--foreground)]"
            aria-label="Instagram"
          >
            <RiInstagramLine className="glow-icon size-10 md:size-12" />
          </a>
          <a
            href="https://soundcloud.com/crimsonc9"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--glow-accent)] transition-colors duration-300 hover:text-[var(--foreground)]"
            aria-label="SoundCloud"
          >
            <RiSoundcloudLine className="glow-icon size-10 md:size-12" />
          </a>
        </div>

        <p className="glow-text font-[family-name:var(--font-ui)] text-lg text-[var(--foreground)] md:text-xl">
          &copy; 2026 CrimsonC9
        </p>
      </div>
    </>
  );
}
