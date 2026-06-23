"use client";

import { AtSign, Eye, EyeOff, Lock, User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <main className="min-h-screen bg-white">
      <div className="grid min-h-screen lg:grid-cols-[45%_55%]">
        <section className="relative hidden overflow-hidden bg-[#eef2f7] px-8 py-10 lg:flex lg:flex-col lg:justify-between xl:px-14">
          <div
            className="pointer-events-none absolute inset-0 opacity-70"
            style={{
              backgroundImage:
                "linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(234,240,249,0.92) 45%, rgba(244,247,252,0.95) 100%), repeating-linear-gradient(135deg, transparent, transparent 28px, rgba(21,101,192,0.04) 28px, rgba(21,101,192,0.04) 29px)",
            }}
            aria-hidden
          />
          <div className="relative pt-12">
            <p className="text-[12px] font-extrabold uppercase tracking-[0.18em] text-[#1565c0]">MOTOVESSEL</p>
            <h1 className="mt-8 max-w-[430px] text-[40px] font-extrabold leading-[1.08] text-[#1a2744]">
              Join the MotoVessel <span className="text-[#1976d2]">Fleet</span>.
            </h1>
            <p className="mt-5 max-w-[430px] text-[15px] leading-relaxed text-[#5c7099]">
              Create your account and get access to exclusive parts, expert service, and real-time order tracking.
            </p>
            <div className="mt-12 flex gap-8">
              <div className="rounded-full border border-[#d6e4f7] bg-white/75 px-6 py-4 shadow-sm">
                <p className="text-[28px] font-extrabold text-[#1a2744]">50,000+</p>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#7a8fb7]">Fleet Members</p>
              </div>
              <div className="rounded-full border border-[#d6e4f7] bg-white/75 px-6 py-4 shadow-sm">
                <p className="text-[28px] font-extrabold text-[#1a2744]">100%</p>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#7a8fb7]">Secure Signup</p>
              </div>
            </div>
          </div>
          <p className="relative text-[10px] font-medium uppercase tracking-[0.3em] text-[#97a7c5]">
            Protocol Active / Est. 2026 Precision Unit
          </p>
        </section>

        <section className="flex items-center justify-center bg-white px-6 py-12 md:px-10">
          <div className="w-full max-w-[440px] rounded-[24px] border border-[#e4edf9] bg-white p-8 shadow-[0_14px_48px_rgba(13,71,161,0.09)]">
            <h2 className="text-[32px] font-bold text-[#1a2744]">Create Account</h2>
            <p className="mt-2 text-[14px] text-[#5c7099]">Start your automotive journey today.</p>

            <form className="mt-8 space-y-5" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label htmlFor="fullName" className="mb-2 block text-[11px] font-bold uppercase tracking-[0.14em] text-[#1565c0]">
                  Full Name
                </label>
                <div className="relative">
                  <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
                  <input id="fullName" type="text" placeholder="Your Full Name" className="mv-input pl-11" />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="mb-2 block text-[11px] font-bold uppercase tracking-[0.14em] text-[#1565c0]">
                  Email Address
                </label>
                <div className="relative">
                  <AtSign size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
                  <input id="email" type="email" placeholder="you@example.com" className="mv-input pl-11" />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="mb-2 block text-[11px] font-bold uppercase tracking-[0.14em] text-[#1565c0]">
                  Password
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
                  <input id="password" type={showPassword ? "text" : "password"} placeholder="••••••••" className="mv-input pl-11 pr-11" />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94a3b8]"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="mb-2 block text-[11px] font-bold uppercase tracking-[0.14em] text-[#1565c0]">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="mv-input pl-11 pr-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((v) => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94a3b8]"
                    aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <label className="flex items-start gap-2 text-[12px] text-[#5c7099]">
                <input type="checkbox" className="mt-0.5 h-4 w-4 accent-[#1565c0]" defaultChecked />
                <span>
                  I agree to the <Link href="#" className="font-semibold text-[#1565c0]">Terms of Service</Link> and{" "}
                  <Link href="#" className="font-semibold text-[#1565c0]">Privacy Policy</Link>
                </span>
              </label>

              <button type="submit" className="w-full rounded-full bg-[#1565c0] py-3.5 text-[14px] font-bold text-white shadow-[0_12px_26px_rgba(21,101,192,0.24)] transition hover:bg-[#0d47a1]">
                Create My Account
              </button>
            </form>

            <div className="my-7 flex items-center gap-3">
              <div className="h-px flex-1 bg-[#d6e4f7]" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#97a7c5]">Or Continue With</span>
              <div className="h-px flex-1 bg-[#d6e4f7]" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button type="button" className="rounded-[12px] border border-[#d6e4f7] py-3 text-[12px] font-semibold text-[#1a2744] transition hover:bg-[#f7fbff]">
                Google
              </button>
              <button type="button" className="rounded-[12px] border border-[#d6e4f7] py-3 text-[12px] font-semibold text-[#1565c0] transition hover:bg-[#f7fbff]">
                Facebook
              </button>
            </div>

            <p className="mt-7 text-center text-[13px] text-[#5c7099]">
              Already have an account?{" "}
              <Link href="/sign-in" className="font-semibold text-[#1565c0] hover:underline">
                Sign In
              </Link>
            </p>

            <div className="mt-5 flex justify-center gap-5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#9aabc8]">
              <Link href="#">Privacy</Link>
              <Link href="#">Terms</Link>
              <Link href="/contact">Support</Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
