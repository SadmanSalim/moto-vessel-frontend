"use client";

import { CarFront, ChevronDown, FileText, Headphones, Heart, Menu, Search, ShoppingCart, User, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { VehiclePartsFinderDropdown } from "@/components/NavbarPartsDropdown";
import { CategoryMegaMenu } from "@/components/layout/CategoryMegaMenu";
import { SearchSuggestions } from "@/components/layout/SearchSuggestions";
import { useLogout } from "@/hooks/useAuth";
import { useDebounce } from "@/hooks/useDebounce";
import { useHasMounted } from "@/hooks/useHasMounted";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import { useCartUIStore } from "@/store/cartUIStore";
import { useCmsNavMenus, useCmsSettings } from "@/hooks/useCms";
import { analytics } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import type { CmsNavItem } from "@/services/cmsService";

type HeaderProps = {
  initialNavMenus?: CmsNavItem[];
  initialSettings?: Record<string, string>;
};

const fallbackNav: CmsNavItem[] = [
  { id: 1, label: "Home", link: "/" },
  { id: 2, label: "Car Parts", link: null, children: [] },
  { id: 3, label: "Bike Parts", link: "/products", children: [] },
  { id: 4, label: "Products", link: "/products" },
  { id: 5, label: "Service", link: "/service" },
  { id: 6, label: "Contact", link: "/contact" },
];

export function Header({ initialNavMenus, initialSettings }: HeaderProps = {}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [finderOpen, setFinderOpen] = useState(false);
  const [finderKey, setFinderKey] = useState(0);
  const [finderPos, setFinderPos] = useState<{ top: number; left: number } | null>(null);
  const [mobileFinderOpen, setMobileFinderOpen] = useState(false);
  const [mobileFinderKey, setMobileFinderKey] = useState(0);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const finderRef = useRef<HTMLDivElement>(null);
  const finderPanelRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const desktopSearchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const mounted = useHasMounted();
  const { isAuthenticated: isAuthenticatedRaw, user } = useAuthStore();
  const cartCountRaw = useCartStore((s) => s.itemCount());
  const openCart = useCartUIStore((s) => s.open);
  // Both stores rehydrate from localStorage client-side only, so the server
  // always renders "logged out, empty cart" — gate on `mounted` to avoid a
  // hydration mismatch (see useHasMounted for why that matters here).
  const isAuthenticated = mounted && isAuthenticatedRaw;
  const cartCount = mounted ? cartCountRaw : 0;
  const logoutMutation = useLogout();
  const { data: navMenus } = useCmsNavMenus(initialNavMenus);
  const { data: settings } = useCmsSettings(initialSettings);
  const mainNavLinks = navMenus?.length ? navMenus : fallbackNav;
  const logoSrc = settings?.site_logo || "/images/logo.png";
  const siteName = settings?.site_name || "MotoVessel";

  // The search pill this button lives in has `overflow-hidden` (for its
  // rounded-pill shape), which silently clips an absolutely-positioned
  // dropdown nested inside it — the panel was rendering but invisible.
  // Rendering it through a portal into <body>, positioned from the
  // trigger's on-screen coordinates, sidesteps that clipping entirely.
  const updateFinderPosition = () => {
    const rect = finderRef.current?.getBoundingClientRect();
    if (!rect) return;
    setFinderPos({ top: rect.bottom + 8, left: rect.left + rect.width / 2 });
  };

  const toggleFinder = () => {
    if (finderOpen) {
      setFinderOpen(false);
      setFinderKey((k) => k + 1);
    } else {
      updateFinderPosition();
      setFinderOpen(true);
    }
  };

  useEffect(() => {
    document.body.style.overflow = mobileOpen || mobileFinderOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen, mobileFinderOpen]);

  useEffect(() => {
    if (!mobileFinderOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileFinderOpen(false);
        setMobileFinderKey((k) => k + 1);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [mobileFinderOpen]);

  const openMobileFinder = () => {
    setMobileOpen(false);
    setMobileFinderOpen(true);
  };

  const closeMobileFinder = () => {
    setMobileFinderOpen(false);
    setMobileFinderKey((k) => k + 1);
  };

  useEffect(() => {
    if (!finderOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setFinderOpen(false);
        setFinderKey((k) => k + 1);
      }
    };

    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      const insideTrigger = finderRef.current?.contains(target);
      const insidePanel = finderPanelRef.current?.contains(target);
      if (!insideTrigger && !insidePanel) {
        setFinderOpen(false);
        setFinderKey((k) => k + 1);
      }
    };

    const onResize = () => updateFinderPosition();

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onPointerDown);
    window.addEventListener("resize", onResize);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("resize", onResize);
    };
  }, [finderOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchTerm.trim();
    if (!query) return;
    setSearchOpen(false);
    setMobileOpen(false);
    analytics.search(query);
    router.push(`/products/all?search=${encodeURIComponent(query)}`);
  };

  useEffect(() => {
    if (!searchOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSearchOpen(false);
    };

    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      const insideDesktop = desktopSearchRef.current?.contains(target);
      const insideMobile = mobileSearchRef.current?.contains(target);
      if (!insideDesktop && !insideMobile) setSearchOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onPointerDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onPointerDown);
    };
  }, [searchOpen]);

  if (pathname?.startsWith("/track-order")) {
    return null;
  }

  return (
    <>
    <header className="fixed left-0 right-0 top-0 z-50">
      {/* Top utility bar — dark navy */}
      <div className="border-b border-white/10 bg-gradient-to-r from-[#0D47A1] via-[#1565C0] to-[#2979FF]">
        <div className="mv-container flex h-[58px] items-center justify-between gap-3 md:h-[60px] md:gap-5">
          <Link href="/" className="shrink-0">
            <Image
              src={logoSrc}
              alt={siteName}
              width={120}
              height={36}
              className="h-auto w-[88px] md:w-[110px]"
              priority
            />
          </Link>

          {/* Unified search pill — desktop */}
          <div ref={desktopSearchRef} className="relative hidden max-w-[520px] flex-1 lg:block">
            <div className="flex items-stretch overflow-hidden rounded-full border border-white/30 bg-white/10 transition-all focus-within:border-white/70 focus-within:bg-white/20">
              <form onSubmit={handleSearchSubmit} className="flex min-w-0 flex-1 items-center gap-2 px-4 py-2">
                <button type="submit" aria-label="Search" className="shrink-0">
                  <Search size={15} className="text-white" />
                </button>
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => setSearchOpen(true)}
                  placeholder="Search"
                  className="w-full bg-transparent text-[13px] text-white/85 outline-none placeholder:text-white/70 focus:outline-none"
                  aria-label="Search"
                />
              </form>
              <div className="w-px self-stretch bg-white/20" aria-hidden />
              <div ref={finderRef} className="relative shrink-0">
                <button
                  type="button"
                  onClick={toggleFinder}
                  aria-expanded={finderOpen}
                  aria-haspopup="dialog"
                  className="flex shrink-0 items-center gap-1.5 whitespace-nowrap px-4 py-2 text-[13px] font-medium text-white/85"
                >
                  Search For Vehicle
                  <ChevronDown size={14} className={cn("text-white transition", finderOpen && "rotate-180")} />
                </button>
              </div>
              <div className="w-px self-stretch bg-white/20" aria-hidden />
              <Link
                href="/products/all"
                className="flex shrink-0 items-center gap-2 px-5 py-2 text-[13px] font-medium text-white/85 transition hover:text-white"
              >
                <Search size={15} className="text-white" />
                Find Parts
              </Link>
            </div>

            <SearchSuggestions
              query={debouncedSearchTerm}
              open={searchOpen}
              onNavigate={() => setSearchOpen(false)}
            />
          </div>

          <div className="flex shrink-0 items-center gap-2 md:gap-2.5">
            <Link
              href="/contact"
              className="btn-consultancy consultancy-btn hidden items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[12px] transition sm:inline-flex"
            >
              <Headphones size={14} className="text-white" />
              Consultancy
            </Link>
            {isAuthenticated ? (
              <Link href="/wishlist" className="relative hidden rounded-full p-1.5 text-white transition hover:bg-white/15 sm:inline-flex" aria-label="Wishlist">
                <Heart size={18} />
              </Link>
            ) : null}
            <button
              type="button"
              onClick={openCart}
              // Hidden below lg — the mobile bottom nav has its own Cart
              // tab, so this would just be a redundant second cart icon.
              className="relative hidden rounded-full p-1.5 text-white transition hover:bg-white/15 lg:inline-flex"
              aria-label="Shopping cart"
            >
              <ShoppingCart size={18} />
              {cartCount > 0 ? (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#2979FF] px-1 text-[10px] font-bold text-white">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              ) : null}
            </button>
            {isAuthenticated ? (
              <div className="relative hidden sm:block" ref={userMenuRef}>
                <button
                  type="button"
                  onClick={() => setUserMenuOpen((v) => !v)}
                  className="flex items-center gap-2 rounded-full border border-white/70 px-3 py-1.5 text-[12px] font-medium text-white transition hover:bg-white/15"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
                    <User size={14} />
                  </span>
                  {user?.name?.split(" ")[0] ?? "Account"}
                  <ChevronDown size={14} />
                </button>
                {userMenuOpen ? (
                  <div className="absolute right-0 top-full z-50 mt-2 min-w-[180px] rounded-lg border border-gray-100 bg-white py-1 shadow-lg">
                    <Link href="/account/profile" className="block px-4 py-2 text-[13px] text-gray-700 hover:bg-gray-50" onClick={() => setUserMenuOpen(false)}>
                      My Account
                    </Link>
                    <Link href="/account/orders" className="block px-4 py-2 text-[13px] text-gray-700 hover:bg-gray-50" onClick={() => setUserMenuOpen(false)}>
                      My Orders
                    </Link>
                    <Link href="/wishlist" className="block px-4 py-2 text-[13px] text-gray-700 hover:bg-gray-50" onClick={() => setUserMenuOpen(false)}>
                      My Wishlist
                    </Link>
                    <Link href="/account/security" className="block px-4 py-2 text-[13px] text-gray-700 hover:bg-gray-50" onClick={() => setUserMenuOpen(false)}>
                      Settings
                    </Link>
                    <button
                      type="button"
                      className="block w-full px-4 py-2 text-left text-[13px] text-red-600 hover:bg-gray-50"
                      onClick={() => {
                        setUserMenuOpen(false);
                        logoutMutation.mutate();
                      }}
                    >
                      Logout
                    </button>
                  </div>
                ) : null}
              </div>
            ) : (
              <>
                <Link
                  href="/sign-in"
                  className="hidden rounded-full border border-white/70 px-5 py-1.5 text-[12px] font-medium text-white transition-colors hover:bg-white/15 sm:inline-block"
                >
                  Sign in
                </Link>
                <Link
                  href="/sign-up"
                  className="rounded-full bg-white px-5 py-1.5 text-[12px] font-semibold text-[#0D47A1] transition-colors hover:bg-[#E3EEFF]"
                >
                  Sign Up
                </Link>
              </>
            )}
            <button
              type="button"
              className="rounded-lg p-1.5 text-white md:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Main navigation — royal blue */}
      <div className="relative hidden bg-[#1565C0] lg:block">
        <div className="mv-container flex h-[50px] items-center">
          <nav className="flex flex-1 items-center justify-center gap-7 xl:gap-10" aria-label="Main">
            {mainNavLinks.map((link) =>
              link.label === "Car Parts" || link.label === "Bike Parts" ? (
                <div key={link.label} className="group relative">
                  <button
                    type="button"
                    className={cn(
                      "flex items-center gap-1 text-[14px] font-medium text-white transition hover:text-[#7eb3ff] hover:underline hover:underline-offset-4",
                      pathname === (link.link ?? "") && "font-semibold underline decoration-[#7eb3ff] underline-offset-4",
                    )}
                  >
                    {link.label}
                    <ChevronDown size={14} className="text-white transition group-hover:rotate-180" />
                  </button>
                  <div className="invisible absolute left-1/2 top-full z-[60] -translate-x-1/2 pt-2 opacity-0 transition group-hover:visible group-hover:opacity-100">
                    <CategoryMegaMenu type={link.label === "Bike Parts" ? "bike" : "car"} />
                  </div>
                </div>
              ) : link.children && link.children.length > 0 ? (
                <div key={link.label} className="group relative">
                  <button
                    type="button"
                    className="flex items-center gap-1 text-[14px] font-medium text-white transition hover:text-[#7eb3ff] hover:underline hover:underline-offset-4"
                  >
                    {link.label}
                    <ChevronDown size={14} className="text-white" />
                  </button>
                  <div className="invisible absolute left-0 top-full z-[60] min-w-[200px] pt-2 opacity-0 transition group-hover:visible group-hover:opacity-100">
                    <div className="rounded-lg border border-white/10 bg-[#0D47A1] py-2 shadow-xl">
                      {link.children.map((child) => (
                        <Link
                          key={child.id}
                          href={child.link ?? "#"}
                          className="block px-4 py-2 text-[13px] text-white/90 hover:bg-white/10 hover:text-white"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={link.label}
                  href={link.link ?? "#"}
                  className={cn(
                    "flex items-center gap-1 text-[14px] font-medium text-white transition hover:text-[#7eb3ff] hover:underline hover:underline-offset-4",
                    pathname === (link.link ?? "") && "font-semibold underline decoration-[#7eb3ff] underline-offset-4",
                  )}
                >
                  {link.label}
                </Link>
              ),
            )}
          </nav>

          <Link
            href="/track-order"
            className="track-order-btn absolute right-4 flex items-center gap-2 rounded-lg bg-white px-4 py-1.5 text-[13px] font-semibold text-[#0D47A1] shadow-sm transition-colors hover:bg-[#E3EEFF] xl:right-6"
          >
            <FileText size={15} className="text-[#0D47A1]" />
            Track Order
          </Link>
        </div>
      </div>

      {/* Mobile sidebar */}
      <div className={cn("md:hidden", !mobileOpen && "pointer-events-none")}>
        <button
          type="button"
          className={cn("mobile-nav-overlay transition-opacity duration-300", mobileOpen ? "opacity-100" : "opacity-0")}
          onClick={() => setMobileOpen(false)}
          aria-label="Close menu overlay"
        />

        <aside className={cn("mobile-nav-drawer flex flex-col", mobileOpen && "open")} aria-label="Mobile navigation">
          <div
            className="flex h-[62px] items-center justify-between px-4"
            style={{ background: "linear-gradient(90deg,#0d47a1,#1565c0,#1976d2)" }}
          >
            <Link href="/" className="shrink-0" onClick={() => setMobileOpen(false)}>
              <Image src={logoSrc} alt={siteName} width={120} height={36} className="h-auto w-[96px]" priority />
            </Link>
            <button
              type="button"
              className="text-[20px] font-medium text-white"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto" aria-label="Sidebar links">
            <ul>
              {mainNavLinks.map((link) => (
                <li key={link.id}>
                  <Link
                    href={link.link ?? "#"}
                    className="flex items-center justify-between border-b border-[#f0f4fa] px-6 py-[14px] text-[14px] font-semibold text-[#1a2744] transition hover:bg-[#f0f6ff] hover:text-[#1976d2]"
                    onClick={() => setMobileOpen(false)}
                  >
                    <span>{link.label}</span>
                    {link.children && link.children.length > 0 ? <ChevronDown size={14} className="shrink-0" /> : null}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex flex-col gap-3 p-5">
            <div ref={mobileSearchRef} className="relative">
              <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 rounded-[20px] border-[1.5px] border-[#d6e4f7] px-4 py-2.5">
                <button type="submit" aria-label="Search">
                  <Search size={15} className="text-[#7a8ca8]" />
                </button>
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => setSearchOpen(true)}
                  placeholder="Search"
                  className="w-full text-[13px] text-[#1a2744] outline-none placeholder:text-[#8ba3c7]"
                  aria-label="Search"
                />
              </form>

              <SearchSuggestions
                query={debouncedSearchTerm}
                open={searchOpen}
                onNavigate={() => {
                  setSearchOpen(false);
                  setMobileOpen(false);
                }}
              />
            </div>
            <button
              type="button"
              onClick={openMobileFinder}
              className="flex w-full items-center justify-center gap-2 rounded-[20px] border-[1.5px] border-[#1976d2] px-4 py-2.5 text-[13px] font-semibold text-[#1976d2] transition hover:bg-[#f0f6ff]"
            >
              <CarFront size={15} />
              Search For Vehicle
            </button>
            <Link
              href="/contact"
              className="btn-consultancy inline-flex w-full items-center justify-center gap-2 rounded-[20px] px-4 py-2.5 text-[13px]"
              onClick={() => setMobileOpen(false)}
            >
              <Headphones size={15} className="text-white" />
              Consultancy
            </Link>
            <Link
              href={isAuthenticated ? "/account/profile" : "/sign-in"}
              className="inline-flex w-full items-center justify-center rounded-[8px] border-[1.5px] border-[#1976d2] px-4 py-2.5 text-[13px] font-semibold text-[#1976d2] transition hover:bg-[#f0f6ff]"
              onClick={() => setMobileOpen(false)}
            >
              {isAuthenticated ? "My Account" : "Sign In"}
            </Link>
            {isAuthenticated ? (
              <Link
                href="/wishlist"
                className="inline-flex w-full items-center justify-center gap-2 rounded-[8px] border-[1.5px] border-[#1976d2] px-4 py-2.5 text-[13px] font-semibold text-[#1976d2] transition hover:bg-[#f0f6ff]"
                onClick={() => setMobileOpen(false)}
              >
                <Heart size={15} />
                My Wishlist
              </Link>
            ) : null}
            {!isAuthenticated ? (
              <Link
                href="/sign-up"
                className="inline-flex w-full items-center justify-center rounded-[8px] bg-[#1565c0] px-4 py-2.5 text-[13px] font-semibold text-white transition hover:bg-[#0d47a1]"
                onClick={() => setMobileOpen(false)}
              >
                Sign Up
              </Link>
            ) : null}
          </div>
        </aside>
      </div>

      {/* Desktop vehicle finder dropdown — portaled to <body> so the search
          pill's `overflow-hidden` (needed for its rounded-pill shape) can't
          clip it. Positioned from the trigger button's live coordinates. */}
      {finderOpen && finderPos && mounted
        ? createPortal(
            <div
              ref={finderPanelRef}
              style={{
                position: "fixed",
                top: finderPos.top,
                left: finderPos.left,
                transform: "translateX(-50%)",
                maxHeight: `calc(100vh - ${finderPos.top}px - 16px)`,
                overflowY: "auto",
              }}
              className="z-[70] rounded-b-[16px]"
            >
              <VehiclePartsFinderDropdown
                key={finderKey}
                onNavigate={() => {
                  setFinderOpen(false);
                  setFinderKey((k) => k + 1);
                }}
              />
            </div>,
            document.body,
          )
        : null}

      {/* Mobile / tablet vehicle finder — same widget as the desktop search-bar dropdown, shown as a full-screen sheet below the lg breakpoint. */}
      {mobileFinderOpen ? (
        <div
          className="fixed inset-0 z-[1000] overflow-y-auto bg-black/60 px-3 py-6 lg:hidden"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeMobileFinder();
          }}
        >
          <div className="relative mx-auto w-full max-w-[560px]">
            <button
              type="button"
              onClick={closeMobileFinder}
              aria-label="Close vehicle finder"
              className="absolute -right-2 -top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#1a2e6f] shadow-lg"
            >
              <X size={16} />
            </button>
            <VehiclePartsFinderDropdown
              key={mobileFinderKey}
              className="!w-full rounded-[16px] border-t"
              onNavigate={closeMobileFinder}
            />
          </div>
        </div>
      ) : null}
    </header>
    {/* Header is `fixed` (not `sticky`) — html/body have overflow-x:hidden
        for the road-animation background, and any ancestor with non-visible
        overflow silently breaks position:sticky. This spacer reserves the
        header's exact height in normal flow so page content isn't hidden
        underneath it; heights must stay in sync with the header's own
        h-[58px]/md:h-[60px] top bar + the lg:h-[50px] nav row below it. */}
    <div className="h-[58px] md:h-[60px] lg:h-[110px]" aria-hidden="true" />
    </>
  );
}
