"use client";

import { ArrowLeft, MapPin, Search } from "lucide-react";
import Link from "next/link";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

const demoOrders = [
  { orderNumber: "3526", email: "demo@motovessel.com" },
  { orderNumber: "jp1002", email: "demo@motovessel.com" },
];

export default function TrackOrderPage() {
  return (
    <>
      <Header />
      <main className="bg-mv-bg pb-4 md:pb-8">
        {/* Page header bar */}
        <div className="border-b border-mv-border bg-white py-5 md:py-6">
          <div className="mv-container flex flex-wrap items-center justify-between gap-4">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-[13px] font-medium text-mv-muted transition hover:text-mv-primary"
            >
              <ArrowLeft size={16} />
              Back
            </Link>
            <div className="order-last w-full text-center sm:order-none sm:w-auto">
              <h1 className="text-[22px] font-bold text-mv-text md:text-[28px]">Track Your Order</h1>
              <p className="mt-1 text-[12px] text-mv-muted md:text-[13px]">
                Enter Your Order Details to track your motovassel shipment.
              </p>
            </div>
            <div className="hidden items-center gap-1.5 text-[12px] font-medium text-mv-red sm:flex">
              <MapPin size={14} />
              Motovassel Order Tracking
            </div>
          </div>
        </div>

        {/* Form card */}
        <div className="mv-container py-10 md:py-14">
          <div className="mx-auto max-w-[560px] rounded-2xl border border-mv-border/80 bg-white p-7 shadow-[0_8px_40px_rgba(26,86,219,0.12)] md:p-10">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-mv-blue-light text-mv-primary">
                <Search size={20} />
              </div>
              <div>
                <h2 className="text-[18px] font-bold text-mv-text">Track Your Order</h2>
                <p className="text-[12px] text-mv-muted">Enter your order number and email to check status</p>
              </div>
            </div>

            <form className="mt-7 space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label htmlFor="orderNumber" className="mb-1.5 block text-[12px] font-semibold text-mv-text">
                  Order Number
                </label>
                <input
                  id="orderNumber"
                  type="text"
                  placeholder="Enter Your Order Number"
                  className="mv-input"
                />
              </div>
              <div>
                <label htmlFor="email" className="mb-1.5 block text-[12px] font-semibold text-mv-text">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="Your123example@email.com"
                  className="mv-input"
                />
              </div>
              <button type="submit" className="mv-btn-red w-full gap-2">
                <Search size={16} />
                Track Order
              </button>
            </form>

            <div className="mt-8 border-t border-mv-border pt-6">
              <p className="text-[12px] font-semibold text-mv-text">Sample Order Number For Demo:</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {demoOrders.map((order) => (
                  <div key={order.orderNumber} className="rounded-xl border border-mv-border bg-mv-bg p-4">
                    <p className="text-[14px] font-bold text-mv-primary">{order.orderNumber}</p>
                    <p className="mt-1 text-[11px] text-mv-muted">{order.email}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
