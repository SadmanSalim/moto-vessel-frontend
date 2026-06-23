"use client";

import { CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { useReveal } from "@/hooks/useReveal";

const serviceCards = [
  "Engine Oil Change",
  "Car Paint",
  "Cleaning",
  "Repair",
  "Health Check",
  "Car Paint",
  "Cleaning",
  "Engine Oil Change",
  "Cleaning",
  "Engine Oil Change",
].map((title, index) => ({
  title,
  description: "Premium diagnostics, authentic components, and master technician care for precision road-readiness.",
  image: index % 2 === 0 ? "/images/placeholders/product.svg" : "/images/placeholders/hero.svg",
}));

export default function ServicePage() {
  useReveal();

  return (
    <>
      <Header />
      <main className="bg-white">
        <section className="relative overflow-hidden bg-[#06142b]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(90deg, rgba(3,12,27,0.84) 0%, rgba(3,12,27,0.72) 40%, rgba(3,12,27,0.55) 100%), url('/images/placeholders/hero.svg')",
              backgroundPosition: "center",
              backgroundSize: "cover",
            }}
            aria-hidden
          />
          <div className="mv-container relative grid gap-10 py-12 md:py-16 lg:grid-cols-[1.1fr_320px] lg:items-center">
            <div className="max-w-[600px] reveal-left text-white">
              <div className="mb-3">
                <Image src="/images/logo.png" alt="MotoVessel" width={120} height={36} className="h-auto w-[96px]" />
              </div>
              <h1 className="max-w-[500px] text-[34px] font-extrabold leading-[1.1] md:text-[44px]">
                Keep Your Vehicle Safe &amp; Road-Ready with Expert Care.
              </h1>
              <ul className="mt-5 space-y-3 text-[13px] text-white/88">
                {[
                  "Best technicians network",
                  "Affordable & Transparent Service Pricing",
                  "Digital process, customer support",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2.5">
                    <CheckCircle2 size={16} className="shrink-0 text-[#8fc5ff]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="reveal-right justify-self-start rounded-2xl border border-white/15 bg-white/8 p-5 text-white shadow-[0_22px_50px_rgba(0,0,0,0.28)] backdrop-blur-sm lg:justify-self-end">
              <p className="text-[12px] text-white/65">Road-tested confidence</p>
              <p className="mt-2 text-[26px] font-extrabold">1,78,000+Services delivered</p>
              <button
                type="button"
                className="mt-5 inline-flex items-center rounded-[10px] bg-[#1565c0] px-6 py-3 text-[13px] font-bold text-white shadow-[0_10px_24px_rgba(21,101,192,0.34)] transition hover:-translate-y-0.5 hover:bg-[#0d47a1]"
              >
                Order Now
              </button>
            </div>
          </div>
        </section>

        <section className="bg-white py-10 md:py-14">
          <div className="mv-container">
            <div className="reveal text-center">
              <h2 className="text-[28px] font-bold text-[#1a2744]">Select Service</h2>
              <p className="mx-auto mt-2 max-w-[540px] text-[13px] leading-relaxed text-[#5c7099]">
                Discover precision-crafted care packages built for performance, protection, and everyday reliability.
              </p>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {serviceCards.map((service, index) => (
                <article
                  key={`${service.title}-${index}`}
                  className={`reveal d${(index % 6) + 1} group grid grid-cols-[1fr_110px] items-center gap-4 rounded-[12px] border border-[#d6e4f7] bg-white p-5 shadow-[0_10px_28px_rgba(13,71,161,0.06)] transition hover:-translate-y-[2px] hover:shadow-[0_14px_32px_rgba(13,71,161,0.12)]`}
                >
                  <div>
                    <h3 className="text-[16px] font-bold text-[#1a2744]">{service.title}</h3>
                    <p className="mt-2 text-[12px] leading-relaxed text-[#5c7099]">{service.description}</p>
                  </div>
                  <div className="relative h-[92px] overflow-hidden rounded-[10px] border border-[#e9f0fb] bg-[#f6f9ff]">
                    <Image src={service.image} alt={service.title} fill className="object-cover opacity-90 transition group-hover:scale-105" />
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
