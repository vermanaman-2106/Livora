"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Meta Pixel PageView tracker
 * Tracks PageView on every route change in Next.js App Router
 */
export default function MetaPixel() {
  const pathname = usePathname();

  useEffect(() => {
    // Track PageView when component mounts or pathname changes
    if (typeof window !== "undefined" && (window as any).fbq) {
      (window as any).fbq("track", "PageView");
    }
  }, [pathname]);

  return null;
}
