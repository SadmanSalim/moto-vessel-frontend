"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { analytics } from "@/lib/analytics";

/** Fires a page_view on every client-side route change (the initial load
 * is already covered by gtag.js's own `gtag('config', ...)` call). */
export default function AnalyticsRouteTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const query = searchParams.toString();
    analytics.pageview(query ? `${pathname}?${query}` : pathname);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams]);

  return null;
}
