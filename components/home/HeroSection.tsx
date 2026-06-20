import Image from "next/image";
import Link from "next/link";
import { heroStats } from "@/data/services";

export function HeroSection() {
  return (
    <section className="hero-pattern relative overflow-hidden pb-12 pt-8 md:pb-16 md:pt-10">
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage: "url('/images/placeholders/hero.svg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        aria-hidden
      />
      <div className="absolute inset-0 bg-gradient-to-r from-mv-navy/95 via-mv-navy/80 to-mv-primary/40" aria-hidden />

      <div className="mv-container relative grid items-center gap-8 md:grid-cols-2 md:gap-10">
        <div className="max-w-[540px]">
          <p className="text-[12px] font-semibold uppercase tracking-widest text-mv-primary">MotoVessel Automotive Solutions</p>
          <h1 className="mt-3 text-[32px] font-extrabold leading-[1.1] tracking-tight text-white sm:text-[40px] lg:text-[46px]">
            Built for Performance &amp; Trust
          </h1>
          <p className="mt-4 text-[14px] leading-relaxed text-white/80">
            Discover curated OEM and performance components engineered for reliability, speed, and precision fit — trusted by
            professionals and enthusiasts nationwide.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/products/brake-shoes"
              className="rounded-full bg-white px-7 py-3 text-[13px] font-bold text-mv-primary shadow-md transition hover:bg-mv-blue-light"
            >
              Get Started
            </Link>
            <Link
              href="/services"
              className="rounded-full border-2 border-white/80 px-7 py-3 text-[13px] font-bold text-white transition hover:bg-white/10"
            >
              Learn More
            </Link>
          </div>

          <dl className="mt-9 flex flex-wrap gap-x-8 gap-y-4">
            {heroStats.map((stat) => (
              <div key={stat.id}>
                <dt className="sr-only">{stat.label}</dt>
                <dd className="text-[22px] font-extrabold leading-none text-white md:text-[26px]">{stat.value}</dd>
                <dd className="mt-1 text-[11px] text-white/65">{stat.label}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative mx-auto w-full max-w-[420px] md:mx-0 md:ml-auto">
          <div className="space-y-3">
            <article className="flex items-center gap-3 rounded-xl bg-white/95 p-3 shadow-lg backdrop-blur">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-mv-blue-light">
                <Image src="/images/placeholders/product.svg" alt="" fill className="object-contain p-1.5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-semibold text-mv-text">Engine Oil 5W-30</p>
                <p className="text-[16px] font-bold text-mv-primary">৳2,800</p>
              </div>
            </article>
            <article className="ml-8 flex items-center gap-3 rounded-xl bg-white/95 p-3 shadow-lg backdrop-blur">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-mv-blue-light">
                <Image src="/images/placeholders/product.svg" alt="" fill className="object-contain p-1.5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-semibold text-mv-text">Premium Brake Pads</p>
                <p className="text-[16px] font-bold text-mv-primary">৳4,500</p>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
