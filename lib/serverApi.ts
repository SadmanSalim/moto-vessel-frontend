import { normalizeProductsPayload } from "@/lib/api";
import type { ApiProduct, Banner, Category, PaginatedProducts, StoreLocation } from "@/types";
import type { CmsFooterData, CmsHomepageData, CmsNavItem, CmsTheme } from "@/services/cmsService";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

type ApiEnvelope<T> = {
  success: boolean;
  message: string;
  data: T;
};

// Admin edits must show up on the next request (and in open tabs via
// StorefrontLiveSync). ISR/SWR was leaving the previous HTML on screen
// until the cache window elapsed, so storefront fetches skip the data cache.
const STOREFRONT_TAGS = ["storefront"];

function storefrontGet(path: string) {
  return fetch(`${API_URL}${path}`, {
    cache: "no-store",
    next: { tags: STOREFRONT_TAGS },
  });
}

export async function fetchProduct(slug: string): Promise<ApiProduct | null> {
  try {
    const res = await fetch(`${API_URL}/products/${slug}`, {
      cache: "no-store",
      next: { tags: STOREFRONT_TAGS },
    });

    if (!res.ok) return null;

    const json = (await res.json()) as ApiEnvelope<ApiProduct>;
    return json.data ?? null;
  } catch {
    return null;
  }
}

export async function fetchProductSlugs(limit = 100): Promise<string[]> {
  try {
    const res = await fetch(`${API_URL}/products?per_page=${limit}`, {
      cache: "no-store",
      next: { tags: STOREFRONT_TAGS },
    });

    if (!res.ok) return [];

    const json = (await res.json()) as ApiEnvelope<{ data?: ApiProduct[] } | ApiProduct[]>;
    const payload = json.data;

    if (Array.isArray(payload)) {
      return payload
        .map((p) => p.slug ?? p.detail?.slug)
        .filter((slug): slug is string => Boolean(slug));
    }

    if (payload && typeof payload === "object" && "data" in payload && Array.isArray(payload.data)) {
      return payload.data
        .map((p) => p.slug ?? p.detail?.slug)
        .filter((slug): slug is string => Boolean(slug));
    }

    return [];
  } catch {
    return [];
  }
}

export async function fetchHeroBanners(): Promise<Banner[]> {
  // Seeded server-side so the hero banner — almost always the page's
  // Largest Contentful Paint element — doesn't have to wait on a
  // client-side fetch before the browser even knows which image/video URL
  // to request. Previously HeroSection fetched this entirely client-side,
  // meaning the LCP resource wasn't discoverable until after JS parsed,
  // hydrated, and an API round-trip completed — Lighthouse flagged this
  // directly ("LCP request discovery").
  try {
    const res = await fetch(`${API_URL}/cms/banners?position=hero`, {
      cache: "no-store",
      next: { tags: STOREFRONT_TAGS },
    });

    if (!res.ok) return [];

    const json = (await res.json()) as ApiEnvelope<Banner[]>;
    return Array.isArray(json.data) ? json.data : [];
  } catch {
    return [];
  }
}

export async function fetchCmsHomepage(): Promise<CmsHomepageData | null> {
  // Same idea as fetchHeroBanners — without this, the homepage's section
  // visibility/order/titles were 100% client-fetched, so nothing below the
  // hero could render correctly until that API call resolved too.
  try {
    const res = await fetch(`${API_URL}/cms/homepage`, {
      cache: "no-store",
      next: { tags: STOREFRONT_TAGS },
    });

    if (!res.ok) return null;

    const json = (await res.json()) as ApiEnvelope<CmsHomepageData>;
    return json.data ?? null;
  } catch {
    return null;
  }
}

export async function fetchNavCategories(): Promise<Category[]> {
  // CategorySlider had no server-side seed at all, so on every homepage
  // load it rendered a hardcoded generic fallback list (data/categories.ts
  // — "Engine Oil", "Brakes", etc. linking to "#") for the ~1-2s it took
  // the client-side useCategories() call to resolve, then swapped in the
  // real categories. That's exactly the "shows demo data first, then real
  // data" symptom — seeding the real categories here removes the window
  // where the fallback could ever render on a normal page load.
  try {
    const res = await fetch(`${API_URL}/categories?nav=1`, {
      cache: "no-store",
      next: { tags: STOREFRONT_TAGS },
    });

    if (!res.ok) return [];

    const json = (await res.json()) as ApiEnvelope<Category[]>;
    return Array.isArray(json.data) ? json.data : [];
  } catch {
    return [];
  }
}

