"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const tokenGroups = [
  {
    title: "Brand & Background",
    note: "The tokens documented in VISION.md §4.",
    tokens: [
      { name: "--background", swatch: "bg-background" },
      { name: "--foreground", swatch: "bg-foreground" },
      { name: "--brand-crimson", swatch: "bg-[var(--brand-crimson)]" },
      { name: "--brand-accent", swatch: "bg-[var(--brand-accent)]" },
      { name: "--glow-accent", swatch: "bg-[var(--glow-accent)]" },
    ],
  },
  {
    title: "shadcn semantic tokens",
    note: "A second, broader token layer shadcn's generated components read from — see WORKING_LOG.md on the overlap with the brand tokens above.",
    tokens: [
      { name: "--primary", swatch: "bg-primary" },
      { name: "--secondary", swatch: "bg-secondary" },
      { name: "--muted", swatch: "bg-muted" },
      { name: "--muted-foreground", swatch: "bg-muted-foreground" },
      { name: "--accent", swatch: "bg-accent" },
      { name: "--destructive", swatch: "bg-destructive" },
      { name: "--border", swatch: "bg-border" },
      { name: "--ring", swatch: "bg-ring" },
    ],
  },
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

const buttonVariants = ["default", "outline", "secondary", "ghost", "destructive", "link"] as const;

export default function TokensPage() {
  const [isAnimating, setIsAnimating] = useState(false);
  const [resolved, setResolved] = useState<Record<string, string>>({});

  const handleAnimate = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 700);
  };

  // Reads the actual live value straight off the CSS custom property, so the value
  // shown next to each swatch can never silently drift from what globals.css defines
  // — no hex code duplicated into this file to go stale.
  useEffect(() => {
    const styles = getComputedStyle(document.documentElement);
    const names = tokenGroups.flatMap((group) => group.tokens.map((t) => t.name));
    const next: Record<string, string> = {};
    for (const name of names) {
      next[name] = styles.getPropertyValue(name).trim();
    }
    // getComputedStyle needs the DOM, so this value can't be derived at render time or
    // read in a state initializer (both run during SSR, before the DOM exists). This is
    // a one-time read on mount (empty deps), not a re-render loop.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setResolved(next);
  }, []);

  return (
    <div className="bg-background text-foreground min-h-screen p-12">
      <div className="mb-12 flex items-center justify-between border-b border-zinc-800 pb-4">
        <Link
          href="/dev"
          className="text-brand-crimson font-mono text-xs tracking-widest uppercase transition-colors hover:text-white"
        >
          ← Back to Dev Portal
        </Link>
      </div>

      <h1 className="font-display mb-16 text-5xl">Design Tokens</h1>

      {tokenGroups.map((group) => (
        <section key={group.title} className="mb-16">
          <h2 className="font-display mb-2 text-3xl">{group.title}</h2>
          <p className="font-ui text-muted-foreground mb-8 text-sm">{group.note}</p>
          <div className="grid grid-cols-3 gap-6">
            {group.tokens.map((token) => (
              <div key={token.name} className="border-border overflow-hidden rounded-2xl border">
                <div className={`h-24 ${token.swatch}`} />
                <div className="bg-secondary space-y-1 p-4">
                  <p className="font-ui text-foreground text-sm">{token.name}</p>
                  <p className="text-muted-foreground font-mono text-[10px]">
                    {resolved[token.name] || "…"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}

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

      <section className="mb-16">
        <h2 className="font-display mb-2 text-3xl">Components</h2>
        <p className="font-ui text-muted-foreground mb-8 text-sm">
          Real components from <code className="text-foreground">src/components/ui/</code> —
          shadcn-generated, built on Radix, styled with the tokens above. Not a mockup.
        </p>

        <div className="bg-secondary mb-6 space-y-4 rounded-2xl p-8">
          <p className="font-ui text-muted-foreground text-xs tracking-widest uppercase">Button</p>
          <div className="flex flex-wrap gap-3">
            {buttonVariants.map((variant) => (
              <Button key={variant} variant={variant}>
                {variant}
              </Button>
            ))}
          </div>
        </div>

        <div className="bg-secondary mb-6 space-y-4 rounded-2xl p-8">
          <p className="font-ui text-muted-foreground text-xs tracking-widest uppercase">Input</p>
          <Input placeholder="you@example.com" className="max-w-sm" />
        </div>

        <div className="bg-secondary mb-6 space-y-4 rounded-2xl p-8">
          <p className="font-ui text-muted-foreground text-xs tracking-widest uppercase">
            Tooltip & Sheet
          </p>
          <div className="flex flex-wrap gap-3">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline">Hover me</Button>
              </TooltipTrigger>
              <TooltipContent>This is a tooltip, unmodified from shadcn</TooltipContent>
            </Tooltip>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="secondary">Open Sheet</Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Example Sheet</SheetTitle>
                  <SheetDescription>
                    The same component the universal menu is a plausible candidate to be built from
                    — slides in from the right, styled entirely with the tokens on this page.
                  </SheetDescription>
                </SheetHeader>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </section>
    </div>
  );
}
