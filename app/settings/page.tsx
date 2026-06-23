"use client";

import {
  Anchor,
  CreditCard,
  Download,
  Headphones,
  History,
  LogOut,
  MapPin,
  Plus,
  Settings,
  Shield,
  User,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { useReveal } from "@/hooks/useReveal";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Account Settings", icon: User, active: true },
  { label: "Order History", icon: History },
  { label: "Preferences", icon: Settings },
  { label: "Payment Methods", icon: CreditCard },
  { label: "Customer Support", icon: Headphones },
];

export default function SettingsPage() {
  const [twoFactor, setTwoFactor] = useState(true);
  const [metric, setMetric] = useState(true);
  const [notifications, setNotifications] = useState({
    alerts: true,
    marketing: true,
    tracking: false,
  });

  useReveal();

  return (
    <>
      <Header />
      <main className="bg-[#f7f9fd] py-6 md:py-10">
        <div className="mv-container grid gap-6 lg:grid-cols-[160px_1fr_270px]">
          <aside className="reveal-left flex flex-col rounded-[18px] bg-white p-4 shadow-[0_10px_30px_rgba(13,71,161,0.06)]">
            <div className="mb-4 flex flex-col items-start gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#1a2744] text-[12px] font-bold text-white">
                CV
              </div>
              <div>
                <p className="text-[14px] font-bold text-[#1a2744]">Captain Vane</p>
                <p className="text-[11px] text-[#5c7099]">Elite Fleet Member</p>
              </div>
            </div>

            <nav className="space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  className={cn(
                    "flex w-full items-center gap-2 rounded-[10px] px-2.5 py-2.5 text-left text-[12px] font-medium transition",
                    item.active ? "bg-[#edf5ff] text-[#1565c0]" : "text-[#5c7099] hover:bg-[#f7fbff] hover:text-[#1a2744]",
                  )}
                >
                  <item.icon size={14} />
                  {item.label}
                </button>
              ))}
            </nav>

            <div className="mt-auto pt-6">
              <div className="rounded-[14px] bg-gradient-to-br from-[#1565c0] to-[#2196f3] p-4 text-white shadow-[0_12px_26px_rgba(21,101,192,0.22)]">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/75">PRO STATUS</p>
                <p className="mt-2 text-[13px] font-bold">Upgrade Membership</p>
                <button type="button" className="mt-3 w-full rounded-[10px] bg-white py-2 text-[12px] font-semibold text-[#1565c0]">
                  View Plans
                </button>
              </div>
              <button type="button" className="mt-4 flex items-center gap-2 text-[12px] font-medium text-[#5c7099]">
                <LogOut size={14} />
                Log Out
              </button>
            </div>
          </aside>

          <section className="space-y-5">
            <div className="reveal flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="text-[40px] font-extrabold leading-none text-[#1565c0]">Command Center</h1>
                <p className="mt-2 text-[14px] text-[#5c7099]">Manage your vessel fleet and personal preferences.</p>
              </div>
              <div className="flex gap-2">
                <button type="button" className="inline-flex items-center gap-1.5 rounded-[10px] border border-[#d6e4f7] px-4 py-2 text-[12px] font-semibold text-[#1a2744]">
                  <Download size={14} />
                  Download Logbook
                </button>
                <button type="button" className="rounded-[10px] bg-[#1565c0] px-4 py-2 text-[12px] font-semibold text-white">
                  Save All Changes
                </button>
              </div>
            </div>

            <div className="reveal rounded-[18px] bg-white p-6 shadow-[0_10px_30px_rgba(13,71,161,0.06)]">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-[20px] font-bold text-[#1a2744]">Public Profile</h2>
                <span className="rounded-full bg-[#eafaf0] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#16a34a]">
                  Verified Captain
                </span>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-[10px] font-bold uppercase tracking-[0.14em] text-[#93a4c1]">Full Name</label>
                  <input defaultValue="Julian Vane" className="mv-input" />
                </div>
                <div>
                  <label className="mb-1 block text-[10px] font-bold uppercase tracking-[0.14em] text-[#93a4c1]">Email Address</label>
                  <input defaultValue="j.vane@vesselcommand.com" className="mv-input" />
                </div>
              </div>
              <div className="mt-4">
                <label className="mb-1 block text-[10px] font-bold uppercase tracking-[0.14em] text-[#93a4c1]">Primary Mooring Location</label>
                <div className="relative">
                  <MapPin size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9db0ce]" />
                  <input defaultValue="Pier 42, Port of Monaco" className="mv-input pl-10" />
                </div>
              </div>
              <div className="mt-4">
                <label className="mb-1 block text-[10px] font-bold uppercase tracking-[0.14em] text-[#93a4c1]">Bio / Credentials</label>
                <textarea
                  rows={4}
                  defaultValue="Professional mariner with 15 years of offshore experience. Specialized in dual-engine maintenance and deep-sea navigation."
                  className="mv-input resize-none"
                />
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="reveal-left rounded-[18px] bg-white p-6 shadow-[0_10px_30px_rgba(13,71,161,0.06)]">
                <div className="mb-4 flex items-center gap-2">
                  <Shield size={16} className="text-[#1565c0]" />
                  <h2 className="text-[18px] font-bold text-[#1a2744]">Security</h2>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[13px] font-semibold text-[#1a2744]">Two-Factor Auth</p>
                    <p className="text-[11px] text-[#5c7099]">Advanced verification enabled</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setTwoFactor((v) => !v)}
                    className={cn("relative h-6 w-11 rounded-full transition", twoFactor ? "bg-[#2196f3]" : "bg-[#d6e4f7]")}
                  >
                    <span className={cn("absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition", twoFactor ? "left-[22px]" : "left-0.5")} />
                  </button>
                </div>
                <button type="button" className="mt-5 rounded-[10px] border border-[#d6e4f7] px-4 py-2 text-[12px] font-semibold text-[#1565c0]">
                  Update Password
                </button>
              </div>

              <div className="reveal-right rounded-[18px] bg-white p-6 shadow-[0_10px_30px_rgba(13,71,161,0.06)]">
                <div className="mb-4 flex items-center gap-2">
                  <Settings size={16} className="text-[#1565c0]" />
                  <h2 className="text-[18px] font-bold text-[#1a2744]">Regional</h2>
                </div>
                <div>
                  <label className="mb-1 block text-[10px] font-bold uppercase tracking-[0.14em] text-[#93a4c1]">Language</label>
                  <select className="mv-input">
                    <option>English (International)</option>
                  </select>
                </div>
                <div className="mt-4">
                  <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.14em] text-[#93a4c1]">Measurement System</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setMetric(true)}
                      className={cn("rounded-[10px] px-4 py-2 text-[12px] font-semibold", metric ? "bg-[#1565c0] text-white" : "border border-[#d6e4f7] text-[#5c7099]")}
                    >
                      Metric
                    </button>
                    <button
                      type="button"
                      onClick={() => setMetric(false)}
                      className={cn("rounded-[10px] px-4 py-2 text-[12px] font-semibold", !metric ? "bg-[#1565c0] text-white" : "border border-[#d6e4f7] text-[#5c7099]")}
                    >
                      Imperial
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <aside className="space-y-4">
            <div className="reveal-right rounded-[18px] bg-white p-5 shadow-[0_10px_30px_rgba(13,71,161,0.06)]">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-[18px] font-bold text-[#1a2744]">Payments</h3>
                <Plus size={16} className="text-[#94a3b8]" />
              </div>
              {[
                { brand: "VISA", last4: "8829", color: "bg-[#1f3d8b]" },
                { brand: "MC", last4: "4110", color: "bg-[#d62828]" },
              ].map((card) => (
                <div key={card.last4} className="mb-3 flex items-center gap-3 rounded-[12px] border border-[#d6e4f7] p-3">
                  <div className={`flex h-8 w-10 items-center justify-center rounded-md text-[10px] font-bold text-white ${card.color}`}>
                    {card.brand}
                  </div>
                  <div>
                    <p className="text-[12px] font-semibold text-[#1a2744]">•••• {card.last4}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="reveal-right d1 rounded-[18px] bg-white p-5 shadow-[0_10px_30px_rgba(13,71,161,0.06)]">
              <h3 className="mb-4 text-[18px] font-bold text-[#1a2744]">Notifications</h3>
              {[
                ["alerts", "Vessel Alerts", "Critical operational updates in real-time"],
                ["marketing", "Marketing & Events", "Invitations, launches, and private fleet offers"],
                ["tracking", "Order Tracking", "Shipment movement and status change"],
              ].map(([key, label, desc]) => (
                <div key={key} className="mb-4 flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[12px] font-semibold text-[#1a2744]">{label}</p>
                    <p className="text-[10px] text-[#7a8fb7]">{desc}</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications[key as keyof typeof notifications]}
                    onChange={() =>
                      setNotifications((n) => ({ ...n, [key]: !n[key as keyof typeof n] }))
                    }
                    className="mt-1 h-4 w-4 accent-[#1565c0]"
                  />
                </div>
              ))}
            </div>

            <div className="reveal-right d2 rounded-[18px] bg-[#0e1630] p-5 text-white shadow-[0_14px_30px_rgba(13,22,48,0.34)]">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-[18px] font-bold">Vessel Fleet</h3>
                <Anchor size={18} className="text-white/45" />
              </div>
              <div className="space-y-3 text-[12px]">
                {[
                  { name: "SeaQuest 420", status: "Docked", color: "bg-[#22c55e]" },
                  { name: "InterceptorX", status: "Service", color: "bg-[#f59e0b]" },
                ].map((item) => (
                  <div key={item.name} className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span>{item.name}</span>
                    <span className="inline-flex items-center gap-1.5 text-white/85">
                      <span className={`h-2 w-2 rounded-full ${item.color}`} />
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
              <button type="button" className="mt-5 w-full rounded-[10px] border border-white/25 py-2.5 text-[12px] font-semibold text-white">
                Register New Vessel
              </button>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}
