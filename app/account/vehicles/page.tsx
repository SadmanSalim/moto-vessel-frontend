"use client";

import { Bike, Car, Loader2, Pencil, Plus, Search, Star, Trash2, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import ErrorMessage from "@/components/ErrorMessage";
import { buildYearRange } from "@/components/NavbarPartsDropdown/types";
import {
  useAddGarageVehicle,
  useDeleteGarageVehicle,
  useGarage,
  useRenameGarageVehicle,
  useSetDefaultGarageVehicle,
} from "@/hooks/useGarage";
import { useVehicleBrands, useVehicleEngines, useVehicleModels } from "@/hooks/useVehicles";
import { getErrorMessage } from "@/lib/api";
import type { GarageVehicle } from "@/types";

function AddVehicleForm({ onCancel, onSaved }: { onCancel: () => void; onSaved: () => void }) {
  const [vehicleType, setVehicleType] = useState<"car" | "bike">("car");
  const [brandId, setBrandId] = useState<number | "">("");
  const [modelId, setModelId] = useState<number | "">("");
  const [engineId, setEngineId] = useState<number | "">("");
  const [year, setYear] = useState("");
  const [nickname, setNickname] = useState("");

  const { data: brands = [], isLoading: brandsLoading } = useVehicleBrands(vehicleType);
  const { data: models = [], isLoading: modelsLoading } = useVehicleModels(brandId || undefined);
  const { data: engines = [], isLoading: enginesLoading } = useVehicleEngines(modelId || undefined);

  const addVehicle = useAddGarageVehicle();

  const selectedEngine = engines.find((e) => e.id === engineId);
  const years = buildYearRange(selectedEngine?.year_from, selectedEngine?.year_to);

  useEffect(() => {
    setModelId("");
    setEngineId("");
    setYear("");
  }, [brandId]);

  useEffect(() => {
    setEngineId("");
    setYear("");
  }, [modelId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandId || !modelId || !engineId || !year) return;
    addVehicle.mutate(
      {
        vehicle_type: vehicleType,
        vehicle_brand_id: Number(brandId),
        vehicle_model_id: Number(modelId),
        vehicle_engine_id: Number(engineId),
        year,
        nickname: nickname || undefined,
      },
      { onSuccess: () => onSaved() },
    );
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-[14px] border border-[#d6e4f7] bg-[#f7fbff] p-4">
      <div className="mb-3 inline-flex rounded-full bg-white p-1">
        <button
          type="button"
          onClick={() => setVehicleType("car")}
          className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-wide transition ${
            vehicleType === "car" ? "bg-[#1a2e6f] text-white" : "text-[#5c7099]"
          }`}
        >
          <Car size={12} />
          Car
        </button>
        <button
          type="button"
          onClick={() => setVehicleType("bike")}
          className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-wide transition ${
            vehicleType === "bike" ? "bg-[#1a2e6f] text-white" : "text-[#5c7099]"
          }`}
        >
          <Bike size={12} />
          Bike
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-[#93a4c1]">Brand</label>
          <select
            className="mv-input"
            value={brandId}
            onChange={(e) => setBrandId(e.target.value ? Number(e.target.value) : "")}
            disabled={brandsLoading}
            required
          >
            <option value="">Select brand</option>
            {brands.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-[#93a4c1]">Model</label>
          <select
            className="mv-input"
            value={modelId}
            onChange={(e) => setModelId(e.target.value ? Number(e.target.value) : "")}
            disabled={!brandId || modelsLoading}
            required
          >
            <option value="">Select model</option>
            {models.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-[#93a4c1]">Engine</label>
          <select
            className="mv-input"
            value={engineId}
            onChange={(e) => setEngineId(e.target.value ? Number(e.target.value) : "")}
            disabled={!modelId || enginesLoading}
            required
          >
            <option value="">Select engine</option>
            {engines.map((eng) => (
              <option key={eng.id} value={eng.id}>
                {eng.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-[#93a4c1]">Year</label>
          <select className="mv-input" value={year} onChange={(e) => setYear(e.target.value)} disabled={!engineId} required>
            <option value="">Select year</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-[#93a4c1]">Nickname (optional)</label>
          <input
            className="mv-input"
            placeholder="e.g. My Daily Driver"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
        </div>
      </div>

      {addVehicle.isError ? (
        <div className="mt-3">
          <ErrorMessage message={getErrorMessage(addVehicle.error)} />
        </div>
      ) : null}

      <div className="mt-4 flex gap-2">
        <button
          type="submit"
          disabled={addVehicle.isPending}
          className="inline-flex items-center gap-2 rounded-[10px] bg-[#1565c0] px-5 py-2 text-[12px] font-bold text-white transition hover:bg-[#0d4ba0] disabled:opacity-60"
        >
          {addVehicle.isPending ? <Loader2 size={14} className="animate-spin" /> : null}
          Save Vehicle
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-[10px] border border-[#d6e4f7] px-5 py-2 text-[12px] font-semibold text-[#5c7099] transition hover:bg-white"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function VehicleCard({ vehicle }: { vehicle: GarageVehicle }) {
  const [renaming, setRenaming] = useState(false);
  const [nickname, setNickname] = useState(vehicle.nickname ?? "");
  const rename = useRenameGarageVehicle();
  const remove = useDeleteGarageVehicle();
  const setDefault = useSetDefaultGarageVehicle();

  const title = [vehicle.brand?.name, vehicle.model?.name].filter(Boolean).join(" ");
  const partsParams = new URLSearchParams({
    type: vehicle.vehicle_type,
    brand: vehicle.brand?.name ?? "",
    model: vehicle.model?.name ?? "",
    year: vehicle.year ?? "",
    engine: vehicle.engine?.name ?? "",
  });

  return (
    <div className="rounded-[14px] border border-[#eef2f8] p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#edf5ff] text-[#1565c0]">
            {vehicle.vehicle_type === "bike" ? <Bike size={15} /> : <Car size={15} />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-[13px] font-bold text-[#1a2744]">{vehicle.nickname || title || "My Vehicle"}</p>
              {vehicle.is_default ? (
                <span className="rounded-full bg-[#edf5ff] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-[#1565c0]">
                  Default
                </span>
              ) : null}
            </div>
            <p className="mt-1 text-[12px] text-[#5c7099]">
              {title} · {vehicle.year} · {vehicle.engine?.name}
            </p>

            {renaming ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  rename.mutate({ id: vehicle.id, nickname }, { onSuccess: () => setRenaming(false) });
                }}
                className="mt-2 flex items-center gap-2"
              >
                <input
                  className="mv-input py-1.5 text-[12px]"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="Nickname"
                  autoFocus
                />
                <button type="submit" disabled={rename.isPending} className="text-[11px] font-bold text-[#1565c0]">
                  Save
                </button>
                <button type="button" onClick={() => setRenaming(false)} className="text-[11px] font-semibold text-[#5c7099]">
                  Cancel
                </button>
              </form>
            ) : null}
          </div>
        </div>
        <div className="flex shrink-0 gap-1.5">
          <button
            type="button"
            onClick={() => setRenaming((v) => !v)}
            className="flex h-7 w-7 items-center justify-center rounded-[8px] text-[#5c7099] transition hover:bg-[#f7f9fd] hover:text-[#1565c0]"
            aria-label="Rename"
          >
            <Pencil size={13} />
          </button>
          <button
            type="button"
            onClick={() => remove.mutate(vehicle.id)}
            disabled={remove.isPending}
            className="flex h-7 w-7 items-center justify-center rounded-[8px] text-[#5c7099] transition hover:bg-red-50 hover:text-red-600"
            aria-label="Delete"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-4">
        <Link
          href={`/parts-finder?${partsParams.toString()}`}
          className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#1565c0] hover:underline"
        >
          <Search size={11} />
          Find Parts for this Vehicle
        </Link>
        {!vehicle.is_default ? (
          <button
            type="button"
            onClick={() => setDefault.mutate(vehicle.id)}
            disabled={setDefault.isPending}
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#5c7099] hover:text-[#1565c0]"
          >
            <Star size={11} />
            Set as default
          </button>
        ) : null}
      </div>
    </div>
  );
}

export default function AccountVehiclesPage() {
  const { data, isLoading, isError, error } = useGarage();
  const [showAdd, setShowAdd] = useState(false);

  return (
    <div className="rounded-[18px] bg-white p-6 shadow-[0_10px_30px_rgba(13,71,161,0.06)]">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[15px] font-bold text-[#1a2744]">My Garage</h2>
          <p className="mt-1 text-[12px] text-[#5c7099]">Save your vehicles for faster parts lookup.</p>
        </div>
        {!showAdd ? (
          <button
            type="button"
            onClick={() => setShowAdd(true)}
            className="inline-flex items-center gap-1.5 rounded-[10px] bg-[#1565c0] px-4 py-2 text-[12px] font-bold text-white transition hover:bg-[#0d4ba0]"
          >
            <Plus size={14} />
            Add Vehicle
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setShowAdd(false)}
            className="flex h-8 w-8 items-center justify-center rounded-full text-[#5c7099] hover:bg-[#f7f9fd]"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {showAdd ? (
        <div className="mt-4">
          <AddVehicleForm onCancel={() => setShowAdd(false)} onSaved={() => setShowAdd(false)} />
        </div>
      ) : null}

      {isError ? (
        <div className="mt-4">
          <ErrorMessage message={getErrorMessage(error)} />
        </div>
      ) : null}

      {isLoading ? (
        <div className="mt-8 flex justify-center">
          <Loader2 size={22} className="animate-spin text-[#1565c0]" />
        </div>
      ) : null}

      {!isLoading && !isError && (data?.length ?? 0) === 0 && !showAdd ? (
        <div className="mt-8 text-center">
          <p className="text-[12px] text-[#5c7099]">No vehicles saved yet.</p>
        </div>
      ) : null}

      {!isLoading && (data?.length ?? 0) > 0 ? (
        <div className="mt-4 space-y-3">
          {data!.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      ) : null}
    </div>
  );
}
