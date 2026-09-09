"use client";

import { Award, HeartHandshake, ShieldCheck, Truck } from "lucide-react";
import Link from "next/link";
import { useCmsHomepage, useCmsSettings } from "@/hooks/useCms";
import { useStores } from "@/hooks/useStores";
import { resolveCmsIcon } from "@/lib/cmsIcons";

const pillars = [
  {
    icon: ShieldCheck,
    title: "Genuine Parts, Verified Fitment",
    desc: "Every part listed is sourced from trusted manufacturers and checked against real vehicle compatibility data before it goes live.",
  },
  {
    icon: Truck,
    title: "Fast, Reliable Delivery",
    desc: "Orders are packed and dispatched quickly, with tracking available from checkout through to your door — no account required.",
  },
  {
    icon: HeartHandshake,
    title: "Real Support, Not a Bot",
    desc: "Questions about fitment, a service booking, or an order? Our team is reachable by phone, email, and WhatsApp.",
  },
  {
    icon: Award,
    title: "Certified Service Network",
    desc: "Beyond parts, our booked-service technicians handle everything from oil changes to full diagnostics.",
  },
];

export default function AboutPage() {
  const { data: settings } = useCmsSettings();
  const { data: homepage } = useCmsHomepage();
  const { data: stores } = useStores();

  const contactPhone = settings?.contact_phone || "+880 1322-910229";
  const contactEmail = settings?.contact_email || "motovessel@gmail.com";
  const storeCount = stores?.length ?? 0;

  return (
    <div className="bg-[#f7f9fd]">
      <section className="relative overflow-hidden bg-mv-navy py-16 text-white md:py-24">
        <div
          className="absolute inset-0 opacity-30"
          style={{ backgroundImage: "url('/images/placeholders/hero.svg')", backgroundSize: "cover", backgroundPosition: "center" }}
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-r from-mv-navy/95 to-mv-navy/70" aria-hidden />
        <div className="mv-container relative max-w-2xl">
          <h1 className="text-[32px] font-extrabold leading-tight md:text-[44px]">
            About MotoVessel
          </h1>
          <p className="mt-4 text-[14px] leading-relaxed text-white/85 md:text-[16px]">
            MotoVessel is an automotive parts and service marketplace built for drivers who want genuine
            components, transparent pricing, and a team that actually knows what fits their vehicle — whether
            you&apos;re shopping online or booking a service at one of our hubs.
          </p>
        </div>
      </section>

      <section className="bg-white py-12 md:py-16">
        <div className="mv-container grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {(homepage?.stats?.length
            ? homepage.stats.map((s) => ({ ...s, Icon: resolveCmsIcon(s.icon ?? "") }))
            : [
                { id: "stores", label: "Service Hubs", value: String(storeCount || "Multiple"), Icon: Truck },
                { id: "parts", label: "Genuine Parts Listed", value: "3,000+", Icon: ShieldCheck },
              ]
          ).map((stat) => (
            <div key={stat.id} className="flex flex-col items-center rounded-xl border border-mv-border p-5 text-center">
              <stat.Icon size={22} className="text-mv-primary" strokeWidth={1.5} />
              <p className="mt-2 text-[22px] font-extrabold text-mv-text">{stat.value}</p>
              <p className="text-[12px] text-mv-muted">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="mv-container">
          <h2 className="section-title text-center">Why Shop With Us</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {pillars.map((item) => (
              <article key={item.title} className="mv-card mv-card-hover p-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-mv-blue-light text-mv-primary">
                  <item.icon size={20} strokeWidth={1.5} />
                </div>
                <h3 className="mt-4 text-[14px] font-bold text-mv-text">{item.title}</h3>
                <p className="mt-2 text-[12px] leading-relaxed text-mv-muted">{item.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-12 md:py-16">
        <div className="mv-container max-w-2xl text-center">
          <h2 className="section-title">Get In Touch</h2>
          <p className="mt-3 text-[13px] leading-relaxed text-mv-muted">
            Have a question about an order, a part, or want to book a service? Reach us at{" "}
            <a href={`tel:${contactPhone.replace(/[^+\d]/g, "")}`} className="font-semibold text-mv-primary hover:underline">
              {contactPhone}
            </a>{" "}
            or{" "}
            <a href={`mailto:${contactEmail}`} className="font-semibold text-mv-primary hover:underline">
              {contactEmail}
            </a>
            .
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link href="/contact" className="mv-btn-primary">
              Contact Us
            </Link>
            <Link href="/service" className="mv-btn-outline">
              Book a Service
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
