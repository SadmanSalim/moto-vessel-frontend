"use client";

import { Loader2, Printer } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ErrorMessage from "@/components/ErrorMessage";
import { useCmsSettings } from "@/hooks/useCms";
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

function InvoiceContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order") ?? "";
  const hasAutoPrinted = useRef(false);
  const [printed, setPrinted] = useState(false);

  const { data: settings } = useCmsSettings();

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

  const siteName = settings?.site_name || "MotoVessel";
  const siteLogo = settings?.site_logo || "/images/logo.png";
  const siteAddress = settings?.contact_address || "";
  const sitePhone = settings?.contact_phone || "";
  const siteEmail = settings?.contact_email || "";

  // Give the browser a moment to finish laying out the invoice, then open
  // the print dialog automatically so "Download Invoice" feels like one
  // click — the customer just picks "Save as PDF" in the print dialog.
  useEffect(() => {
    if (order && !hasAutoPrinted.current) {
      hasAutoPrinted.current = true;
      const timer = setTimeout(() => {
        window.print();
        setPrinted(true);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [order]);

  if (!orderNumber) {
    return (
      <div className="mv-container py-16">
        <ErrorMessage message="No order number was provided." />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="mv-container flex items-center justify-center gap-2 py-16 text-[13px] text-mv-muted">
        <Loader2 size={16} className="animate-spin" />
        Loading invoice...
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="mv-container py-16">
        <ErrorMessage message={getErrorMessage(error) || "Order not found."} />
      </div>
    );
  }

  return (
    <div className="bg-mv-bg py-8 print:bg-white print:py-0">
      <div className="mv-container print:!max-w-none print:!px-0">
        <div className="print:hidden mb-4 flex items-center justify-between">
          <p className="text-[13px] text-mv-muted">
            {printed ? "If the print dialog didn't open, use the button below." : "Preparing your invoice..."}
          </p>
          <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center gap-2 rounded-xl bg-mv-primary px-4 py-2.5 text-[13px] font-semibold text-white transition hover:bg-mv-navy"
          >
            <Printer size={15} />
            Print / Save as PDF
          </button>
        </div>

        <div className="mx-auto max-w-[820px] rounded-2xl border border-mv-border bg-white p-8 shadow-[0_8px_40px_rgba(26,86,219,0.1)] print:max-w-none print:rounded-none print:border-0 print:p-0 print:shadow-none">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-mv-border pb-6">
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element -- next/image's optimizer 400s on
                  storage-hosted CMS images until the dev server is restarted to pick up remotePatterns;
                  a plain <img> sidesteps that entirely, same workaround used in HeroSection. */}
              <img src={siteLogo} alt={siteName} width={110} height={33} className="h-auto w-[110px]" />
            </div>
            <div className="text-right">
              <h1 className="text-[22px] font-bold text-mv-text">INVOICE</h1>
              <p className="mt-1 text-[12px] text-mv-muted">Order #{order.order_number}</p>
              <p className="text-[12px] text-mv-muted">
                {formatDhakaDate(order.created_at, "long")}
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-mv-muted">From</p>
              <p className="mt-1.5 text-[13px] font-semibold text-mv-text">{siteName}</p>
              {siteAddress ? <p className="text-[12px] text-mv-muted">{siteAddress}</p> : null}
              {sitePhone ? <p className="text-[12px] text-mv-muted">{sitePhone}</p> : null}
              {siteEmail ? <p className="text-[12px] text-mv-muted">{siteEmail}</p> : null}
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-mv-muted">Bill / Ship To</p>
              <p className="mt-1.5 text-[13px] font-semibold text-mv-text">{order.customer_name}</p>
              <p className="text-[12px] text-mv-muted">{order.shipping_address}</p>
              <p className="text-[12px] text-mv-muted">{order.city}</p>
              <p className="text-[12px] text-mv-muted">{order.customer_phone}</p>
              <p className="text-[12px] text-mv-muted">{order.customer_email}</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-mv-muted">Payment</p>
              <p className="mt-1.5 text-[13px] font-semibold text-mv-text">{formatPaymentMethod(order.payment_method)}</p>
              <p className="text-[12px] text-mv-muted">Status: {formatLabel(order.payment_status)}</p>
              <p className="mt-2 text-[11px] font-semibold uppercase tracking-wide text-mv-muted">Order Status</p>
              <p className="text-[12px] text-mv-muted">{formatLabel(order.order_status)}</p>
            </div>
          </div>

          <table className="mt-8 w-full border-collapse text-[13px]">
            <thead>
              <tr className="border-b-2 border-mv-text/80 text-left text-[11px] font-semibold uppercase tracking-wide text-mv-muted">
                <th className="py-2">Item</th>
                <th className="py-2">SKU</th>
                <th className="py-2 text-center">Qty</th>
                <th className="py-2 text-right">Unit Price</th>
                <th className="py-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item) => (
                <tr key={item.id} className="border-b border-mv-border">
                  <td className="py-2.5 font-medium text-mv-text">{item.product_name}</td>
                  <td className="py-2.5 text-mv-muted">{item.product_sku}</td>
                  <td className="py-2.5 text-center text-mv-muted">{item.quantity}</td>
                  <td className="py-2.5 text-right text-mv-muted">{formatPrice(item.unit_price)}</td>
                  <td className="py-2.5 text-right font-semibold text-mv-text">{formatPrice(item.total_price)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-6 flex justify-end">
            <div className="w-full max-w-[280px] space-y-2 text-[13px]">
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
              <div className="flex justify-between border-t border-mv-text/20 pt-2 text-[15px] font-bold text-mv-text">
                <span>Total</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          {order.notes ? (
            <div className="mt-6 border-t border-mv-border pt-4">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-mv-muted">Notes</p>
              <p className="mt-1 text-[12px] text-mv-muted">{order.notes}</p>
            </div>
          ) : null}

          <p className="mt-10 text-center text-[11px] text-mv-muted">
            Thank you for shopping with {siteName}. This is a computer-generated invoice.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function InvoicePage() {
  return (
    <Suspense fallback={null}>
      <InvoiceContent />
    </Suspense>
  );
}
