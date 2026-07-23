"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export function PageTracker() {
  const pathname = usePathname();
  const lastTracked = useRef<string | null>(null);

  useEffect(() => {
    // Avoid double tracking in dev mode React.StrictMode
    if (lastTracked.current === pathname) return;
    lastTracked.current = pathname;

    // Do not track admin panels, api requests, or developer tokens
    if (
      pathname.startsWith("/admin") ||
      pathname.startsWith("/api") ||
      pathname.startsWith("/dev")
    ) {
      return;
    }

    fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    }).catch((err) => console.error("Visitor tracking error:", err));
  }, [pathname]);

  return null;
}
