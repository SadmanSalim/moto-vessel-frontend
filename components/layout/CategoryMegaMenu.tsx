"use client";

import { Bike, Car, PackageSearch, ShieldCheck, Truck, BadgeCheck } from "lucide-react";
import Link from "next/link";
import { useCategoryMenu } from "@/hooks/useCatalog";
import { useCmsMegaMenu } from "@/hooks/useCms";
import { resolveCmsIcon } from "@/lib/cmsIcons";

const TRUST_BADGES = [
  { icon: BadgeCheck, label: "Genuine Parts" },
  { icon: ShieldCheck, label: "Secure Checkout" },
  { icon: Truck, label: "Nationwide Delivery" },
];

type CategoryMegaMenuProps = {
  type: "car" | "bike";
};

/**
 * Category mega-menu shown under the "Car Parts" / "Bike Parts" nav items —
 * styled after japanparts.com.bd's "CAR PARTS" dropdown: a grid of category
 * groups (each with a short list of sub-categories) plus a promo panel.
 * Content is 100% admin-managed via Filament > Website Categories
 * (vehicle_type + parent/child), no hardcoded categories here.
 */
export function CategoryMegaMenu({ type }: CategoryMegaMenuProps) {
  const { data: groups = [], isLoading } = useCategoryMenu(type);
  const { data: megaMenu } = useCmsMegaMenu();
  const typeLabel = type === "bike" ? "Bike" : "Car";
  const browseHref = `/products/all?type=${type}`;

  const panel = megaMenu?.[type] ?? {
    badge_text: "Authentic Parts",
    title: "Guaranteed Fitment",
    description: `Every ${typeLabel.toLowerCase()} part is matched to your exact make, model and year.`,
    button_text: `Shop All ${typeLabel} Parts`,
    button_link: browseHref,
  };

  return (
    <div className="parts-finder-dropdown-enter w-[min(960px,calc(100vw-2rem))] overflow-hidden rounded-b-[16px] border border-t-0 border-[#e8edf5] bg-white shadow-[0_8px_32px_rgba(0,0,0,0.12)]">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_260px]">
        <div className="max-h-[70vh] overflow-y-auto p-6">
          <div className="mb-5 flex items-center gap-2 border-b border-[#eef2f8] pb-4">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-mv-blue-light text-mv-primary">
              {type === "bike" ? <Bike size={16} /> : <Car size={16} />}
            </span>
            <h3 className="text-[15px] font-bold text-mv-text">Genuine {typeLabel} Parts</h3>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="animate-pulse space-y-2 rounded-xl border border-transparent p-3">
                  <div className="h-4 w-24 rounded bg-gray-100" />
                  <div className="h-3 w-20 rounded bg-gray-100" />
                  <div className="h-3 w-16 rounded bg-gray-100" />
                </div>
              ))}
            </div>
          ) : groups.length ? (
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              {groups.map((group) => {
                const Icon = resolveCmsIcon(group.icon ?? "");
                return (
                  <div
                    key={group.id}
                    className="group rounded-xl border border-transparent p-3 transition hover:border-mv-primary/25 hover:bg-mv-blue-light/30"
                  >
                    <Link
                      href={`/products/all?category=${group.slug}`}
                      prefetch={false}
                      className="flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-wide text-mv-text group-hover:text-mv-primary"
                    >
                      <Icon size={13} className="text-mv-primary" />
                      {group.name}
                    </Link>
                    {group.children.length ? (
                      <ul className="mt-2 space-y-1.5">
                        {group.children.map((child) => (
                          <li key={child.id}>
                            <Link
                              href={`/products/all?category=${child.slug}`}
                              prefetch={false}
                              className="flex items-center gap-1.5 text-[12px] text-mv-muted transition hover:text-mv-primary"
                            >
                              <span className="h-[5px] w-[5px] shrink-0 rounded-full border border-current" aria-hidden />
                              {child.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-[13px] text-mv-muted">
              {typeLabel} part categories haven&apos;t been added yet — manage them in the admin panel under Website Categories.
            </p>
          )}
        </div>

        <div className="flex flex-col justify-between gap-5 bg-mv-navy p-6 text-white">
          <div>
            {panel.badge_text ? (
              <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white/60">
                <PackageSearch size={12} />
                {panel.badge_text}
              </p>
            ) : null}
            <h4 className="mt-2 text-[16px] font-bold">{panel.title}</h4>
            <p className="mt-1 text-[12px] text-white/70">{panel.description}</p>
          </div>

          <div>
            <Link
              href={panel.button_link || browseHref}
              prefetch={false}
              className="inline-flex w-full items-center justify-center rounded-xl bg-white px-4 py-2.5 text-[12px] font-bold text-mv-navy transition hover:bg-white/90"
            >
              {panel.button_text}
            </Link>

            <ul className="mt-4 space-y-2.5 border-t border-white/10 pt-4">
              {TRUST_BADGES.map(({ icon: BadgeIcon, label }) => (
                <li key={label} className="flex items-center gap-2 text-[11px] font-medium text-white/75">
                  <BadgeIcon size={14} className="shrink-0 text-white/60" />
                  {label}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