export async function fetchDefaultProducts(perPage = 12): Promise<PaginatedProducts | null> {
  // Seeds the /products/all page's default view (page 1, no filters) so the
  // catalog's main browse page shows real products immediately instead of
  // skeletons — same problem as the homepage had: the whole grid was
  // 100% client-fetched with nothing in the initial HTML.
  try {
    const res = await fetch(`${API_URL}/products?per_page=${perPage}&page=1`, {
      cache: "no-store",
      next: { tags: STOREFRONT_TAGS },
    });

    if (!res.ok) return null;

    const json = (await res.json()) as ApiEnvelope<unknown>;
    return normalizeProductsPayload(json.data);
  } catch {
    return null;
  }
}

export async function fetchFeaturedProducts(perPage = 4): Promise<PaginatedProducts | null> {
  // Seeds only the homepage's default "Best Selling" tab (FeaturedPartsSection's
  // initial activeTab) — the other tabs are fetched client-side as usual once
  // someone actually clicks them, same as before. best_seller=true matches
  // that tab's own client-side params (admin curates this list via the
  // flame toggle in the product admin — it's not automatic sales ranking).
  try {
    const res = await fetch(`${API_URL}/products?per_page=${perPage}&best_seller=true`, {
      cache: "no-store",
      next: { tags: STOREFRONT_TAGS },
    });

    if (!res.ok) return null;

    const json = (await res.json()) as ApiEnvelope<unknown>;
    return normalizeProductsPayload(json.data);
  } catch {
    return null;
  }
}

// The four fetchers below seed the root layout's Header/Footer/ThemeProvider
// — previously those were 100% client-fetched (useCmsNavMenus, useCmsSettings,
// useCmsTheme, useCmsFooter, useStores all fired only after hydration), which
// is what caused the nav links, logo, brand colors, and footer branches to
// visibly "pop in" after the page shell had already painted on every single
// page. Same fix pattern as fetchHeroBanners/fetchCmsHomepage above, just
// applied to the layout-level data instead of the homepage body.
export async function fetchCmsNavMenus(): Promise<CmsNavItem[]> {
  try {
    const res = await fetch(`${API_URL}/cms/nav-menus`, {
      cache: "no-store",
      next: { tags: STOREFRONT_TAGS },
    });

    if (!res.ok) return [];

    const json = (await res.json()) as ApiEnvelope<CmsNavItem[]>;
    return Array.isArray(json.data) ? json.data : [];
  } catch {
    return [];
  }
}

export async function fetchCmsSettings(): Promise<Record<string, string>> {
  try {
    const res = await fetch(`${API_URL}/cms/settings`, {
      cache: "no-store",
      next: { tags: STOREFRONT_TAGS },
    });

    if (!res.ok) return {};

    const json = (await res.json()) as ApiEnvelope<Record<string, string>>;
    return json.data ?? {};
  } catch {
    return {};
  }
}

export async function fetchCmsTheme(): Promise<CmsTheme | null> {
  try {
    const res = await fetch(`${API_URL}/cms/theme`, {
      cache: "no-store",
      next: { tags: STOREFRONT_TAGS },
    });

    if (!res.ok) return null;

    const json = (await res.json()) as ApiEnvelope<CmsTheme>;
    return json.data ?? null;
  } catch {
    return null;
  }
}

export async function fetchCmsFooter(): Promise<CmsFooterData | null> {
  try {
    const res = await fetch(`${API_URL}/cms/footer`, {
      cache: "no-store",
      next: { tags: STOREFRONT_TAGS },
    });

    if (!res.ok) return null;

    const json = (await res.json()) as ApiEnvelope<CmsFooterData>;
    return json.data ?? null;
  } catch {
    return null;
  }
}

export async function fetchStores(): Promise<StoreLocation[]> {
  try {
    const res = await fetch(`${API_URL}/stores`, {
      cache: "no-store",
      next: { tags: STOREFRONT_TAGS },
    });

    if (!res.ok) return [];

    const json = (await res.json()) as ApiEnvelope<StoreLocation[]>;
    return Array.isArray(json.data) ? json.data : [];
  } catch {
    return [];
  }
}

function productImageUrl(product: ApiProduct): string | undefined {
  if (typeof product.primary_image === "string") return product.primary_image;
  return product.primary_image?.url;
}

export function productMetaDescription(product: ApiProduct): string {
  return (
    product.detail?.short_description ??
    product.detail?.meta_description ??
    product.name
  );
}

export function productMetaImage(product: ApiProduct): string | undefined {
  return productImageUrl(product);
}
