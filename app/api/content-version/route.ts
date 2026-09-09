import { NextResponse } from "next/server";
import { getStorefrontGeneration } from "@/lib/storefrontGeneration";

export const dynamic = "force-dynamic";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

type VersionEnvelope = {
  data?: { v?: number };
  v?: number;
};

export async function GET() {
  let v: number | null = null;

  try {
    const res = await fetch(`${API_URL}/cms/content-version`, {
      cache: "no-store",
      headers: { Accept: "application/json" },
    });
    if (res.ok) {
      const json = (await res.json()) as VersionEnvelope;
      const next = json.data?.v ?? json.v;
      if (typeof next === "number" && Number.isFinite(next)) v = next;
    }
  } catch {
    // API unreachable — fall back to this process's generation.
  }

  return NextResponse.json(
    { v: v ?? getStorefrontGeneration() },
    { headers: { "Cache-Control": "private, no-store, no-cache, must-revalidate" } },
  );
}
