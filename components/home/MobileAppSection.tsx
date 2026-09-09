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
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href="#" className="inline-block transition hover:opacity-90" aria-label="Download on the App Store">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                alt="Download on the App Store"
                className="h-[42px] w-auto"
              />
            </Link>
            <Link href="#" className="inline-block overflow-hidden rounded-lg transition hover:opacity-90" aria-label="Get it on Google Play">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
                alt="Get it on Google Play"
                className="h-[56px] w-auto"
              />
            </Link>
          </div>
        </div>

        <div className="reveal-right flex items-end justify-center md:justify-end">
          <div className="flex items-end">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/app-promo/phone1-cutout.png"
              alt="MotoVessel app sign-in screen"
              loading="lazy"
              decoding="async"
              className="relative z-0 -mr-9 hidden w-[125px] -rotate-6 translate-y-5 drop-shadow-2xl sm:block md:w-[150px] lg:w-[172px]"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/app-promo/phone2-cutout.png"
              alt="MotoVessel app home screen"
              loading="lazy"
              decoding="async"
              className="relative z-10 w-[160px] drop-shadow-2xl md:w-[190px] lg:w-[220px]"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/app-promo/phone3-cutout.png"
              alt="MotoVessel app vehicle finder screen"
              loading="lazy"
              decoding="async"
              className="relative z-0 -ml-9 hidden w-[125px] rotate-6 translate-y-5 drop-shadow-2xl md:block md:w-[150px] lg:w-[172px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
