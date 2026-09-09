"use client";

import { Home, LayoutGrid, Search, ShoppingCart, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { MobileSearchSheet } from "@/components/layout/MobileSearchSheet";
import { useHasMounted } from "@/hooks/useHasMounted";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import { useCartUIStore } from "@/store/cartUIStore";

/**
 * Fixed bottom tab bar shown only on small screens (lg:hidden) — the header
 * nav and mega menus are desktop patterns that don't work well as
 * thumb-reachable navigation on a phone. Present on every page (rendered
 * once from RootLayout) so the whole site stays reachable in one tap.
 */
export function MobileBottomNav() {
  const pathname = usePathname();
  const mounted = useHasMounted();
  const isAuthenticatedRaw = useAuthStore((s) => s.isAuthenticated);
  const isAuthenticated = mounted && isAuthenticatedRaw;
  const cartCountRaw = useCartStore((s) => s.itemCount());
  const cartCount = mounted ? cartCountRaw : 0;
  const openCart = useCartUIStore((s) => s.open);
  const [searchOpen, setSearchOpen] = useState(false);

  if (pathname?.startsWith("/track-order")) {
    return null;
  }

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname?.startsWith(href));

  const items: Array<{
    key: string;
    label: string;
    icon: typeof Home;
    href?: string;
    onClick?: () => void;
    active: boolean;
    badge?: number;
  }> = [
    { key: "home", label: "Home", icon: Home, href: "/", active: isActive("/") },
    { key: "shop", label: "Shop", icon: LayoutGrid, href: "/products/all", active: isActive("/products") },
    { key: "search", label: "Search", icon: Search, onClick: () => setSearchOpen(true), active: false },
    { key: "cart", label: "Cart", icon: ShoppingCart, onClick: openCart, active: false, badge: cartCount },
    {
      key: "account",
      label: "Account",
      icon: User,
      href: isAuthenticated ? "/account/profile" : "/sign-in",
      active: isActive("/account") || isActive("/sign-in"),
    },
  ];

  return (
    <>
      <nav
        aria-label="Mobile"
        className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-mv-border bg-white shadow-[0_-2px_12px_rgba(0,0,0,0.06)] lg:hidden"
      >
        {items.map((item) => {
          const Icon = item.icon;
          const content = (
            <>
              <span className="relative">
                <Icon size={20} className={item.active ? "fill-mv-primary/10" : undefined} />
                {item.badge ? (
                  <span className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-mv-red px-1 text-[9px] font-bold text-white">
                    {item.badge > 99 ? "99+" : item.badge}
                  </span>
                ) : null}
              </span>
              <span className="text-[10px] font-medium">{item.label}</span>
            </>
          );

          const className = cn(
            "flex flex-col items-center justify-center gap-1 py-2.5 transition-colors",
            item.active ? "text-mv-primary" : "text-mv-muted",
          );

          return item.href ? (
            <Link key={item.key} href={item.href} className={className}>
              {content}
            </Link>
          ) : (
            <button key={item.key} type="button" onClick={item.onClick} className={className}>
              {content}
            </button>
          );
        })}
      </nav>
      {/* Reserves the bar's height in normal flow (same reasoning as the
          header's spacer) so it never covers the last bit of page content. */}
      <div className="h-[60px] lg:hidden" aria-hidden="true" />
      <MobileSearchSheet open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
