"use client";

import { CheckCircle2, Download, FileText, Loader2, MapPin, Search } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import ErrorMessage from "@/components/ErrorMessage";
import { getErrorMessage } from "@/lib/api";
import { formatDhakaDate } from "@/lib/formatDate";
import { formatPrice } from "@/lib/mapProduct";
import { orderService } from "@/services/orderService";

function formatLabel(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1).replace(/_/g, " ");
}

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  cod: "Cash on Delivery (COD)",
  sslcommerz: "Online Payment (SSLCommerz)",
  bank_transfer: "Bank Transfer",
};

function formatPaymentMethod(value: string): string {
  return PAYMENT_METHOD_LABELS[value] ?? formatLabel(value);
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order") ?? "";

  const {
    data: order,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["order", "track", orderNumber],
    queryFn: () => orderService.track(orderNumber),
    enabled: !!orderNumber,
  });

  const isOnlinePaid = order?.payment_method === "sslcommerz" && order?.payment_status === "paid";
  const heading = isOnlinePaid ? "Payment Successful" : "Order Placed Successfully";
  const subheading = isOnlinePaid
    ? "Thanks — your payment went through and your order is confirmed."
    : "Thanks — we've received your order and will start processing it shortly.";

  return (
    <div className="bg-mv-bg py-10 md:py-14">
      <div className="mv-container">
        <div className="mx-auto max-w-[640px] rounded-2xl border border-mv-border bg-white p-6 shadow-[0_8px_40px_rgba(26,86,219,0.12)] md:p-10">
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
              <CheckCircle2 size={32} className="text-green-600" />
            </div>
            <h1 className="mt-5 text-[22px] font-bold text-mv-text md:text-[26px]">{heading}</h1>
            <p className="mt-2 text-[13px] text-mv-muted">{subheading}</p>
          </div>

          {!orderNumber ? (
            <div className="mt-6">
              <ErrorMessage message="No order number was provided." />
            </div>
          ) : isLoading ? (
            <div className="mt-8 flex items-center justify-center gap-2 text-[12px] text-mv-muted">
              <Loader2 size={14} className="animate-spin" />
              Fetching order details...
            </div>
          ) : isError ? (
            <div className="mt-6">
              <ErrorMessage message={getErrorMessage(error)} />
            </div>
          ) : order ? (
            <div className="mt-8 space-y-6 border-t border-mv-border pt-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-[12px] text-mv-muted">Order Number</p>
                  <p className="text-[18px] font-bold text-mv-primary">{order.order_number}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-mv-blue-light px-3 py-1 text-[11px] font-semibold text-mv-primary">
                    {formatLabel(order.order_status)}
                  </span>
                  <span className="rounded-full bg-mv-bg px-3 py-1 text-[11px] font-semibold text-mv-text">
                    Payment: {formatLabel(order.payment_status)}
                  </span>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-mv-border bg-mv-bg p-4">
                  <p className="text-[12px] font-semibold text-mv-text">Shipping To</p>
                  <p className="mt-1 text-[13px] text-mv-text">{order.customer_name}</p>
                  <p className="text-[12px] text-mv-muted">{order.shipping_address}, {order.city}</p>
                  <p className="text-[12px] text-mv-muted">{order.customer_phone}</p>
                </div>
                <div className="rounded-xl border border-mv-border bg-mv-bg p-4">
                  <p className="text-[12px] font-semibold text-mv-text">Payment Method</p>
                  <p className="mt-1 text-[13px] text-mv-text">{formatPaymentMethod(order.payment_method)}</p>
                  <p className="mt-2 text-[12px] font-semibold text-mv-text">Order Date</p>
                  <p className="text-[12px] text-mv-muted">
                    {formatDhakaDate(order.created_at, "long")}
                  </p>
                </div>
              </div>

              <div>
                <p className="mb-3 text-[12px] font-semibold text-mv-text">Order Items</p>
                <div className="space-y-2">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between rounded-xl border border-mv-border bg-white px-4 py-3 text-[13px]">
                      <div>
                        <p className="font-semibold text-mv-text">{item.product_name}</p>
                        <p className="text-[11px] text-mv-muted">SKU: {item.product_sku} · Qty: {item.quantity}</p>
                      </div>
                      <p className="font-bold text-mv-text">{formatPrice(item.total_price)}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2 border-t border-mv-border pt-4 text-[13px]">
                <div className="flex justify-between text-mv-muted">
                  <span>Subtotal</span>
                  <span>{formatPrice(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-mv-muted">
                  <span>Shipping</span>
                  <span>{formatPrice(order.shipping_charge)}</span>
                </div>
                {order.discount > 0 ? (
                  <div className="flex justify-between text-mv-muted">
                    <span>Discount</span>
                    <span>-{formatPrice(order.discount)}</span>
                  </div>
                ) : null}
                <div className="flex items-center justify-between border-t border-mv-border pt-3">
                  <span className="text-[14px] font-bold text-mv-text">Total</span>
                  <span className="text-[20px] font-bold text-mv-primary">{formatPrice(order.total)}</span>
                </div>
              </div>
            </div>
          ) : null}

          <div className="mt-8 grid gap-2.5 sm:grid-cols-3">
            <Link
              href={`/orders/invoice?order=${encodeURIComponent(orderNumber)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl border border-mv-border py-3 text-[13px] font-semibold text-mv-text transition hover:border-mv-primary hover:text-mv-primary"
            >
              <Download size={15} />
              Download Invoice
            </Link>
            <Link
              href={`/track-order?order=${encodeURIComponent(orderNumber)}`}
              className="flex items-center justify-center gap-2 rounded-xl bg-mv-primary py-3 text-[13px] font-semibold text-white transition hover:bg-mv-navy"
            >
              <Search size={15} />
              Track This Order
            </Link>
            <Link
              href="/products/all"
              className="flex items-center justify-center gap-2 rounded-xl border border-mv-border py-3 text-[13px] font-semibold text-mv-text transition hover:border-mv-primary hover:text-mv-primary"
            >
              <FileText size={15} />
              Continue Shopping
            </Link>
          </div>

          {!isOnlinePaid && order?.payment_method === "bank_transfer" ? (
            <p className="mt-4 flex items-start gap-2 rounded-xl bg-mv-blue-light/50 px-4 py-3 text-[12px] text-mv-primary">
              <MapPin size={14} className="mt-0.5 shrink-0" />
              We&apos;ll share our bank account details by email/phone shortly so you can complete the transfer.
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="mv-container py-16 text-center text-mv-muted">Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
