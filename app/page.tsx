"use client";

import Script from "next/script";
import { RiInstagramLine, RiSoundcloudLine } from "react-icons/ri";
import Image from "next/image";

export default function Page() {
  return (
    <div className="fixed inset-x-0 top-0 z-[100] flex min-h-full items-center justify-center overflow-y-auto bg-[var(--background)] px-6 py-16">
      <div className="flex w-full max-w-2xl flex-col items-center gap-10 text-center">
        <Image
          src="/crimson_logo_black.png"
          alt="CrimsonC9"
          width={144}
          height={144}
          className="h-40 w-auto"
          style={{ filter: "drop-shadow(0 0 24px var(--foreground))" }}
          priority
        />

        <hr className="w-full border-[var(--secondary)]" />

        <div className="w-full">
          <div
            className="ot-iframe"
            data-ot-url="https://shop.weeztix.com/0bf26a79-697a-11f1-8e27-d65b0659bc31"
            data-ot-guid="0bf26a79-697a-11f1-8e27-d65b0659bc31"
          />
        </div>
        <Script src="https://v1.widget.shop.weeztix.com/injector.js" strategy="lazyOnload" />

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
