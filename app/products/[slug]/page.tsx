"use client";

import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Heart,
  Minus,
  Plus,
  Share2,
  ShoppingCart,
  Star,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { use, useState } from "react";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { getProductBySlug, relatedProducts } from "@/data/products";
import { cn } from "@/lib/utils";

const infoTabs = ["Description", "Specs", "Compatibility", "Review"];
const whyChoose = [
  { title: "2,500+", sub: "Happy Customer" },
  { title: "98%", sub: "Satisfaction" },
  { title: "24-48 Hours", sub: "Delivery" },
  { title: "Warranty", sub: "Safe Packing" },
  { title: "2,500+", sub: "Happy Customer" },
  { title: "2,500+", sub: "Happy Customer" },
];

const stockBadge = {
  "in-stock": { label: "In Stock", class: "bg-green-50 text-green-600" },
  "out-of-stock": { label: "Out of Stock", class: "bg-red-50 text-mv-red" },
  "low-stock": { label: "Low Stock", class: "bg-orange-50 text-orange-600" },
};

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const product = getProductBySlug(slug);
  const [qty, setQty] = useState(2);
  const [activeTab, setActiveTab] = useState("Description");
  const [activeImage, setActiveImage] = useState(0);
  const [specTab, setSpecTab] = useState<"parts" | "brand">("brand");

  const images = [product?.image, product?.image, product?.image].filter(Boolean) as string[];

  return (
    <>
      <Header />
      <main className="bg-mv-bg">
        <div className="mv-container py-6">
          {/* Breadcrumb */}
          <nav className="mb-6 text-[12px] text-mv-muted">
            <Link href="/" className="hover:text-mv-primary">Home</Link>
            {" > "}
            <Link href="/products/brake-shoes" className="hover:text-mv-primary">Products</Link>
            {" > "}
            <Link href="/products/brake-shoes" className="hover:text-mv-primary">Car Parts</Link>
            {" > "}
            <span className="text-mv-text">{product?.name}</span>
          </nav>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Left: Product info */}
            <div>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-mv-blue-light px-3 py-0.5 text-[11px] font-semibold text-mv-primary">Denso</span>
                <span className="rounded-full bg-red-50 px-3 py-0.5 text-[11px] font-semibold text-mv-red">Out of Stock</span>
              </div>
              <h1 className="mt-3 text-[22px] font-bold leading-tight text-mv-text md:text-[26px]">
                Denso Spark Plug VFKBH(TOYOTA HIACE TRHV(200K)
              </h1>
              <div className="mt-2 flex items-center gap-2">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={14} className={i < 4 ? "fill-amber-400 text-amber-400" : "text-gray-200"} />
                  ))}
                </div>
                <span className="text-[12px] text-mv-muted">(24 Reviews)</span>
              </div>
              <p className="mt-3 text-[28px] font-bold text-mv-primary">$8000</p>

              {/* Spec tabs */}
              <div className="mt-5 flex gap-2">
                <button
                  type="button"
                  onClick={() => setSpecTab("parts")}
                  className={cn("rounded-xl border px-4 py-2 text-[12px] font-medium", specTab === "parts" ? "border-mv-primary text-mv-primary" : "border-mv-border text-mv-muted")}
                >
                  Parts List: 1234567...
                </button>
                <button
                  type="button"
                  onClick={() => setSpecTab("brand")}
                  className={cn("rounded-xl border px-4 py-2 text-[12px] font-medium", specTab === "brand" ? "border-mv-primary bg-mv-blue-light text-mv-primary" : "border-mv-border text-mv-muted")}
                >
                  Brand: Denso
                </button>
              </div>
              <p className="mt-4 text-[12px] leading-relaxed text-mv-muted">
                High-performance Denso spark plug engineered for Toyota Hiace TRHV models. Delivers optimal ignition,
                fuel efficiency, and long-lasting reliability under demanding conditions.
              </p>

              {/* Quantity & actions */}
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <div className="flex items-center rounded-full border border-mv-border bg-white">
                  <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-4 py-2 text-mv-muted hover:text-mv-text">
                    <Minus size={16} />
                  </button>
                  <span className="w-8 text-center text-[14px] font-semibold">{qty}</span>
                  <button type="button" onClick={() => setQty((q) => q + 1)} className="px-4 py-2 text-mv-muted hover:text-mv-text">
                    <Plus size={16} />
                  </button>
                </div>
                <p className="text-[14px] font-semibold text-mv-primary">Price: $8000</p>
              </div>

              <div className="mt-4 flex flex-wrap gap-3">
                <button type="button" className="mv-btn-primary gap-2">
                  <ShoppingCart size={16} />
                  Add to cart
                </button>
                <Link href="/checkout" className="mv-btn-red gap-2">
                  Buy Now
                  <ArrowRight size={16} />
                </Link>
              </div>
              <button
                type="button"
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] py-3 text-[13px] font-bold text-white transition hover:bg-[#1fb855]"
              >
                Order on WhatsApp
              </button>
              <button type="button" className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-mv-primary py-3 text-[13px] font-semibold text-mv-primary">
                <ClipboardList size={16} />
                Calculate EMI
              </button>
              <div className="mt-3 flex gap-3">
                <button type="button" className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-mv-primary py-2.5 text-[12px] font-semibold text-mv-primary">
                  <Share2 size={14} />
                  Share
                </button>
                <button type="button" className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-mv-red py-2.5 text-[12px] font-semibold text-mv-red">
                  <Heart size={14} />
                  Wish List
                </button>
              </div>
            </div>

            {/* Right: Images */}
            <div>
              <div className="relative aspect-square overflow-hidden rounded-xl border border-mv-border bg-white p-8">
                <Image src={images[activeImage] ?? "/images/placeholders/product.svg"} alt={product?.name ?? "Product"} fill className="object-contain" />
              </div>
              <div className="relative mt-3 rounded-xl border border-mv-border bg-white p-3">
                <span className="absolute left-4 top-2 text-[11px] font-medium text-mv-muted">{activeImage + 1}/{images.length}</span>
                <div className="mt-4 flex justify-center gap-2">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setActiveImage(i)}
                      className={cn("relative h-16 w-16 overflow-hidden rounded-lg border-2", activeImage === i ? "border-mv-primary" : "border-mv-border")}
                    >
                      <Image src={img} alt="" fill className="object-contain p-1" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Info tabs */}
          <div className="mt-12">
            <div className="mx-auto flex w-fit rounded-full border border-mv-border bg-white p-1">
              {infoTabs.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={cn("rounded-full px-5 py-2 text-[12px] font-semibold transition", activeTab === tab ? "bg-mv-primary text-white" : "text-mv-muted hover:text-mv-text")}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="mt-6 rounded-xl border border-mv-border bg-white p-6">
              <p className="text-[13px] leading-relaxed text-mv-muted">
                The Denso Spark Plug VFKBH is a premium iridium-tipped spark plug designed specifically for Toyota Hiace
                TRHV (200K) engines. It features advanced electrode technology for superior ignition performance, reduced
                fuel consumption, and extended service life. Ideal for both commercial fleet operators and private owners
                seeking OEM-quality replacement parts.
              </p>
            </div>
          </div>

          {/* Why Choose */}
          <div className="mt-12 text-center">
            <h2 className="text-[20px] font-bold text-mv-primary">Why Choose Moto Vessel?</h2>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {whyChoose.map((item, i) => (
                <div key={i} className="rounded-xl border border-mv-border bg-white p-4">
                  <p className="text-[16px] font-bold text-mv-primary">{item.title}</p>
                  <p className="mt-1 text-[10px] text-mv-muted">{item.sub}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Related Products */}
          <div className="mt-12 pb-8">
            <span className="mx-auto block w-fit rounded-full bg-mv-blue-light px-4 py-1 text-[11px] font-semibold text-mv-primary">
              You Might Also Like
            </span>
            <h2 className="mt-3 text-center text-[22px] font-bold text-mv-text">Related Products</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {relatedProducts.map((p) => {
                const badge = stockBadge[p.stockStatus ?? "in-stock"];
                return (
                  <article key={p.id} className="overflow-hidden rounded-xl border border-mv-border bg-white shadow-sm">
                    <div className="relative aspect-[4/3] bg-mv-bg p-4">
                      <span className={cn("absolute right-3 top-3 rounded-full px-2 py-0.5 text-[10px] font-semibold", badge.class)}>
                        {badge.label}
                      </span>
                      <Image src={p.image} alt={p.name} width={200} height={150} className="h-full w-full object-contain" />
                    </div>
                    <div className="p-4">
                      <span className="rounded-full bg-mv-blue-light px-2 py-0.5 text-[10px] font-semibold text-mv-primary">{p.category}</span>
                      <h3 className="mt-2 text-[13px] font-semibold text-mv-text">{p.name}</h3>
                      <div className="mt-1 flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} size={11} className="fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <p className="mt-2 text-[15px] font-bold">{p.price}$</p>
                      <div className="mt-3 flex gap-2">
                        <button type="button" className="flex-1 rounded-xl border border-mv-primary py-2 text-[11px] font-semibold text-mv-primary">Add to Cart</button>
                        <button type="button" className="flex-1 rounded-xl bg-mv-primary py-2 text-[11px] font-semibold text-white">Buy Now</button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
            <div className="mt-6 flex justify-center gap-2">
              <button type="button" className="flex h-8 w-8 items-center justify-center rounded-full border border-mv-border text-mv-muted hover:border-mv-primary hover:text-mv-primary">
                <ChevronLeft size={16} />
              </button>
              <button type="button" className="flex h-8 w-8 items-center justify-center rounded-full border border-mv-border text-mv-muted hover:border-mv-primary hover:text-mv-primary">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
