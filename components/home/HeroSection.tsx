"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import ErrorMessage from "@/components/ErrorMessage";
import BannerSkeleton from "@/components/skeletons/BannerSkeleton";
import { useBanners } from "@/hooks/useBanners";
import { getErrorMessage } from "@/lib/api";
import { cn } from "@/lib/utils";
import type { Banner } from "@/types";

const AUTOPLAY_MS = 6000;

const fallbackSlide: Banner = {
  id: 0,
  title: "",
  image_url: "/images/placeholders/hero.svg",
};

export function HeroSection({ initialBanners }: { initialBanners?: Banner[] } = {}) {
  const { data: banners, isLoading, isError, error } = useBanners(initialBanners);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const slides = banners?.length ? banners : [fallbackSlide];
  const hasMultiple = slides.length > 1;

  const goTo = useCallback(
    (index: number) => setActiveIndex((index + slides.length) % slides.length),
    [slides.length],
  );
  const next = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);
  const prev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);

  useEffect(() => {
    if (!hasMultiple || isPaused) return;
    const timer = setInterval(next, AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [hasMultiple, isPaused, next]);

  // Keep the active index valid if the slide count changes (e.g. data refetch).
  useEffect(() => {
    if (activeIndex >= slides.length) setActiveIndex(0);
  }, [activeIndex, slides.length]);

  if (isLoading) {
    return (
      <section className="relative overflow-hidden bg-mv-navy">
        <BannerSkeleton />
      </section>
    );
  }

  if (isError) {
    return (
      <section className="relative overflow-hidden bg-mv-navy py-8">
        <div className="mv-container">
          <ErrorMessage message={getErrorMessage(error)} />
        </div>
      </section>
    );
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 40) {
      if (delta < 0) next();
      else prev();
    }
    touchStartX.current = null;
  };

  return (
    <section
      className="relative w-full overflow-hidden bg-mv-navy"
      aria-roledescription="carousel"
      aria-label="Homepage promotional banners"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="relative h-[280px] w-full sm:h-[360px] md:h-[440px] lg:h-[520px]">
        {slides.map((slide, index) => {
          const isActive = index === activeIndex;
          const hasOverlay = Boolean(slide.title || slide.subtitle || slide.button_text);

          const slideContent = (
            <>
              {slide.video_url ? (
                <video
                  key={slide.video_url}
                  src={slide.video_url}
                  autoPlay
                  loop
                  muted
                  playsInline
                  // LCP is scored off the poster frame for <video>, not the
                  // full file — preload="auto" was forcing a needless
                  // multi-MB eager download that competed with everything
                  // else for bandwidth right at page load. "metadata" is
                  // enough for the poster to paint immediately; playback
                  // then streams in progressively once autoplay kicks in.
                  preload={index === 0 ? "metadata" : "none"}
                  poster={slide.image_url}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element -- full-bleed remote banner served straight from the backend; avoids Next's image-optimizer proxy so it isn't gated on the dev server picking up remotePatterns config changes on restart.
                <img
                  src={slide.image_url}
                  alt={slide.title || "Promotional banner"}
                  loading={index === 0 ? "eager" : "lazy"}
                  fetchPriority={index === 0 ? "high" : "auto"}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              )}
              {hasOverlay ? (
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" aria-hidden />
              ) : null}
              {hasOverlay ? (
                <div className="mv-container absolute inset-x-0 bottom-0 pb-8 md:pb-12">
                  <div className="max-w-[560px]">
                    {slide.title ? (
                      <h1 className="text-[24px] font-extrabold leading-tight text-white sm:text-[32px] lg:text-[40px]">
                        {slide.title}
                      </h1>
                    ) : null}
                    {slide.subtitle ? (
                      <p className="mt-2 text-[13px] leading-relaxed text-white/85 sm:text-[14px]">{slide.subtitle}</p>
                    ) : null}
                    {slide.button_text && slide.button_link ? (
                      <span className="mt-5 inline-flex rounded-full bg-white px-6 py-2.5 text-[13px] font-bold text-mv-primary shadow-md transition group-hover:bg-mv-blue-light">
                        {slide.button_text}
                      </span>
                    ) : null}
                  </div>
                </div>
              ) : null}
            </>
          );

          return (
            <div
              key={slide.id}
              aria-hidden={!isActive}
              className={cn(
                "absolute inset-0 transition-opacity duration-700 ease-in-out",
                isActive ? "opacity-100" : "pointer-events-none opacity-0",
              )}
            >
              {slide.button_link ? (
                <Link href={slide.button_link} className="group relative block h-full w-full" tabIndex={isActive ? 0 : -1}>
                  {slideContent}
                </Link>
              ) : (
                <div className="relative h-full w-full">{slideContent}</div>
              )}
            </div>
          );
        })}

        {hasMultiple ? (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label="Previous banner"
              className="absolute left-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/25 text-white backdrop-blur transition hover:bg-white/40 sm:left-5 sm:h-10 sm:w-10"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next banner"
              className="absolute right-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/25 text-white backdrop-blur transition hover:bg-white/40 sm:right-5 sm:h-10 sm:w-10"
            >
              <ChevronRight size={20} />
            </button>

            <div className="absolute inset-x-0 bottom-3 z-10 flex justify-center gap-2 sm:bottom-4" role="tablist" aria-label="Banner navigation">
              {slides.map((slide, index) => (
                <button
                  key={slide.id}
                  type="button"
                  role="tab"
                  aria-selected={index === activeIndex}
                  aria-label={`Go to banner ${index + 1}`}
                  onClick={() => goTo(index)}
                  className={cn(
                    "h-2 rounded-full transition-all",
                    index === activeIndex ? "w-6 bg-white" : "w-2 bg-white/50 hover:bg-white/75",
                  )}
                />
              ))}
            </div>
          </>
        ) : null}
      </div>
    </section>
  );
}
