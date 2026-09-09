import { branches as fallbackBranches } from "@/data/branches";
import { useStores } from "@/hooks/useStores";
import { cn } from "@/lib/utils";
import { FooterWave } from "@/components/layout/FooterWave";

export function BranchesSection() {
  const { data: stores } = useStores();

  const branches = stores?.length
    ? stores.map((store) => ({
        id: store.id,
        category: store.branch_type?.toUpperCase() ?? "BRANCH",
        name: store.name,
        subtitle: store.branch_type ?? "Branch",
        location: [store.address, store.city].filter(Boolean).join(", "),
        status: "open" as const,
        statusLabel: undefined as string | undefined,
      }))
    : fallbackBranches;

  return (
    <section className="bg-mv-navy pb-12 pt-0 text-white md:pb-16" aria-labelledby="branches-heading">
      <FooterWave />
      <div className="mv-container pt-4 md:pt-6">
        <p className="text-center text-[11px] font-medium uppercase tracking-[0.22em] text-[#7EB3FF]">
          Find us near you
        </p>
        <h2 id="branches-heading" className="mt-2 text-center text-[26px] font-bold md:text-[32px]">
          Our <span className="text-[#7EB3FF]">Branches</span>
        </h2>

        <div className="mt-8 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] sm:grid sm:snap-none sm:grid-cols-2 sm:overflow-visible sm:pb-0 lg:grid-cols-5 lg:gap-4 [&::-webkit-scrollbar]:hidden">
          {branches.map((branch) => (
            <article
              key={branch.id}
              className="group relative min-w-[200px] shrink-0 snap-start overflow-hidden rounded-xl border border-[#3B6FD4]/40 bg-[#0D3580]/50 p-4 backdrop-blur-sm sm:min-w-0"
            >
              <div className="mb-3 inline-flex rounded border border-white/25 bg-white/[0.06] px-2 py-1">
                <span className="text-[8px] font-bold tracking-[0.15em] text-white/75">{branch.category}</span>
              </div>
              <h3 className="text-[14px] font-bold text-white">{branch.name}</h3>
              <p className="mt-1 text-[11px] font-medium text-[#7EB3FF]">{branch.subtitle}</p>
              <p className="mt-1.5 text-[10px] text-white/50">{branch.location}</p>
              <div className="mt-3 flex items-center gap-1.5">
                <span
                  className={cn(
                    "h-1.5 w-1.5 rounded-full",
                    branch.status === "open" ? "bg-[#10B981]" : "bg-[#94A3B8]",
                  )}
                />
                <span
                  className={cn(
                    "text-[10px] font-semibold",
                    branch.status === "open" ? "text-[#10B981]" : "text-white/55",
                  )}
                >
                  {branch.status === "open" ? "Open Now" : branch.statusLabel ?? "Coming Soon"}
                </span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#3B82F6] to-transparent opacity-70" />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
