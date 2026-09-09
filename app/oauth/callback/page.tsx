"use client";

import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import ErrorMessage from "@/components/ErrorMessage";
import { getErrorMessage } from "@/lib/api";
import { authService } from "@/services/authService";
import { useAuthStore } from "@/store/authStore";

function OAuthCallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setError("Missing sign-in token.");
      return;
    }

    // authService.me() reads the bearer token from localStorage via the
    // axios interceptor, so stash it there first, then confirm it's valid
    // by fetching the profile before committing to auth state.
    localStorage.setItem("mv_token", token);

    authService
      .me()
      .then((user) => {
        setAuth(user, token);
        router.replace("/");
      })
      .catch((err) => {
        localStorage.removeItem("mv_token");
        setError(getErrorMessage(err));
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  if (error) {
    return (
      <div className="mv-container flex min-h-[60vh] flex-col items-center justify-center gap-4 py-16 text-center">
        <ErrorMessage message={error} />
        <a href="/sign-in" className="text-[13px] font-semibold text-mv-primary hover:underline">
          Back to Sign In
        </a>
      </div>
    );
  }

  return (
    <div className="mv-container flex min-h-[60vh] flex-col items-center justify-center gap-3 py-16 text-center">
      <Loader2 size={28} className="animate-spin text-mv-primary" />
      <p className="text-[13px] text-mv-muted">Finishing sign-in...</p>
    </div>
  );
}

export default function OAuthCallbackPage() {
  return (
    <Suspense fallback={<div className="mv-container py-16 text-center text-mv-muted">Loading...</div>}>
      <OAuthCallbackContent />
    </Suspense>
  );
}
