"use client";

import { useState } from "react";
import Loading from "../loading";
import ErrorBoundary from "../error";

export default function DevClient() {
  const [activeTab, setActiveTab] = useState<"loading" | "error">("loading");

  return (
    <div className="space-y-8">
      {/* View Toggle Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab("loading")}
            className={`cursor-pointer rounded-xl px-5 py-2.5 text-xs font-bold uppercase transition ${
              activeTab === "loading"
                ? "bg-brand-crimson text-white"
                : "bg-zinc-900 text-zinc-400 hover:text-white"
            }`}
          >
            Loading Skeleton (<code className="lowercase">loading.tsx</code>)
          </button>
          <button
            onClick={() => setActiveTab("error")}
            className={`cursor-pointer rounded-xl px-5 py-2.5 text-xs font-bold uppercase transition ${
              activeTab === "error"
                ? "bg-brand-crimson text-white"
                : "bg-zinc-900 text-zinc-400 hover:text-white"
            }`}
          >
            Error Boundary (<code className="lowercase">error.tsx</code>)
          </button>
        </div>
      </div>

      {/* Loading Skeleton Showcase */}
      {activeTab === "loading" && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold tracking-widest text-zinc-400 uppercase">
              Unified Loading Skeleton
            </h2>
            <span className="font-mono text-[10px] text-zinc-500 uppercase">
              Fallback for all frontend routes
            </span>
          </div>
          <div className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950/90">
            <Loading />
          </div>
        </section>
      )}

      {/* Error Boundary Showcase */}
      {activeTab === "error" && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold tracking-widest text-zinc-400 uppercase">
              Error Boundary Fallback
            </h2>
            <span className="font-mono text-[10px] text-zinc-500 uppercase">
              Signal Interrupted Error Handler
            </span>
          </div>
          <div className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950/90">
            <ErrorBoundary
              error={new Error("Simulated Dev Database Timeout Error")}
              reset={() => alert("Simulated connection reset action triggered!")}
            />
          </div>
        </section>
      )}
    </div>
  );
}
