"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { useHasMounted } from "./useHasMounted";

/**
 * Client-side replacement for the old middleware.ts route guard.
 *
 * Static export (`output: 'export'`, required for Hostinger shared hosting
 * with no Node.js runtime) doesn't support Next.js Middleware at all — there
 * is no server left to run it on. This reproduces the same behavior
 * (redirect to /sign-in if not logged in) entirely in the browser instead.
 *
 * Gated on useHasMounted() because the auth store hydrates from
 * localStorage after mount; checking isAuthenticated on the very first
 * render would see the pre-hydration "logged out" default and incorrectly
 * bounce an actually-logged-in user.
 *
 * Returns true once it's safe to render the protected content.
 */
export function useRequireAuth(): boolean {
  const mounted = useHasMounted();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.replace(`/sign-in?next=${encodeURIComponent(pathname ?? "/")}`);
    }
  }, [mounted, isAuthenticated, pathname, router]);

  return mounted && isAuthenticated;
}
