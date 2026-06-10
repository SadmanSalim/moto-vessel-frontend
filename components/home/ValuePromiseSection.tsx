import { brandPromises } from "@/data/promises";

export function ValuePromiseSection() {
  return (
    <section className="border-y border-mv-border bg-white py-12 md:py-14" aria-labelledby="promise-heading">
      <div className="mv-container">
        <h2 id="promise-heading" className="section-title text-center">
          The Moto Vessel Promise
        </h2>
        <div className="mt-9 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6 lg:gap-4">
          {brandPromises.map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.id} className="flex flex-col items-center text-center">
                <div className="flex h-[52px] w-[52px] items-center justify-center rounded-full bg-mv-blue-light text-mv-primary shadow-sm">
                  <Icon size={24} strokeWidth={1.5} />
                </div>
                <h3 className="mt-2.5 text-[13px] font-bold text-mv-text">{item.title}</h3>
                <p className="mt-0.5 text-[11px] leading-relaxed text-mv-muted">{item.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
