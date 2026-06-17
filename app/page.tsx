"use client";

import DecryptedText from "@/components/ui/decrypted_text";

export default function Page() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <h1 className="text-6xl font-bold tracking-tighter">
        <DecryptedText
          text="CrimsonC9"
          speed={100}
          maxIterations={20}
          sequential={true}
          animateOn="hover"
          revealDirection="center"
          className="text-brand-crimson"
          encryptedClassName="text-foreground/20"
          useRandomColors={true}
        />
      </h1>
    </div>
  );
}
