"use client";

import { ChevronDown, Filter, MapPin, Shield, User, Zap } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { cn } from "@/lib/utils";

const stores = [
  {
    id: 1,
    name: "Dhaka Central Hub",
    badge: "FLAGSHIP",
    rating: 4.9,
    address: "Plot 12, Block C, Banani, Dhaka 1213",
    tags: ["SALES", "SERVICE", "CUSTOMIZATION"],
    status: "Open until 8:00 PM",
    open: true,
  },
  {
    id: 2,
    name: "Chattogram Coastal Port",
    badge: "PREMIUM",
    rating: 4.7,
    address: "Agrabad Commercial Area, Chattogram 4100",
    tags: ["SALES", "CERTIFIED SPARE PARTS"],
    status: "Open until 7:30 PM",
    open: true,
  },
  {
    id: 3,
    name: "Sylhet Expressway",
    badge: "SERVICE POINT",
    rating: 4.8,
    address: "Zindabazar Main Road, Sylhet 3100",
    tags: ["EXPRESS SERVICE"],
    status: "Closed Now",
    open: false,
  },
];

const precisionFeatures = [
  { icon: Shield, title: "Authentic Parts", desc: "Every component is sourced directly from OEM manufacturers with full certification." },
  { icon: User, title: "Expert Service", desc: "Our certified technicians deliver precision service backed by years of experience." },
  { icon: Zap, title: "Quick Service", desc: "Express service bays ensure your vehicle is back on the road in record time." },
];

export default function StoreLocatorPage() {
  const [activeStore, setActiveStore] = useState(1);

  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="relative bg-mv-navy py-16 text-center md:py-24">
          <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "url('/images/placeholders/hero.svg')", backgroundSize: "cover", backgroundPosition: "right" }} aria-hidden />
          <div className="absolute inset-0 bg-gradient-to-b from-mv-navy/90 to-mv-navy/70" aria-hidden />
          <div className="mv-container relative">
            <h1 className="text-[30px] font-extrabold text-white md:text-[38px]">
              Find Our Stores in <span className="text-mv-primary">Bangladesh</span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-[14px] leading-relaxed text-white/75">
              Experience the pinnacle of motorcycle engineering. Visit our exclusive showrooms and service centers across the country.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <button type="button" className="inline-flex items-center gap-1.5 rounded-xl bg-mv-primary px-6 py-3 text-[13px] font-bold text-white">
                Get Directions
                <ChevronDown size={16} />
              </button>
              <Link href="/contact" className="rounded-xl border-2 border-white/60 px-6 py-3 text-[13px] font-bold text-white transition hover:bg-white/10">
                Contact Us
              </Link>
            </div>
          </div>
        </section>

        {/* Search + map */}
        <section className="bg-mv-bg py-10 md:py-12">
          <div className="mv-container">
            <div className="mx-auto mb-8 flex max-w-2xl overflow-hidden rounded-xl border border-mv-border bg-white shadow-sm">
              <input
                type="text"
                placeholder="Enter city, district or zip code"
                className="flex-1 px-5 py-3.5 text-[13px] outline-none"
              />
              <button type="button" className="flex items-center justify-center bg-mv-primary px-5 text-white">
                <Filter size={18} />
              </button>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {/* Store list */}
              <div className="space-y-4">
                {stores.map((store) => (
                  <article
                    key={store.id}
                    onClick={() => setActiveStore(store.id)}
                    className={cn(
                      "cursor-pointer rounded-xl border bg-white p-5 transition hover:shadow-md",
                      activeStore === store.id ? "border-mv-primary shadow-[0_0_20px_rgba(26,86,219,0.1)]" : "border-mv-border",
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="rounded-full bg-mv-blue-light px-2.5 py-0.5 text-[10px] font-bold text-mv-primary">{store.badge}</span>
                        <h3 className="mt-2 text-[16px] font-bold text-mv-text">{store.name}</h3>
                      </div>
                      <span className="flex items-center gap-0.5 text-[12px] font-semibold text-amber-500">
                        ★ {store.rating}
                      </span>
                    </div>
                    <p className="mt-2 text-[12px] text-mv-muted">{store.address}</p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {store.tags.map((tag) => (
                        <span key={tag} className="rounded bg-mv-bg px-2 py-0.5 text-[10px] font-semibold text-mv-muted">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <span className={cn("text-[12px] font-semibold", store.open ? "text-green-600" : "text-mv-red")}>
                        {store.status}
                      </span>
                      <button type="button" className="text-[12px] font-semibold text-mv-primary hover:underline">
                        View Map →
                      </button>
                    </div>
                  </article>
                ))}
              </div>

              {/* Map */}
              <div className="relative overflow-hidden rounded-xl border border-mv-border bg-white p-4">
                <svg viewBox="0 0 400 500" className="h-full min-h-[400px] w-full" aria-label="Bangladesh map">
                  <path d="M200,50 C280,80 320,150 310,220 C300,290 260,350 220,400 C180,450 140,460 120,420 C100,380 110,300 130,240 C150,180 160,100 200,50 Z" fill="#22c55e" opacity="0.6" />
                  <circle cx="200" cy="160" r="10" fill="#1A56DB" stroke="white" strokeWidth="2" />
                  <circle cx="220" cy="280" r="10" fill="#DC2626" stroke="white" strokeWidth="2" />
                  <circle cx="240" cy="220" r="10" fill="#f59e0b" stroke="white" strokeWidth="2" />
                </svg>
                <div className="absolute bottom-4 left-4 flex gap-1">
                  <button type="button" className="flex h-7 w-7 items-center justify-center rounded bg-white text-[14px] font-bold shadow">+</button>
                  <button type="button" className="flex h-7 w-7 items-center justify-center rounded bg-white text-[14px] font-bold shadow">−</button>
                </div>
                <div className="absolute bottom-4 right-4 flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[10px] font-semibold shadow">
                  <MapPin size={12} className="text-mv-primary" />
                  CLOSEST TO YOU: Dhaka Central Hub (2.4km)
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Engineered for Precision */}
        <section className="bg-white py-12 md:py-16">
          <div className="mv-container text-center">
            <h2 className="text-[24px] font-bold text-mv-text">Engineered for Precision</h2>
            <p className="mx-auto mt-2 max-w-lg text-[13px] text-mv-muted">
              Why MOTOVESSEL remains the top choice for enthusiasts.
            </p>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {precisionFeatures.map((feat) => (
                <article key={feat.title} className="rounded-xl border border-mv-border bg-mv-bg p-6 text-left">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-mv-blue-light text-mv-primary">
                    <feat.icon size={22} />
                  </div>
                  <h3 className="text-[15px] font-bold text-mv-text">{feat.title}</h3>
                  <p className="mt-2 text-[12px] leading-relaxed text-mv-muted">{feat.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mv-container pb-12 md:pb-16">
          <div className="rounded-xl bg-mv-primary p-10 text-center text-white">
            <h2 className="text-[24px] font-bold">Need More Information?</h2>
            <p className="mx-auto mt-3 max-w-md text-[13px] text-white/80">
              Our specialized consultants are ready to help you find the perfect parts and services for your vehicle.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link href="/contact" className="rounded-xl bg-white px-6 py-3 text-[13px] font-bold text-mv-primary">
                Talk to an Expert
              </Link>
              <button type="button" className="rounded-xl border-2 border-white/60 px-6 py-3 text-[13px] font-bold text-white hover:bg-white/10">
                Download Catalog
              </button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
