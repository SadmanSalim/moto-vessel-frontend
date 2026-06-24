"use client";

import { ChevronDown, FileText, Headphones, Menu, Search, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { VehiclePartsFinderDropdown } from "@/components/NavbarPartsDropdown";
import { cn } from "@/lib/utils";

const mainNavLinks = [
  { label: "Home", href: "/" },
  { label: "Car Parts", href: "/products/brake-shoes", hasDropdown: true },
  { label: "Bike Parts", href: "/products/brake-shoes", hasDropdown: true },
  { label: "Products", href: "/products/brake-shoes" },
  { label: "Service", href: "/service" },
  { label: "Contact", href: "/contact" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [finderOpen, setFinderOpen] = useState(false);
  const [finderKey, setFinderKey] = useState(0);
  const pathname = usePathname();
  const finderRef = useRef<HTMLDivElement>(null);
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearHideTimeout = () => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
  };

  const openFinder = () => {
    clearHideTimeout();
    setFinderOpen(true);
  };

  const scheduleCloseFinder = () => {
    clearHideTimeout();
    hideTimeoutRef.current = setTimeout(() => {
      setFinderOpen(false);
      setFinderKey((k) => k + 1);
    }, 150);
  };

  const toggleFinder = () => {
    clearHideTimeout();
    if (finderOpen) {
      setFinderOpen(false);
      setFinderKey((k) => k + 1);
    } else {
      setFinderOpen(true);
    }
  };

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    if (!finderOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setFinderOpen(false);
        setFinderKey((k) => k + 1);
      }
    };

    const onPointerDown = (event: MouseEvent) => {
      if (finderRef.current && !finderRef.current.contains(event.target as Node)) {
        setFinderOpen(false);
        setFinderKey((k) => k + 1);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onPointerDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onPointerDown);
    };
  }, [finderOpen]);

  useEffect(() => {
    return () => clearHideTimeout();
  }, []);

  return (
    <header className="sticky top-0 z-50">
      {/* Top utility bar — dark navy */}
      <div className="border-b border-white/10 bg-gradient-to-r from-[#0D47A1] via-[#1565C0] to-[#2979FF]">
        <div className="mv-container flex h-[58px] items-center justify-between gap-3 md:h-[60px] md:gap-5">
          <Link href="/" className="shrink-0">
            <Image
              src="/images/logo.png"
              alt="MotoVessel"
              width={120}
              height={36}
              className="h-auto w-[88px] md:w-[110px]"
              priority
            />
          </Link>

          {/* Unified search pill — desktop */}
          <div className="hidden max-w-[520px] flex-1 items-stretch overflow-hidden rounded-full border border-white/30 bg-white/10 transition-all focus-within:border-white/70 focus-within:bg-white/20 lg:flex">
            <div className="flex min-w-0 flex-1 items-center gap-2 px-4 py-2">
              <Search size={15} className="shrink-0 text-white" />
              <input
                type="search"
                placeholder="Search"
                className="w-full bg-transparent text-[13px] text-white/85 outline-none placeholder:text-white/70 focus:outline-none"
                aria-label="Search"
              />
            </div>
            <div className="w-px self-stretch bg-white/20" aria-hidden />
            <button
              type="button"
              className="flex shrink-0 items-center gap-1.5 whitespace-nowrap px-4 py-2 text-[13px] font-medium text-white/85"
            >
              Search For Vehicle
              <ChevronDown size={14} className="text-white" />
            </button>
            <div className="w-px self-stretch bg-white/20" aria-hidden />
            <Link
              href="/products/brake-shoes"
              className="flex shrink-0 items-center gap-2 px-5 py-2 text-[13px] font-medium text-white/85 transition hover:text-white"
            >
              <Search size={15} className="text-white" />
              Find Parts
            </Link>
          </div>

          <div className="flex shrink-0 items-center gap-2 md:gap-2.5">
            <Link
              href="/contact"
              className="btn-consultancy consultancy-btn hidden items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[12px] transition sm:inline-flex"
            >
              <Headphones size={14} className="text-white" />
              Consultancy
            </Link>
            <Link
              href="/sign-in"
              className="hidden rounded-full border border-white/70 px-5 py-1.5 text-[12px] font-medium text-white transition-colors hover:bg-white/15 sm:inline-block"
            >
              Sign in
            </Link>
            <Link
              href="/sign-in"
              className="rounded-full bg-white px-5 py-1.5 text-[12px] font-semibold text-[#0D47A1] transition-colors hover:bg-[#E3EEFF]"
            >
              Sign Up
            </Link>
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
              link.label === "Car Parts" ? (
                <div
                  key={link.label}
                  ref={finderRef}
                  className="relative"
                  onMouseEnter={openFinder}
                  onMouseLeave={scheduleCloseFinder}
                >
                  <button
                    type="button"
                    className={cn(
                      "flex items-center gap-1 text-[14px] font-medium text-white transition hover:text-[#7eb3ff] hover:underline hover:underline-offset-4",
                      finderOpen && "text-[#7eb3ff] underline decoration-[#7eb3ff] underline-offset-4",
                      pathname === link.href && "font-semibold underline decoration-[#7eb3ff] underline-offset-4",
                    )}
                    aria-expanded={finderOpen}
                    aria-haspopup="dialog"
                    onClick={toggleFinder}
                  >
                    {link.label}
                    <ChevronDown size={14} className={cn("text-white transition", finderOpen && "rotate-180")} />
                  </button>

                  {finderOpen ? (
                    <div
                      className="absolute left-1/2 top-full z-[60] -translate-x-1/2 pt-2"
                      onMouseEnter={openFinder}
                      onMouseLeave={scheduleCloseFinder}
                    >
                      <VehiclePartsFinderDropdown key={finderKey} />
                    </div>
                  ) : null}
                </div>
              ) : (
                <Link
                  key={link.label}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-1 text-[14px] font-medium text-white transition hover:text-[#7eb3ff] hover:underline hover:underline-offset-4",
                    pathname === link.href && "font-semibold underline decoration-[#7eb3ff] underline-offset-4",
                  )}
                >
                  {link.label}
                  {link.hasDropdown ? <ChevronDown size={14} className="text-white" /> : null}
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
              <Image src="/images/logo.png" alt="MotoVessel" width={120} height={36} className="h-auto w-[96px]" priority />
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
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="flex items-center justify-between border-b border-[#f0f4fa] px-6 py-[14px] text-[14px] font-semibold text-[#1a2744] transition hover:bg-[#f0f6ff] hover:text-[#1976d2]"
                    onClick={() => setMobileOpen(false)}
                  >
                    <span>{link.label}</span>
                    {link.hasDropdown ? <ChevronDown size={14} className="shrink-0" /> : null}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex flex-col gap-3 p-5">
            <div className="flex items-center gap-2 rounded-[20px] border-[1.5px] border-[#d6e4f7] px-4 py-2.5">
              <Search size={15} className="text-[#7a8ca8]" />
              <input
                type="search"
                placeholder="Search"
                className="w-full text-[13px] text-[#1a2744] outline-none placeholder:text-[#8ba3c7]"
                aria-label="Search"
              />
            </div>
            <Link
              href="/contact"
              className="btn-consultancy inline-flex w-full items-center justify-center gap-2 rounded-[20px] px-4 py-2.5 text-[13px]"
              onClick={() => setMobileOpen(false)}
            >
              <Headphones size={15} className="text-white" />
              Consultancy
            </Link>
            <Link
              href="/sign-in"
              className="inline-flex w-full items-center justify-center rounded-[8px] border-[1.5px] border-[#1976d2] px-4 py-2.5 text-[13px] font-semibold text-[#1976d2] transition hover:bg-[#f0f6ff]"
              onClick={() => setMobileOpen(false)}
            >
              Sign In
            </Link>
            <Link
              href="/sign-in"
              className="inline-flex w-full items-center justify-center rounded-[8px] bg-[#1565c0] px-4 py-2.5 text-[13px] font-semibold text-white transition hover:bg-[#0d47a1]"
              onClick={() => setMobileOpen(false)}
            >
              Sign Up
            </Link>
          </div>
        </aside>
      </div>
    </header>
  );
}
