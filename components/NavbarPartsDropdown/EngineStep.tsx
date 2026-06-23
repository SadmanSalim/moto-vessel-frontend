import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

type EngineStepProps = {
  selectedBrand: string;
  selectedModel: string;
  selectedYear: string;
  selectedEngine: string | null;
  engines: string[];
  onSelect: (engine: string) => void;
  onBack: () => void;
  onFindParts: () => void;
};

export function EngineStep({
  selectedBrand,
  selectedModel,
  selectedYear,
  selectedEngine,
  engines,
  onSelect,
  onBack,
  onFindParts,
}: EngineStepProps) {
  return (
    <>
      <div className="text-center">
        <h2 className="text-[28px] font-extrabold tracking-tight text-[#1a2e6f]">Select Engine</h2>
        <p className="mt-2 text-[13px] text-[#6b7c95]">
          Step 4: Choose the engine type for your{" "}
          <span className="font-bold text-[#2563eb]">
            {selectedYear} {selectedBrand} {selectedModel}
          </span>
        </p>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {engines.map((engine) => {
          const isSelected = selectedEngine === engine;
          return (
            <button
              key={engine}
              type="button"
              onClick={() => onSelect(engine)}
              className={cn(
                "relative rounded-[12px] border-2 bg-white px-4 py-4 text-left shadow-sm transition hover:-translate-y-0.5",
                isSelected
                  ? "border-[#2563eb] shadow-[0_8px_24px_rgba(37,99,235,0.12)]"
                  : "border-[#e8edf5] hover:border-[#2563eb]/40",
              )}
            >
              {isSelected ? (
                <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-[#2563eb] text-white">
                  <Check size={12} strokeWidth={3} />
                </span>
              ) : null}
              <p className="pr-6 text-[14px] font-bold text-[#1a2e6f]">{engine}</p>
              <p className="mt-1 text-[11px] text-[#6b7c95]">OEM-compatible fitment</p>
            </button>
          );
        })}
      </div>

      <div className="mt-8 flex items-center justify-between border-t border-[#eef2f8] pt-5">
        <button
          type="button"
          onClick={onBack}
          className="text-[13px] font-medium text-[#1a2e6f] transition hover:text-[#2563eb]"
        >
          ← Back to Year
        </button>
        <button
          type="button"
          onClick={onFindParts}
          disabled={!selectedEngine}
          className="rounded-[8px] bg-[#1a2e6f] px-6 py-2.5 text-[13px] font-semibold text-white shadow-[0_8px_20px_rgba(26,46,111,0.2)] transition hover:bg-[#152456] disabled:cursor-not-allowed disabled:opacity-45"
        >
          Find Parts →
        </button>
      </div>
    </>
  );
}
