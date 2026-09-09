"use client";

import { ChevronDown, X } from "lucide-react";
import { useState } from "react";
import { createPortal } from "react-dom";
import { VehiclePartsFinderDropdown } from "@/components/NavbarPartsDropdown";
import { useHasMounted } from "@/hooks/useHasMounted";

// Fields are visual only — they open the real Brand → Model → Year → Engine
// finder (same widget as the header's "Search For Vehicle") instead of each
// running its own disconnected dropdown, since a plain 3-field <select> here
// couldn't produce a valid /parts-finder query on its own (that page requires
// a matched engine, not just make/model/year).
const fields = ["Select Make", "Select Model", "Select Year"];

export function VehicleFilterBar() {
  const mounted = useHasMounted();
  const [finderOpen, setFinderOpen] = useState(false);
  const [finderKey, setFinderKey] = useState(0);

  const closeFinder = () => setFinderOpen(false);

  return (
    <section className="bg-mv-primary py-6 md:py-8" aria-label="Vehicle part search">
      <div className="mv-container">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
          {fields.map((label) => (
            <button
              key={label}
              type="button"
              onClick={() => setFinderOpen(true)}
              className="relative min-w-0 flex-1 rounded-xl border border-white/20 bg-white px-4 py-3 pr-9 text-left text-[13px] font-medium text-mv-muted outline-none transition hover:border-mv-primary/30"
            >
              {label}
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-mv-muted" size={16} />
            </button>
          ))}
          <button
            type="button"
            onClick={() => setFinderOpen(true)}
            className="shrink-0 rounded-xl bg-white px-8 py-3 text-[13px] font-bold text-mv-primary transition hover:bg-mv-blue-light"
          >
            Find Parts
          </button>
        </div>
      </div>

      {finderOpen && mounted
        ? createPortal(
            <div
              className="fixed inset-0 z-[1000] overflow-y-auto bg-black/60 px-3 py-6"
              onClick={(e) => {
                if (e.target === e.currentTarget) closeFinder();
              }}
            >
              <div className="relative mx-auto w-full max-w-[560px]">
                <button
                  type="button"
                  onClick={closeFinder}
                  aria-label="Close vehicle finder"
                  className="absolute -right-2 -top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#1a2e6f] shadow-lg"
                >
                  <X size={16} />
                </button>
                <VehiclePartsFinderDropdown
                  key={finderKey}
                  className="!w-full rounded-[16px] border-t"
                  onNavigate={() => {
                    closeFinder();
                    setFinderKey((k) => k + 1);
                  }}
                />
              </div>
            </div>,
            document.body,
          )
        : null}
    </section>
  );
}
