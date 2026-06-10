"use client";

import { AtSign, Eye, EyeOff, Lock } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <Header />
      <main className="min-h-[calc(100vh-200px)] bg-mv-bg">
        <div className="grid min-h-[600px] lg:grid-cols-2">
          {/* Left panel */}
          <div className="relative hidden overflow-hidden bg-gradient-to-br from-mv-navy via-mv-primary/80 to-mv-bg p-10 lg:flex lg:flex-col lg:justify-between">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "24px 24px" }} aria-hidden />
            <div className="relative">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-mv-primary">MOTOVESSEL</p>
              <h1 className="mt-6 text-[32px] font-extrabold leading-tight text-mv-navy md:text-[38px]">
                Redefining the <span className="text-mv-primary">Digital Cockpit</span> experience.
              </h1>
              <p className="mt-4 max-w-md text-[14px] leading-relaxed text-mv-muted">
                Access your personalized fleet dashboard, real-time performance telemetry, and exclusive engineering insights.
              </p>
              <div className="mt-10 flex gap-10">
                <div>
                  <p className="text-[22px] font-extrabold text-mv-navy">0.18s</p>
                  <p className="text-[11px] font-medium uppercase tracking-wider text-mv-muted">Latency Response</p>
                </div>
                <div>
                  <p className="text-[22px] font-extrabold text-mv-navy">256-bit</p>
                  <p className="text-[11px] font-medium uppercase tracking-wider text-mv-muted">Encrypted Tunnel</p>
                </div>
              </div>
            </div>
            <p className="relative text-[10px] font-mono uppercase tracking-widest text-mv-muted">Protocol Active</p>
          </div>

          {/* Right panel */}
          <div className="flex items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-[420px] rounded-xl border border-mv-border bg-white p-8 shadow-lg">
              <h2 className="text-[24px] font-bold text-mv-navy">Welcome Back</h2>
              <p className="mt-1 text-[13px] text-mv-muted">Experience the pinnacle of automotive engineering.</p>

              <form className="mt-7 space-y-5" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label htmlFor="email" className="mb-1.5 block text-[12px] font-semibold text-mv-primary">
                    Email Address
                  </label>
                  <div className="relative">
                    <AtSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-mv-muted" />
                    <input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      className="w-full rounded-xl border border-mv-border py-3 pl-10 pr-4 text-[13px] outline-none focus:border-mv-primary"
                    />
                  </div>
                </div>

                <div>
                  <div className="mb-1.5 flex items-center justify-between">
                    <label htmlFor="password" className="text-[12px] font-semibold text-mv-primary">
                      Password
                    </label>
                    <Link href="#" className="text-[11px] font-medium text-mv-primary hover:underline">
                      Forgot Password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-mv-muted" />
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="w-full rounded-xl border border-mv-border py-3 pl-10 pr-10 text-[13px] outline-none focus:border-mv-primary"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-mv-muted"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-mv-primary py-3.5 text-[14px] font-bold text-white transition hover:bg-mv-primary-dark"
                >
                  Sign In to Dashboard
                </button>
              </form>

              <div className="my-6 flex items-center gap-3">
                <div className="h-px flex-1 bg-mv-border" />
                <span className="text-[10px] font-semibold uppercase tracking-widest text-mv-muted">Or Continue With</span>
                <div className="h-px flex-1 bg-mv-border" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button type="button" className="flex items-center justify-center gap-2 rounded-xl border border-mv-border py-2.5 text-[12px] font-semibold text-mv-text transition hover:bg-mv-bg">
                  <span className="text-[16px]">G</span> Google
                </button>
                <button type="button" className="flex items-center justify-center gap-2 rounded-xl border border-mv-border py-2.5 text-[12px] font-semibold text-mv-text transition hover:bg-mv-bg">
                  <span className="text-[16px] text-blue-600">f</span> Facebook
                </button>
              </div>

              <p className="mt-6 text-center text-[13px] text-mv-muted">
                Don&apos;t have an account?{" "}
                <Link href="/sign-in" className="font-semibold text-mv-primary hover:underline">
                  Create Account
                </Link>
              </p>

              <div className="mt-4 flex justify-center gap-4 text-[10px] font-semibold uppercase tracking-wider text-mv-muted">
                <Link href="#" className="hover:text-mv-primary">Privacy</Link>
                <Link href="#" className="hover:text-mv-primary">Terms</Link>
                <Link href="/contact" className="hover:text-mv-primary">Support</Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
