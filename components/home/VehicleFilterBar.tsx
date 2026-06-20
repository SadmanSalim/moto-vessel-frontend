"use client";

import { ChevronDown } from "lucide-react";

const filters = [
  { id: "make", label: "Select Make", options: ["Toyota", "Honda", "Ford", "BMW", "Suzuki"] },
  { id: "model", label: "Select Model", options: ["Camry", "Civic", "F-150", "Hiace", "Corolla"] },
  { id: "year", label: "Select Year", options: ["2024", "2023", "2022", "2021", "2020"] },
];

export function VehicleFilterBar() {
  return (
    <section className="bg-mv-primary py-6 md:py-8" aria-label="Vehicle part search">
      <div className="mv-container">
        <form
          className="flex flex-col gap-3 sm:flex-row sm:items-stretch"
          onSubmit={(e) => e.preventDefault()}
        >
          {filters.map((filter) => (
            <div key={filter.id} className="relative min-w-0 flex-1">
              <label htmlFor={filter.id} className="sr-only">
                {filter.label}
              </label>
              <select
                id={filter.id}
                className="h-full w-full appearance-none rounded-xl border border-white/20 bg-white px-4 py-3 pr-9 text-[13px] font-medium text-mv-text outline-none"
                defaultValue=""
              >
                <option value="" disabled>
                  {filter.label}
                </option>
                {filter.options.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-mv-muted" size={16} />
            </div>
          ))}
          <button
            type="submit"
            className="shrink-0 rounded-xl bg-white px-8 py-3 text-[13px] font-bold text-mv-primary transition hover:bg-mv-blue-light"
          >
            Find Parts
          </button>
        </form>
      </div>
    </section>
  );
}
