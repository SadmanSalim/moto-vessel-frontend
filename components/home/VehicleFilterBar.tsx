"use client";

import { ChevronDown } from "lucide-react";

const filters = [
  { id: "make", label: "Make", options: ["Toyota", "Honda", "Ford", "BMW", "Suzuki"] },
  { id: "model", label: "Model", options: ["Camry", "Civic", "F-150", "Hiace", "Corolla"] },
  { id: "year", label: "Year", options: ["2024", "2023", "2022", "2021", "2020"] },
];

export function VehicleFilterBar() {
  return (
    <section className="bg-mv-blue-light py-8 md:py-10" aria-label="Vehicle part search">
      <div className="mv-container">
        <h2 className="mb-5 text-center text-[18px] font-bold text-mv-text md:text-[20px]">
          Find Parts for Your Car or Bike
        </h2>
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
                className="h-full w-full appearance-none rounded-xl border border-mv-border bg-white px-4 py-3 pr-9 text-[13px] font-medium text-mv-text outline-none"
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
            className="shrink-0 rounded-xl bg-mv-primary px-8 py-3 text-[13px] font-bold text-white transition hover:bg-mv-primary-dark"
          >
            Find Parts
          </button>
        </form>
      </div>
    </section>
  );
}
