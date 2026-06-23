"use client";

import { CreditCard, Globe, Lock, Plane, Shield, Truck, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { useReveal } from "@/hooks/useReveal";
import { cn } from "@/lib/utils";

const shippingOptions = [
  { id: "express", label: "Express Delivery", price: "$24.00", time: "2-3 Business Days", icon: Zap },
  { id: "standard", label: "Standard Shipping", price: "FREE", time: "5-7 Business Days", icon: Truck },
  { id: "overnight", label: "Overnight Priority", price: "$45.00", time: "Next Day by 10 AM", icon: Plane },
];

const paymentTabs = ["CARD", "PAYPAL", "COD", "TRANSFER"];

const orderItems = [
  { name: "Forged Titanium Pistons", detail: "Model X-700 / Racing Grade", price: 599, image: "/images/placeholders/product.svg" },
  { name: "Nitro-Coil Suspension", detail: "Rear-Mono / Competition", price: 1250, image: "/images/placeholders/product.svg" },
];

export default function CheckoutPage() {
  const [shipping, setShipping] = useState("express");
  const [paymentTab, setPaymentTab] = useState("CARD");
  const [emailUpdates, setEmailUpdates] = useState(true);
  const [sameAddress, setSameAddress] = useState(true);
  useReveal();

  const subtotal = 1849;
  const shippingCost = shipping === "express" ? 24 : shipping === "overnight" ? 45 : 0;
  const tax = 147.92;
  const total = subtotal + shippingCost + tax;

  return (
    <>
      <Header />
      <main className="bg-mv-bg">
        {/* Breadcrumb */}
        <div className="border-b border-mv-border bg-white py-3">
          <div className="mv-container text-[12px] text-mv-muted">
            <Link href="/" className="hover:text-mv-primary">Home</Link>
            {" > "}
            <Link href="/products/brake-shoes" className="hover:text-mv-primary">Products</Link>
            {" > "}
            <Link href="/products/brake-shoes" className="hover:text-mv-primary">Brake Pad</Link>
            {" > "}
            <span className="text-mv-text">Brembo Front Brake Pad P83054</span>
          </div>
        </div>

        <div className="mv-container py-8 md:py-12">
          <div className="grid gap-8 lg:grid-cols-[1fr_minmax(0,400px)]">
            <div className="space-y-6">
              <section className="reveal mv-card p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-[16px] font-bold text-mv-text">Contact Information</h2>
                  <Link href="/sign-in" className="text-[12px] font-semibold text-mv-primary hover:underline">Log In</Link>
                </div>
                <input type="email" placeholder="Email Address" className="mv-input" />
                <label className="mt-3 flex cursor-pointer items-center gap-2.5 text-[12px] text-mv-muted">
                  <button
                    type="button"
                    onClick={() => setEmailUpdates((v) => !v)}
                    className={cn("relative h-5 w-9 rounded-full transition", emailUpdates ? "bg-mv-primary" : "bg-mv-border")}
                  >
                    <span className={cn("absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition", emailUpdates ? "left-[18px]" : "left-0.5")} />
                  </button>
                  Email me with precision updates and exclusive offers
                </label>
              </section>

              <section className="reveal d1 mv-card p-6">
                <h2 className="mb-4 text-[16px] font-bold text-mv-text">Delivery Details</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  <input type="text" placeholder="First Name" className="rounded-xl border border-mv-border px-4 py-3 text-[13px] outline-none focus:border-mv-primary" />
                  <input type="text" placeholder="Last Name" className="rounded-xl border border-mv-border px-4 py-3 text-[13px] outline-none focus:border-mv-primary" />
                </div>
                <input type="text" placeholder="Address" className="mt-3 w-full rounded-xl border border-mv-border px-4 py-3 text-[13px] outline-none focus:border-mv-primary" />
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <input type="text" placeholder="City" className="rounded-xl border border-mv-border px-4 py-3 text-[13px] outline-none focus:border-mv-primary" />
                  <input type="text" placeholder="Postal Code" className="rounded-xl border border-mv-border px-4 py-3 text-[13px] outline-none focus:border-mv-primary" />
                </div>
              </section>

              <section className="reveal d2 mv-card p-6">
                <h2 className="mb-4 text-[16px] font-bold text-mv-text">Shipping Velocity</h2>
                <div className="space-y-3">
                  {shippingOptions.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setShipping(opt.id)}
                      className={cn(
                        "flex w-full items-center gap-4 rounded-xl border p-4 text-left transition",
                        shipping === opt.id ? "border-mv-primary bg-mv-blue-light/30" : "border-mv-border hover:border-mv-primary/50",
                      )}
                    >
                      <opt.icon size={20} className={shipping === opt.id ? "text-mv-primary" : "text-mv-muted"} />
                      <div className="flex-1">
                        <p className="text-[13px] font-semibold text-mv-text">
                          {opt.icon === Zap ? "⚡ " : opt.icon === Truck ? "🚚 " : "✈ "}
                          {opt.label}
                        </p>
                        <p className="text-[11px] text-mv-muted">{opt.time}</p>
                      </div>
                      <p className="text-[12px] font-semibold text-[#1a2744]">{opt.price}</p>
                    </button>
                  ))}
                </div>
              </section>

              <section className="reveal d3 mv-card p-6">
                <h2 className="mb-4 text-[16px] font-bold text-mv-text">Secure Payment</h2>
                <div className="mb-5 flex border-b border-mv-border">
                  {paymentTabs.map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setPaymentTab(tab)}
                      className={cn("flex items-center gap-1.5 rounded-lg border px-4 py-2.5 text-[11px] font-bold tracking-wider transition",
                        paymentTab === tab ? "border-mv-primary text-mv-primary" : "border-mv-border text-mv-muted")}
                    >
                      {tab === "CARD" ? <CreditCard size={14} /> : null}
                      {tab}
                    </button>
                  ))}
                </div>

                {/* Card mockup */}
                <div className="relative mb-5 overflow-hidden rounded-xl bg-mv-navy p-6 text-white">
                  <div className="flex items-start justify-between">
                    <p className="text-[11px] font-bold tracking-widest">MOTOVESSEL ELITE</p>
                    <div className="flex gap-2">
                      <div className="h-6 w-8 rounded bg-amber-400/80" />
                      <div className="h-6 w-6 rounded-full border border-white/30" />
                    </div>
                  </div>
                  <p className="mt-8 font-mono text-[18px] tracking-[0.2em]">4532 •••• •••• 9012</p>
                  <div className="mt-4 flex justify-between text-[11px]">
                    <div>
                      <p className="text-white/50">CARDHOLDER</p>
                      <p className="font-semibold">ALEXANDER VANCE</p>
                    </div>
                    <div>
                      <p className="text-white/50">EXPIRES</p>
                      <p className="font-semibold">08 / 26</p>
                    </div>
                  </div>
                </div>

                <input type="text" placeholder="Card Number" className="mb-3 w-full rounded-xl border border-mv-border px-4 py-3 text-[13px] outline-none focus:border-mv-primary" />
                <div className="grid grid-cols-2 gap-3">
                  <input type="text" placeholder="MM/YY" className="rounded-xl border border-mv-border px-4 py-3 text-[13px] outline-none focus:border-mv-primary" />
                  <input type="text" placeholder="CVV" className="rounded-xl border border-mv-border px-4 py-3 text-[13px] outline-none focus:border-mv-primary" />
                </div>
                <label className="mt-3 flex cursor-pointer items-center gap-2 text-[12px] text-mv-muted">
                  <input type="checkbox" checked={sameAddress} onChange={() => setSameAddress((v) => !v)} className="h-4 w-4 accent-mv-primary" />
                  Same as delivery address
                </label>
              </section>
            </div>

            <div>
              <div className="reveal-right sticky top-24 rounded-xl border border-mv-primary/20 bg-white p-6">
                <h2 className="text-[16px] font-bold text-mv-text">Order Architecture</h2>
                <div className="mt-4 space-y-4">
                  {orderItems.map((item) => (
                    <div key={item.name} className="flex gap-3">
                      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-mv-bg">
                        <Image src={item.image} alt={item.name} fill className="object-contain p-1" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[13px] font-semibold text-mv-text">{item.name}</p>
                        <p className="text-[11px] text-mv-muted">{item.detail}</p>
                      </div>
                      <p className="text-[13px] font-bold text-mv-text">${item.price.toFixed(2)}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex gap-2">
                  <input type="text" placeholder="Promo Code" className="flex-1 rounded-xl border border-mv-border px-3 py-2 text-[12px] outline-none" />
                  <button type="button" className="rounded-xl bg-mv-primary px-4 py-2 text-[12px] font-semibold text-white">Apply</button>
                </div>

                <div className="mt-4 space-y-2 border-t border-mv-border pt-4 text-[13px]">
                  <div className="flex justify-between text-mv-muted">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-mv-muted">
                    <span>Shipping (Express)</span>
                    <span>${shippingCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-mv-muted">
                    <span>Estimated Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-t border-mv-border pt-2">
                    <span className="font-bold text-mv-text">Total</span>
                    <span className="text-right">
                      <span className="mr-1 text-[10px] font-semibold uppercase tracking-wider text-mv-muted">USD</span>
                      <span className="text-[22px] font-bold text-mv-primary">${total.toFixed(2)}</span>
                    </span>
                  </div>
                </div>

                <button type="button" className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-mv-navy py-3.5 text-[14px] font-bold text-white">
                  <Lock size={16} />
                  Complete Ignition
                </button>
                <p className="mt-3 text-center text-[9px] font-semibold uppercase tracking-widest text-mv-muted">
                  Encrypted &amp; Powered By MotoVessel Core
                </p>

                <div className="mt-5 grid grid-cols-3 gap-2 border-t border-mv-border pt-4 text-center">
                  {[
                    { icon: Shield, label: "Lifetime Warranty" },
                    { icon: Globe, label: "ISO Certified" },
                    { icon: Globe, label: "Global Support" },
                  ].map(({ icon: Icon, label }) => (
                    <div key={label} className="text-[9px] text-mv-muted">
                      <Icon size={16} className="mx-auto mb-1 text-mv-primary" />
                      {label}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mini footer */}
        <div className="border-t border-mv-border bg-white py-4">
          <div className="mv-container flex flex-wrap items-center justify-between gap-3 text-[10px] font-semibold uppercase tracking-wider text-mv-muted">
            <div className="flex flex-wrap gap-4">
              <span>MOTOVESSEL</span>
              <span>SECURE CHECKOUT</span>
              <Link href="#" className="hover:text-mv-primary">PRIVACY POLICY</Link>
              <Link href="#" className="hover:text-mv-primary">SHIPPING INFO</Link>
              <Link href="/contact" className="hover:text-mv-primary">SUPPORT</Link>
            </div>
            <span>© 2024 MOTOVESSEL. PRECISION ENGINEERED.</span>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
