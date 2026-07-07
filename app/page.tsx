"use client";

import Script from "next/script";
import { RiInstagramLine, RiSoundcloudLine } from "react-icons/ri";
import Image from "next/image";

export default function Page() {
  return (
    <div className="bg-background fixed inset-0 z-[100] overflow-x-hidden overflow-y-auto px-6 py-12">
      <div className="mx-auto flex min-h-[calc(100svh-6rem)] w-full max-w-2xl flex-col items-center justify-start gap-8 py-4 text-center md:min-h-[calc(100svh-8rem)] md:justify-center md:gap-10 md:py-8">
        <Image
          src="/crimson_logo_black.png"
          alt="CrimsonC9"
          width={144}
          height={144}
          className="h-36 w-auto"
          style={{ filter: "drop-shadow(0 0 24px var(--foreground))" }}
          priority
        />

        <h1 className="neon-text text-4xl font-bold tracking-widest md:text-6xl">Bunker Dreams</h1>

        <div className="ticket-glass max-h-[70vh] w-full overflow-y-auto rounded-3xl p-1">
          <div
            className="ot-iframe"
            data-ot-url="https://shop.weeztix.com/0bf26a79-697a-11f1-8e27-d65b0659bc31"
            data-ot-guid="0bf26a79-697a-11f1-8e27-d65b0659bc31"
          />
        </div>
        <Script src="https://v1.widget.shop.weeztix.com/injector.js" strategy="afterInteractive" />

        <div className="flex items-center gap-8">
          <a
            href="https://instagram.com/crimsonc9"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--muted-foreground)] transition-colors duration-300 hover:text-[var(--foreground)]"
            aria-label="Instagram"
          >
            <RiInstagramLine className="size-7" />
          </a>
          <a
            href="https://soundcloud.com/crimsonc9"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--muted-foreground)] transition-colors duration-300 hover:text-[var(--foreground)]"
            aria-label="SoundCloud"
          >
            <RiSoundcloudLine className="size-7" />
          </a>
        </div>

        <p className="font-[family-name:var(--font-ui)] text-sm text-[var(--muted-foreground)]">
          &copy; 2026 CrimsonC9
        </p>
      </div>
    </div>
  );
}
