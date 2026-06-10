"use client";

import { ChevronDown, FileText, Headphones, Menu, Search, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
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
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-mv-primary">
      {/* Top bar — logo | search pill | auth buttons */}
      <div className="border-b border-white/10">
        <div className="mv-container flex h-[60px] items-center justify-between gap-3 md:gap-5">
          {/* Logo */}
          <Link href="/" className="shrink-0">
            <Image
              src="/images/logo.png"
              alt="MotoVessel"
              width={120}
              height={36}
              className="h-auto w-[90px] md:w-[110px]"
              priority
            />
          </Link>

          {/* Unified search pill — hidden on small screens */}
          <div className="hidden max-w-[520px] flex-1 items-stretch overflow-hidden rounded-full border border-white/20 bg-white/10 lg:flex">
            {/* Search */}
            <div className="flex min-w-0 flex-1 items-center gap-2 px-4 py-2.5">
              <Search size={15} className="shrink-0 text-white/80" />
              <input
                type="search"
                placeholder="Search"
                className="w-full bg-transparent text-[13px] text-white outline-none placeholder:text-white/60"
                aria-label="Search"
              />
            </div>

            <div className="w-px self-stretch bg-white/20" aria-hidden />

            {/* Vehicle dropdown */}
            <button
              type="button"
              className="flex shrink-0 items-center gap-1.5 whitespace-nowrap px-4 py-2.5 text-[13px] font-medium text-white"
            >
              Search For Vehicle
              <ChevronDown size={14} className="text-white/70" />
            </button>

            <div className="w-px self-stretch bg-white/20" aria-hidden />

            {/* Find Parts */}
            <Link
              href="/products/brake-shoes"
              className="flex shrink-0 items-center gap-2 bg-white/20 px-5 py-2.5 text-[13px] font-medium text-white transition hover:bg-white/30"
            >
              <Search size={15} />
              Find Parts
            </Link>
          </div>

          {/* Action buttons */}
          <div className="flex shrink-0 items-center gap-2 md:gap-2.5">
            <Link
              href="/contact"
              className="hidden items-center gap-1.5 rounded-full border border-white/30 px-3.5 py-1.5 text-[12px] font-medium text-white sm:inline-flex"
              style={{
                background: "linear-gradient(90deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.06) 100%)",
              }}
            >
              <Headphones size={14} className="text-white" />
              Consultancy
            </Link>
            <Link
              href="/sign-in"
              className="hidden rounded-full border border-white/80 px-3.5 py-1.5 text-[12px] font-medium text-white transition hover:bg-white/10 sm:inline-block"
            >
              Sign in
            </Link>
            <Link
              href="/sign-in"
              className="rounded-full bg-white px-3.5 py-1.5 text-[12px] font-semibold text-mv-primary transition hover:bg-white/90"
            >
              Sign Up
            </Link>
            <button
              type="button"
              className="rounded-lg p-1.5 text-white lg:hidden"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Main navigation — blue bg, centered links, Track Order right */}
      <div className="relative hidden lg:block">
        <div className="mv-container flex h-[52px] items-center">
          <nav className="flex flex-1 items-center justify-center gap-8 xl:gap-10" aria-label="Main">
            {mainNavLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={cn(
                  "flex items-center gap-1 text-[14px] font-medium text-white transition hover:text-white/85",
                  pathname === link.href && "underline decoration-white/40 underline-offset-4",
                )}
              >
                {link.label}
                {link.hasDropdown ? <ChevronDown size={14} className="text-white/80" /> : null}
              </Link>
            ))}
          </nav>

          <Link
            href="/track-order"
            className="absolute right-4 flex items-center gap-2 rounded-lg bg-[#2563EB] px-4 py-2 text-[14px] font-medium text-white shadow-sm transition hover:bg-[#1d4ed8] xl:right-6"
          >
            <FileText size={15} />
            Track Order
          </Link>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen ? (
        <nav className="border-t border-white/10 px-4 py-4 lg:hidden" aria-label="Mobile">
          <div className="mb-4 flex items-stretch overflow-hidden rounded-full border border-white/20 bg-white/10">
            <div className="flex flex-1 items-center gap-2 px-3 py-2">
              <Search size={14} className="text-white/80" />
              <input
                type="search"
                placeholder="Search"
                className="w-full bg-transparent text-[13px] text-white outline-none placeholder:text-white/60"
              />
            </div>
            <Link href="/products/brake-shoes" className="flex items-center gap-1 bg-white/20 px-3 py-2 text-[12px] text-white">
              <Search size={13} />
              Find Parts
            </Link>
          </div>
          <ul className="space-y-3 text-[14px]">
            {mainNavLinks.map((link) => (
              <li key={link.label}>
                <Link href={link.href} className="block font-medium text-white" onClick={() => setMobileOpen(false)}>
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/track-order"
                className="inline-flex items-center gap-2 rounded-lg bg-[#2563EB] px-4 py-2 font-medium text-white"
                onClick={() => setMobileOpen(false)}
              >
                <FileText size={15} />
                Track Order
              </Link>
            </li>
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
