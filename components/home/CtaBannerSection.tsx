"use client";

import Image from "next/image";
import Link from "next/link";
import { useCmsHomepage } from "@/hooks/useCms";

export function CtaBannerSection() {
  const { data } = useCmsHomepage();
  const cta = data?.cta_banner;

  if (!cta) return null;

  return (
    <section className="bg-mv-bg py-12 md:py-14" aria-labelledby="cta-banner-heading">
      <div className="mv-container">
        <div
          className="reveal overflow-hidden rounded-xl shadow-lg"
          style={{ backgroundColor: cta.background_color || "#1565C0" }}
        >
          <div className="grid gap-6 p-7 md:grid-cols-2 md:gap-10 md:p-10">
            <div>
              <h2 id="cta-banner-heading" className="text-[28px] font-extrabold leading-tight text-white md:text-[34px]">
                {cta.title}
              </h2>
              {cta.subtitle ? (
                <p className="mt-3 max-w-md text-[13px] leading-relaxed text-white/85">{cta.subtitle}</p>
              ) : null}
              <div className="mt-6 flex flex-wrap gap-3">
                {cta.button_text && cta.button_link ? (
                  <Link
                    href={cta.button_link}
                    className="inline-flex items-center rounded-full bg-white px-7 py-3 text-[13px] font-bold text-[#1565C0] transition hover:bg-gray-100"
                  >
                    {cta.button_text}
                  </Link>
                ) : null}
                {cta.button_two_text && cta.button_two_link ? (
                  <Link
                    href={cta.button_two_link}
                    className="inline-flex items-center rounded-full border border-white/70 px-7 py-3 text-[13px] font-bold text-white transition hover:bg-white/10"
                  >
                    {cta.button_two_text}
                  </Link>
                ) : null}
              </div>
            </div>
            {cta.image ? (
              <div className="relative hidden min-h-[180px] md:block">
                <Image src={cta.image} alt="" fill className="object-contain object-right" />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
