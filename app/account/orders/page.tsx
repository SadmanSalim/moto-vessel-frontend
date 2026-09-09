"use client";

import { useQuery } from "@tanstack/react-query";
import { Loader2, Package } from "lucide-react";
import Link from "next/link";
import ErrorMessage from "@/components/ErrorMessage";
import OrderRowSkeleton from "@/components/skeletons/OrderRowSkeleton";
import { getErrorMessage } from "@/lib/api";
import { formatDhakaDate } from "@/lib/formatDate";
import { formatPrice } from "@/lib/mapProduct";
import { orderService } from "@/services/orderService";
import { useAuthStore } from "@/store/authStore";

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-amber-50 text-amber-600",
  processing: "bg-blue-50 text-blue-600",
  shipped: "bg-indigo-50 text-indigo-600",
  delivered: "bg-green-50 text-green-600",
  cancelled: "bg-red-50 text-red-600",
};

function statusLabel(status: string) {
  return status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function AccountOrdersPage() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["my-orders"],
    queryFn: orderService.myOrders,
    enabled: isAuthenticated,
  });

  return (
    <div className="rounded-[18px] bg-white p-6 shadow-[0_10px_30px_rgba(13,71,161,0.06)]">
      <h2 className="text-[15px] font-bold text-[#1a2744]">Order History</h2>
      <p className="mt-1 text-[12px] text-[#5c7099]">Track and review your past orders.</p>

      {isError ? (
        <div className="mt-4">
          <ErrorMessage message={getErrorMessage(error)} />
        </div>
      ) : null}

      {isLoading ? (
        <div className="mt-4 space-y-3">
          <OrderRowSkeleton />
          <OrderRowSkeleton />
          <OrderRowSkeleton />
        </div>
      ) : null}

      {!isLoading && !isError && (data?.length ?? 0) === 0 ? (
        <div className="mt-8 text-center">
          <Package size={26} className="mx-auto mb-3 text-[#93a4c1]" />
          <p className="text-[12px] text-[#5c7099]">You haven&apos;t placed any orders yet.</p>
          <Link href="/products/all" className="mt-4 inline-flex rounded-xl bg-[#1565c0] px-6 py-2.5 text-[12px] font-bold text-white">
            Browse Products
          </Link>
        </div>
      ) : null}

      {!isLoading && (data?.length ?? 0) > 0 ? (
        <div className="mt-4 space-y-3">
          {data!.map((order) => (
            <Link
              key={order.id}
              href={`/checkout/success?order=${order.order_number}`}
              className="block rounded-[14px] border border-[#eef2f8] p-4 transition hover:border-[#d6e4f7] hover:bg-[#f7fbff]"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-[13px] font-bold text-[#1a2744]">#{order.order_number}</p>
                  <p className="mt-0.5 text-[11px] text-[#5c7099]">
                    {formatDhakaDate(order.created_at, "short")}
                    {" · "}
                    {order.items?.length ?? 0} item{order.items?.length === 1 ? "" : "s"}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${
                      STATUS_STYLES[order.order_status?.toLowerCase()] ?? "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {statusLabel(order.order_status ?? "")}
                  </span>
                  <p className="text-[13px] font-bold text-[#1a2744]">{formatPrice(order.total)}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : null}

      {!isAuthenticated ? (
        <div className="mt-8 flex justify-center">
          <Loader2 size={20} className="animate-spin text-[#1565c0]" />
        </div>
      ) : null}
    </div>
  );
}
