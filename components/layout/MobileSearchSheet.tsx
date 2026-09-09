"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { ArrowLeft, Search } from "lucide-react";
import { SearchSuggestions } from "@/components/layout/SearchSuggestions";
import { useDebounce } from "@/hooks/useDebounce";
import { useHasMounted } from "@/hooks/useHasMounted";
import { analytics } from "@/lib/analytics";

/**
 * Full-screen search reached from the mobile bottom nav's Search tab — the
 * desktop search pill lives in the header, which is hidden behind the "..."
 * menu on small screens, so this gives search its own always-reachable tab
 * instead. Reuses the same SearchSuggestions dropdown as the header.
 */
export function MobileSearchSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const mounted = useHasMounted();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [term, setTerm] = useState("");
  const debouncedTerm = useDebounce(term, 300);

  useEffect(() => {
    if (!open) return;
    setTerm("");
    const t = setTimeout(() => inputRef.current?.focus(), 50);
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      clearTimeout(t);
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open || !mounted) return null;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = term.trim();
    if (!query) return;
    analytics.search(query);
    onClose();
    router.push(`/products/all?search=${encodeURIComponent(query)}`);
  };

  return createPortal(
    <div className="fixed inset-0 z-[1000] flex flex-col bg-white lg:hidden">
      <div className="flex items-center gap-2 border-b border-mv-border px-4 py-3">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close search"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-mv-muted transition hover:bg-mv-bg"
        >
          <ArrowLeft size={20} />
        </button>
        <form onSubmit={submit} className="flex min-w-0 flex-1 items-center gap-2 rounded-full border border-mv-border bg-mv-bg px-4 py-2.5">
          <Search size={16} className="shrink-0 text-mv-muted" />
          <input
            ref={inputRef}
            type="search"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="Search parts, brands, SKU..."
            className="w-full bg-transparent text-[14px] text-mv-text outline-none placeholder:text-mv-muted"
            aria-label="Search"
          />
        </form>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        <SearchSuggestions
          query={debouncedTerm}
          open={debouncedTerm.trim().length >= 2}
          onNavigate={onClose}
          variant="inline"
        />
      </div>
    </div>,
    document.body,
  );
}
