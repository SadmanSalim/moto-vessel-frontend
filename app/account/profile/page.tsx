"use client";

import { Camera, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ErrorMessage from "@/components/ErrorMessage";
import { getErrorMessage, useMe, useUpdateProfile, useUploadAvatar } from "@/hooks/useAuth";
import { useAuthStore } from "@/store/authStore";

export default function AccountProfilePage() {
  const { user: storedUser } = useAuthStore();
  const { data: profile } = useMe();
  const user = profile ?? storedUser;

  const updateProfile = useUpdateProfile();
  const uploadAvatar = useUploadAvatar();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({ name: "", phone: "", address: "", city: "" });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name ?? "",
        phone: user.phone ?? "",
        address: user.address ?? "",
        city: user.city ?? "",
      });
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(false);
    updateProfile.mutate(form, { onSuccess: () => setSaved(true) });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadAvatar.mutate(file);
    e.target.value = "";
  };

  return (
    <div className="space-y-5">
      <div className="rounded-[18px] bg-white p-6 shadow-[0_10px_30px_rgba(13,71,161,0.06)]">
        <h2 className="text-[15px] font-bold text-[#1a2744]">Profile Photo</h2>
        <p className="mt-1 text-[12px] text-[#5c7099]">JPG, PNG or WEBP. Max 4MB.</p>

        <div className="mt-4 flex items-center gap-4">
          <div className="relative">
            {user?.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.avatar} alt="" className="h-16 w-16 rounded-full object-cover" />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#1a2744] text-[16px] font-bold text-white">
                {user?.name?.slice(0, 2).toUpperCase() ?? "MV"}
              </div>
            )}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadAvatar.isPending}
              className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-[#1565c0] text-white shadow disabled:opacity-60"
              aria-label="Change photo"
            >
              {uploadAvatar.isPending ? <Loader2 size={12} className="animate-spin" /> : <Camera size={12} />}
            </button>
            <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={handleAvatarChange} />
          </div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadAvatar.isPending}
            className="rounded-[10px] border border-[#d6e4f7] px-4 py-2 text-[12px] font-semibold text-[#1565c0] transition hover:bg-[#edf5ff] disabled:opacity-60"
          >
            Upload New Photo
          </button>
        </div>

        {uploadAvatar.isError ? (
          <div className="mt-3">
            <ErrorMessage message={getErrorMessage(uploadAvatar.error)} />
          </div>
        ) : null}
      </div>

      <form onSubmit={handleSubmit} className="rounded-[18px] bg-white p-6 shadow-[0_10px_30px_rgba(13,71,161,0.06)]">
        <h2 className="text-[15px] font-bold text-[#1a2744]">Personal Information</h2>
        <p className="mt-1 text-[12px] text-[#5c7099]">Update your name and contact details.</p>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wide text-[#93a4c1]">Full Name</label>
            <input
              className="mv-input"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              required
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wide text-[#93a4c1]">Email</label>
            <input className="mv-input bg-[#f7f9fd] text-[#93a4c1]" value={user?.email ?? ""} disabled />
          </div>
          <div>
            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wide text-[#93a4c1]">Phone</label>
            <input
              className="mv-input"
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wide text-[#93a4c1]">City</label>
            <input
              className="mv-input"
              value={form.city}
              onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wide text-[#93a4c1]">Address</label>
            <input
              className="mv-input"
              value={form.address}
              onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
            />
          </div>
        </div>

        {updateProfile.isError ? (
          <div className="mt-4">
            <ErrorMessage message={getErrorMessage(updateProfile.error)} />
          </div>
        ) : null}
        {saved && !updateProfile.isPending ? <p className="mt-4 text-[12px] font-medium text-green-600">Profile updated.</p> : null}

        <button
          type="submit"
          disabled={updateProfile.isPending}
          className="mt-5 inline-flex items-center gap-2 rounded-[10px] bg-[#1565c0] px-6 py-2.5 text-[12px] font-bold text-white transition hover:bg-[#0d4ba0] disabled:opacity-60"
        >
          {updateProfile.isPending ? <Loader2 size={14} className="animate-spin" /> : null}
          Save Changes
        </button>
      </form>
    </div>
  );
}
