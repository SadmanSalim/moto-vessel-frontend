"use client";

import { ChevronDown, ChevronLeft, ChevronRight, Heart, MessageCircle, Plus, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";
import ErrorMessage from "@/components/ErrorMessage";
import ProductCardSkeleton from "@/components/skeletons/ProductCardSkeleton";
import { useBrands, useCategories } from "@/hooks/useCatalog";
import { useCmsSettings } from "@/hooks/useCms";
import { useDebounce } from "@/hooks/useDebounce";
import { useProducts } from "@/hooks/useProducts";
import { useIsWishlisted, useToggleWishlist } from "@/hooks/useWishlist";
import { analytics } from "@/lib/analytics";
import { getErrorMessage } from "@/lib/api";
import { formatPrice, mapApiProductToCard } from "@/lib/mapProduct";
import { cn } from "@/lib/utils";
import { buildWhatsAppInquiryLink, productAbsoluteUrl } from "@/lib/whatsapp";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import { useCartUIStore } from "@/store/cartUIStore";
import type { ApiProduct, PaginatedProducts } from "@/types";

const MIN_PRICE = 0;
const MAX_PRICE = 5000;

const infoCards = [
  { title: "Genuine Parts", desc: "Every part we list is sourced from trusted manufacturers and verified for authenticity before it reaches you." },
  { title: "Why Quality Matters", desc: "Premium components mean consistent performance, reduced wear, and improved safety under all driving conditions." },
  { title: "Compatibility Tips", desc: "Always match parts to your vehicle's make, model, and year for optimal fitment and performance." },
  { title: "Need Help Choosing?", desc: "Not sure which part fits your vehicle? Reach out to our team for expert recommendations before you order." },
];

const SORT_OPTIONS = [
  { value: "", label: "Default" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
] as const;

const PER_PAGE = 12;

/**
 * Condenses a potentially huge page count (e.g. 276 pages) down to a
 * compact, professional-looking window: first page, last page, the
 * current page +/-1, and "…" for whatever's skipped in between. Without
 * this, a catalog this size renders one button per page — hundreds of
 * them in a single row.
 */
function getPaginationRange(current: number, total: number): (number | "...")[] {
  const delta = 1;
  const pages: number[] = [];

  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || (i >= current - delta && i <= current + delta)) {
      pages.push(i);
    }
  }

  const withDots: (number | "...")[] = [];
  let prev: number | undefined;
  for (const page of pages) {
    if (prev !== undefined) {
      if (page - prev === 2) {
        withDots.push(prev + 1);
      } else if (page - prev > 1) {
        withDots.push("...");
      }
    }
    withDots.push(page);
    prev = page;
  }

  return withDots;
}

