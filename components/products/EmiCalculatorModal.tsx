"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { Calculator, X } from "lucide-react";
import { useCmsEmiPlans } from "@/hooks/useCms";
import { useHasMounted } from "@/hooks/useHasMounted";
import { formatPrice } from "@/lib/mapProduct";

export function EmiCalculatorModal({
  open,
  onClose,
  productName,
  productPrice,
}: {
  open: boolean;
  onClose: () => void;
  productName: string;
  productPrice: number;
}) {
  const mounted = useHasMounted();
  const { data: plans, isLoading } = useCmsEmiPlans(productPrice, open && productPrice > 0);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open || !mounted) return null;

  // Group by tenure so e.g. "12 months" shows every bank's rate for that
  // tenure together, sorted shortest-to-longest.
  const sortedPlans = [...(plans ?? [])].sort((a, b) => a.tenure_months - b.tenure_months);

  return createPortal(
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 px-4 py-8"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="max-h-[85vh] w-full max-w-[560px] overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <div className="sticky top-0 flex items-center justify-between border-b border-mv-border bg-white px-5 py-4">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-mv-blue-light text-mv-primary">
              <Calculator size={18} />
            </span>
            <div>
              <h2 className="text-[15px] font-bold text-mv-text">EMI Calculator</h2>
              <p className="line-clamp-1 text-[11px] text-mv-muted">{productName}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-full text-mv-muted transition hover:bg-mv-bg hover:text-mv-text"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5">
          <div className="rounded-xl bg-mv-bg px-4 py-3 text-center">
            <p className="text-[11px] text-mv-muted">Product Price</p>
            <p className="text-[20px] font-bold text-mv-text">{formatPrice(productPrice)}</p>
          </div>

          <div className="mt-5 space-y-3">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-16 animate-pulse rounded-xl bg-mv-bg" />
              ))
            ) : sortedPlans.length > 0 ? (
              sortedPlans.map((plan) => (
                <div
                  key={plan.id}
                  className="flex items-center justify-between rounded-xl border border-mv-border p-4 transition hover:border-mv-primary"
                >
                  <div>
                    <p className="text-[13px] font-bold text-mv-text">
                      {plan.tenure_months} months — {plan.bank_name}
                    </p>
                    <p className="mt-0.5 text-[11px] text-mv-muted">
                      {plan.interest_rate > 0 ? `${plan.interest_rate}% p.a.` : "Interest-free"}
                      {plan.processing_fee_percent > 0 ? ` + ${plan.processing_fee_percent}% processing fee` : ""}
                    </p>
                    {plan.total_interest !== undefined ? (
                      <p className="mt-1 text-[11px] text-mv-muted">
                        Total payable: {formatPrice(plan.total_payable ?? 0)}
                        {plan.total_interest > 0 ? ` (incl. ${formatPrice(plan.total_interest)} interest)` : ""}
                      </p>
                    ) : null}
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-[17px] font-bold text-mv-primary">
                      {formatPrice(plan.monthly_installment ?? 0)}
                    </p>
                    <p className="text-[10px] text-mv-muted">/ month</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-xl border border-dashed border-mv-border p-6 text-center text-[12px] text-mv-muted">
                No EMI plans are available for this product right now. Contact us on WhatsApp to ask about
                installment options.
              </div>
            )}
          </div>

          <p className="mt-5 text-center text-[10px] text-mv-muted">
            EMI figures are estimates. Final terms depend on your card issuer and are confirmed at checkout.
          </p>
        </div>
      </div>
    </div>,
    document.body,
  );
}
