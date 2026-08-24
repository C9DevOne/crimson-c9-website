import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="bg-background text-foreground flex min-h-[85vh] w-full flex-col items-center justify-center px-6 py-16">
      {/* Brand Dragon Logo / Pulsing Header */}
      <div className="relative mb-8 flex items-center justify-center">
        <div className="bg-brand-crimson/20 absolute h-24 w-24 animate-ping rounded-full blur-xl" />
        <div className="border-brand-crimson/40 h-16 w-16 animate-spin rounded-full border-2 border-t-transparent shadow-[0_0_20px_rgba(220,20,60,0.4)]" />
      </div>

      <div className="w-full max-w-md space-y-4 text-center">
        <Skeleton className="mx-auto h-8 w-48 bg-zinc-900" />
        <Skeleton className="mx-auto h-4 w-64 bg-zinc-900/60" />
      </div>

      <div className="mt-12 grid w-full max-w-4xl gap-6 sm:grid-cols-2 md:grid-cols-3">
        <Skeleton className="border-zinc-850 h-64 rounded-2xl border bg-zinc-900/40" />
        <Skeleton className="border-zinc-850 h-64 rounded-2xl border bg-zinc-900/40" />
        <Skeleton className="border-zinc-850 h-64 rounded-2xl border bg-zinc-900/40" />
      </div>
    </div>
  );
}
