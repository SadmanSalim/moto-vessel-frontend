"use client";

import { Eye, EyeOff, Lock, Loader2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { AuthLeftPanel } from "@/components/AuthLeftPanel";
import ErrorMessage from "@/components/ErrorMessage";
import { getErrorMessage, useResetPassword } from "@/hooks/useAuth";

function PasswordResetForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const email = searchParams.get("email") ?? "";

  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const mutation = useResetPassword();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({
      token,
      email,
      password,
      password_confirmation: passwordConfirmation,
    });
  };

  return (
    <div className="bg-[#F8F9FB]">
      <div className="grid lg:min-h-[calc(100vh-140px)] lg:grid-cols-[45%_55%]">
        <AuthLeftPanel />

        <section className="flex items-center justify-center px-6 py-10 md:px-10 lg:py-12">
          <div className="w-full max-w-[460px] rounded-2xl bg-white px-10 py-10 shadow-[0_4px_24px_rgba(0,0,0,0.08)] md:px-12">
            <h2 className="text-[28px] font-bold text-[#111827]">Set a New Password</h2>
            <p className="mt-2 text-[14px] italic text-[#6B7280]">
              Choose a new password for <span className="font-semibold not-italic">{email || "your account"}</span>.
            </p>

            {!email || !token ? (
              <div className="mt-4">
                <ErrorMessage message="This reset link is missing or incomplete. Please request a new link." />
              </div>
            ) : null}

            {mutation.isError ? (
              <div className="mt-4">
                <ErrorMessage message={getErrorMessage(mutation.error)} />
              </div>
            ) : null}

            <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="password" className="mb-2 block text-[11px] font-bold uppercase tracking-[0.14em] text-[#1565c0]">
                  New Password
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="mv-input h-12 pl-11 pr-11"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9CA3AF]"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="password_confirmation" className="mb-2 block text-[11px] font-bold uppercase tracking-[0.14em] text-[#1565c0]">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                  <input
                    id="password_confirmation"
                    type={showPassword ? "text" : "password"}
                    value={passwordConfirmation}
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                    placeholder="••••••••"
                    className="mv-input h-12 pl-11"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={mutation.isPending || !email || !token}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#1A2E6F] text-[14px] font-bold text-white transition hover:bg-[#0d47a1] disabled:opacity-60"
              >
                {mutation.isPending ? <Loader2 size={18} className="animate-spin" /> : null}
                Reset Password
              </button>
            </form>

            <p className="mt-7 text-center text-[13px] text-[#6B7280]">
              Remembered it after all?{" "}
              <Link href="/sign-in" className="font-bold text-[#2563EB] hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

export default function PasswordResetPage() {
  return (
    <Suspense fallback={null}>
      <PasswordResetForm />
    </Suspense>
  );
}
