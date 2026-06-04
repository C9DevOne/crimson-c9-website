"use client";

import DecryptedText from "@/components/ui/decrypted_text";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-6xl font-bold tracking-tighter">
        <DecryptedText
          text="CrimsonC9"
          speed={100}
          maxIterations={20}
          sequential
          animateOn="hover"
          revealDirection="center"
          className="text-white"
          encryptedClassName="text-white/20"
        />
      </h1>
    </main>
  );
}
