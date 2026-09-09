"use client";

import { ChevronDown, Filter, Shield, User, Zap } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { BangladeshMap3D } from "@/components/BangladeshMap3D";
import ErrorMessage from "@/components/ErrorMessage";
import StoreCardSkeleton from "@/components/skeletons/StoreCardSkeleton";
import { useStores } from "@/hooks/useStores";
import { useReveal } from "@/hooks/useReveal";
import { getErrorMessage } from "@/lib/api";
import { cn } from "@/lib/utils";
import type { StoreLocation } from "@/types";

const precisionFeatures = [
  { icon: Shield, title: "Authentic Parts", desc: "Every component is sourced directly from OEM manufacturers with full certification." },
  { icon: User, title: "Expert Service", desc: "Our certified technicians deliver precision service backed by years of experience." },
  { icon: Zap, title: "Quick Service", desc: "Express service bays ensure your vehicle is back on the road in record time." },
];

function isStoreOpen(store: StoreLocation): boolean {
  if (!store.opening_time || !store.closing_time) return store.is_active;
  const now = new Date();
  const [openH, openM] = store.opening_time.split(":").map(Number);
  const [closeH, closeM] = store.closing_time.split(":").map(Number);
  const current = now.getHours() * 60 + now.getMinutes();
  return current >= openH * 60 + (openM || 0) && current <= closeH * 60 + (closeM || 0);
}

function storeStatusLabel(store: StoreLocation): string {
  const open = isStoreOpen(store);
  return open ? `Open until ${store.closing_time}` : "Closed Now";
}

/** Approximate map pin positions from lat/lng for Bangladesh */
function latLngToMapXY(lat: number, lng: number): { x: number; y: number } {
  const x = ((lng - 88) / (93 - 88)) * 360 + 40;
  const y = ((26 - lat) / (26 - 20)) * 320 + 40;
  return { x: Math.round(x), y: Math.round(y) };
}

export default function StoreLocatorPage() {
  const [activeStore, setActiveStore] = useState<number | null>(null);
  const { data: stores, isLoading, isError, error } = useStores();
  useReveal();

  const mapStores = useMemo(
    () =>
      (stores ?? []).map((s) => ({
        id: s.id,
        name: s.name,
        ...latLngToMapXY(Number(s.latitude), Number(s.longitude)),
        open: isStoreOpen(s),
      })),
    [stores],
  );

  const selectedId = activeStore ?? stores?.[0]?.id ?? null;

  return (
    <div className="bg-[#f7f9fd]">
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
                {isLoading &&
                  Array.from({ length: 3 }).map((_, i) => <StoreCardSkeleton key={i} />)}
                {isError && <ErrorMessage message={getErrorMessage(error)} />}
                {stores?.map((store, index) => {
                  const open = isStoreOpen(store);
                  return (
                  <article
                    key={store.id}
                    onClick={() => setActiveStore(store.id)}
                    className={cn(
                      `reveal-left d${index + 1} cursor-pointer rounded-[16px] border bg-white p-5 transition hover:shadow-md`,
                      selectedId === store.id ? "border-mv-primary shadow-[0_0_20px_rgba(26,86,219,0.1)]" : "border-mv-border",
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="rounded-full bg-mv-blue-light px-2.5 py-0.5 text-[10px] font-bold text-mv-primary">
                          {store.branch_type.replace("_", " ").toUpperCase()}
                        </span>
                        <h3 className="mt-2 text-[16px] font-bold text-mv-text">{store.name}</h3>
                      </div>
                    </div>
                    <p className="mt-2 text-[12px] text-mv-muted">{store.address}</p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {(store.services ?? []).map((tag) => (
                        <span key={tag} className="rounded bg-mv-bg px-2 py-0.5 text-[10px] font-semibold text-mv-muted">
                          {tag.toUpperCase()}
                        </span>
                      ))}
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <span className={cn("inline-flex items-center gap-1.5 text-[12px] font-semibold", open ? "text-green-600" : "text-mv-red")}>
                        <span className={cn("h-2 w-2 rounded-full", open ? "bg-green-500" : "bg-red-500")} />
                        {storeStatusLabel(store)}
                      </span>
                      <button type="button" className="text-[12px] font-semibold text-mv-primary hover:underline">
                        View Map →
                      </button>
                    </div>
                  </article>
                  );
                })}
              </div>

              <div className="reveal-right relative overflow-hidden rounded-[18px] border border-mv-border bg-white p-4 shadow-[0_10px_30px_rgba(13,71,161,0.08)]">
                {mapStores.length > 0 ? (
                <BangladeshMap3D
                  stores={mapStores}
                  activeStoreId={selectedId ?? mapStores[0].id}
                  onStoreSelect={setActiveStore}
                />
                ) : (
                  <div className="flex h-[320px] items-center justify-center text-[13px] text-mv-muted">
                    {isLoading ? "Loading map..." : "No stores to display"}
                  </div>
                )}
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
    </div>
  );
}
