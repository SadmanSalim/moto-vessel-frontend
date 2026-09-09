"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { queryClient } from "@/lib/queryClient";

async function readGeneration(): Promise<number | null> {
  const res = await fetch(`/api/content-version/?t=${Date.now()}`, { cache: "no-store" });
  if (!res.ok) return null;
  const json = (await res.json()) as { v?: number };
  return typeof json.v === "number" ? json.v : null;
}

// When admin saves, moto-vessel-api bumps a DB generation and (best-effort)
// hits /api/revalidate/. Open storefront tabs poll that generation and
// refetch without a manual refresh.
export default function StorefrontLiveSync() {
  const router = useRouter();
  const generationRef = useRef<number | null>(null);
  const refreshingRef = useRef(false);

  useEffect(() => {
    let cancelled = false;

    async function sync() {
      if (document.visibilityState === "hidden" || refreshingRef.current) return;

      try {
        const next = await readGeneration();
        if (cancelled || next == null) return;

        if (generationRef.current == null) {
          generationRef.current = next;
          return;
        }

        if (generationRef.current === next) return;

        generationRef.current = next;
        refreshingRef.current = true;
        await queryClient.invalidateQueries({ refetchType: "all" });
        router.refresh();
      } catch {
        // Offline / API down — keep showing whatever is already on screen.
      } finally {
        refreshingRef.current = false;
      }
    }

    void sync();
    const id = window.setInterval(() => void sync(), 2000);
    const onVisible = () => {
      if (document.visibilityState === "visible") void sync();
    };
    window.addEventListener("focus", onVisible);
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      cancelled = true;
      window.clearInterval(id);
      window.removeEventListener("focus", onVisible);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [router]);

  return null;
}
