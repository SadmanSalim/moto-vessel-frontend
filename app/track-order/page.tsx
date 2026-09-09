"use client";

import { ArrowLeft, Check, Loader2, MapPin, Package, Search, Truck } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import ErrorMessage from "@/components/ErrorMessage";
import { useReveal } from "@/hooks/useReveal";
import { getErrorMessage } from "@/lib/api";
import { formatPrice } from "@/lib/mapProduct";
import { cn } from "@/lib/utils";
import { orderService } from "@/services/orderService";
import type { CourierStage, Order } from "@/types";

const STATUS_STEPS = [
  { key: "pending", label: "Pending" },
  { key: "confirmed", label: "Confirmed" },
  { key: "processing", label: "Processing" },
  { key: "shipped", label: "Shipped" },
  { key: "delivered", label: "Delivered" },
];

function getStatusIndex(status: string): number {
  const index = STATUS_STEPS.findIndex((step) => step.key === status.toLowerCase());
  return index === -1 ? 0 : index;
}

function formatLabel(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1).replace(/_/g, " ");
}

function OrderStatusTimeline({ orderStatus }: { orderStatus: string }) {
  const currentIndex = getStatusIndex(orderStatus);
  const isCancelled = orderStatus.toLowerCase() === "cancelled";

  return (
    <div>
      <p className="mb-4 text-[12px] font-semibold text-mv-text">Shipment Status</p>
      {isCancelled ? (
        <p className="rounded-xl border border-mv-red/30 bg-red-50 px-4 py-3 text-[13px] font-semibold text-mv-red">
          This order has been cancelled.
        </p>
      ) : (
        <div className="flex items-start justify-between gap-1">
          {STATUS_STEPS.map((step, index) => {
            const isComplete = index < currentIndex;
            const isCurrent = index === currentIndex;
            const isUpcoming = index > currentIndex;

            return (
              <div key={step.key} className="flex flex-1 flex-col items-center">
                <div className="flex w-full items-center">
                  {index > 0 ? (
                    <div
                      className={cn(
                        "h-0.5 flex-1 rounded-full",
                        index <= currentIndex ? "bg-mv-primary" : "bg-mv-border",
                      )}
                    />
                  ) : (
                    <div className="flex-1" />
                  )}
                  <span
                    className={cn(
                      "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold",
                      (isComplete || isCurrent) && "bg-mv-primary text-white",
                      isUpcoming && "border border-mv-border bg-white text-mv-muted",
                    )}
                  >
                    {isComplete ? <Check size={12} strokeWidth={3} /> : index + 1}
                  </span>
                  {index < STATUS_STEPS.length - 1 ? (
                    <div
                      className={cn(
                        "h-0.5 flex-1 rounded-full",
                        index < currentIndex ? "bg-mv-primary" : "bg-mv-border",
                      )}
                    />
                  ) : (
                    <div className="flex-1" />
                  )}
                </div>
                <p
                  className={cn(
                    "mt-2 text-center text-[9px] font-semibold leading-tight sm:text-[10px]",
                    isCurrent || isComplete ? "text-mv-primary" : "text-mv-muted",
                  )}
                >
                  {step.label}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const COURIER_STEPS = [
  { stage: "pending" as const, label: "Sent to Courier" },
  { stage: "picked_up" as const, label: "Picked Up" },
  { stage: "in_transit" as const, label: "In Transit" },
  { stage: "out_for_delivery" as const, label: "Out for Delivery" },
  { stage: "delivered" as const, label: "Delivered" },
];

function courierProviderLabel(provider?: string | null): string {
  if (provider === "pathao") return "Pathao Courier";
  if (provider === "steadfast") return "Steadfast Courier";
  return "Courier";
}

/**
 * Shows the order's REAL delivery status, fetched live from whichever
 * courier (Steadfast/Pathao) it was actually sent through — not just our
 * own internal order_status. The backend (lib/orders.ts#trackOrder) calls
 * the courier's API fresh on every lookup and normalizes its status
 * vocabulary into courier_stage, so this component doesn't need to know
 * Steadfast's words vs Pathao's words.
 */
function CourierTimeline({ order }: { order: Order }) {
  const stage: CourierStage = order.courier_stage ?? "unknown";
  const isTerminalWarning = stage === "cancelled" || stage === "returned" || stage === "hold";
  const currentIndex = COURIER_STEPS.findIndex((s) => s.stage === stage);

  return (
    <div className="rounded-xl border border-mv-border bg-white p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Truck size={16} className="text-mv-primary" />
          <p className="text-[12px] font-semibold text-mv-text">{courierProviderLabel(order.courier_provider)}</p>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-[10px] font-semibold text-green-700">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" />
          Live status
        </span>
      </div>

      {order.courier_tracking_code && (
        <p className="mt-2 text-[12px] text-mv-muted">
          Tracking code: <span className="font-semibold text-mv-text">{order.courier_tracking_code}</span>
        </p>
      )}

      {isTerminalWarning ? (
        <p
          className={cn(
            "mt-4 rounded-lg px-3 py-2 text-[12px] font-semibold",
            stage === "hold" ? "bg-amber-50 text-amber-700" : "bg-red-50 text-mv-red",
          )}
        >
          {stage === "hold" && "Shipment is on hold with the courier."}
          {stage === "cancelled" && "Shipment was cancelled by the courier."}
          {stage === "returned" && "Shipment was returned."}
          {order.courier_status && !order.courier_status.startsWith("error:") && (
            <span className="ml-1 font-normal text-mv-muted">({order.courier_status})</span>
          )}
        </p>
      ) : (
        <div className="mt-4 flex items-start justify-between gap-1">
          {COURIER_STEPS.map((step, index) => {
            const isComplete = currentIndex >= 0 && index < currentIndex;
            const isCurrent = index === currentIndex;
            const isUpcoming = currentIndex === -1 || index > currentIndex;

            return (
              <div key={step.stage} className="flex flex-1 flex-col items-center">
                <div className="flex w-full items-center">
                  {index > 0 ? (
                    <div className={cn("h-0.5 flex-1 rounded-full", index <= currentIndex ? "bg-mv-primary" : "bg-mv-border")} />
                  ) : (
                    <div className="flex-1" />
                  )}
                  <span
                    className={cn(
                      "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold",
                      (isComplete || isCurrent) && "bg-mv-primary text-white",
                      isUpcoming && "border border-mv-border bg-white text-mv-muted",
                    )}
                  >
                    {isComplete ? <Check size={11} strokeWidth={3} /> : <Package size={11} />}
                  </span>
                  {index < COURIER_STEPS.length - 1 ? (
                    <div className={cn("h-0.5 flex-1 rounded-full", index < currentIndex ? "bg-mv-primary" : "bg-mv-border")} />
                  ) : (
                    <div className="flex-1" />
                  )}
                </div>
                <p
                  className={cn(
                    "mt-1.5 text-center text-[8.5px] font-semibold leading-tight sm:text-[9.5px]",
                    isCurrent || isComplete ? "text-mv-primary" : "text-mv-muted",
                  )}
                >
                  {step.label}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {stage === "unknown" && (
        <p className="mt-3 text-[11px] text-mv-muted">
          Waiting for the first status update from the courier — check back shortly.
        </p>
      )}
    </div>
  );
}

function OrderResult({ order }: { order: Order }) {
  return (
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

      <OrderStatusTimeline orderStatus={order.order_status} />

      {order.courier_provider && <CourierTimeline order={order} />}

      <div className="rounded-xl border border-mv-border bg-mv-bg p-4">
        <p className="text-[12px] font-semibold text-mv-text">Tracking Number</p>
        <p className="mt-1 text-[14px] font-bold text-mv-primary">
          {order.tracking_number || "Not assigned yet"}
        </p>
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
              <p className="font-bold text-mv-text">{formatPrice(Number(item.total_price))}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-mv-border pt-4">
        <span className="text-[14px] font-bold text-mv-text">Total</span>
        <span className="text-[20px] font-bold text-mv-primary">{formatPrice(Number(order.total))}</span>
      </div>
    </div>
  );
}

function TrackOrderContent() {
  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");
  const searchParams = useSearchParams();

  useReveal();

  const trackMutation = useMutation({
    mutationFn: (number: string) => orderService.track(number),
  });

  useEffect(() => {
    const orderFromQuery = searchParams.get("order");
    if (orderFromQuery) {
      setOrderNumber(orderFromQuery);
      trackMutation.mutate(orderFromQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber.trim()) return;
    trackMutation.mutate(orderNumber.trim());
  };

  return (
    <div className="bg-mv-bg pb-4 md:pb-8">
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
                Enter Your Order Details to track your MotoVessel shipment.
              </p>
            </div>
            <div className="hidden items-center gap-1.5 text-[12px] font-medium text-mv-red sm:flex">
              <MapPin size={14} />
              MotoVessel Order Tracking
            </div>
            <div className="w-full text-center text-[11px] font-medium text-mv-muted sm:hidden">
              ← Back | Track Your Order | MotoVessel Order Tracking
            </div>
          </div>
        </div>

        <div className="mv-container py-10 md:py-14">
          <div className="reveal mx-auto max-w-[560px] rounded-2xl border border-mv-border/80 bg-white p-7 shadow-[0_8px_40px_rgba(26,86,219,0.12)] md:p-10">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-mv-blue-light text-mv-primary">
                <Search size={20} />
              </div>
              <div>
                <h2 className="text-[18px] font-bold text-mv-text">Track Your Order</h2>
                <p className="text-[12px] text-mv-muted">Enter Your order number and email address to view your order status</p>
              </div>
            </div>

            <form className="mt-7 space-y-4" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="orderNumber" className="mb-1.5 block text-[12px] font-semibold text-mv-text">
                  Order Number
                </label>
                <input
                  id="orderNumber"
                  type="text"
                  placeholder="Enter Your Order Number"
                  className="mv-input"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {trackMutation.isError ? (
                <ErrorMessage message={getErrorMessage(trackMutation.error)} />
              ) : null}

              <button
                type="submit"
                disabled={trackMutation.isPending}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#c92127] py-3 text-[14px] font-bold text-white transition hover:bg-[#a81c22] disabled:opacity-70"
              >
                {trackMutation.isPending ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Tracking...
                  </>
                ) : (
                  <>
                    Track Order
                    <Search size={16} />
                  </>
                )}
              </button>
            </form>

            {trackMutation.isSuccess && trackMutation.data ? (
              <OrderResult order={trackMutation.data} />
            ) : null}
          </div>
        </div>
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={<div className="mv-container py-16 text-center text-mv-muted">Loading...</div>}>
      <TrackOrderContent />
    </Suspense>
  );
}
