"use client";

import DecryptedText from "@/components/ui/decrypted_text";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-theme(spacing.14)-113px)]">
      <h1 className="text-6xl font-bold tracking-tighter">
        <DecryptedText
          text="CrimsonC9"
          speed={100}
          maxIterations={20}
          sequential={true}
          animateOn="hover"
          revealDirection="center"
          className="text-white"
          encryptedClassName="text-white/20"
        />
      </h1>
    </div>
  );
}
