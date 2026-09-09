import { useEffect, useState } from "react";

/**
 * Returns false on the server and on the client's very first render, then
 * flips to true once mounted. Use this to gate any UI that depends on
 * client-only persisted state (Zustand `persist` stores read from
 * localStorage, e.g. auth/cart) — rendering that state immediately causes a
 * server/client markup mismatch ("Hydration failed...") because the server
 * always renders the pre-hydration default (logged out, empty cart). React
 * recovers by discarding and re-rendering the whole subtree from that point
 * up, which is expensive and can visibly disrupt sibling content (e.g. a
 * footer section further down the tree failing to paint on that pass).
 */
export function useHasMounted(): boolean {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
}
