import { cn } from "@/lib/utils";

type YearStepProps = {
  selectedBrand: string;
  selectedModel: string;
  selectedYear: string | null;
  years: string[];
  onSelect: (year: string) => void;
  onBack: () => void;
  onNext: () => void;
};

export function YearStep({
  selectedBrand,
  selectedModel,
  selectedYear,
  years,
  onSelect,
  onBack,
  onNext,
}: YearStepProps) {
  return (
    <>
      <div className="text-center">
        <h2 className="text-[28px] font-extrabold tracking-tight text-[#1a2e6f]">Select Year</h2>
        <p className="mt-2 text-[13px] text-[#6b7c95]">
          Step 3: Choose the manufacturing year for your{" "}
          <span className="font-bold text-[#2563eb]">
            {selectedBrand} {selectedModel}
          </span>
        </p>
      </div>

      <div className="mt-8 max-h-[280px] overflow-y-auto pr-1">
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
          {years.map((year) => {
            const isSelected = selectedYear === year;
            return (
              <button
                key={year}
                type="button"
                onClick={() => onSelect(year)}
                className={cn(
                  "rounded-[12px] border-2 bg-white px-4 py-4 text-[15px] font-bold text-[#1a2e6f] shadow-sm transition hover:-translate-y-0.5",
                  isSelected
                    ? "border-[#2563eb] bg-[#eff6ff] shadow-[0_6px_18px_rgba(37,99,235,0.12)]"
                    : "border-[#e8edf5] hover:border-[#2563eb]/40",
                )}
              >
                {year}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between border-t border-[#eef2f8] pt-5">
        <button
          type="button"
          onClick={onBack}
          className="text-[13px] font-medium text-[#1a2e6f] transition hover:text-[#2563eb]"
        >
          ← Back to Model
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!selectedYear}
          className="rounded-[8px] bg-[#1a2e6f] px-6 py-2.5 text-[13px] font-semibold text-white shadow-[0_8px_20px_rgba(26,46,111,0.2)] transition hover:bg-[#152456] disabled:cursor-not-allowed disabled:opacity-45"
        >
          Next: Select Engine →
        </button>
      </div>
    </>
  );
}
