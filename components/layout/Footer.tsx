"use client";

import { Globe, Mail, MapPin, Phone, Share2, ShieldCheck, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import ErrorMessage from "@/components/ErrorMessage";
import StoreCardSkeleton from "@/components/skeletons/StoreCardSkeleton";
import { useCmsFooter } from "@/hooks/useCms";
import { useReveal } from "@/hooks/useReveal";
import { useStores } from "@/hooks/useStores";
import { getErrorMessage } from "@/lib/api";
import { cn } from "@/lib/utils";
import { FooterWave } from "./FooterWave";
import type { CmsFooterData } from "@/services/cmsService";
import type { StoreLocation } from "@/types";

type FooterProps = {
  initialFooter?: CmsFooterData | null;
  initialStores?: StoreLocation[];
};

const footerGroupLabels: Record<string, string> = {
  footer_shop: "Shop Parts",
  footer_company: "Company",
  footer_support: "Support",
  footer_account: "My Account",
};

const defaultFooterLinks: Record<string, Array<{ label: string; link: string; open_in_new_tab?: boolean }>> = {
  footer_shop: [
    { label: "All Collections", link: "/products" },
    { label: "Browse Products", link: "/products" },
  ],
  footer_company: [
    { label: "About MotoVessel", link: "/contact" },
    { label: "Store locator", link: "/store-locator" },
  ],
  footer_support: [
    { label: "Track Your Order", link: "/track-order" },
    { label: "Help Center", link: "/contact" },
  ],
  footer_account: [
    { label: "Sign In", link: "/sign-in" },
    { label: "Create Account", link: "/sign-up" },
  ],
};

function isStoreOpen(store: StoreLocation): boolean {
  if (!store.opening_time || !store.closing_time) return store.is_active;
  const now = new Date();
  const [openH, openM] = store.opening_time.split(":").map(Number);
  const [closeH, closeM] = store.closing_time.split(":").map(Number);
  const current = now.getHours() * 60 + now.getMinutes();
  const open = openH * 60 + (openM || 0);
  const close = closeH * 60 + (closeM || 0);
  return current >= open && current <= close;
}

export function Footer({ initialFooter, initialStores }: FooterProps = {}) {
  // Footer renders on every page (it lives in the root layout), but the
  // scroll-reveal animation only activates for a page if that page's own
  // component happens to call useReveal() — most pages do, but not all
  // (e.g. the product listing/detail pages don't), which left the branch
  // cards below permanently invisible (stuck at opacity:0) on those pages.
  // Calling it here guarantees it's always active regardless of page.
  useReveal();
  const { data: footer } = useCmsFooter(initialFooter ?? undefined);
  const { data: stores, isLoading, isError, error } = useStores(initialStores);

  const settings = footer?.settings ?? {};
  const menus = footer?.menus ?? defaultFooterLinks;
  const logoSrc = settings.site_logo || "/images/logo.png";
  const aboutText =
    settings.footer_about_text ||
    "Authentic MotoVessel automotive parts with guaranteed quality and nationwide shipping.";
  const phone = settings.contact_phone || "+880 1322-910229";
  const email = settings.contact_email || "motovessel@gmail.com";
  const address = settings.contact_address || "Kadamtali, Chattogram, Bangladesh";
  const copyright =
    settings.footer_copyright || "© 2026 MotoVessel. All rights reserved. Developed By TechItNext";

  const socialLinks = [
    { Icon: Share2, label: "Facebook", href: settings.facebook_url || "#" },
    { Icon: Users, label: "Instagram", href: settings.instagram_url || "#" },
    { Icon: Globe, label: "YouTube", href: settings.youtube_url || "#" },
  ];

  return (
    <footer className="relative bg-mv-navy text-white">
      <FooterWave />

      <div className="relative pt-2 md:pt-4">
        <div className="mv-container pb-10 md:pb-14">
          <p className="text-center text-[11px] font-medium uppercase tracking-[0.22em] text-[#7EB3FF]">
            Find us near you
          </p>
          <h2 className="reveal mt-2 text-center text-[26px] font-bold leading-tight text-white md:text-[32px]">
            Our <span className="text-[#7EB3FF]">Branches</span>
          </h2>

          <div className="mt-8 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] sm:grid sm:snap-none sm:grid-cols-2 sm:overflow-visible sm:pb-0 lg:grid-cols-5 lg:gap-4 [&::-webkit-scrollbar]:hidden">
            {isLoading &&
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="min-w-[200px] sm:min-w-0">
                  <StoreCardSkeleton />
                </div>
              ))}
            {isError && (
              <div className="col-span-full">
                <ErrorMessage message={getErrorMessage(error)} />
              </div>
            )}
            {stores?.map((branch, index) => {
              const open = isStoreOpen(branch);
              return (
                <article
                  key={branch.id}
                  className={`group reveal relative min-w-[200px] shrink-0 snap-start overflow-hidden rounded-xl border border-[#3B6FD4]/40 bg-[#0D3580]/50 p-4 backdrop-blur-sm transition duration-300 hover:border-[#5B9AFF]/60 hover:bg-[#0D3580]/70 sm:min-w-0 d${index + 1}`}
                >
                  <div className="mb-3 inline-flex items-center justify-center rounded border border-white/25 bg-white/[0.06] px-2 py-1">
                    <span className="text-[8px] font-bold tracking-[0.15em] text-white/75">
                      {branch.branch_type.replace("_", " ").toUpperCase()}
                    </span>
                  </div>
                  <h3 className="text-[14px] font-bold leading-tight text-white">{branch.name}</h3>
                  <p className="mt-1 text-[11px] font-medium text-[#7EB3FF]">{branch.city}</p>
                  <p className="mt-1.5 text-[10px] leading-relaxed text-white/50">{branch.address}</p>
                  <div className="mt-3 flex items-center gap-1.5">
                    <span className={cn("h-1.5 w-1.5 rounded-full", open ? "bg-[#10B981]" : "bg-[#94A3B8]")} />
                    <span className={cn("text-[10px] font-semibold", open ? "text-[#10B981]" : "text-white/55")}>
                      {open ? "Open Now" : "Closed"}
                    </span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#3B82F6] to-transparent opacity-70 transition group-hover:opacity-100" />
                </article>
              );
            })}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mv-container grid gap-10 py-12 md:grid-cols-2 md:gap-8 lg:grid-cols-5 lg:gap-6 lg:py-16">
          <div className="reveal d1 md:col-span-2 lg:col-span-1">
            <Image
              src={logoSrc}
              alt={settings.site_name || "MotoVessel"}
              width={140}
              height={40}
              className="h-auto w-[120px] md:w-[140px]"
            />
            <p className="mt-4 max-w-[240px] text-[12px] leading-relaxed text-white/55">
              {aboutText}
            </p>

            <h3 className="mt-7 text-[13px] font-bold text-white">Contact</h3>
            <ul className="mt-3 space-y-2.5">
              <li className="flex items-center gap-2.5 text-[12px] text-white/65">
                <Phone size={13} className="shrink-0 text-white/45" />
                {phone}
              </li>
              <li className="flex items-center gap-2.5 text-[12px] text-white/65">
                <Mail size={13} className="shrink-0 text-white/45" />
                {email}
              </li>
              <li className="flex items-start gap-2.5 text-[12px] text-white/65">
                <MapPin size={13} className="mt-0.5 shrink-0 text-white/45" />
                {address}
              </li>
            </ul>

            <h3 className="mt-7 text-[13px] font-bold text-white">Follow Us</h3>
            <div className="mt-3 flex gap-2">
              {socialLinks.map(({ Icon, label, href }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-[#1A56DB]/40 text-white transition hover:border-[#7EB3FF] hover:bg-[#1A56DB]"
                >
                  <Icon size={14} />
                </Link>
              ))}
            </div>
          </div>

          {Object.entries(footerGroupLabels).map(([groupKey, heading], index) => {
            const links = menus[groupKey] ?? defaultFooterLinks[groupKey] ?? [];
            return (
              <div key={groupKey} className={`reveal d${Math.min(index + 1, 4)}`}>
                <h3 className="text-[13px] font-bold text-white">{heading}</h3>
                <ul className="mt-4 space-y-2.5">
                  {links.map((link) => (
                    <li key={`${groupKey}-${link.label}`}>
                      <Link
                        href={link.link}
                        target={link.open_in_new_tab ? "_blank" : undefined}
                        rel={link.open_in_new_tab ? "noopener noreferrer" : undefined}
                        className="text-[12px] text-white/50 transition hover:text-[#7EB3FF]"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mv-container flex flex-col items-center justify-between gap-3 py-4 text-[11px] text-white/45 md:flex-row">
          <p className="text-center md:text-left">{copyright}</p>
          <div className="flex gap-5">
            <Link href="/privacy" className="transition hover:text-white">
              Privacy
            </Link>
            <Link href="/terms" className="transition hover:text-white">
              Terms
            </Link>
            <Link href="/cookies" className="transition hover:text-white">
              Cookies
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 bg-[#0A2558] py-5 md:py-6">
        <div className="mv-container">
          <div className="mb-4 flex items-center justify-center gap-1.5">
            <ShieldCheck size={15} className="text-[#10B981]" />
            <span className="text-[12px] font-medium text-white/75">Secure payments:</span>
          </div>
          <div className="overflow-hidden rounded-lg bg-[#061A3D]">
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
