"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const colors = [
  { name: "--background", var: "bg-background" },
  { name: "--foreground", var: "bg-foreground" },
  { name: "--brand-crimson", var: "bg-[var(--brand-crimson)]" },
  { name: "--brand-accent", var: "bg-[var(--brand-accent)]" },
  { name: "--secondary", var: "bg-secondary" },
  { name: "--muted-foreground", var: "bg-[var(--muted-foreground)]" },
];

const fonts = [
  {
    name: "Cinzel Decorative",
    variable: "--font-display",
    className: "font-display",
    sample: "Change Through Music",
  },
  {
    name: "Philosopher",
    variable: "--font-body",
    className: "font-body",
    sample: "Something is growing here.",
  },
  {
    name: "DM Sans",
    variable: "--font-ui",
    className: "font-ui",
    sample: "Artists · Events · Connect",
  },
];

const radiuses = [
  { name: "rounded-sm", className: "rounded-sm" },
  { name: "rounded-xl", className: "rounded-xl" },
  { name: "rounded-2xl", className: "rounded-2xl" },
  { name: "rounded-3xl", className: "rounded-3xl" },
  { name: "rounded-full", className: "rounded-full" },
];

export default function TokensPage() {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleAnimate = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 700);
  };

  return (
    <div className="bg-background text-foreground min-h-screen p-12">
      <h1 className="font-display mb-16 text-5xl">Design Tokens</h1>

      <section className="mb-16">
        <h2 className="font-display mb-8 text-3xl">Colours</h2>
        <div className="grid grid-cols-3 gap-6">
          {colors.map((color) => (
            <div key={color.name} className="border-border overflow-hidden rounded-2xl border">
              <div className={`h-24 ${color.var}`} />
              <div className="bg-secondary p-4">
                <p className="font-ui text-foreground text-sm">{color.name}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-16">
        <h2 className="font-display mb-8 text-3xl">Typography</h2>
        <div className="space-y-8">
          {fonts.map((font) => (
            <div key={font.variable} className="border-border border-b pb-8">
              <p className={`mb-2 text-3xl ${font.className}`}>{font.sample}</p>
              <div className="font-ui text-muted-foreground flex gap-4 text-sm">
                <span>{font.name}</span>
                <span>·</span>
                <span>{font.variable}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-16">
        <h2 className="font-display mb-8 text-3xl">Spacing & Radius</h2>
        <div className="flex items-end gap-6">
          {radiuses.map((radius) => (
            <div key={radius.name} className="flex flex-col items-center gap-3">
              <div className={`bg-brand-crimson h-24 w-24 ${radius.className}`} />
              <span className="font-ui text-muted-foreground text-sm">{radius.name}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-16">
        <h2 className="font-display mb-8 text-3xl">Motion</h2>
        <div className="bg-secondary rounded-2xl p-8">
          <div className="mb-6 flex items-center gap-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={isAnimating ? "animating" : "idle"}
                initial={isAnimating ? { x: -100, opacity: 0 } : false}
                animate={{ x: 0, opacity: 1 }}
                transition={{
                  duration: 0.6,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
                className="bg-brand-accent h-32 w-32 rounded-2xl"
              />
            </AnimatePresence>
            <div className="font-ui space-y-2 text-sm">
              <p>
                <span className="text-muted-foreground">Duration:</span> 600ms
              </p>
              <p>
                <span className="text-muted-foreground">Easing:</span> ease-out (custom
                cubic-bezier)
              </p>
              <p>
                <span className="text-muted-foreground">Range:</span> 400ms – 700ms
              </p>
            </div>
          </div>
          <button
            onClick={handleAnimate}
            disabled={isAnimating}
            className="bg-foreground font-ui text-background rounded-full px-6 py-3 text-sm font-medium transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {isAnimating ? "Animating..." : "Trigger Animation"}
          </button>
        </div>
      </section>
    </div>
  );
}
