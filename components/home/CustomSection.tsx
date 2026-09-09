import Image from "next/image";
import Link from "next/link";
import type { CmsHomepageSection } from "@/services/cmsService";

/**
 * Generic renderer for admin-added homepage sections (Filament > Content
 * Management > Homepage Sections > New). Since custom sections aren't tied
 * to a specific frontend component, all their content lives in `extra_data`.
 */
export function CustomSection({ section }: { section: CmsHomepageSection }) {
  const { title, subtitle } = section;
  const extra = section.extra_data ?? {};
  const layout = extra.layout ?? "text-image";

  if (layout === "full-banner") {
    return (
      <section className="reveal mv-container py-10">
        <div className="relative overflow-hidden rounded-2xl bg-mv-navy px-8 py-12 text-center text-white">
          {extra.image_path ? (
            <Image
              src={extra.image_path}
              alt={title ?? ""}
              fill
              className="absolute inset-0 h-full w-full object-cover opacity-30"
            />
          ) : null}
          <div className="relative z-10">
            {title ? <h2 className="text-[24px] font-bold md:text-[30px]">{title}</h2> : null}
            {subtitle ? <p className="mt-2 text-[14px] text-white/80">{subtitle}</p> : null}
            {extra.body ? (
              <div className="prose prose-invert mx-auto mt-4 max-w-2xl text-[13px]" dangerouslySetInnerHTML={{ __html: extra.body }} />
            ) : null}
            {extra.button_text && extra.button_link ? (
              <Link href={extra.button_link} className="mv-btn-primary mt-6 inline-flex">
                {extra.button_text}
              </Link>
            ) : null}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="reveal mv-container py-10">
      <div className={`grid gap-8 ${layout === "text-image" && extra.image_path ? "md:grid-cols-2" : ""} items-center`}>
        <div>
          {title ? <h2 className="section-title">{title}</h2> : null}
          {subtitle ? <p className="mt-2 text-[14px] text-mv-muted">{subtitle}</p> : null}
          {extra.body ? (
            <div className="prose mt-4 max-w-none text-[13px] text-mv-text" dangerouslySetInnerHTML={{ __html: extra.body }} />
          ) : null}
          {extra.button_text && extra.button_link ? (
            <Link href={extra.button_link} className="mv-btn-primary mt-6 inline-flex">
              {extra.button_text}
            </Link>
          ) : null}
        </div>
        {layout === "text-image" && extra.image_path ? (
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-mv-bg">
            <Image src={extra.image_path} alt={title ?? ""} fill className="object-cover" />
          </div>
        ) : null}
      </div>
    </section>
  );
}
