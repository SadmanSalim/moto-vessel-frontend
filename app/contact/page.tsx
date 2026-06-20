"use client";

import { Clock, CloudUpload, Globe, Mail, MapPin, MessageCircle, Phone, Shield } from "lucide-react";
import Link from "next/link";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

const contactMethods = [
  { icon: Phone, title: "Phone Support", desc: "Call us for immediate technical assistance.", action: "Call Now", href: "tel:+8801322910229" },
  { icon: Mail, title: "Email", desc: "Send us your inquiry for a detailed response.", action: "Send Message", href: "mailto:contact@motovessel.com" },
  { icon: MapPin, title: "Visit Store", desc: "Come visit our showroom for an in-person shopping.", action: "Find Location", href: "/store-locator" },
  { icon: MessageCircle, title: "Live Chat", desc: "Real-time support for quick questions and help.", action: "Start Chat", href: "#" },
];

const showroomHours = [
  { day: "Monday - Friday", time: "08:00 AM - 08:00 PM" },
  { day: "Saturday", time: "09:00 AM - 06:00 PM" },
  { day: "Sunday", time: "Closed for Testing", closed: true },
];

const flagshipHubs = [
  { name: "Stuttgart Command Center", address: "Mercedesstraße 100, 70372 Stuttgart, Germany" },
  { name: "Los Angeles Studio", address: "1200 S Figueroa St, Los Angeles, CA 90015, USA" },
  { name: "Tokyo Precision Lab", address: "2-11-3 Shibuya, Shibuya City, Tokyo 150-0002, Japan" },
];

