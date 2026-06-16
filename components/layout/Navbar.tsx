"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 flex w-full items-center justify-center py-6">
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
          />
        </Link>
      </motion.div>
    </nav>
  );
}
