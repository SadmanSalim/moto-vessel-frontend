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
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { cn } from "@/lib/utils";

const sidebarLinks = [
  { label: "Account Settings", icon: User, href: "/account/settings", active: true },
  { label: "Order History", icon: History, href: "/account/settings" },
  { label: "Preferences", icon: Settings, href: "/account/settings" },
  { label: "Payment Methods", icon: CreditCard, href: "/account/settings" },
  { label: "Customer Support", icon: Headphones, href: "/contact" },
];

const fleetVessels = [
  { model: "SeaQuest 420", status: "Docked", color: "green" },
  { model: "Interceptor X", status: "Service", color: "orange" },
];

export default function AccountSettingsPage() {
  const [twoFactor, setTwoFactor] = useState(true);
  const [metric, setMetric] = useState(true);
  const [notifications, setNotifications] = useState({ alerts: true, marketing: true, tracking: false });

  return (
    <>
      <Header />
      <main className="bg-mv-bg py-6 md:py-10">
        <div className="mv-container grid gap-6 lg:grid-cols-[minmax(0,240px)_1fr_minmax(0,280px)] lg:gap-8">
          {/* Left sidebar */}
          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <div className="flex items-center gap-3 rounded-xl border border-mv-border bg-white p-4">
              <div className="relative h-12 w-12 overflow-hidden rounded-full bg-mv-blue-light">
                <Image src="/images/placeholders/logo.svg" alt="Captain Vane" fill className="object-cover" />
              </div>
              <div>
                <p className="text-[14px] font-bold text-mv-text">Captain Vane</p>
                <p className="text-[11px] text-mv-muted">Elite Fleet Member</p>
              </div>
            </div>

            <nav className="rounded-xl border border-mv-border bg-white p-2">
              {sidebarLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-[13px] font-medium transition",
                    link.active ? "bg-mv-blue-light text-mv-primary" : "text-mv-muted hover:bg-mv-bg hover:text-mv-text",
                  )}
                >
                  <link.icon size={16} />
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="rounded-xl bg-mv-primary p-4 text-white">
              <p className="text-[11px] font-semibold uppercase tracking-wider opacity-80">Pro Status</p>
              <p className="mt-1 text-[13px] font-bold">Upgrade Membership</p>
              <button type="button" className="mt-3 w-full rounded-lg bg-white py-2 text-[12px] font-bold text-mv-primary">
                View Plans
              </button>
            </div>

            <button type="button" className="flex w-full items-center gap-2 px-2 text-[13px] font-medium text-mv-muted hover:text-mv-red">
              <LogOut size={16} />
              Log Out
            </button>
          </aside>

          {/* Main content */}
          <div>
            <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="text-[26px] font-bold text-mv-primary">Command Center</h1>
                <p className="mt-1 text-[13px] text-mv-muted">Manage your vessel fleet and personal preferences.</p>
              </div>
              <div className="flex gap-2">
                <button type="button" className="flex items-center gap-1.5 rounded-xl border border-mv-primary px-4 py-2 text-[12px] font-semibold text-mv-primary">
                  <Download size={14} />
                  Download Logbook
                </button>
                <button type="button" className="rounded-xl bg-mv-primary px-4 py-2 text-[12px] font-semibold text-white">
                  Save All Changes
                </button>
              </div>
            </div>

            {/* Public Profile */}
            <div className="rounded-xl border border-mv-border bg-white p-6">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-[16px] font-bold text-mv-text">Public Profile</h2>
                <span className="rounded-full bg-green-50 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-green-600">
                  Verified Captain
                </span>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-mv-muted">Full Name</label>
                  <input defaultValue="Julian Vane" className="w-full rounded-xl border border-mv-border px-4 py-2.5 text-[13px] outline-none focus:border-mv-primary" />
                </div>
                <div>
                  <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-mv-muted">Email Address</label>
                  <input defaultValue="j.vane@vesselcommand.com" className="w-full rounded-xl border border-mv-border px-4 py-2.5 text-[13px] outline-none focus:border-mv-primary" />
                </div>
              </div>
              <div className="mt-4">
                <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-mv-muted">Primary Mooring Location</label>
                <div className="relative">
                  <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-mv-muted" />
                  <input defaultValue="Pier 42, Port of Monaco" className="w-full rounded-xl border border-mv-border py-2.5 pl-9 pr-4 text-[13px] outline-none focus:border-mv-primary" />
                </div>
              </div>
              <div className="mt-4">
                <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-mv-muted">Bio / Credentials</label>
                <textarea
                  rows={3}
                  defaultValue="Seasoned maritime captain with 15+ years navigating international waters. Specialized in fleet management and vessel optimization."
                  className="w-full resize-none rounded-xl border border-mv-border px-4 py-2.5 text-[13px] outline-none focus:border-mv-primary"
                />
              </div>
            </div>

            <div className="mt-5 grid gap-5 md:grid-cols-2">
              {/* Security */}
              <div className="rounded-xl border border-mv-border bg-white p-6">
                <div className="mb-4 flex items-center gap-2">
                  <Shield size={18} className="text-mv-primary" />
                  <h2 className="text-[16px] font-bold text-mv-text">Security</h2>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[13px] font-semibold text-mv-text">Two-Factor Auth</p>
                    <p className="text-[11px] text-mv-muted">Extra layer of account protection</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setTwoFactor((v) => !v)}
                    className={cn("relative h-6 w-11 rounded-full transition", twoFactor ? "bg-mv-primary" : "bg-mv-border")}
                    aria-pressed={twoFactor}
                  >
                    <span className={cn("absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition", twoFactor ? "left-[22px]" : "left-0.5")} />
                  </button>
                </div>
                <button type="button" className="mt-4 w-full rounded-xl border border-mv-primary py-2.5 text-[12px] font-semibold text-mv-primary">
                  Update Password
                </button>
              </div>

              {/* Regional */}
              <div className="rounded-xl border border-mv-border bg-white p-6">
                <div className="mb-4 flex items-center gap-2">
                  <Settings size={18} className="text-mv-primary" />
                  <h2 className="text-[16px] font-bold text-mv-text">Regional</h2>
                </div>
                <div>
                  <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-mv-muted">Language</label>
                  <select className="w-full rounded-xl border border-mv-border px-4 py-2.5 text-[13px] outline-none">
                    <option>English International</option>
                  </select>
                </div>
                <div className="mt-4">
                  <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-mv-muted">Measurement System</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setMetric(true)}
                      className={cn("flex-1 rounded-xl py-2 text-[12px] font-semibold", metric ? "bg-mv-primary text-white" : "border border-mv-border text-mv-muted")}
                    >
                      Metric
                    </button>
                    <button
                      type="button"
                      onClick={() => setMetric(false)}
                      className={cn("flex-1 rounded-xl py-2 text-[12px] font-semibold", !metric ? "bg-mv-primary text-white" : "border border-mv-border text-mv-muted")}
                    >
                      Imperial
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right sidebar */}
          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            {/* Payments */}
            <div className="rounded-xl border border-mv-border bg-white p-5">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-[14px] font-bold text-mv-text">Payments</h3>
                <button type="button" className="text-mv-primary" aria-label="Add payment method">
                  <Plus size={18} />
                </button>
              </div>
              {[
                { brand: "VISA", last4: "8829", exp: "08/26" },
                { brand: "MC", last4: "4110", exp: "12/25" },
              ].map((card) => (
                <div key={card.last4} className="mb-2 flex items-center gap-3 rounded-lg border border-mv-border p-3">
                  <CreditCard size={18} className="text-mv-primary" />
                  <div>
                    <p className="text-[12px] font-semibold text-mv-text">{card.brand} ••••{card.last4}</p>
                    <p className="text-[10px] text-mv-muted">Exp {card.exp}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Notifications */}
            <div className="rounded-xl border border-mv-border bg-white p-5">
              <h3 className="mb-4 text-[14px] font-bold text-mv-text">Notifications</h3>
              {[
                { key: "alerts" as const, label: "Vessel Alerts" },
                { key: "marketing" as const, label: "Marketing & Events" },
                { key: "tracking" as const, label: "Order Tracking" },
              ].map((item) => (
                <label key={item.key} className="mb-3 flex cursor-pointer items-center gap-2.5 text-[12px] text-mv-text">
                  <input
                    type="checkbox"
                    checked={notifications[item.key]}
                    onChange={() => setNotifications((n) => ({ ...n, [item.key]: !n[item.key] }))}
                    className="h-4 w-4 rounded accent-mv-primary"
                  />
                  {item.label}
                </label>
              ))}
            </div>

            {/* Vessel Fleet */}
            <div className="rounded-xl bg-mv-navy p-5 text-white">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-[14px] font-bold">Vessel Fleet</h3>
                <Anchor size={18} className="text-white/40" />
              </div>
              <table className="w-full text-[11px]">
                <thead>
                  <tr className="text-white/50">
                    <th className="pb-2 text-left font-medium">Model</th>
                    <th className="pb-2 text-right font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {fleetVessels.map((v) => (
                    <tr key={v.model} className="border-t border-white/10">
                      <td className="py-2 font-medium">{v.model}</td>
                      <td className="py-2 text-right">
                        <span className={cn("inline-flex items-center gap-1", v.color === "green" ? "text-green-400" : "text-orange-400")}>
                          <span className={cn("h-1.5 w-1.5 rounded-full", v.color === "green" ? "bg-green-400" : "bg-orange-400")} />
                          {v.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button type="button" className="mt-4 w-full rounded-lg border border-white/30 py-2 text-[12px] font-semibold text-white transition hover:bg-white/10">
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
