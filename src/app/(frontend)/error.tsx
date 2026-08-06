"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Frontend Route Error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[85vh] w-full flex-col items-center justify-center bg-[#0a0a0a] px-6 py-16 text-white">
      <div className="mx-auto w-full max-w-lg rounded-3xl border border-zinc-800 bg-zinc-900/60 p-8 text-center backdrop-blur-md md:p-12">
        <div className="bg-brand-crimson/20 text-brand-crimson mx-auto mb-6 flex size-16 items-center justify-center rounded-2xl font-mono text-2xl font-bold">
          909
        </div>
        <h2 className="text-brand-crimson mb-2 text-2xl font-extrabold tracking-widest uppercase md:text-3xl">
          Signal Interrupted
        </h2>
        <p className="mb-8 text-xs tracking-wider text-zinc-400 uppercase md:text-sm">
          We encountered an issue connecting to the collective database.
        </p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <button
            onClick={() => reset()}
            className="bg-brand-crimson hover:bg-brand-crimson/80 w-full rounded-full px-6 py-3 text-xs font-bold tracking-wider text-white uppercase transition-colors sm:w-auto"
          >
            Retry Connection
          </button>
          <Link
            href="/"
            className="w-full rounded-full border border-zinc-700 px-6 py-3 text-xs font-bold tracking-wider text-zinc-300 uppercase transition-colors hover:border-zinc-500 hover:text-white sm:w-auto"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
