"use client";

import Link from "next/link";
import DecryptedText from "@/components/ui/decrypted_text";

const links = [
  { name: "Contact", href: "/contact" },
  { name: "Imprint", href: "/imprint" },
  { name: "Support", href: "/support" },
  { name: "Terms & Conditions", href: "/terms" },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background relative mt-auto border-t border-white/5 py-8">
      {/* Minimal background glow */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_bottom,rgba(220,20,60,0.03),transparent_75%)]" />

      <div className="container mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 sm:flex-row">
        {/* Left Side: Copyright with Scramble Effect */}
        <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-[0.3em] text-white/30 uppercase select-none">
          <DecryptedText
            text="CrimsonC9"
            className="text-[10px] font-bold tracking-[0.3em] text-white/50 uppercase transition-colors hover:text-white"
            encryptedClassName="text-[10px] font-bold tracking-[0.3em] text-brand-crimson uppercase font-mono"
            speed={60}
            maxIterations={8}
            sequential={true}
            animateOn="hover"
          />
          <span>© {currentYear}</span>
        </div>

        {/* Right Side: Navigation Links */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="hover:text-brand-crimson text-[10px] font-bold tracking-[0.3em] text-white/40 uppercase transition-all duration-300"
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
