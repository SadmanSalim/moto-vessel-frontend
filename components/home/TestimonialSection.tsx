import Image from "next/image";
import { Star } from "lucide-react";
import { testimonials } from "@/data/testimonials";

export function TestimonialSection() {
  return (
    <section className="bg-mv-bg py-12 md:py-14" aria-labelledby="testimonials-heading">
      <div className="mv-container">
        <h2 id="testimonials-heading" className="section-title reveal text-center">
          Trusted by Enthusiasts
        </h2>

        <div className="mt-8 grid gap-4 md:grid-cols-3 md:gap-5">
          {testimonials.map((item, index) => (
            <article
              key={item.id}
              className={`reveal flex flex-col rounded-[12px] border border-[var(--mv-border)] bg-white p-5 shadow-[0_2px_10px_rgba(26,43,74,0.05)] d${index + 1}`}
            >
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
          ))}
        </div>
      </div>
    </section>
  );
}
