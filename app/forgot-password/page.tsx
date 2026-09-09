"use client";

import { AtSign, Loader2, MailCheck } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { AuthLeftPanel } from "@/components/AuthLeftPanel";
import ErrorMessage from "@/components/ErrorMessage";
import { getErrorMessage, useForgotPassword } from "@/hooks/useAuth";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const mutation = useForgotPassword();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(email);
  };

  return (
    <div className="bg-[#F8F9FB]">
      <div className="grid lg:min-h-[calc(100vh-140px)] lg:grid-cols-[45%_55%]">
        <AuthLeftPanel />

        <section className="flex items-center justify-center px-6 py-10 md:px-10 lg:py-12">
          <div className="w-full max-w-[460px] rounded-2xl bg-white px-10 py-10 shadow-[0_4px_24px_rgba(0,0,0,0.08)] md:px-12">
            {mutation.isSuccess ? (
              <div className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-50 text-green-600">
                  <MailCheck size={26} />
                </div>
                <h2 className="mt-4 text-[24px] font-bold text-[#111827]">Check your email</h2>
                <p className="mt-2 text-[14px] text-[#6B7280]">
                  If an account exists for <span className="font-semibold">{email}</span>, we&apos;ve sent a link to
                  reset your password.
                </p>
                <Link
                  href="/sign-in"
                  className="mt-7 inline-flex h-12 w-full items-center justify-center rounded-lg bg-[#1A2E6F] text-[14px] font-bold text-white transition hover:bg-[#0d47a1]"
                >
                  Back to Sign In
                </Link>
              </div>
            ) : (
              <>
                <h2 className="text-[28px] font-bold text-[#111827]">Reset Password</h2>
                <p className="mt-2 text-[14px] italic text-[#6B7280]">
                  Enter your account email and we&apos;ll send you a reset link.
                </p>

                {mutation.isError ? (
                  <div className="mt-4">
                    <ErrorMessage message={getErrorMessage(mutation.error)} />
                  </div>
                ) : null}

                <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                  <div>
                    <label htmlFor="email" className="mb-2 block text-[11px] font-bold uppercase tracking-[0.14em] text-[#1565c0]">
                      Email Address
                    </label>
                    <div className="relative">
                      <AtSign size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="mv-input h-12 pl-11"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={mutation.isPending}
                    className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#1A2E6F] text-[14px] font-bold text-white transition hover:bg-[#0d47a1] disabled:opacity-60"
                  >
                    {mutation.isPending ? <Loader2 size={18} className="animate-spin" /> : null}
                    Send Reset Link
                  </button>
                </form>

                <p className="mt-7 text-center text-[13px] text-[#6B7280]">
                  Remembered your password?{" "}
                  <Link href="/sign-in" className="font-bold text-[#2563EB] hover:underline">
                    Sign In
                  </Link>
                </p>
              </>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
