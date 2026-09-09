"use client";

import { AtSign, Eye, EyeOff, Lock, Loader2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { AuthLeftPanel } from "@/components/AuthLeftPanel";
import ErrorMessage from "@/components/ErrorMessage";
import { getErrorMessage, useLogin } from "@/hooks/useAuth";

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1").replace(/\/$/, "");

function oauthUrl(provider: "google" | "facebook") {
  return `${API_BASE}/auth/${provider}/redirect`;
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="#1877F2" aria-hidden>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function SignInContent() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [oauthToast, setOauthToast] = useState("");
  const loginMutation = useLogin();
  const searchParams = useSearchParams();

  useEffect(() => {
    const error = searchParams.get("oauth_error");
    if (error) setOauthToast(error);
  }, [searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ email, password });
  };

  return (
    <div className="bg-[#F8F9FB]">
      <div className="grid lg:min-h-[calc(100vh-140px)] lg:grid-cols-[45%_55%]">
        <AuthLeftPanel />

        <section className="flex items-center justify-center px-6 py-10 md:px-10 lg:py-12">
          <div className="w-full max-w-[460px] rounded-2xl bg-white px-10 py-10 shadow-[0_4px_24px_rgba(0,0,0,0.08)] md:px-12">
            <h2 className="text-[28px] font-bold text-[#111827]">Welcome Back</h2>
            <p className="mt-2 text-[14px] italic text-[#6B7280]">Experience the pinnacle of automotive engineering.</p>

            {loginMutation.isError ? (
              <div className="mt-4">
                <ErrorMessage message={getErrorMessage(loginMutation.error)} />
              </div>
            ) : null}
            {oauthToast ? (
              <p className="mt-4 rounded-lg bg-blue-50 p-3 text-[13px] text-blue-700">{oauthToast}</p>
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

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label htmlFor="password" className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#1565c0]">
                    Password
                  </label>
                  <Link href="/forgot-password" className="text-[11px] font-medium text-[#2563EB] hover:underline">
                    Forgot Password?
                  </Link>
                </div>
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

              <button
                type="submit"
                disabled={loginMutation.isPending}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#1A2E6F] text-[14px] font-bold text-white transition hover:bg-[#0d47a1] disabled:opacity-60"
              >
                {loginMutation.isPending ? <Loader2 size={18} className="animate-spin" /> : null}
                Sign In to Dashboard
              </button>
            </form>

            <div className="my-7 flex items-center gap-3">
              <div className="h-px flex-1 bg-[#E5E7EB]" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#9CA3AF]">Or Continue With</span>
              <div className="h-px flex-1 bg-[#E5E7EB]" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <a href={oauthUrl("google")} className="flex h-11 items-center justify-center gap-2 rounded-lg border border-[#E5E7EB] bg-white text-[12px] font-semibold text-[#111827] transition hover:bg-[#F9FAFB]">
                <GoogleIcon />
                Google
              </a>
              <a href={oauthUrl("facebook")} className="flex h-11 items-center justify-center gap-2 rounded-lg border border-[#E5E7EB] bg-white text-[12px] font-semibold text-[#111827] transition hover:bg-[#F9FAFB]">
                <FacebookIcon />
                Facebook
              </a>
            </div>

            <p className="mt-7 text-center text-[13px] text-[#6B7280]">
              Don&apos;t have an account?{" "}
              <Link href="/sign-up" className="font-bold text-[#2563EB] hover:underline">
                Create Account
              </Link>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F8F9FB]" />}>
      <SignInContent />
    </Suspense>
  );
}
