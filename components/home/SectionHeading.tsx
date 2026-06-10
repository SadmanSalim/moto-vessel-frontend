type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
};

export function SectionHeading({ eyebrow, title, subtitle }: SectionHeadingProps) {
  return (
    <div className="mb-6 md:mb-8">
      {eyebrow ? <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0077FF]">{eyebrow}</p> : null}
      <h2 className="mt-2 text-2xl font-bold text-[#111827] md:text-3xl">{title}</h2>
      {subtitle ? <p className="mt-2 max-w-2xl text-sm text-[#6B7280] md:text-base">{subtitle}</p> : null}
    </div>
  );
}
