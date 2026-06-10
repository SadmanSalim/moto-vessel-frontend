import Link from "next/link";
import Image from "next/image";
import { Globe, Mail, MapPin, Phone, Share2, Users } from "lucide-react";

const footerLinks = {
  "Shop Parts": ["All Parts", "Engine", "Brakes", "Suspension", "Lighting"],
  Company: ["About Us", "Careers", "Blog", "Press", "Partners"],
  Support: ["Help Center", "Shipping", "Returns", "Warranty", "Contact"],
  "My Account": ["Orders", "Wishlist", "Addresses", "Settings"],
};

const paymentMethods = [
  "Visa",
  "Mastercard",
  "PayPal",
  "Amex",
  "Apple Pay",
  "Google Pay",
  "Stripe",
  "Discover",
];

export function Footer() {
  return (
    <footer className="bg-mv-navy-deep text-white">
      <div className="mv-container grid gap-9 py-12 md:grid-cols-2 lg:grid-cols-5 lg:gap-8 lg:py-14">
        <div>
          <div className="flex items-center gap-2">
            <Image src="/images/placeholders/logo.svg" alt="" width={32} height={32} className="h-8 w-8" />
            <p className="text-[16px] font-extrabold tracking-tight">
              <span>MOTO</span>
              <span className="text-[#5eb3ff]">VESSEL</span>
            </p>
          </div>
          <p className="mt-3 text-[13px] leading-relaxed text-white/65">
            Premium automotive ecommerce destination with genuine parts, trusted fitment, and fast nationwide delivery.
          </p>
          <ul className="mt-4 space-y-2 text-[13px] text-white/75">
            <li className="flex items-center gap-2">
              <Phone size={13} className="shrink-0 text-[#5eb3ff]" />
              +1 (800) 555-0199
            </li>
            <li className="flex items-center gap-2">
              <Mail size={13} className="shrink-0 text-[#5eb3ff]" />
              support@motovessel.com
            </li>
            <li className="flex items-start gap-2">
              <MapPin size={13} className="mt-0.5 shrink-0 text-[#5eb3ff]" />
              124 Main Street, Los Angeles, CA 90012
            </li>
          </ul>
          <div className="mt-4 flex gap-2">
            {[
              { Icon: Share2, label: "Facebook" },
              { Icon: Globe, label: "Twitter" },
              { Icon: Users, label: "Instagram" },
            ].map(({ Icon, label }) => (
              <Link
                key={label}
                href="#"
                aria-label={label}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 transition hover:bg-mv-blue"
              >
                <Icon size={14} />
              </Link>
            ))}
          </div>
        </div>

        {Object.entries(footerLinks).map(([heading, links]) => (
          <div key={heading}>
            <h3 className="text-[13px] font-bold">{heading}</h3>
            <ul className="mt-3 space-y-2">
              {links.map((link) => (
                <li key={link}>
                  <Link href="#" className="text-[12px] text-white/60 transition hover:text-white">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-white/10">
        <div className="mv-container flex flex-col items-center justify-between gap-3 py-4 text-[11px] text-white/50 md:flex-row">
          <p>© {new Date().getFullYear()} Moto Vessel. All rights reserved.</p>
          <div className="flex gap-5">
            <Link href="#" className="transition hover:text-white">
              Privacy Policy
            </Link>
            <Link href="#" className="transition hover:text-white">
              Terms &amp; Conditions
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-3.5">
        <div className="mv-container flex flex-wrap items-center justify-center gap-2">
          {paymentMethods.map((method) => (
            <span
              key={method}
              className="rounded-[4px] bg-white/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wide text-white/70"
            >
              {method}
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
}
