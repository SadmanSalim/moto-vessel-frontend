"use client";

import { ChevronDown, Filter, MapPin, Shield, User, Zap } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { useReveal } from "@/hooks/useReveal";
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
  useReveal();

  return (
    <>
      <Header />
      <main className="bg-[#f7f9fd]">
        <section className="relative overflow-hidden bg-[#0d47a1] py-16 text-center md:py-24">
          <div
            className="absolute inset-0 opacity-35"
            style={{ backgroundImage: "url('/images/placeholders/hero.svg')", backgroundSize: "cover", backgroundPosition: "center" }}
            aria-hidden
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0b356f] via-[#0d47a1] to-[#103b79]/90" aria-hidden />
          <div className="mv-container relative reveal">
            <h1 className="text-[30px] font-extrabold text-white md:text-[42px]">
              Find Our Stores in <span className="text-mv-primary">Bangladesh</span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-[14px] leading-relaxed text-white/75">
              Experience the pinnacle of motorcycle engineering. Visit our exclusive showrooms and service centers across the country.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <button type="button" className="inline-flex items-center gap-1.5 rounded-[10px] bg-[#1565c0] px-6 py-3 text-[13px] font-bold text-white shadow-[0_10px_28px_rgba(21,101,192,0.34)]">
                Get Directions
                <ChevronDown size={16} />
              </button>
              <Link href="/contact" className="rounded-[10px] border border-white/40 px-6 py-3 text-[13px] font-bold text-white transition hover:bg-white/10">
                Contact Us
              </Link>
            </div>
          </div>
        </section>

        <section className="bg-mv-bg py-10 md:py-12">
          <div className="mv-container">
            <div className="reveal mx-auto mb-8 flex max-w-2xl overflow-hidden rounded-full border border-[#d6e4f7] bg-white shadow-[0_12px_30px_rgba(13,71,161,0.08)]">
              <input
                type="text"
                placeholder="Enter city, district or zip code"
                className="flex-1 px-5 py-3.5 text-[13px] outline-none"
              />
              <button type="button" className="m-1 flex h-10 w-10 items-center justify-center rounded-full bg-[#1565c0] text-white">
                <Filter size={18} />
              </button>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-4">
                {stores.map((store, index) => (
                  <article
                    key={store.id}
                    onClick={() => setActiveStore(store.id)}
                    className={cn(
                      `reveal-left d${index + 1} cursor-pointer rounded-[16px] border bg-white p-5 transition hover:shadow-md`,
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
                      <span className={cn("inline-flex items-center gap-1.5 text-[12px] font-semibold", store.open ? "text-green-600" : "text-mv-red")}>
                        <span className={cn("h-2 w-2 rounded-full", store.open ? "bg-green-500" : "bg-red-500")} />
                        {store.status}
                      </span>
                      <button type="button" className="text-[12px] font-semibold text-mv-primary hover:underline">
                        View Map →
                      </button>
                    </div>
                  </article>
                ))}
              </div>

              <div className="reveal-right relative overflow-hidden rounded-[18px] border border-mv-border bg-white p-4 shadow-[0_10px_30px_rgba(13,71,161,0.08)]">
                <svg viewBox="0 0 400 500" className="h-full min-h-[400px] w-full" aria-label="Bangladesh map">
                  <path d="M200,50 C280,80 320,150 310,220 C300,290 260,350 220,400 C180,450 140,460 120,420 C100,380 110,300 130,240 C150,180 160,100 200,50 Z" fill="#0f766e" opacity="0.92" />
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
                  Closest to You: Dhaka Central Hub (2.4km)
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-12 md:py-16">
          <div className="mv-container text-center">
            <h2 className="reveal text-[24px] font-bold text-mv-text">Engineered for Precision</h2>
            <p className="mx-auto mt-2 max-w-lg text-[13px] text-mv-muted">
              Why MOTOVESSEL remains the top choice for enthusiasts.
            </p>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {precisionFeatures.map((feat, index) => (
                <article key={feat.title} className={`reveal d${index + 1} rounded-xl border border-mv-border bg-mv-bg p-6 text-left`}>
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

        <section className="mv-container pb-12 md:pb-16">
          <div className="reveal rounded-[20px] bg-mv-primary p-10 text-center text-white shadow-[0_18px_34px_rgba(21,101,192,0.22)]">
            <h2 className="text-[24px] font-bold">Need More Information?</h2>
            <p className="mx-auto mt-3 max-w-md text-[13px] text-white/80">
              Our specialized consultants are ready to help you find the perfect parts and services for your vehicle.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link href="/contact" className="rounded-xl border border-white bg-white px-6 py-3 text-[13px] font-bold text-mv-primary">
                Talk to an Expert
              </Link>
              <button type="button" className="rounded-xl border border-white/70 px-6 py-3 text-[13px] font-bold text-white hover:bg-white/10">
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
