import { Globe, Mail, MapPin, Phone, Share2, ShieldCheck, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { branches } from "@/data/branches";
import { cn } from "@/lib/utils";

const footerLinks = {
  "Shop Parts": [
    { label: "All Collections", href: "/products/brake-shoes" },
    { label: "Browse Products", href: "/products/brake-shoes" },
    { label: "Deal & Offers", href: "/products/brake-shoes" },
    { label: "Sale Items", href: "/products/brake-shoes" },
    { label: "Search Parts", href: "/products/brake-shoes" },
  ],
  Company: [
    { label: "About MotoVessel", href: "/contact" },
    { label: "Blog & News", href: "/contact" },
    { label: "Store locator", href: "/store-locator" },
    { label: "Contact Us", href: "/contact" },
  ],
  Support: [
    { label: "Track Your Order", href: "/track-order" },
    { label: "Vehicle Fitment", href: "/products/brake-shoes" },
    { label: "Help Center", href: "/contact" },
    { label: "Returns & Warranty", href: "/contact" },
    { label: "Privacy Policy", href: "/contact" },
  ],
  "My Account": [
    { label: "Sign In", href: "/sign-in" },
    { label: "Create Account", href: "/sign-in" },
    { label: "My Account", href: "/account/settings" },
    { label: "Shopping Cart", href: "/checkout" },
  ],
};

export function Footer() {
  return (
    <footer className="relative bg-mv-navy text-white">
      {/* Convex curve — white page into navy footer */}
      <div className="pointer-events-none absolute -top-11 left-0 right-0 h-11 overflow-hidden md:-top-14 md:h-14" aria-hidden>
        <svg viewBox="0 0 1440 56" preserveAspectRatio="none" className="h-full w-full">
          <path
            d="M0,56 L0,28 C240,0 480,0 720,20 C960,40 1200,56 1440,28 L1440,56 Z"
            fill="#0F2C6B"
          />
        </svg>
      </div>

      {/* Our Branches */}
      <div className="relative pt-14 md:pt-16">
        <div className="mv-container pb-10 md:pb-12">
          <p className="text-center text-[11px] font-medium uppercase tracking-[0.2em] text-[#7EB3FF]">
            Find us near you
          </p>
          <h2 className="mt-1.5 text-center text-[26px] font-bold text-white md:text-[30px]">Our Branches</h2>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5 lg:gap-4">
            {branches.map((branch) => (
              <article
                key={branch.id}
                className="group relative overflow-hidden rounded-lg border border-white/15 bg-white/[0.06] p-4 backdrop-blur-sm transition hover:bg-white/[0.09]"
              >
                <div className="mb-3 inline-flex items-center justify-center rounded border border-white/20 bg-white/5 px-2 py-1">
                  <span className="text-[8px] font-bold tracking-widest text-white/70">{branch.category}</span>
                </div>
                <h3 className="text-[14px] font-bold leading-tight text-white">{branch.name}</h3>
                <p className="mt-1 text-[11px] font-medium text-[#7EB3FF]">{branch.subtitle}</p>
                <p className="mt-1.5 text-[10px] leading-relaxed text-white/45">{branch.location}</p>
                <div className="mt-3 flex items-center gap-1.5">
                  <span
                    className={cn(
                      "h-1.5 w-1.5 rounded-full",
                      branch.status === "open" ? "bg-[#10B981]" : "bg-[#F59E0B]",
                    )}
                  />
                  <span
                    className={cn(
                      "text-[10px] font-semibold",
                      branch.status === "open" ? "text-[#10B981]" : "text-white/50",
                    )}
                  >
                    {branch.status === "open" ? "Open Now" : branch.statusLabel ?? "Coming Soon"}
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#1A56DB] to-transparent opacity-60 transition group-hover:opacity-100" />
              </article>
            ))}
          </div>
        </div>
      </div>

      {/* Main footer grid */}
      <div className="border-t border-white/10">
        <div className="mv-container grid gap-8 py-12 md:grid-cols-2 lg:grid-cols-5 lg:gap-6 lg:py-14">
          <div>
            <Image
              src="/images/logo.png"
              alt="MotoVessel"
              width={140}
              height={40}
              className="h-auto w-[120px] md:w-[140px]"
            />
            <p className="mt-4 max-w-[220px] text-[12px] leading-relaxed text-white/55">
              Authentic MotoVessel automotive parts with guaranteed quality and nationwide shipping.
            </p>

            <h3 className="mt-6 text-[13px] font-bold text-white">Contact</h3>
            <ul className="mt-3 space-y-2.5">
              <li className="flex items-center gap-2.5 text-[12px] text-white/65">
                <Phone size={13} className="shrink-0 text-white/40" />
                018 XXXXXXXX
              </li>
              <li className="flex items-center gap-2.5 text-[12px] text-white/65">
                <Mail size={13} className="shrink-0 text-white/40" />
                motovessel@gmail.com
              </li>
              <li className="flex items-start gap-2.5 text-[12px] text-white/65">
                <MapPin size={13} className="mt-0.5 shrink-0 text-white/40" />
                Kadamtali, Chattogram, Bangladesh
              </li>
            </ul>

            <h3 className="mt-6 text-[13px] font-bold text-white">Follow Us</h3>
            <div className="mt-2.5 flex gap-2">
              {[
                { Icon: Share2, label: "Facebook" },
                { Icon: Users, label: "Instagram" },
                { Icon: Globe, label: "YouTube" },
              ].map(({ Icon, label }) => (
                <Link
                  key={label}
                  href="#"
                  aria-label={label}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:border-mv-primary hover:bg-mv-primary"
                >
                  <Icon size={14} />
                </Link>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h3 className="text-[13px] font-bold text-white">{heading}</h3>
              <ul className="mt-3 space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-[12px] text-white/50 transition hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Copyright bar */}
      <div className="border-t border-white/10">
        <div className="mv-container flex flex-col items-center justify-between gap-3 py-4 text-[11px] text-white/45 md:flex-row">
          <p>© 2026 MotoVessel. All rights reserved. Developed By TechItNext</p>
          <div className="flex gap-5">
            <Link href="#" className="transition hover:text-white">
              Privacy
            </Link>
            <Link href="#" className="transition hover:text-white">
              Terms
            </Link>
            <Link href="#" className="transition hover:text-white">
              Cookies
            </Link>
          </div>
        </div>
      </div>

      {/* Secure payments — uses provided payment image */}
      <div className="border-t border-white/10 py-5 md:py-6">
        <div className="mv-container">
          <div className="mb-4 flex items-center justify-center gap-1.5">
            <ShieldCheck size={15} className="text-[#10B981]" />
            <span className="text-[12px] font-medium text-white/70">Secure payments:</span>
          </div>
          <div className="overflow-hidden rounded-md bg-black">
            <Image
              src="/images/payment-methods.png"
              alt="Secure payment methods — Visa, Mastercard, bKash, Nagad, SSLCommerz and more"
              width={1400}
              height={60}
              className="h-auto w-full object-contain"
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
