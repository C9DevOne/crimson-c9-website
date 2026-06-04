"use client";
import DecryptedText from "@/components/ui/decrypted_text";

export default function Page() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
      <h1 className="mb-4 text-4xl font-bold tracking-tighter">
        <DecryptedText
          text="CONTACT"
          animateOn="view"
          revealDirection="center"
          useRandomColors={true}
          className="text-brand-crimson"
          encryptedClassName="text-white/20"
        />
      </h1>
      <p className="max-w-md text-sm leading-relaxed tracking-widest text-zinc-500 uppercase">
        This section is under development. <br /> Discover, Connect, Have Fun.
      </p>
    </div>
  );
}
