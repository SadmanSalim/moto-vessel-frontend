"use client";

import { Loader2, MapPin, Pencil, Plus, Star, Trash2, X } from "lucide-react";
import { useState } from "react";
import ErrorMessage from "@/components/ErrorMessage";
import {
  useAddresses,
  useCreateAddress,
  useDeleteAddress,
  useSetDefaultAddress,
  useUpdateAddress,
} from "@/hooks/useAddresses";
import { getErrorMessage } from "@/lib/api";
import type { Address } from "@/types";
import type { AddressInput } from "@/services/addressService";

const EMPTY_FORM: AddressInput = {
  label: "",
  recipient_name: "",
  phone: "",
  address_line: "",
  city: "",
  area: "",
  postal_code: "",
};

function AddressForm({
  initial,
  onCancel,
  onSubmit,
  isPending,
  error,
}: {
  initial: AddressInput;
  onCancel: () => void;
  onSubmit: (data: AddressInput) => void;
  isPending: boolean;
  error: unknown;
}) {
  const [form, setForm] = useState<AddressInput>(initial);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(form);
      }}
      className="rounded-[14px] border border-[#d6e4f7] bg-[#f7fbff] p-4"
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-[#93a4c1]">Label</label>
          <input
            className="mv-input"
            placeholder="Home, Office..."
            value={form.label ?? ""}
            onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
          />
        </div>
        <div>
          <label className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-[#93a4c1]">Recipient Name</label>
          <input
            className="mv-input"
            value={form.recipient_name}
            onChange={(e) => setForm((f) => ({ ...f, recipient_name: e.target.value }))}
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-[#93a4c1]">Phone</label>
          <input
            className="mv-input"
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-[#93a4c1]">City</label>
          <input
            className="mv-input"
            value={form.city}
            onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-[#93a4c1]">Area</label>
          <input className="mv-input" value={form.area ?? ""} onChange={(e) => setForm((f) => ({ ...f, area: e.target.value }))} />
        </div>
        <div>
          <label className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-[#93a4c1]">Postal Code</label>
          <input
            className="mv-input"
            value={form.postal_code ?? ""}
            onChange={(e) => setForm((f) => ({ ...f, postal_code: e.target.value }))}
          />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-[#93a4c1]">Address</label>
          <input
            className="mv-input"
            value={form.address_line}
            onChange={(e) => setForm((f) => ({ ...f, address_line: e.target.value }))}
            required
          />
        </div>
      </div>

      {error ? (
        <div className="mt-3">
          <ErrorMessage message={getErrorMessage(error)} />
        </div>
      ) : null}

      <div className="mt-4 flex gap-2">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-2 rounded-[10px] bg-[#1565c0] px-5 py-2 text-[12px] font-bold text-white transition hover:bg-[#0d4ba0] disabled:opacity-60"
        >
          {isPending ? <Loader2 size={14} className="animate-spin" /> : null}
          Save Address
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

function AddressCard({ address }: { address: Address }) {
  const [editing, setEditing] = useState(false);
  const updateAddress = useUpdateAddress();
  const deleteAddress = useDeleteAddress();
  const setDefault = useSetDefaultAddress();

  if (editing) {
    return (
      <AddressForm
        initial={{
          label: address.label ?? "",
          recipient_name: address.recipient_name,
          phone: address.phone,
          address_line: address.address_line,
          city: address.city,
          area: address.area ?? "",
          postal_code: address.postal_code ?? "",
        }}
        isPending={updateAddress.isPending}
        error={updateAddress.error}
        onCancel={() => setEditing(false)}
        onSubmit={(data) => updateAddress.mutate({ id: address.id, data }, { onSuccess: () => setEditing(false) })}
      />
    );
  }

  return (
    <div className="rounded-[14px] border border-[#eef2f8] p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#edf5ff] text-[#1565c0]">
            <MapPin size={14} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-[13px] font-bold text-[#1a2744]">{address.label || "Address"}</p>
              {address.is_default ? (
                <span className="rounded-full bg-[#edf5ff] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-[#1565c0]">
                  Default
                </span>
              ) : null}
            </div>
            <p className="mt-1 text-[12px] font-medium text-[#1a2744]">{address.recipient_name} · {address.phone}</p>
            <p className="mt-0.5 text-[12px] text-[#5c7099]">
              {address.address_line}
              {address.area ? `, ${address.area}` : ""}, {address.city}
              {address.postal_code ? ` ${address.postal_code}` : ""}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 gap-1.5">
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="flex h-7 w-7 items-center justify-center rounded-[8px] text-[#5c7099] transition hover:bg-[#f7f9fd] hover:text-[#1565c0]"
            aria-label="Edit"
          >
            <Pencil size={13} />
          </button>
          <button
            type="button"
            onClick={() => deleteAddress.mutate(address.id)}
            disabled={deleteAddress.isPending}
            className="flex h-7 w-7 items-center justify-center rounded-[8px] text-[#5c7099] transition hover:bg-red-50 hover:text-red-600"
            aria-label="Delete"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>
      {!address.is_default ? (
        <button
          type="button"
          onClick={() => setDefault.mutate(address.id)}
          disabled={setDefault.isPending}
          className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold text-[#1565c0] hover:underline"
        >
          <Star size={11} />
          Set as default
        </button>
      ) : null}
    </div>
  );
}

export default function AccountAddressesPage() {
  const { data, isLoading, isError, error } = useAddresses();
  const createAddress = useCreateAddress();
  const [showAdd, setShowAdd] = useState(false);

  return (
    <div className="rounded-[18px] bg-white p-6 shadow-[0_10px_30px_rgba(13,71,161,0.06)]">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[15px] font-bold text-[#1a2744]">Address Book</h2>
          <p className="mt-1 text-[12px] text-[#5c7099]">Manage your delivery addresses.</p>
        </div>
        {!showAdd ? (
          <button
            type="button"
            onClick={() => setShowAdd(true)}
            className="inline-flex items-center gap-1.5 rounded-[10px] bg-[#1565c0] px-4 py-2 text-[12px] font-bold text-white transition hover:bg-[#0d4ba0]"
          >
            <Plus size={14} />
            Add Address
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
          <AddressForm
            initial={EMPTY_FORM}
            isPending={createAddress.isPending}
            error={createAddress.error}
            onCancel={() => setShowAdd(false)}
            onSubmit={(data) => createAddress.mutate(data, { onSuccess: () => setShowAdd(false) })}
          />
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
          <p className="text-[12px] text-[#5c7099]">No saved addresses yet.</p>
        </div>
      ) : null}

      {!isLoading && (data?.length ?? 0) > 0 ? (
        <div className="mt-4 space-y-3">
          {data!.map((address) => (
            <AddressCard key={address.id} address={address} />
          ))}
        </div>
      ) : null}
    </div>
  );
}
