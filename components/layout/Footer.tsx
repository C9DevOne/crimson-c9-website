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
    <footer className="bg-background border-foreground/5 relative mt-auto border-t py-5 sm:py-8">
      {/* Minimal background glow */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_bottom,rgba(220,20,60,0.03),transparent_75%)]" />

      <div className="container mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 sm:flex-row sm:gap-4 sm:px-6">
        {/* Left Side: Copyright with Scramble Effect */}
        <div className="text-foreground/30 flex items-center gap-1.5 text-[10px] font-bold tracking-[0.3em] uppercase select-none">
          <DecryptedText
            text="CrimsonC9"
            className="text-foreground/50 hover:text-foreground text-[10px] font-bold tracking-[0.3em] uppercase transition-colors"
            encryptedClassName="text-[10px] font-bold tracking-[0.3em] text-brand-crimson uppercase font-mono"
            speed={60}
            maxIterations={8}
            sequential={true}
            animateOn="hover"
          />
          <span>© {currentYear}</span>
        </div>

        {/* Right Side: Navigation Links */}
        <div className="flex flex-col items-center justify-center gap-y-2 sm:flex-row sm:gap-x-6 sm:gap-y-0">
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="hover:text-brand-crimson text-foreground/40 text-[10px] font-bold tracking-[0.3em] uppercase transition-all duration-300"
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
