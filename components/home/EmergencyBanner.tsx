import { Check, Phone } from "lucide-react";
import Link from "next/link";
import { emergencyServices } from "@/data/emergency";

export function EmergencyBanner() {
  return (
    <section className="bg-mv-bg py-12 md:py-16" aria-labelledby="emergency-heading">
      <div className="mv-container">
        <div className="overflow-hidden rounded-xl bg-gradient-to-r from-mv-red to-mv-red-dark shadow-lg">
          <div className="grid gap-6 p-7 md:grid-cols-2 md:gap-10 md:p-10">
            <div className="reveal-left">
              <p className="text-[12px] font-semibold uppercase tracking-widest text-white/80">Emergency Service</p>
              <h2 id="emergency-heading" className="mt-2 text-[28px] font-extrabold leading-tight text-white md:text-[34px]">
                Accident? We Come To You.
              </h2>
              <p className="mt-3 max-w-sm text-[13px] leading-relaxed text-white/85">
                24/7 emergency roadside assistance — towing, flat tires, jump starts, and more. Help is one call away.
              </p>
              <Link
                href="tel:+8801322910229"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-[13px] font-bold text-mv-red transition hover:bg-gray-100"
              >
                <Phone size={16} />
                Call Now: +880 1322-910229
              </Link>
            </div>

            <ul className="reveal-right space-y-2.5 self-center rounded-xl bg-black/15 p-5 md:p-6">
              {emergencyServices.map((service) => (
                <li key={service} className="flex items-center gap-3 text-[13px] font-medium text-white">
                  <span className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full bg-white/20">
                    <Check size={12} strokeWidth={3} />
                  </span>
                  {service}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
