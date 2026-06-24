"use client";

import { AtSign, Eye, EyeOff, Lock, User } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { AuthLeftPanel } from "@/components/AuthLeftPanel";
import { cn } from "@/lib/utils";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
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

type PasswordStrength = "weak" | "medium" | "strong" | null;

function getPasswordStrength(password: string): PasswordStrength {
  if (!password) return null;
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  const length = password.length;

  if (length < 6) return "weak";
  if (length >= 10 && hasLower && hasUpper && hasNumber && hasSpecial) return "strong";
  if (length >= 8 && ((hasLower && hasUpper) || (hasNumber && hasLower))) return "medium";
  return "weak";
}

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState("");

  const strength = useMemo(() => getPasswordStrength(password), [password]);

  const strengthConfig = {
    weak: { width: "33%", color: "#ef4444", label: "Weak" },
    medium: { width: "66%", color: "#eab308", label: "Medium" },
    strong: { width: "100%", color: "#22c55e", label: "Strong" },
  };

  return (
    <div className="bg-[#F8F9FB]">
        <div className="grid lg:min-h-[calc(100vh-140px)] lg:grid-cols-[45%_55%]">
          <AuthLeftPanel />

          <section className="flex items-center justify-center px-6 py-10 md:px-10 lg:py-12">
            <div className="w-full max-w-[460px] rounded-2xl bg-white px-10 py-10 shadow-[0_4px_24px_rgba(0,0,0,0.08)] md:px-12">
              <h2 className="text-[28px] font-bold text-[#111827]">Create Your Account</h2>
              <p className="mt-2 text-[14px] italic text-[#6B7280]">Join the MotoVessel ecosystem.</p>

              <form className="mt-8 space-y-5" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label
                    htmlFor="fullName"
                    className="mb-2 block text-[11px] font-bold uppercase tracking-[0.14em] text-[#1565c0]"
                  >
                    Full Name
                  </label>
                  <div className="relative">
                    <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                    <input id="fullName" type="text" placeholder="Your Full Name" className="mv-input h-12 pl-11" />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-[11px] font-bold uppercase tracking-[0.14em] text-[#1565c0]"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <AtSign size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                    <input id="email" type="email" placeholder="mahinbhai@" className="mv-input h-12 pl-11" />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-[11px] font-bold uppercase tracking-[0.14em] text-[#1565c0]"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="mv-input h-12 pl-11 pr-11"
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
                  {strength && (
                    <div className="mt-2">
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#E5E7EB]">
                        <div
                          className="h-full rounded-full transition-all duration-300"
                          style={{
                            width: strengthConfig[strength].width,
                            backgroundColor: strengthConfig[strength].color,
                          }}
                        />
                      </div>
                      <p
                        className={cn("mt-1 text-[10px] font-semibold uppercase tracking-wide", {
                          "text-[#ef4444]": strength === "weak",
                          "text-[#eab308]": strength === "medium",
                          "text-[#22c55e]": strength === "strong",
                        })}
                      >
                        {strengthConfig[strength].label}
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="mb-2 block text-[11px] font-bold uppercase tracking-[0.14em] text-[#1565c0]"
                  >
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="mv-input h-12 pl-11 pr-11"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((v) => !v)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9CA3AF]"
                      aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="h-12 w-full rounded-lg bg-[#1A2E6F] text-[14px] font-bold text-white transition hover:bg-[#0d47a1]"
                >
                  Create Account
                </button>
              </form>

              <div className="my-7 flex items-center gap-3">
                <div className="h-px flex-1 bg-[#E5E7EB]" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#9CA3AF]">
                  Or Continue With
                </span>
                <div className="h-px flex-1 bg-[#E5E7EB]" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  className="flex h-11 items-center justify-center gap-2 rounded-lg border border-[#E5E7EB] bg-white text-[12px] font-semibold text-[#111827] transition hover:bg-[#F9FAFB]"
                >
                  <GoogleIcon />
                  Google
                </button>
                <button
                  type="button"
                  className="flex h-11 items-center justify-center gap-2 rounded-lg border border-[#E5E7EB] bg-white text-[12px] font-semibold text-[#111827] transition hover:bg-[#F9FAFB]"
                >
                  <FacebookIcon />
                  Facebook
                </button>
              </div>

              <p className="mt-7 text-center text-[13px] text-[#6B7280]">
                Already have an account?{" "}
                <Link href="/sign-in" className="font-bold text-[#2563EB] hover:underline">
                  Sign In
                </Link>
              </p>

              <div className="mt-5 flex justify-center gap-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#9CA3AF]">
                <Link href="#" className="hover:text-[#6B7280]">
                  Privacy
                </Link>
                <span aria-hidden>·</span>
                <Link href="#" className="hover:text-[#6B7280]">
                  Terms
                </Link>
                <span aria-hidden>·</span>
                <Link href="/contact" className="hover:text-[#6B7280]">
                  Support
                </Link>
              </div>
            </div>
          </section>
        </div>
    </div>
  );
}
