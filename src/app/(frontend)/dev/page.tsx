"use cache";

import Link from "next/link";
import DevClient from "./dev-client";

export default function DevPortalPage() {
  return (
    <div className="bg-background text-foreground min-h-screen">
      <div className="mx-auto max-w-5xl px-6 py-8">
        <div className="mb-8 flex items-center justify-between border-b border-zinc-800 pb-4">
          <h1 className="text-brand-crimson text-xl font-bold tracking-widest uppercase">
            DEV PORTAL — UI Component Showcase
          </h1>
          <div className="flex gap-4 font-mono text-xs">
            <Link href="/dev/tokens" className="text-zinc-400 underline hover:text-white">
              Design Tokens
            </Link>
          </div>
        </div>

        <DevClient />
      </div>
    </div>
  );
}
