"use client";

import { ChevronDown, Plus, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { brakeShoeProducts } from "@/data/products";
import { cn } from "@/lib/utils";

const brands = ["Bosch", "Brembo", "TRW", "Ferodo", "Wagner", "Akebono"];
const vehicleTypes = ["Sedan", "SUV", "Truck", "Hatchback", "Van", "Coupe"];

const infoCards = [
  { title: "What is Brake Shoe?", desc: "Brake shoes are curved friction components that press against the inside of a brake drum to slow or stop your vehicle." },
  { title: "Why Quality Matters", desc: "Premium brake shoes ensure consistent stopping power, reduced wear, and improved safety under all driving conditions." },
  { title: "Compatibility Tips", desc: "Always match brake shoes to your vehicle's make, model, and year for optimal fitment and performance." },
  { title: "When To Replace", desc: "Replace brake shoes when lining thickness falls below 2mm or you notice squealing, grinding, or reduced braking." },
];

export default function ProductListingPage() {
  const [selectedBrands, setSelectedBrands] = useState<string[]>(["Bosch"]);
  const [vehicleType, setVehicleType] = useState("Sedan");
  const [availability, setAvailability] = useState("in-stock");
  const [page, setPage] = useState(1);

  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="relative bg-mv-navy py-16 md:py-20">
          <div className="absolute inset-0 opacity-40" style={{ backgroundImage: "url('/images/placeholders/hero.svg')", backgroundSize: "cover" }} aria-hidden />
          <div className="absolute inset-0 bg-gradient-to-r from-mv-navy/95 to-mv-navy/60" aria-hidden />
          <div className="mv-container relative max-w-xl">
            <h1 className="text-[32px] font-extrabold text-white md:text-[40px]">
              Brake Shoe <span className="text-mv-primary">Collection</span>
            </h1>
            <p className="mt-4 text-[14px] leading-relaxed text-white/80">
              Discover premium brake shoes engineered for superior stopping power, durability, and perfect fit across all major vehicle types.
            </p>
            <Link href="#products" className="mt-6 inline-block rounded-full bg-mv-primary px-7 py-3 text-[13px] font-bold text-white">
              Shop Now
            </Link>
          </div>
        </section>

        {/* Breadcrumb */}
        <div className="border-b border-mv-border bg-white py-3">
          <div className="mv-container text-[12px] text-mv-muted">
            Home / Products / Car Parts / Brake Shoe / <span className="text-mv-text">Brake Shoe Collection</span>
          </div>
        </div>

        {/* Main content */}
        <section id="products" className="bg-mv-bg py-10 md:py-12">
          <div className="mv-container grid gap-8 lg:grid-cols-[280px_1fr]">
            {/* Sidebar filters */}
            <aside className="h-fit rounded-xl border border-mv-border bg-white p-5">
              <div className="mb-5">
                <label className="mb-1.5 block text-[12px] font-semibold text-mv-text">Sort By</label>
                <div className="relative">
                  <select className="w-full appearance-none rounded-xl border border-mv-border px-3 py-2.5 text-[12px] outline-none">
                    <option>Default</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                  </select>
                  <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-mv-muted" />
                </div>
              </div>

              <div className="mb-5">
                <label className="mb-2 block text-[12px] font-semibold text-mv-text">Price Range</label>
                <input type="range" min={15} max={150} defaultValue={80} className="w-full accent-mv-primary" />
                <div className="mt-1 flex justify-between text-[11px] text-mv-muted">
                  <span>$15</span>
                  <span>$150</span>
                </div>
              </div>

              <div className="mb-5">
                <p className="mb-2 text-[12px] font-semibold text-mv-text">Brand</p>
                {brands.map((brand) => (
                  <label key={brand} className="mb-1.5 flex cursor-pointer items-center gap-2 text-[12px] text-mv-text">
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand)}
                      onChange={() =>
                        setSelectedBrands((prev) =>
                          prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand],
                        )
                      }
                      className="h-3.5 w-3.5 accent-mv-primary"
                    />
                    {brand}
                  </label>
                ))}
              </div>

              <div className="mb-5">
                <p className="mb-2 text-[12px] font-semibold text-mv-text">Vehicle Type</p>
                <div className="flex flex-wrap gap-1.5">
                  {vehicleTypes.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setVehicleType(type)}
                      className={cn(
                        "rounded-full border px-3 py-1 text-[11px] font-medium transition",
                        vehicleType === type ? "border-mv-primary bg-mv-primary text-white" : "border-mv-border text-mv-muted hover:border-mv-primary",
                      )}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-5">
                <p className="mb-2 text-[12px] font-semibold text-mv-text">Availability</p>
                {["in-stock", "in-store"].map((opt) => (
                  <label key={opt} className="mb-1.5 flex cursor-pointer items-center gap-2 text-[12px] text-mv-text">
                    <input
                      type="radio"
                      name="availability"
                      checked={availability === opt}
                      onChange={() => setAvailability(opt)}
                      className="accent-mv-primary"
                    />
                    {opt === "in-stock" ? "In Stock" : "In Store"}
                  </label>
                ))}
              </div>

              <div>
                <p className="mb-2 text-[12px] font-semibold text-mv-text">Rating</p>
                {[5, 4, 3, 2, 1].map((rating) => (
                  <button key={rating} type="button" className="mb-1 flex items-center gap-1">
                    {Array.from({ length: rating }).map((_, i) => (
                      <Star key={i} size={12} className="fill-amber-400 text-amber-400" />
                    ))}
                  </button>
                ))}
              </div>
            </aside>

            {/* Product grid */}
            <div>
              <div className="mb-6">
                <h2 className="text-[22px] font-bold text-mv-text">All Brake Shoes</h2>
                <p className="text-[13px] text-mv-muted">20 Products Found</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {brakeShoeProducts.map((product) => (
                  <article key={product.id} className="overflow-hidden rounded-xl border border-mv-border bg-white shadow-sm transition hover:shadow-md">
                    <Link href={`/products/${product.slug}`} className="relative block aspect-[4/3] bg-mv-bg p-4">
                      <Image src={product.image} alt={product.name} width={200} height={150} className="h-full w-full object-contain" />
                    </Link>
                    <div className="p-4">
                      <span className="rounded-full bg-mv-blue-light px-2.5 py-0.5 text-[10px] font-semibold text-mv-primary">
                        {product.badge}
                      </span>
                      <h3 className="mt-2 text-[13px] font-semibold text-mv-text">{product.name}</h3>
                      <div className="mt-1 flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} size={11} className="fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <p className="text-[15px] font-bold text-mv-text">{product.price}$</p>
                        <button type="button" className="flex h-8 w-8 items-center justify-center rounded-full bg-mv-primary text-white transition hover:bg-mv-primary-dark">
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {/* Pagination */}
              <div className="mt-8 flex justify-center gap-2">
                {[1, 2, 3].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPage(p)}
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-full text-[13px] font-semibold transition",
                      page === p ? "bg-mv-primary text-white" : "border border-mv-border text-mv-muted hover:border-mv-primary",
                    )}
                  >
                    {p}
                  </button>
                ))}
                <button type="button" className="flex h-9 w-9 items-center justify-center rounded-full border border-mv-border text-mv-muted hover:border-mv-primary">
                  ›
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Info section */}
        <section className="bg-white py-12 md:py-16">
          <div className="mv-container">
            <h2 className="text-center text-[24px] font-bold text-mv-text">
              Everything About <span className="text-mv-primary">Brake Shoes</span>
            </h2>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {infoCards.map((card) => (
                <article key={card.title} className="rounded-xl border border-mv-border bg-white p-5 shadow-sm">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-mv-blue-light text-mv-primary">
                    <Star size={18} />
                  </div>
                  <h3 className="text-[14px] font-bold text-mv-text">{card.title}</h3>
                  <p className="mt-2 text-[12px] leading-relaxed text-mv-muted">{card.desc}</p>
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
