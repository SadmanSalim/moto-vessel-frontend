"use client";

import { CloudUpload, Globe, Mail, MapPin, MessageCircle, Phone, Shield } from "lucide-react";
import Link from "next/link";
import { useReveal } from "@/hooks/useReveal";

const contactMethods = [
  {
    icon: Phone,
    title: "Phone Support",
    desc: "Direct line to our master technicians for immediate assistance.",
    action: "Call Now",
    href: "tel:18006686837",
  },
  {
    icon: Mail,
    title: "Email",
    desc: "Detailed inquiries regarding custom builds and orders.",
    action: "Send Message",
    href: "mailto:concierge@motovessel.com",
  },
  {
    icon: MapPin,
    title: "Visit Store",
    desc: "Experience the precision at one of our premium showrooms.",
    action: "Find Location",
    href: "/store-locator",
  },
  {
    icon: MessageCircle,
    title: "Live Chat",
    desc: "Real-time collaboration with our parts specialist team.",
    action: "Start Chat",
    href: "#",
  },
];

const hubs = [
  {
    name: "Stuttgart Command Center",
    address: "Waiblinger St. 13173 Stuttgart, Germany",
  },
  {
    name: "Los Angeles Studio",
    address: "2020 S Central Ave, Los Angeles, CA 90021",
  },
  {
    name: "Tokyo Precision Lab",
    address: "2-15-7 Yurikamome, Chiyoda-City, Tokyo 100-0006",
  },
];

