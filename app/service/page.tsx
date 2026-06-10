"use client";

import { Bookmark, Car, Clock, Globe, Play } from "lucide-react";
import Image from "next/image";
import { oilChangeWarnings } from "@/data/services";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

const warningIcons = { car: Car, clock: Clock, globe: Globe };

export default function ServicePage() {
  return (
    <>
      <Header />
      <main className="bg-mv-bg">
        {/* Hero / Appointment */}
        <section className="mv-container py-12 md:py-16">
          <div className="grid items-start gap-8 lg:grid-cols-2">
            {/* Video card */}
            <div className="overflow-hidden rounded-xl border border-mv-border bg-white shadow-sm">
              <div className="relative aspect-video bg-mv-navy">
                <Image src="/images/placeholders/video.svg" alt="Expert Car Service" fill className="object-cover opacity-60" />
                <button
                  type="button"
                  className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-mv-primary shadow-lg transition hover:scale-105"
                  aria-label="Play video"
                >
                  <Play size={28} className="ml-1" fill="currentColor" />
                </button>
              </div>
              <div className="border-t border-mv-border bg-white p-5">
                <h3 className="text-[16px] font-bold text-mv-text">Expert Car Service</h3>
                <p className="mt-1 text-[12px] text-mv-muted">
                  Professional automotive care from certified technicians with genuine parts and transparent pricing.
                </p>
              </div>
            </div>

            {/* Booking form */}
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-widest text-mv-primary">Schedule Now</p>
              <h1 className="mt-2 text-[30px] font-bold leading-tight text-mv-text md:text-[36px]">
                Book our <span className="text-mv-primary">Apointment</span>
              </h1>
              <p className="mt-3 text-[13px] leading-relaxed text-mv-muted">
                Fill in your details and our team will confirm your service slot within 24 hours.
              </p>

              <div className="mt-6 rounded-xl border border-mv-primary/20 bg-white p-6 shadow-[0_0_30px_rgba(26,86,219,0.08)]">
                <div className="mb-5 flex items-center gap-2 text-mv-primary">
                  <Bookmark size={18} />
                  <span className="text-[14px] font-semibold">Book Your Service</span>
                </div>
                <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
                  {["Car Model", "Work Description", "Your Name", "Your Number", "Your Location"].map((field) => (
                    <input
                      key={field}
                      type="text"
                      placeholder={field}
                      className="w-full rounded-xl border border-mv-border px-4 py-3 text-[13px] outline-none focus:border-mv-primary"
                    />
                  ))}
                  <button
                    type="submit"
                    className="w-full rounded-xl bg-mv-primary py-3.5 text-[14px] font-bold text-white transition hover:bg-mv-primary-dark"
                  >
                    Submit
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* Oil change warning section */}
        <section className="bg-white py-12 md:py-16">
          <div className="mv-container text-center">
            <span className="inline-block rounded-full bg-red-50 px-4 py-1 text-[11px] font-semibold text-mv-red">
              Important Warning 🔥
            </span>
            <h2 className="mt-4 text-[26px] font-bold text-mv-text md:text-[30px]">
              Why Regular <span className="text-mv-primary">Engine Oil Change</span> Matters
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-[13px] leading-relaxed text-mv-muted">
              Regular oil changes are essential for engine longevity, performance, and reliability. Neglecting this simple
              maintenance can lead to costly repairs.
            </p>

            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {oilChangeWarnings.map((item) => {
                const Icon = warningIcons[item.icon];
                return (
                  <article key={item.id} className="rounded-xl border border-mv-border bg-white p-6 text-left shadow-sm">
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-mv-blue-light text-mv-primary">
                      <Icon size={20} />
                    </div>
                    <h3 className="text-[15px] font-bold text-mv-text">{item.title}</h3>
                    <p className="mt-2 text-[12px] leading-relaxed text-mv-muted">{item.description}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
