"use client";

import { Loader2, ShieldCheck } from "lucide-react";
import { useState } from "react";
import ErrorMessage from "@/components/ErrorMessage";
import { getErrorMessage, useChangePassword } from "@/hooks/useAuth";

export default function AccountSecurityPage() {
  const changePassword = useChangePassword();
  const [form, setForm] = useState({ current_password: "", password: "", password_confirmation: "" });
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(false);
    changePassword.mutate(form, {
      onSuccess: () => {
        setSaved(true);
        setForm({ current_password: "", password: "", password_confirmation: "" });
      },
    });
  };

  return (
    <div className="space-y-5">
      <form onSubmit={handleSubmit} className="rounded-[18px] bg-white p-6 shadow-[0_10px_30px_rgba(13,71,161,0.06)]">
        <div className="flex items-center gap-2">
          <ShieldCheck size={16} className="text-[#1565c0]" />
          <h2 className="text-[15px] font-bold text-[#1a2744]">Change Password</h2>
        </div>
        <p className="mt-1 text-[12px] text-[#5c7099]">Use a strong password you don&apos;t use elsewhere.</p>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wide text-[#93a4c1]">Current Password</label>
            <input
              type="password"
              className="mv-input"
              value={form.current_password}
              onChange={(e) => setForm((f) => ({ ...f, current_password: e.target.value }))}
              required
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wide text-[#93a4c1]">New Password</label>
            <input
              type="password"
              className="mv-input"
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              required
              minLength={8}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wide text-[#93a4c1]">Confirm New Password</label>
            <input
              type="password"
              className="mv-input"
              value={form.password_confirmation}
              onChange={(e) => setForm((f) => ({ ...f, password_confirmation: e.target.value }))}
              required
              minLength={8}
            />
          </div>
        </div>

        {changePassword.isError ? (
          <div className="mt-4">
            <ErrorMessage message={getErrorMessage(changePassword.error)} />
          </div>
        ) : null}
        {saved && !changePassword.isPending ? <p className="mt-4 text-[12px] font-medium text-green-600">Password updated.</p> : null}

        <button
          type="submit"
          disabled={changePassword.isPending}
          className="mt-5 inline-flex items-center gap-2 rounded-[10px] bg-[#1565c0] px-6 py-2.5 text-[12px] font-bold text-white transition hover:bg-[#0d4ba0] disabled:opacity-60"
        >
          {changePassword.isPending ? <Loader2 size={14} className="animate-spin" /> : null}
          Update Password
        </button>
      </form>
    </div>
  );
}
