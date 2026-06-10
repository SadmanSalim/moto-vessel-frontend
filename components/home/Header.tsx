"use client";

import { Menu, Search, ShoppingCart, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const navLinks = ["Home", "Shop", "Brands", "Services", "Offers", "Contact"];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="relative z-50 text-white">
      <div className="border-b border-white/10">
        <div className="mv-container flex items-center gap-4 py-2.5">
          <div className="mx-auto flex w-full max-w-[480px] items-center rounded-full border border-white/15 bg-white/10 px-4 py-[7px] backdrop-blur-sm">
            <Search size={15} className="shrink-0 text-white/60" />
            <input
              type="search"
              placeholder="Search parts, brands, SKU..."
              className="ml-2 w-full bg-transparent text-[13px] text-white outline-none placeholder:text-white/45"
              aria-label="Search"
            />
          </div>
          <div className="hidden shrink-0 items-center gap-5 text-[13px] font-medium md:flex">
            <Link href="#" className="text-white/85 transition hover:text-white">
              My Account
            </Link>
            <Link href="#" className="text-white/85 transition hover:text-white">
              Log In
            </Link>
          </div>
        </div>
      </div>

      <div className="mv-container flex items-center gap-4 py-3.5">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <Image src="/images/placeholders/logo.svg" alt="" width={36} height={36} className="h-9 w-9" />
          <span className="text-[17px] font-extrabold tracking-tight">
            <span className="text-white">MOTO</span>
            <span className="text-[#5eb3ff]">VESSEL</span>
          </span>
        </Link>

        <nav className="hidden flex-1 items-center justify-center gap-7 lg:flex" aria-label="Main">
          {navLinks.map((link) => (
            <Link
              key={link}
              href="#"
              className="text-[13px] font-medium text-white/90 transition hover:text-white"
            >
              {link}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2.5">
          <Link
            href="#"
            className="hidden rounded-full border border-white/80 px-5 py-[7px] text-[13px] font-semibold transition hover:bg-white hover:text-mv-navy lg:inline-flex"
          >
            Become a Seller
          </Link>
          <Link
            href="#"
            className="relative hidden items-center gap-1.5 rounded-full bg-white px-4 py-[7px] text-[13px] font-bold text-mv-blue sm:inline-flex"
          >
            <ShoppingCart size={15} />
            Cart
            <span className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-mv-red px-1 text-[10px] font-bold text-white">
              2
            </span>
          </Link>
          <button
            type="button"
            className="rounded-lg p-1.5 lg:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <nav className="border-t border-white/10 px-4 py-4 lg:hidden" aria-label="Mobile">
          <ul className="space-y-3 text-[13px]">
            {navLinks.map((link) => (
              <li key={link}>
                <Link href="#" className="block font-medium" onClick={() => setMobileOpen(false)}>
                  {link}
                </Link>
              </li>
            ))}
            <li className="flex gap-4 pt-2">
              <Link href="#">My Account</Link>
              <Link href="#">Log In</Link>
            </li>
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
