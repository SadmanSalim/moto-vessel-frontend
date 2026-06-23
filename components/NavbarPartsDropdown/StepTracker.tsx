import { Calendar, Car, Check, Cog, Star } from "lucide-react";
import type { FinderStep } from "./types";
import { cn } from "@/lib/utils";

const STEPS: { id: FinderStep; label: string; icon: typeof Star }[] = [
  { id: "brand", label: "Brand", icon: Star },
  { id: "model", label: "Model", icon: Car },
  { id: "year", label: "Year", icon: Calendar },
  { id: "engine", label: "Engine", icon: Cog },
];

const STEP_INDEX: Record<FinderStep, number> = {
  brand: 0,
  model: 1,
  year: 2,
  engine: 3,
};

type StepTrackerProps = {
  step: FinderStep;
};

export function StepTracker({ step }: StepTrackerProps) {
  const currentIndex = STEP_INDEX[step];

  if (step === "brand") {
    return (
      <div className="mx-auto flex w-full max-w-[620px] items-center justify-center rounded-full bg-[#f0f2f7] px-2 py-1.5">
        {STEPS.map((item) => {
          const Icon = item.icon;
          const isActive = item.id === "brand";
          return (
            <div
              key={item.id}
              className={cn(
                "flex flex-1 items-center justify-center gap-1.5 rounded-full px-3 py-2 text-[11px] font-bold uppercase tracking-[0.12em] transition",
                isActive ? "bg-[#1a2e6f] text-white shadow-sm" : "text-[#8b9ab5]",
              )}
            >
              <Icon size={12} className={isActive ? "text-white" : "text-[#a8b4c8]"} />
              {item.label}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center gap-0">
      {STEPS.map((item, index) => {
        const isComplete = index < currentIndex;
        const isCurrent = index === currentIndex;
        const isUpcoming = index > currentIndex;

        return (
          <div key={item.id} className="flex items-center">
            <div className="flex flex-col items-center gap-2">
              <div className="relative flex h-9 w-9 items-center justify-center">
                {isCurrent ? (
                  <span className="parts-finder-step-pulse absolute inset-0 rounded-full bg-[#2563eb]/20" aria-hidden />
                ) : null}
                <span
                  className={cn(
                    "relative z-[1] flex h-8 w-8 items-center justify-center rounded-full text-[12px] font-bold transition",
                    isComplete && "bg-[#2563eb] text-white",
                    isCurrent && "bg-[#2563eb] text-white",
                    isUpcoming && "bg-[#e8edf5] text-[#9aa8be]",
                  )}
                >
                  {isComplete ? <Check size={14} strokeWidth={3} /> : index + 1}
                </span>
              </div>
              <span
                className={cn(
                  "text-[11px] font-semibold",
                  isCurrent || isComplete ? "text-[#1a2e6f]" : "text-[#9aa8be]",
                )}
              >
                {item.label}
              </span>
            </div>
            {index < STEPS.length - 1 ? (
              <div
                className={cn(
                  "mx-3 mb-5 h-0.5 w-16 rounded-full transition sm:w-24",
                  index < currentIndex ? "bg-[#2563eb]" : "bg-[#e2e8f0]",
                )}
                aria-hidden
              />
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
