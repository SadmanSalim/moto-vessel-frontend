"use client";

import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function CancelContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order") ?? "";

  return (
    <div className="mv-container flex min-h-[60vh] items-center justify-center py-16">
      <div className="w-full max-w-md rounded-2xl border border-mv-border bg-white p-8 text-center shadow-[0_8px_40px_rgba(26,86,219,0.12)]">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-50">
          <AlertCircle size={32} className="text-amber-500" />
        </div>
        <h1 className="mt-5 text-[22px] font-bold text-mv-text">Payment Cancelled</h1>
        <p className="mt-2 text-[13px] text-mv-muted">
          You cancelled the payment for order <span className="font-semibold text-mv-text">{orderNumber || "—"}</span>. No amount was charged.
          Your order is still saved if you&apos;d like to complete payment later.
        </p>

        <div className="mt-7 flex flex-col gap-2">
          <Link
            href={`/track-order?order=${encodeURIComponent(orderNumber)}`}
            className="rounded-xl bg-mv-primary py-3 text-[13px] font-semibold text-white"
          >
            View Order &amp; Retry
          </Link>
          <Link href="/products/all" className="rounded-xl border border-mv-border py-3 text-[13px] font-semibold text-mv-text">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutCancelPage() {
  return (
    <Suspense fallback={<div className="mv-container py-16 text-center text-mv-muted">Loading...</div>}>
      <CancelContent />
    </Suspense>
  );
}
