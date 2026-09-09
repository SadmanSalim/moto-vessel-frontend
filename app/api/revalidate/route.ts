import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { bumpStorefrontGeneration } from "@/lib/storefrontGeneration";

// On-demand cache clear, called after every admin mutation (and by the
// admin "Refresh Frontend" button). `revalidateTag(tag, "max")` only marks
// data stale and still serves the old HTML on the next visit (SWR). Admin
// edits need a hard expire so the next request blocks on fresh data.
export const dynamic = "force-dynamic";

function authorized(request: NextRequest): boolean {
  const provided = request.headers.get("x-revalidate-secret");
  const expected = process.env.REVALIDATE_SECRET || process.env.AUTH_SECRET;
  return Boolean(expected && provided && provided === expected);
}

function clearStorefrontCache() {
  bumpStorefrontGeneration();
  revalidateTag("storefront", { expire: 0 });
  revalidatePath("/", "layout");
  revalidatePath("/", "page");
}

export async function POST(request: NextRequest) {
  const expected = process.env.REVALIDATE_SECRET || process.env.AUTH_SECRET;
  if (!expected) {
    return NextResponse.json({ ok: false, message: "REVALIDATE_SECRET is not configured on the frontend." }, { status: 500 });
  }
  if (!authorized(request)) {
    return NextResponse.json({ ok: false, message: "Invalid or missing secret." }, { status: 401 });
  }

  clearStorefrontCache();
  return NextResponse.json({ ok: true, message: "Frontend cache cleared." });
}
