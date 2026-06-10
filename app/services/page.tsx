import { Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { serviceListingItems } from "@/data/services";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

const heroFeatures = [
  "24/7 Roadside Assistance",
  "Affordable & Transparent Service Pricing",
  "Expert & Certified Technical Support",
];

export default function ServicesListingPage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden bg-mv-navy py-16 md:py-24">
          <div
            className="absolute inset-0 opacity-30"
            style={{ backgroundImage: "url('/images/placeholders/hero.svg')", backgroundSize: "cover", backgroundPosition: "center" }}
            aria-hidden
          />
          <div className="absolute inset-0 bg-gradient-to-r from-mv-navy/95 to-mv-navy/70" aria-hidden />
          <div className="mv-container relative grid items-center gap-8 md:grid-cols-2">
            <div>
              <h1 className="text-[28px] font-extrabold leading-tight text-white md:text-[36px]">
                Keep Your Vehicle Safe &amp; Road-Ready with Expert Care.
              </h1>
              <ul className="mt-6 space-y-2.5">
                {heroFeatures.map((feature) => (
                  <li key={feature} className="flex items-center gap-2.5 rounded-full bg-white/10 px-4 py-2 text-[13px] text-white">
                    <Check size={14} className="shrink-0 text-mv-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            <div className="text-center md:text-right">
              <p className="text-[20px] font-bold text-white md:text-[24px]">1,78,000+ Services delivered</p>
              <Link
                href="/service"
                className="mt-5 inline-block rounded-xl bg-mv-primary px-8 py-3.5 text-[14px] font-bold text-white transition hover:bg-mv-primary-dark"
              >
                Order Now
              </Link>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-8 overflow-hidden" aria-hidden>
            <svg viewBox="0 0 1440 32" preserveAspectRatio="none" className="h-full w-full">
              <path d="M0,32 C480,0 960,0 1440,32 L1440,32 L0,32 Z" fill="white" />
            </svg>
          </div>
        </section>

        {/* Service grid */}
        <section className="bg-white py-12 md:py-16">
          <div className="mv-container">
            <h2 className="text-center text-[26px] font-bold text-mv-text">Select Service</h2>
            <p className="mx-auto mt-2 max-w-lg text-center text-[13px] text-mv-muted">
              Choose from our comprehensive range of automotive services delivered by certified professionals.
            </p>
            <div className="mt-10 grid gap-5 md:grid-cols-2">
              {serviceListingItems.map((service, i) => (
                <article
                  key={service.id}
                  className={`flex items-center gap-4 overflow-hidden rounded-xl border bg-white p-5 shadow-sm transition hover:shadow-md ${
                    i === 0 ? "border-mv-primary shadow-[0_0_20px_rgba(26,86,219,0.15)]" : "border-mv-border"
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <h3 className="text-[16px] font-bold text-mv-text">{service.name}</h3>
                    <p className="mt-1 text-[12px] leading-relaxed text-mv-muted">{service.description}</p>
                  </div>
                  <div className="relative h-20 w-20 shrink-0">
                    <Image src={service.image} alt={service.name} fill className="object-contain" />
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
