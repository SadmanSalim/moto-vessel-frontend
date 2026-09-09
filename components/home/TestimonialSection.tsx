"use client";

import Image from "next/image";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import type SwiperCore from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import { useCmsHomepage } from "@/hooks/useCms";
import { testimonials as fallbackTestimonials } from "@/data/testimonials";

export function TestimonialSection() {
  const { data, isLoading } = useCmsHomepage();
  const swiperRef = useRef<SwiperCore | null>(null);

  // Only fall back to the sample reviews once loading has actually
  // finished and the CMS genuinely has none configured — never while still
  // loading, otherwise fake names/quotes flash before the real ones arrive.
  const items = data?.testimonials?.length
    ? data.testimonials.map((t) => ({
        id: t.id,
        name: t.customer_name,
        location: t.customer_title ?? "",
        quote: t.review,
        rating: t.rating,
        avatar: t.avatar || "/images/placeholders/logo.svg",
      }))
    : isLoading
      ? []
      : fallbackTestimonials;

  // Looping needs more real slides than the widest breakpoint shows (3) or
  // Swiper just warns and silently disables it — same slider component
  // renders 1-up on mobile and 3-up on desktop either way.
  const canLoop = items.length > 3;

  return (
    <section className="bg-mv-bg py-12 md:py-14" aria-labelledby="testimonials-heading">
      <div className="mv-container">
        <div className="flex items-center justify-between gap-4">
          <h2 id="testimonials-heading" className="section-title reveal">
            {data?.sections?.find((s) => s.section_key === "testimonials")?.title || "Trusted by Enthusiasts"}
          </h2>

          {items.length > 1 && (
            <div className="reveal hidden shrink-0 gap-2 sm:flex">
              <button
                type="button"
                aria-label="Previous testimonials"
                onClick={() => swiperRef.current?.slidePrev()}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-mv-border bg-white text-mv-text transition hover:border-mv-primary hover:text-mv-primary"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                aria-label="Next testimonials"
                onClick={() => swiperRef.current?.slideNext()}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-mv-border bg-white text-mv-text transition hover:border-mv-primary hover:text-mv-primary"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </div>

        {items.length > 0 && (
          <Swiper
            key={items.length}
            modules={[Navigation, Pagination, Autoplay]}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
            loop={canLoop}
            autoplay={canLoop ? { delay: 4500, disableOnInteraction: false, pauseOnMouseEnter: true } : false}
            pagination={{ clickable: true }}
            spaceBetween={16}
            slidesPerView={1}
            breakpoints={{
              768: { slidesPerView: 2, spaceBetween: 20 },
              1024: { slidesPerView: 3, spaceBetween: 20 },
            }}
            className="reveal !pb-10 !pt-1"
          >
            {items.map((item) => (
              <SwiperSlide key={item.id} className="h-auto">
                <article className="flex h-full flex-col rounded-[12px] border border-[var(--mv-border)] bg-white p-5 shadow-[0_2px_10px_rgba(26,43,74,0.05)]">
                  <div className="mb-3 flex gap-0.5">
                    {Array.from({ length: item.rating }).map((_, i) => (
                      <Star key={`${item.id}-${i}`} size={14} className="fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <blockquote className="flex-1 text-[13px] leading-relaxed text-mv-muted">
                    &ldquo;{item.quote}&rdquo;
                  </blockquote>
                  <footer className="mt-5 flex items-center gap-3 border-t border-[var(--mv-border)] pt-4">
                    <Image
                      src={item.avatar}
                      alt=""
                      width={36}
                      height={36}
                      className="h-9 w-9 rounded-full bg-mv-blue-light object-cover"
                    />
                    <div>
                      <p className="text-[13px] font-bold text-mv-text">{item.name}</p>
                      <p className="text-[11px] text-mv-muted">{item.location}</p>
                    </div>
                  </footer>
                </article>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </section>
  );
}
