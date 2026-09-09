"use client";

import { CheckCircle2, Loader2, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import ErrorMessage from "@/components/ErrorMessage";
import { useCmsServices, useCmsSettings } from "@/hooks/useCms";
import { useReveal } from "@/hooks/useReveal";
import { getErrorMessage } from "@/lib/api";
import { formatPrice } from "@/lib/mapProduct";
import { consultancyService } from "@/services/consultancyService";
import { serviceBookingService } from "@/services/serviceBookingService";
import type { CmsService } from "@/services/cmsService";

const fallbackServiceCards = [
  { id: -1, title: "Engine Oil Change", description: "Premium diagnostics, authentic components, and master technician care for precision road-readiness.", price: null },
  { id: -2, title: "Car Paint", description: "Premium diagnostics, authentic components, and master technician care for precision road-readiness.", price: null },
  { id: -3, title: "Cleaning", description: "Premium diagnostics, authentic components, and master technician care for precision road-readiness.", price: null },
  { id: -4, title: "Repair", description: "Premium diagnostics, authentic components, and master technician care for precision road-readiness.", price: null },
].map((card, index) => ({
  ...card,
  image_url: index % 2 === 0 ? "/images/placeholders/product.svg" : "/images/placeholders/hero.svg",
}));

/** Modal form that books whichever service card was clicked. */
function BookServiceModal({ service, onClose }: { service: CmsService; onClose: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [description, setDescription] = useState("");
  const [success, setSuccess] = useState(false);

  const bookService = useMutation({
    mutationFn: () =>
      serviceBookingService.book(service.id, {
        name,
        email,
        phone,
        description: description || undefined,
      }),
    onSuccess: () => setSuccess(true),
  });

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="book-service-heading"
    >
      <div
        className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between bg-[#0d47a1] px-6 py-5 text-white">
          <div>
            <h2 id="book-service-heading" className="text-[18px] font-bold">
              Book {service.title}
            </h2>
            {service.price != null ? (
              <p className="mt-1 text-[13px] text-white/80">{formatPrice(service.price)}</p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="shrink-0 rounded-full p-1 text-white/80 transition hover:bg-white/15 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6">
          {success ? (
            <div className="text-center">
              <CheckCircle2 size={40} className="mx-auto text-green-600" />
              <p className="mt-3 text-[14px] font-semibold text-mv-text">Booking request sent.</p>
              <p className="mt-1 text-[13px] text-mv-muted">Our team will contact you shortly to confirm.</p>
              <button
                type="button"
                onClick={onClose}
                className="mt-5 w-full rounded-[12px] bg-mv-primary py-2.5 text-[13px] font-bold text-white transition hover:bg-mv-primary-dark"
              >
                Close
              </button>
            </div>
          ) : (
            <form
              className="space-y-3.5"
              onSubmit={(e) => {
                e.preventDefault();
                bookService.mutate();
              }}
            >
              {bookService.isError ? <ErrorMessage message={getErrorMessage(bookService.error)} /> : null}
              <input
                className="mv-input"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <input
                className="mv-input"
                placeholder="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                className="mv-input"
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
              <textarea
                rows={4}
                className="mv-input resize-none"
                placeholder="Describe what you need (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <button
                type="submit"
                disabled={bookService.isPending}
                className="flex w-full items-center justify-center gap-2 rounded-[12px] bg-[#1565c0] py-3 text-[13px] font-bold text-white transition hover:bg-[#0d47a1] disabled:opacity-60"
              >
                {bookService.isPending ? <Loader2 size={16} className="animate-spin" /> : null}
                Book This Service
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ServicePage() {
  useReveal();

  const { data: settings } = useCmsSettings();
  const { data: apiServices, isLoading: servicesLoading } = useCmsServices();

  const heroTitle = settings?.service_hero_title || "Keep Your Vehicle Safe & Road-Ready with Expert Care.";
  const heroStatValue = settings?.service_hero_stat_value || "1,78,000+";
  const heroStatLabel = settings?.service_hero_stat_label || "Services delivered";
  const heroBullets = [
    settings?.service_hero_bullet_1 || "Best technicians network",
    settings?.service_hero_bullet_2 || "Affordable & Transparent Service Pricing",
    settings?.service_hero_bullet_3 || "Digital process, customer support",
  ];
  const introTitle = settings?.service_intro_title || "Select Service";
  const introSubtitle =
    settings?.service_intro_subtitle ||
    "Discover precision-crafted care packages built for performance, protection, and everyday reliability.";

  // Only fall back to the generic sample cards once loading has actually
  // finished and the CMS genuinely has no services configured — never while
  // still loading, so real service names/prices don't get replaced by
  // placeholder text after the fact.
  const serviceCards: Array<Pick<CmsService, "id" | "title" | "description" | "price"> & { image_url: string }> =
    apiServices?.length
      ? apiServices.map((s) => ({
          id: s.id,
          title: s.title,
          description: s.description || "",
          price: s.price,
          image_url: s.image_url || "/images/placeholders/product.svg",
        }))
      : servicesLoading
        ? []
        : fallbackServiceCards;

  const [selectedService, setSelectedService] = useState<CmsService | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const submitConsultancy = useMutation({
    mutationFn: () =>
      consultancyService.submit({
        name,
        phone: phone || "N/A",
        email: email || undefined,
        message: message || undefined,
      }),
    onSuccess: () => {
      setSuccess(true);
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
    },
  });

  return (
    <div className="bg-white">
        <section className="relative overflow-hidden bg-[#06142b]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(90deg, rgba(3,12,27,0.84) 0%, rgba(3,12,27,0.72) 40%, rgba(3,12,27,0.55) 100%), url('/images/placeholders/hero.svg')",
              backgroundPosition: "center",
              backgroundSize: "cover",
            }}
            aria-hidden
          />
          <div className="mv-container relative grid gap-10 py-12 md:py-16 lg:grid-cols-[1.1fr_320px] lg:items-center">
            <div className="max-w-[600px] reveal-left text-white">
              <div className="mb-3">
                <Image src="/images/logo.png" alt="MotoVessel" width={120} height={36} className="h-auto w-[96px]" />
              </div>
              <h1 className="max-w-[500px] text-[34px] font-extrabold leading-[1.1] md:text-[44px]">
                {heroTitle}
              </h1>
              <ul className="mt-5 space-y-3 text-[13px] text-white/88">
                {heroBullets.map((item) => (
                  <li key={item} className="flex items-center gap-2.5">
                    <CheckCircle2 size={16} className="shrink-0 text-[#8fc5ff]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="reveal-right justify-self-start rounded-2xl border border-white/15 bg-white/8 p-5 text-white shadow-[0_22px_50px_rgba(0,0,0,0.28)] backdrop-blur-sm lg:justify-self-end">
              <p className="text-[12px] text-white/65">Road-tested confidence</p>
              <p className="mt-2 text-[26px] font-extrabold">{heroStatValue} {heroStatLabel}</p>
              <button
                type="button"
                className="mt-5 inline-flex items-center rounded-[10px] bg-[#1565c0] px-6 py-3 text-[13px] font-bold text-white shadow-[0_10px_24px_rgba(21,101,192,0.34)] transition hover:-translate-y-0.5 hover:bg-[#0d47a1]"
              >
                Order Now
              </button>
            </div>
          </div>
        </section>

        <section className="bg-white py-10 md:py-14">
          <div className="mv-container">
            <div className="reveal text-center">
              <h2 className="text-[28px] font-bold text-[#1a2744]">{introTitle}</h2>
              <p className="mx-auto mt-2 max-w-[540px] text-[13px] leading-relaxed text-[#5c7099]">
                {introSubtitle}
              </p>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {serviceCards.map((service, index) => (
                <button
                  key={`${service.id}-${index}`}
                  type="button"
                  onClick={() => service.id > 0 && setSelectedService(service as CmsService)}
                  className={`reveal d${(index % 6) + 1} group grid grid-cols-[1fr_110px] items-center gap-4 rounded-[12px] border border-[#d6e4f7] bg-white p-5 text-left shadow-[0_10px_28px_rgba(13,71,161,0.06)] transition hover:-translate-y-[2px] hover:border-[#1565c0]/40 hover:shadow-[0_14px_32px_rgba(13,71,161,0.12)]`}
                >
                  <div>
                    <h3 className="text-[16px] font-bold text-[#1a2744]">{service.title}</h3>
                    <p className="mt-2 text-[12px] leading-relaxed text-[#5c7099]">{service.description}</p>
                    {service.price != null ? (
                      <p className="mt-2 text-[14px] font-bold text-[#1565c0]">{formatPrice(service.price)}</p>
                    ) : null}
                    <span className="mt-3 inline-block text-[12px] font-semibold text-[#1565c0] group-hover:underline">
                      Book Now →
                    </span>
                  </div>
                  <div className="relative h-[92px] overflow-hidden rounded-[10px] border border-[#e9f0fb] bg-[#f6f9ff]">
                    <Image src={service.image_url} alt={service.title} fill className="object-cover opacity-90 transition group-hover:scale-105" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#f6f9ff] py-10 md:py-14">
          <div className="mv-container">
            <div className="reveal mx-auto max-w-[720px] overflow-hidden rounded-[18px] border border-[#d6e4f7] bg-white shadow-[0_14px_34px_rgba(13,71,161,0.1)]">
              <div className="bg-[#0d47a1] px-6 py-5 text-white">
                <h2 className="text-[22px] font-bold">Not Sure Which Service You Need?</h2>
                <p className="mt-1 text-[12px] text-white/75">
                  Tell us about your vehicle and service needs — our team will get back to you shortly.
                </p>
              </div>
              <form
                className="space-y-4 p-6 md:p-8"
                onSubmit={(e) => {
                  e.preventDefault();
                  submitConsultancy.mutate();
                }}
              >
                {success ? (
                  <p className="rounded-lg bg-green-50 p-4 text-[13px] text-green-700">
                    Your request has been submitted. Our team will contact you shortly.
                  </p>
                ) : null}
                {submitConsultancy.isError ? (
                  <ErrorMessage message={getErrorMessage(submitConsultancy.error)} />
                ) : null}
                <div className="grid gap-3 md:grid-cols-2">
                  <input
                    className="mv-input"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                  <input
                    className="mv-input"
                    placeholder="Phone Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
                <input
                  className="mv-input"
                  placeholder="Email Address (optional)"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <textarea
                  rows={4}
                  className="mv-input resize-none"
                  placeholder="Describe your service requirements"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <button
                  type="submit"
                  disabled={submitConsultancy.isPending}
                  className="flex w-full items-center justify-center gap-2 rounded-[12px] bg-[#1565c0] py-3 text-[13px] font-bold text-white transition hover:bg-[#0d47a1] disabled:opacity-60"
                >
                  {submitConsultancy.isPending ? <Loader2 size={16} className="animate-spin" /> : null}
                  Submit Request
                </button>
              </form>
            </div>
          </div>
        </section>

        {selectedService ? (
          <BookServiceModal service={selectedService} onClose={() => setSelectedService(null)} />
        ) : null}
    </div>
  );
}
