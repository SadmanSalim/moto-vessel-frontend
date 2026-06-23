import { Check } from "lucide-react";
import Link from "next/link";

const features = [
  "Real-time order tracking",
  "Vehicle fitment lookup",
  "Exclusive app-only deals",
  "Push notifications for restocks",
];

export function MobileAppSection() {
  return (
    <section className="bg-mv-primary py-12 md:py-16" aria-labelledby="app-heading">
      <div className="mv-container grid items-center gap-10 md:grid-cols-2">
        <div className="reveal-left">
          <h2 id="app-heading" className="text-[28px] font-bold text-white md:text-[32px]">
            Order Parts Anywhere
          </h2>
          <p className="mt-3 max-w-md text-[14px] leading-relaxed text-white/80">
            Download the MotoVessel app to browse inventory, track deliveries, and get emergency roadside support on the go.
          </p>
          <ul className="mt-6 space-y-2.5">
            {features.map((feature) => (
              <li key={feature} className="flex items-center gap-2.5 text-[13px] text-white/90">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/20">
                  <Check size={12} className="text-white" strokeWidth={3} />
                </span>
                {feature}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="#"
              className="inline-flex items-center rounded-lg bg-black px-5 py-2.5 text-[11px] font-semibold text-white transition hover:bg-gray-900"
            >
              <span className="mr-2 text-[16px]">&#63743;</span>
              App Store
            </Link>
            <Link
              href="#"
              className="inline-flex items-center rounded-lg bg-black px-5 py-2.5 text-[11px] font-semibold text-white transition hover:bg-gray-900"
            >
              <span className="mr-2 text-[14px]">▶</span>
              Google Play
            </Link>
          </div>
        </div>

        <div className="reveal-right flex items-end justify-center gap-3 md:justify-end">
          {[0.85, 1, 0.9].map((scale, i) => (
            <div
              key={i}
              className={`overflow-hidden rounded-[28px] border-[3px] border-[#1a1a2e] bg-[#1a1a2e] shadow-2xl ${
                i === 1 ? "z-10 -mb-2" : i === 0 ? "hidden sm:block" : "hidden md:block"
              }`}
              style={{ width: `${Math.round(108 * scale)}px`, height: `${Math.round(220 * scale)}px` }}
            >
              <div className="flex h-full flex-col bg-gradient-to-b from-mv-primary to-mv-navy p-2.5">
                <div className="mx-auto mb-2 h-1 w-8 rounded-full bg-white/25" />
                <div className="flex-1 space-y-1.5 rounded-xl bg-white/10 p-2">
                  <div className="h-2 w-full rounded bg-white/25" />
                  <div className="h-2 w-3/4 rounded bg-white/15" />
                  <div className="mt-2 h-14 rounded-lg bg-white/10" />
                  <div className="grid grid-cols-2 gap-1">
                    <div className="h-8 rounded bg-white/15" />
                    <div className="h-8 rounded bg-white/15" />
                  </div>
                  <div className="h-6 rounded-lg bg-mv-primary/60" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
