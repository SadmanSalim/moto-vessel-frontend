"use client";

import { Loader2, XCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { orderService } from "@/services/orderService";

function FailContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order") ?? "";

  const trackMutation = useMutation({
    mutationFn: (number: string) => orderService.track(number),
  });

  useEffect(() => {
    if (orderNumber) trackMutation.mutate(orderNumber);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderNumber]);

  return (
    <div className="mv-container flex min-h-[60vh] items-center justify-center py-16">
      <div className="w-full max-w-md rounded-2xl border border-mv-border bg-white p-8 text-center shadow-[0_8px_40px_rgba(26,86,219,0.12)]">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
          <XCircle size={32} className="text-mv-red" />
        </div>
        <h1 className="mt-5 text-[22px] font-bold text-mv-text">Payment Failed</h1>
        <p className="mt-2 text-[13px] text-mv-muted">
          We couldn&apos;t process payment for order <span className="font-semibold text-mv-text">{orderNumber || "—"}</span>. No amount was
          charged. Your order is saved and you can try paying again.
        </p>

        {trackMutation.isPending ? (
          <div className="mt-6 flex items-center justify-center gap-2 text-[12px] text-mv-muted">
            <Loader2 size={14} className="animate-spin" />
            Fetching order details...
          </div>
        ) : null}

        <div className="mt-7 flex flex-col gap-2">
          <Link
            href={`/track-order?order=${encodeURIComponent(orderNumber)}`}
            className="rounded-xl bg-mv-primary py-3 text-[13px] font-semibold text-white"
          >
            View Order &amp; Retry
          </Link>
          <Link href="/contact" className="rounded-xl border border-mv-border py-3 text-[13px] font-semibold text-mv-text">
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutFailPage() {
  return (
    <Suspense fallback={<div className="mv-container py-16 text-center text-mv-muted">Loading...</div>}>
      <FailContent />
    </Suspense>
  );
}