export default function ContactPage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="relative bg-mv-navy py-20 text-center text-white md:py-28">
          <div className="absolute inset-0 opacity-40" style={{ backgroundImage: "url('/images/placeholders/hero.svg')", backgroundSize: "cover" }} aria-hidden />
          <div className="absolute inset-0 bg-mv-navy/80" aria-hidden />
          <div className="mv-container relative">
            <h1 className="text-[36px] font-extrabold md:text-[44px]">Get In Touch</h1>
            <div className="mt-6 flex flex-wrap justify-center gap-8">
              <p className="flex items-center gap-2 text-[14px]">
                <Phone size={16} className="text-mv-primary" />
                +88 01322-910229
              </p>
              <p className="flex items-center gap-2 text-[14px]">
                <Mail size={16} className="text-mv-primary" />
                contact@motovessel.com
              </p>
            </div>
          </div>
        </section>

        {/* Contact cards */}
        <section className="mv-container -mt-8 grid gap-4 pb-12 sm:-mt-10 sm:grid-cols-2 lg:grid-cols-4">
          {contactMethods.map((method) => (
            <article key={method.title} className="mv-card mv-card-hover p-6">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-mv-blue-light text-mv-primary">
                <method.icon size={20} />
              </div>
              <h3 className="text-[15px] font-bold text-mv-text">{method.title}</h3>
              <p className="mt-2 text-[12px] leading-relaxed text-mv-muted">{method.desc}</p>
              <Link href={method.href} className="mt-4 inline-block text-[12px] font-semibold text-mv-primary hover:underline">
                {method.action}
              </Link>
            </article>
          ))}
        </section>

        {/* Hours + features */}
        <section className="bg-mv-bg py-12">
          <div className="mv-container grid gap-8 md:grid-cols-2">
            <div>
              <h2 className="text-[18px] font-bold text-mv-primary">Showroom Hours</h2>
              <ul className="mt-4 space-y-3">
                {showroomHours.map((row) => (
                  <li key={row.day} className="flex justify-between border-b border-mv-border pb-3 text-[13px]">
                    <span className="font-medium text-mv-text">{row.day}</span>
                    <span className={row.closed ? "font-semibold text-mv-red" : "text-mv-muted"}>{row.time}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-4">
              {[
                { icon: Shield, title: "OEM Precision", desc: "Every part is meticulously tested for accuracy and performance." },
                { icon: Globe, title: "Global Express", desc: "Fast and reliable shipping across the globe for all your automotive needs." },
              ].map((feat) => (
                <div key={feat.title} className="flex gap-4 rounded-xl border border-mv-border bg-white p-5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-mv-blue-light text-mv-primary">
                    <feat.icon size={20} />
                  </div>
                  <div>
                    <h3 className="text-[14px] font-bold text-mv-text">{feat.title}</h3>
                    <p className="mt-1 text-[12px] text-mv-muted">{feat.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Quote form */}
        <section className="mv-container py-12">
          <div className="overflow-hidden rounded-xl border border-mv-border bg-white shadow-sm">
            <div className="bg-mv-navy px-6 py-5 text-white md:px-8">
              <h2 className="text-[20px] font-bold">Request a Precision Quote</h2>
              <p className="mt-1 text-[13px] text-white/70">Fill out the details below and get a customized quote for your vehicle.</p>
            </div>
            <form className="space-y-6 p-6 md:p-8" onSubmit={(e) => e.preventDefault()}>
              <div>
                <p className="mb-3 text-[13px] font-semibold text-mv-text">Personal Information</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <input type="text" placeholder="Full Name" className="rounded-xl border border-mv-border px-4 py-3 text-[13px] outline-none focus:border-mv-primary" />
                  <input type="email" placeholder="Email Address" className="rounded-xl border border-mv-border px-4 py-3 text-[13px] outline-none focus:border-mv-primary" />
                </div>
              </div>
              <div>
                <p className="mb-3 text-[13px] font-semibold text-mv-text">Vehicle Identification</p>
                <div className="grid gap-3 sm:grid-cols-3">
                  <select className="rounded-xl border border-mv-border px-4 py-3 text-[13px] outline-none">
                    <option>Year</option>
                    <option>2024</option>
                    <option>2023</option>
                  </select>
                  <input type="text" placeholder="Make" className="rounded-xl border border-mv-border px-4 py-3 text-[13px] outline-none focus:border-mv-primary" />
                  <input type="text" placeholder="Model" className="rounded-xl border border-mv-border px-4 py-3 text-[13px] outline-none focus:border-mv-primary" />
                </div>
              </div>
              <div>
                <p className="mb-3 text-[13px] font-semibold text-mv-text">Part Requirements</p>
                <textarea rows={4} placeholder="Part Description" className="w-full resize-none rounded-xl border border-mv-border px-4 py-3 text-[13px] outline-none focus:border-mv-primary" />
                <div className="mt-3 flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-mv-border bg-mv-bg py-10 text-center">
                  <CloudUpload size={32} className="text-mv-muted" />
                  <p className="mt-3 text-[12px] text-mv-muted">Drag &amp; drop files here or click to upload.</p>
                  <p className="mt-1 text-[11px] text-mv-muted">Max file size: 5MB. Formats: JPG, PNG, PDF.</p>
                </div>
              </div>
              <button type="submit" className="w-full rounded-xl bg-mv-navy py-3.5 text-[14px] font-bold text-white transition hover:bg-mv-primary">
                Generate Precision Quote
              </button>
            </form>
          </div>
        </section>

        {/* Global hubs */}
        <section className="bg-white py-12 md:py-16">
          <div className="mv-container">
            <h2 className="text-center text-[24px] font-bold text-mv-text">Global Flagship Hubs</h2>
            <div className="mt-10 grid gap-8 lg:grid-cols-2">
              <div className="flex flex-col items-center">
                <svg viewBox="0 0 400 500" className="h-[300px] w-full max-w-[360px]" aria-label="Bangladesh map">
                  <path d="M200,50 C280,80 320,150 310,220 C300,290 260,350 220,400 C180,450 140,460 120,420 C100,380 110,300 130,240 C150,180 160,100 200,50 Z" fill="#22c55e" opacity="0.7" />
                  <circle cx="200" cy="180" r="8" fill="#1A56DB" />
                  <circle cx="170" cy="260" r="8" fill="#DC2626" />
                  <circle cx="230" cy="320" r="8" fill="#f59e0b" />
                </svg>
                <p className="mt-4 text-[28px] font-extrabold text-mv-text">SAFE WORK</p>
              </div>
              <div className="space-y-4">
                {flagshipHubs.map((hub, i) => (
                  <div key={hub.name} className={`rounded-xl border border-mv-border p-5 ${i > 0 ? "bg-mv-bg" : "bg-white"}`}>
                    <h3 className="text-[15px] font-bold text-mv-text">{hub.name}</h3>
                    <p className="mt-1 text-[12px] text-mv-muted">{hub.address}</p>
                    <Link href="#" className="mt-3 inline-flex items-center gap-1 text-[12px] font-semibold text-mv-primary hover:underline">
                      Get Directions →
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
