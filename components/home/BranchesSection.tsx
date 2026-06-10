import { branches } from "@/data/branches";
import { cn } from "@/lib/utils";

export function BranchesSection() {
  return (
    <section className="bg-mv-navy pb-12 pt-8 text-white md:pb-16" aria-labelledby="branches-heading">
      <div className="mv-container">
        <p className="text-center text-[11px] font-medium uppercase tracking-[0.2em] text-[#7EB3FF]">
          Find us near you
        </p>
        <h2 id="branches-heading" className="mt-1.5 text-center text-[26px] font-bold">
          Our Branches
        </h2>

        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5 lg:gap-4">
          {branches.map((branch) => (
            <article
              key={branch.id}
              className="group relative overflow-hidden rounded-lg border border-white/15 bg-white/[0.06] p-4"
            >
              <div className="mb-3 inline-flex rounded border border-white/20 bg-white/5 px-2 py-1">
                <span className="text-[8px] font-bold tracking-widest text-white/70">{branch.category}</span>
              </div>
              <h3 className="text-[14px] font-bold text-white">{branch.name}</h3>
              <p className="mt-1 text-[11px] font-medium text-[#7EB3FF]">{branch.subtitle}</p>
              <p className="mt-1.5 text-[10px] text-white/45">{branch.location}</p>
              <div className="mt-3 flex items-center gap-1.5">
                <span
                  className={cn(
                    "h-1.5 w-1.5 rounded-full",
                    branch.status === "open" ? "bg-[#10B981]" : "bg-[#F59E0B]",
                  )}
                />
                <span
                  className={cn(
                    "text-[10px] font-semibold",
                    branch.status === "open" ? "text-[#10B981]" : "text-white/50",
                  )}
                >
                  {branch.status === "open" ? "Open Now" : branch.statusLabel ?? "Coming Soon"}
                </span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#1A56DB] to-transparent opacity-60" />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