function ProductGridCard({ product }: { product: ApiProduct }) {
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartUIStore((s) => s.open);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const card = mapApiProductToCard(product);
  const toggleWishlist = useToggleWishlist(card.slug ?? String(product.id));
  const isWishlisted = useIsWishlisted(product.id, product.source);
  const { data: settings } = useCmsSettings();
  const inStock = card.stockStatus !== "out-of-stock";
  const canPurchase = card.hasPrice && inStock;
  const whatsappHref = buildWhatsAppInquiryLink({
    phone: settings?.contact_phone,
    productName: card.name,
    productUrl: productAbsoluteUrl(card.slug ?? product.id),
    hasPrice: card.hasPrice ?? true,
    inStock,
  });

  const handleToggleWishlist = () => {
    if (!isAuthenticated) {
      router.push("/sign-in");
      return;
    }
    if (!isWishlisted) {
      analytics.addToWishlist({ id: product.id, name: card.name, price: card.price });
    }
    toggleWishlist.mutate();
  };

  const handleSelectItem = () => {
    analytics.selectItem({ id: product.id, name: card.name, price: card.price, category: card.category }, "Product Listing");
  };

  return (
    <article className="mv-card mv-card-hover min-w-0 overflow-hidden">
      <Link href={`/products/${card.slug}`} onClick={handleSelectItem} className="relative block aspect-[4/3] bg-mv-bg p-4">
        <Image src={card.image} alt={card.name} width={200} height={150} className="h-full w-full object-contain" />
      </Link>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <span className="rounded-full bg-mv-blue-light px-2.5 py-0.5 text-[10px] font-semibold text-mv-primary">
            {card.badge}
          </span>
          <button
            type="button"
            onClick={handleToggleWishlist}
            disabled={toggleWishlist.isPending}
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            className="shrink-0 text-mv-muted transition hover:text-mv-red disabled:opacity-60"
          >
            <Heart size={16} className={isWishlisted ? "fill-mv-red text-mv-red" : undefined} />
          </button>
        </div>
        <h3 className="mt-2 text-[13px] font-semibold text-mv-text">{card.name}</h3>
        <div className="mt-1 flex items-center gap-1">
          <div className="flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={11} className={i < Math.round(card.rating) ? "fill-amber-400 text-amber-400" : "text-gray-200"} />
            ))}
          </div>
          {card.reviewCount ? <span className="text-[10px] text-mv-muted">({card.reviewCount})</span> : null}
        </div>
        <div className="mt-3 flex items-center justify-between">
          <p className="text-[15px] font-bold text-mv-text">
            {card.hasPrice ? formatPrice(card.price) : <span className="text-[12px] text-mv-muted">Contact for price</span>}
          </p>
          {canPurchase ? (
            <button
              type="button"
              onClick={() => {
                addItem({
                  id: product.id,
                  source: product.source,
                  sku: product.sku,
                  name: card.name,
                  price: card.price,
                  quantity: 1,
                  image: card.image,
                });
                openCart();
              }}
              aria-label="Add to cart"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-mv-primary text-white transition hover:bg-mv-primary-dark"
            >
              <Plus size={16} />
            </button>
          ) : (
            // No price yet, or out of stock — quick-add doesn't apply, so
            // this jumps straight to a pre-filled WhatsApp inquiry instead.
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              aria-label={inStock ? "Order on WhatsApp" : "Contact on WhatsApp"}
              title={inStock ? "Order on WhatsApp" : "Contact on WhatsApp"}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-[#25D366] text-white transition hover:bg-[#1fb855]"
            >
              <MessageCircle size={16} />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

function ProductListingContent({ initialProducts }: { initialProducts?: PaginatedProducts }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const categorySlug = searchParams.get("category");
  const brandSlug = searchParams.get("brand");
  const page = Math.max(1, Number(searchParams.get("page") ?? "1") || 1);
  const sort = searchParams.get("sort") ?? "";
  const searchQuery = searchParams.get("search") ?? "";
  const debouncedSearch = useDebounce(searchQuery, 300);
  const maxPriceParam = searchParams.get("price_max");
  const [maxPrice, setMaxPrice] = useState(maxPriceParam ? Number(maxPriceParam) : MAX_PRICE);
  const debouncedMaxPrice = useDebounce(maxPrice, 400);

  const [categorySearch, setCategorySearch] = useState("");

  const { data: categories } = useCategories();
  const { data: brands } = useBrands();

  const selectedCategory = categorySlug ? categories?.find((c) => c.slug === categorySlug) : undefined;
  const brandId = brands?.find((b) => b.slug === brandSlug)?.id;

  // Only list categories that actually have products, so the filter doesn't
  // dead-end into empty results, and sort alphabetically for scannability.
  const filterableCategories = (categories ?? [])
    .filter((c) => (c.products_count ?? 0) > 0)
    .filter((c) => c.name.toLowerCase().includes(categorySearch.trim().toLowerCase()))
    .sort((a, b) => a.name.localeCompare(b.name));

  const pageHeading = selectedCategory
    ? selectedCategory.name
    : searchQuery
      ? `Search Results for "${searchQuery}"`
      : "All Products";

  const pageSubtitle = selectedCategory
    ? `Browse our full range of ${selectedCategory.name} — engineered for durability, performance, and perfect fit.`
    : searchQuery
      ? "Showing matches for your search across our full parts catalog."
      : "Discover premium automotive parts engineered for superior performance, durability, and perfect fit across all major vehicle types.";

  // initialProducts came from a build-time fetch of page 1 with no filters
  // applied — only seed it when the current view actually matches that
  // exact query, otherwise a filtered/paginated view would briefly show the
  // wrong (unfiltered) products.
  const isDefaultView =
    page === 1 && !categorySlug && !brandSlug && !sort && debouncedSearch.length < 2 && debouncedMaxPrice >= MAX_PRICE;

  const { data, isLoading, isError, error } = useProducts(
    {
      page,
      per_page: PER_PAGE,
      // Both the POS and Website product queries filter by category *slug*
      // (via the shared websiteCategories relation) — category_id only ever
      // matched the POS-only pos_category_id column, which is why category
      // filtering silently did nothing for the current catalog (100% Website
      // products).
      category: categorySlug ?? undefined,
      brand_id: brandId,
      sort: sort || undefined,
      search: debouncedSearch.length >= 2 ? debouncedSearch : undefined,
      price_max: debouncedMaxPrice < MAX_PRICE ? debouncedMaxPrice : undefined,
    },
    { initialData: isDefaultView ? initialProducts : undefined },
  );

  const meta = data?.meta;
  const currentPage = meta?.current_page ?? page;
  const lastPage = meta?.last_page ?? 1;
  const totalProducts = meta?.total ?? 0;

  useEffect(() => {
    if (!data?.items.length) return;
    analytics.viewItemList(
      data.items.map((p) => {
        const card = mapApiProductToCard(p);
        return { id: p.id, name: card.name, price: card.price, category: card.category };
      }),
      pageHeading,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, currentPage]);

  const updateParams = useCallback(
    // scrollToTop defaults to false — without that, Next.js jumps back to
    // the top of the page on every filter click, which is jarring when
    // someone's scrolled down and just wants to toggle another brand/price/
    // sort option in place. Pagination is the one case that still wants the
    // jump (so the new page's results are actually visible), so it opts in.
    (updates: Record<string, string | null>, scrollToTop = false) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === "") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      }
      const qs = params.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: scrollToTop });
    },
    [pathname, router, searchParams],
  );

  const handleBrandToggle = (brand: { id: number; slug: string }) => {
    if (brandSlug === brand.slug) {
      updateParams({ brand: null, page: "1" });
    } else {
      updateParams({ brand: brand.slug, page: "1" });
    }
  };

  const handleCategoryToggle = (category: { slug: string }) => {
    if (categorySlug === category.slug) {
      updateParams({ category: null, page: "1" });
    } else {
      updateParams({ category: category.slug, page: "1" });
    }
  };

  const handleSortChange = (value: string) => {
    updateParams({ sort: value || null, page: "1" });
  };

  const handlePageChange = (nextPage: number) => {
    if (nextPage < 1 || nextPage > lastPage) return;
    updateParams({ page: String(nextPage) }, true);
  };

  // Keep the URL in sync once the debounced slider value settles, so the
  // filter survives navigation/sharing without re-querying on every tick.
  useEffect(() => {
    const current = maxPriceParam ? Number(maxPriceParam) : MAX_PRICE;
    if (current === debouncedMaxPrice) return;
    updateParams({ price_max: debouncedMaxPrice < MAX_PRICE ? String(debouncedMaxPrice) : null, page: "1" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedMaxPrice]);

  return (
    <div>
        {/* Hero */}
        <section className="relative bg-mv-navy py-16 md:py-20">
          <div className="absolute inset-0 opacity-40" style={{ backgroundImage: "url('/images/placeholders/hero.svg')", backgroundSize: "cover" }} aria-hidden />
          <div className="absolute inset-0 bg-gradient-to-r from-mv-navy/95 to-mv-navy/60" aria-hidden />
          <div className="mv-container relative max-w-xl">
            <h1 className="text-[32px] font-extrabold text-white md:text-[40px]">{pageHeading}</h1>
            <p className="mt-4 text-[14px] leading-relaxed text-white/80">{pageSubtitle}</p>
            <Link href="#products" className="mt-6 inline-block rounded-full bg-mv-primary px-7 py-3 text-[13px] font-bold text-white">
              Shop Now
            </Link>
          </div>
        </section>

        {/* Breadcrumb */}
        <div className="border-b border-mv-border bg-white py-3">
          <div className="mv-container text-[12px] text-mv-muted">
            <Link href="/" className="hover:text-mv-primary">Home</Link>
            {" / "}
            <Link href="/products/all" className="hover:text-mv-primary">Products</Link>
            {selectedCategory ? (
              <>
                {" / "}
                <span className="text-mv-text">{selectedCategory.name}</span>
              </>
            ) : null}
          </div>
        </div>

        {/* Main content */}
        <section id="products" className="bg-mv-bg py-10 md:py-12">
          <div className="mv-container grid gap-8 lg:grid-cols-[minmax(0,280px)_1fr]">
            {/* Sidebar filters */}
            <aside className="h-fit rounded-2xl border border-mv-border bg-white p-5 lg:sticky lg:top-24">
              <div className="mb-5">
                <label className="mb-1.5 block text-[12px] font-semibold text-mv-text">Sort By</label>
                <div className="relative">
                  <select
                    value={sort}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="w-full appearance-none rounded-xl border border-mv-border px-3 py-2.5 text-[12px] outline-none"
                  >
                    {SORT_OPTIONS.map((opt) => (
                      <option key={opt.value || "default"} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-mv-muted" />
                </div>
              </div>

              <div className="mb-5">
                <label className="mb-2 block text-[12px] font-semibold text-mv-text">Max Price</label>
                <input
                  type="range"
                  min={MIN_PRICE}
                  max={MAX_PRICE}
                  step={50}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-mv-primary"
                />
                <div className="mt-1 flex justify-between text-[11px] text-mv-muted">
                  <span>৳{MIN_PRICE}</span>
                  <span>{maxPrice >= MAX_PRICE ? `৳${MAX_PRICE}+` : `৳${maxPrice}`}</span>
                </div>
              </div>

              <div className="mb-5">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-[12px] font-semibold text-mv-text">Category</p>
                  {selectedCategory ? (
                    <button
                      type="button"
                      onClick={() => updateParams({ category: null, page: "1" })}
                      className="text-[11px] font-medium text-mv-primary hover:underline"
                    >
                      Clear
                    </button>
                  ) : null}
                </div>
                {(categories?.length ?? 0) > 8 ? (
                  <input
                    type="text"
                    value={categorySearch}
                    onChange={(e) => setCategorySearch(e.target.value)}
                    placeholder="Search categories..."
                    className="mb-2 w-full rounded-xl border border-mv-border px-3 py-2 text-[12px] outline-none focus:border-mv-primary"
                  />
                ) : null}
                <div className="max-h-52 space-y-1.5 overflow-y-auto pr-1">
                  {filterableCategories.length ? (
                    filterableCategories.map((category) => (
                      <label key={category.id} className="flex cursor-pointer items-center gap-2 text-[12px] text-mv-text">
                        <input
                          type="checkbox"
                          checked={categorySlug === category.slug}
                          onChange={() => handleCategoryToggle(category)}
                          className="h-3.5 w-3.5 shrink-0 accent-mv-primary"
                        />
                        <span className="flex-1 truncate">{category.name}</span>
                        {category.products_count ? (
                          <span className="text-[10px] text-mv-muted">({category.products_count})</span>
                        ) : null}
                      </label>
                    ))
                  ) : (
                    <p className="text-[12px] text-mv-muted">No categories match.</p>
                  )}
                </div>
              </div>

              <div>
                <p className="mb-2 text-[12px] font-semibold text-mv-text">Brand</p>
                {(brands ?? []).map((brand) => (
                  <label key={brand.id} className="mb-1.5 flex cursor-pointer items-center gap-2 text-[12px] text-mv-text">
                    <input
                      type="checkbox"
                      checked={brandSlug === brand.slug}
                      onChange={() => handleBrandToggle(brand)}
                      className="h-3.5 w-3.5 accent-mv-primary"
                    />
                    {brand.name}
                  </label>
                ))}
              </div>
            </aside>

            {/* Product grid */}
            <div className="min-w-0">
              <div className="mb-6">
                <h2 className="text-[22px] font-bold text-mv-text">{pageHeading}</h2>
                <p className="text-[13px] text-mv-muted">
                  {isLoading ? "Loading..." : `${totalProducts} Products Found`}
                </p>
              </div>

              {isError && (
                <div className="mb-6">
                  <ErrorMessage message={getErrorMessage(error)} />
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {isLoading &&
                  Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
                {!isLoading &&
                  !isError &&
                  (data?.items.length ? (
                    data.items.map((product) => <ProductGridCard key={product.id} product={product} />)
                  ) : (
                    <p className="col-span-full text-center text-[13px] text-mv-muted">No products found.</p>
                  ))}
              </div>

              {/* Pagination */}
              {!isLoading && !isError && lastPage > 1 && (
                <nav className="mt-10 flex flex-col items-center gap-3" aria-label="Pagination">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage <= 1}
                      aria-label="Previous page"
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-mv-border text-mv-muted transition hover:border-mv-primary hover:text-mv-primary disabled:pointer-events-none disabled:opacity-40"
                    >
                      <ChevronLeft size={16} />
                    </button>

                    {getPaginationRange(currentPage, lastPage).map((p, i) =>
                      p === "..." ? (
                        <span
                          key={`ellipsis-${i}`}
                          className="flex h-9 w-9 items-center justify-center text-[13px] text-mv-muted"
                        >
                          …
                        </span>
                      ) : (
                        <button
                          key={p}
                          type="button"
                          onClick={() => handlePageChange(p)}
                          aria-current={currentPage === p ? "page" : undefined}
                          className={cn(
                            "flex h-9 w-9 items-center justify-center rounded-full text-[13px] font-semibold transition",
                            currentPage === p
                              ? "bg-mv-primary text-white"
                              : "border border-mv-border text-mv-muted hover:border-mv-primary hover:text-mv-primary",
                          )}
                        >
                          {p}
                        </button>
                      ),
                    )}

                    <button
                      type="button"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage >= lastPage}
                      aria-label="Next page"
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-mv-border text-mv-muted transition hover:border-mv-primary hover:text-mv-primary disabled:pointer-events-none disabled:opacity-40"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>

                  <p className="text-[12px] text-mv-muted">
                    Page {currentPage} of {lastPage}
                  </p>
                </nav>
              )}
            </div>
          </div>
        </section>

        {/* Info section */}
        <section className="bg-white py-12 md:py-16">
          <div className="mv-container">
            <h2 className="text-center text-[24px] font-bold text-mv-text">
              Everything You Need To <span className="text-mv-primary">Know</span>
            </h2>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {infoCards.map((card) => (
                <article key={card.title} className="rounded-xl border border-mv-border bg-white p-5 shadow-sm">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-mv-blue-light text-mv-primary">
                    <Star size={18} />
                  </div>
                  <h3 className="text-[14px] font-bold text-mv-text">{card.title}</h3>
                  <p className="mt-2 text-[12px] leading-relaxed text-mv-muted">{card.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
    </div>
  );
}

export default function ProductsAllClient({ initialProducts }: { initialProducts?: PaginatedProducts }) {
  return (
    <Suspense fallback={<div className="mv-container py-16 text-[13px] text-mv-muted">Loading...</div>}>
      <ProductListingContent initialProducts={initialProducts} />
    </Suspense>
  );
}