export default function ContactPage() {
  useReveal();

  return (
    <div className="bg-[#f7f9fd]">
        <section className="relative overflow-hidden py-14 text-center text-white md:py-20">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(180deg, rgba(5,17,39,0.78), rgba(5,17,39,0.82)), url('/images/placeholders/hero.svg')",
              backgroundPosition: "center",
              backgroundSize: "cover",
            }}
            aria-hidden
          />
          <div className="mv-container relative reveal">
            <h1 className="text-[40px] font-extrabold leading-none md:text-[52px]">Get In Touch</h1>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[13px] text-white/85">
              <span className="flex items-center gap-2">
                <Phone size={15} className="text-[#9fd0ff]" />
                1-800-MOTO-VESSEL
              </span>
              <span className="flex items-center gap-2">
                <Mail size={15} className="text-[#9fd0ff]" />
                concierge@motovessel.com
              </span>
            </div>
          </div>
        </section>

        <section className="mv-container -mt-7 pb-10 md:-mt-9 md:pb-14">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {contactMethods.map((method, index) => (
              <article
                key={method.title}
                className={`reveal d${index + 1} rounded-[16px] border border-[#d6e4f7] bg-white p-5 shadow-[0_12px_34px_rgba(13,71,161,0.08)]`}
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-[12px] bg-[#edf5ff] text-[#1565c0]">
                  <method.icon size={20} />
                </div>
                <h3 className="mt-4 text-[16px] font-bold text-[#1a2744]">{method.title}</h3>
                <p className="mt-2 text-[12px] leading-relaxed text-[#5c7099]">{method.desc}</p>
                <Link href={method.href} className="mt-4 inline-block text-[12px] font-semibold text-[#1976d2] hover:underline">
                  {method.action}
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className="mv-container pb-10 md:pb-14">
          <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="reveal-left rounded-[18px] bg-white p-6 shadow-[0_10px_30px_rgba(13,71,161,0.06)]">
              <h2 className="text-[22px] font-bold text-[#1565c0]">Showroom Hours</h2>
              <div className="mt-5 space-y-4">
                {[
                  ["Monday–Friday", "08:00 AM–08:00 PM"],
                  ["Saturday", "09:00 AM–06:00 PM"],
                  ["Sunday", "Closed for Testing"],
                ].map(([day, time]) => (
                  <div key={day} className="flex items-center justify-between border-b border-[#eef3fb] pb-3">
                    <span className="text-[13px] font-semibold text-[#1a2744]">{day}</span>
                    <span className="text-[12px] text-[#5c7099]">{time}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {[
                {
                  icon: Shield,
                  title: "OEM Precision",
                  desc: "Factory-grade components and measurement-perfect engineering for every service workflow.",
                },
                {
                  icon: Globe,
                  title: "Global Express",
                  desc: "Rapid logistics coordination for custom parts and international support routing.",
                },
              ].map((item, index) => (
                <div
                  key={item.title}
                  className={`reveal-right d${index + 1} rounded-[18px] border border-[#d6e4f7] bg-white p-5 shadow-[0_10px_30px_rgba(13,71,161,0.06)]`}
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-[12px] bg-[#edf5ff] text-[#1565c0]">
                    <item.icon size={20} />
                  </div>
                  <h3 className="mt-4 text-[16px] font-bold text-[#1a2744]">{item.title}</h3>
                  <p className="mt-2 text-[12px] leading-relaxed text-[#5c7099]">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mv-container pb-10 md:pb-16">
          <div className="reveal mx-auto max-w-[860px] overflow-hidden rounded-[20px] border border-[#d6e4f7] bg-white shadow-[0_14px_34px_rgba(13,71,161,0.12)]">
            <div className="bg-[#0d47a1] px-6 py-5 text-white">
              <h2 className="text-[22px] font-bold">Request a Precision Quote</h2>
              <p className="mt-1 text-[12px] text-white/75">
                Submit your vehicle details and part requirements for a bespoke pricing offer.
              </p>
            </div>
            <form className="space-y-5 p-6 md:p-8" onSubmit={(e) => e.preventDefault()}>
              <div>
                <p className="mb-3 text-[12px] font-bold text-[#1a2744]">Step 1 Personal Information</p>
                <div className="grid gap-3 md:grid-cols-2">
                  <input className="mv-input" placeholder="Full Name" />
                  <input className="mv-input" placeholder="Email Address" />
                </div>
              </div>
              <div>
                <p className="mb-3 text-[12px] font-bold text-[#1a2744]">Step 2 Vehicle Identification</p>
                <div className="grid gap-3 md:grid-cols-3">
                  <select className="mv-input">
                    <option>Year</option>
                    <option>2026</option>
                    <option>2025</option>
                  </select>
                  <input className="mv-input" placeholder="Make" />
                  <input className="mv-input" placeholder="Model" />
                </div>
              </div>
              <div>
                <p className="mb-3 text-[12px] font-bold text-[#1a2744]">Step 3 Part Requirements</p>
                <textarea rows={4} className="mv-input resize-none" placeholder="Part Description" />
                <div className="mt-3 flex min-h-[130px] flex-col items-center justify-center rounded-[14px] border-2 border-dashed border-[#d6e4f7] bg-[#f7fbff] text-center">
                  <CloudUpload size={28} className="text-[#7da1d3]" />
                  <p className="mt-3 text-[12px] font-medium text-[#5c7099]">Drag &amp; drop engineering files here</p>
                  <p className="mt-1 text-[11px] text-[#7e90b2]">or browse from your device</p>
                </div>
              </div>
              <button className="w-full rounded-[12px] bg-[#1565c0] py-3 text-[13px] font-bold text-white transition hover:bg-[#0d47a1]">
                Generate Precision Quote
              </button>
            </form>
          </div>
        </section>

        <section className="bg-white py-12 md:py-16">
          <div className="mv-container">
            <h2 className="reveal text-center text-[28px] font-bold text-[#1a2744]">Global Flagship Hubs</h2>
            <div className="mt-8 grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="reveal-left rounded-[20px] border border-[#d6e4f7] bg-white p-6 shadow-[0_10px_32px_rgba(13,71,161,0.08)]">
                <svg viewBox="0 0 420 420" className="mx-auto h-[320px] w-full max-w-[360px]" aria-label="Bangladesh map">
                  <path
                    d="M83 184c15-43 40-90 82-113 29-17 69-17 108 1 41 19 70 54 81 93 10 39 7 79-14 109-16 24-42 36-63 59-30 33-34 63-64 67-30 4-45-28-70-51-20-18-49-28-68-53-22-28-19-73 8-112Z"
                    fill="#9bd58a"
                  />
                  <circle cx="170" cy="178" r="11" fill="#1d4ed8" />
                  <circle cx="250" cy="214" r="11" fill="#ef4444" />
                  <circle cx="218" cy="125" r="11" fill="#fbbf24" />
                  <circle cx="126" cy="242" r="11" fill="#0f766e" />
                  <text x="210" y="377" textAnchor="middle" className="fill-[#0f5132] text-[24px] font-extrabold">
                    SAFE WORK
                  </text>
                </svg>
              </div>

              <div className="space-y-4">
                {hubs.map((hub, index) => (
                  <article
                    key={hub.name}
                    className={`reveal-right d${index + 1} rounded-[16px] border border-[#d6e4f7] bg-white p-5 shadow-[0_10px_28px_rgba(13,71,161,0.06)]`}
                  >
                    <h3 className="text-[15px] font-bold text-[#1a2744]">{hub.name}</h3>
                    <p className="mt-2 text-[12px] leading-relaxed text-[#5c7099]">{hub.address}</p>
                    <Link href="#" className="mt-3 inline-block text-[12px] font-semibold text-[#1976d2] hover:underline">
                      Get Directions ↗
                    </Link>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>
    </div>
  );
}
