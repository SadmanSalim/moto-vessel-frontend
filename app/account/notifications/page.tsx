"use client";

import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import ErrorMessage from "@/components/ErrorMessage";
import { getErrorMessage, useMe, useUpdateNotificationPreferences } from "@/hooks/useAuth";
import { useAuthStore } from "@/store/authStore";

const OPTIONS: { key: "notify_order_updates" | "notify_marketing" | "notify_restock"; label: string; description: string }[] = [
  {
    key: "notify_order_updates",
    label: "Order Updates",
    description: "Get notified when your order status changes (confirmed, shipped, delivered).",
  },
  {
    key: "notify_marketing",
    label: "Marketing & Promotions",
    description: "Receive emails about discounts, new arrivals, and special offers.",
  },
  {
    key: "notify_restock",
    label: "Restock Alerts",
    description: "Get notified when items on your wishlist are back in stock.",
  },
];

export default function AccountNotificationsPage() {
  const { user: storedUser } = useAuthStore();
  const { data: profile } = useMe();
  const user = profile ?? storedUser;
  const updatePrefs = useUpdateNotificationPreferences();

  const [prefs, setPrefs] = useState({
    notify_order_updates: true,
    notify_marketing: false,
    notify_restock: false,
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (user) {
      setPrefs({
        notify_order_updates: user.notify_order_updates ?? true,
        notify_marketing: user.notify_marketing ?? false,
        notify_restock: user.notify_restock ?? false,
      });
    }
  }, [user]);

  const toggle = (key: keyof typeof prefs) => {
    setSaved(false);
    const next = { ...prefs, [key]: !prefs[key] };
    setPrefs(next);
    updatePrefs.mutate(next, { onSuccess: () => setSaved(true) });
  };

  return (
    <div className="rounded-[18px] bg-white p-6 shadow-[0_10px_30px_rgba(13,71,161,0.06)]">
      <h2 className="text-[15px] font-bold text-[#1a2744]">Notification Preferences</h2>
      <p className="mt-1 text-[12px] text-[#5c7099]">Choose what you want to hear from us about.</p>

      <div className="mt-5 space-y-3">
        {OPTIONS.map((opt) => (
          <label
            key={opt.key}
            className="flex cursor-pointer items-start justify-between gap-4 rounded-[14px] border border-[#eef2f8] p-4 transition hover:bg-[#f7fbff]"
          >
            <div>
              <p className="text-[13px] font-bold text-[#1a2744]">{opt.label}</p>
              <p className="mt-0.5 text-[12px] text-[#5c7099]">{opt.description}</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={prefs[opt.key]}
              onClick={() => toggle(opt.key)}
              className={`relative mt-0.5 h-6 w-11 shrink-0 rounded-full transition ${
                prefs[opt.key] ? "bg-[#1565c0]" : "bg-[#d6e4f7]"
              }`}
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${
                  prefs[opt.key] ? "left-[22px]" : "left-0.5"
                }`}
              />
            </button>
          </label>
        ))}
      </div>

      {updatePrefs.isError ? (
        <div className="mt-4">
          <ErrorMessage message={getErrorMessage(updatePrefs.error)} />
        </div>
      ) : null}
      <div className="mt-4 flex items-center gap-2 text-[12px]">
        {updatePrefs.isPending ? <Loader2 size={13} className="animate-spin text-[#1565c0]" /> : null}
        {saved && !updatePrefs.isPending ? <span className="font-medium text-green-600">Preferences saved.</span> : null}
      </div>
    </div>
  );
}
