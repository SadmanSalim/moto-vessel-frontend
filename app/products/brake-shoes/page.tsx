"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

/**
 * Legacy URL — this route used to host the generic product listing page,
 * but the "brake-shoes" slug was misleading (it lists every category, not
 * just brake shoes). The listing page now lives at /products/all. This
 * redirect preserves bookmarks/links and forwards the query string
 * (category, brand, search, sort, page, price_max) unchanged.
 */
function RedirectToAll() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const qs = searchParams.toString();
    router.replace(qs ? `/products/all?${qs}` : "/products/all");
  }, [router, searchParams]);

  return null;
}

export default function LegacyBrakeShoesRedirect() {
  return (
    <Suspense fallback={null}>
      <RedirectToAll />
    </Suspense>
  );
}
