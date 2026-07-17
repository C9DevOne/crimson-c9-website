"use client";

import Link from "next/link";
import DecryptedText from "@/components/ui/decrypted_text";
import { Button } from "@/components/ui/button";

/**
 * Custom 404 page for CrimsonC9.
 * This component is used by Next.js when a page is not found or when notFound() is called.
 */
export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center p-4 text-center">
      <div className="space-y-4">
        <h1 className="text-9xl leading-none font-bold tracking-tighter">
          <DecryptedText
            text="404"
            speed={200}
            maxIterations={20}
            sequential={true}
            animateOn="view"
            revealDirection="center"
            className="text-brand-crimson"
            encryptedClassName="text-white/20"
            useRandomColors={true}
            loop={true}
            loopInterval={600}
          />
        </h1>
        <h2 className="text-foreground text-3xl font-semibold">Lost in the Rhythm</h2>
        <p className="text-muted-foreground mx-auto max-w-md text-lg">
          The track you&apos;re looking for has faded out into the void. Join us back in the main
          room.
        </p>
        <div className="pt-6">
          <Button
            asChild
            className="bg-brand-crimson hover:bg-brand-crimson/90 h-11 px-8 font-medium text-white"
          >
            <Link href="/">Return to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
