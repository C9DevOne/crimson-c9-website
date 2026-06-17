"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useSidebar } from "@/components/ui/sidebar";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const { toggleSidebar, openMobile, state, isMobile } = useSidebar();
  const isOpen = isMobile ? openMobile : state === "expanded";

  return (
    <nav className="sticky top-0 z-50 flex w-full items-center justify-center py-6">
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleSidebar}
        className="border-zinc-850 hover:bg-brand-crimson/10 hover:border-brand-crimson/50 hover:text-brand-crimson absolute top-1/2 left-4 z-50 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border bg-black/40 text-zinc-400 backdrop-blur-md transition-all duration-300 hover:shadow-[0_0_15px_rgba(81,6,6,0.3)] md:left-8"
        aria-label="Toggle Menu"
      >
        <motion.div
          animate={{ rotate: isOpen ? 90 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="flex items-center justify-center"
        >
          {isOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </motion.div>
      </Button>

      <motion.div
        whileHover={{ scale: 1.15 }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <Link href="/" className="flex items-center">
          <Image
            src="/crimson_logo_black.png"
            alt="CrimsonC9"
            width={144}
            height={144}
            className="h-36 w-auto"
            priority
          />
        </Link>
      </motion.div>
    </nav>
  );
}
