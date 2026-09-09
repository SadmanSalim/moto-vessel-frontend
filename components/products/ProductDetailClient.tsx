"use client";

import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Heart,
  Loader2,
  Minus,
  Plus,
  Share2,
  ShoppingCart,
  Star,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import ErrorMessage from "@/components/ErrorMessage";
import { EmiCalculatorModal } from "@/components/products/EmiCalculatorModal";
import ProductCardSkeleton from "@/components/skeletons/ProductCardSkeleton";
import { useCmsSettings } from "@/hooks/useCms";
import { useHasMounted } from "@/hooks/useHasMounted";
import { useProduct, useProducts } from "@/hooks/useProducts";
import { useProductReviews, useSubmitReview } from "@/hooks/useReviews";
import { useToggleWishlist, useWishlist } from "@/hooks/useWishlist";
import { analytics } from "@/lib/analytics";
import { getErrorMessage } from "@/lib/api";
import { formatPrice, mapApiProductToCard } from "@/lib/mapProduct";
import { cn } from "@/lib/utils";
import { buildWhatsAppInquiryLink, productAbsoluteUrl } from "@/lib/whatsapp";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import { useCartUIStore } from "@/store/cartUIStore";
import type { ApiProduct } from "@/types";

const infoTabs = ["Description", "Specs", "Compatibility", "Review"];
const whyChoose = [
  { title: "2,500+", sub: "Happy Customer" },
  { title: "98%", sub: "Satisfaction" },
  { title: "24-48 Hours", sub: "Delivery" },
  { title: "Warranty", sub: "Safe Packing" },
  { title: "2,500+", sub: "Happy Customer" },
  { title: "2,500+", sub: "Happy Customer" },
];

const stockBadge = {
  "in-stock": { label: "In Stock", class: "bg-green-50 text-green-600" },
  "out-of-stock": { label: "Out of Stock", class: "bg-red-50 text-mv-red" },
  "low-stock": { label: "Low Stock", class: "bg-orange-50 text-orange-600" },
};

function getStockStatus(quantity: number): keyof typeof stockBadge {
  if (quantity <= 0) return "out-of-stock";
  if (quantity < 5) return "low-stock";
  return "in-stock";
}

function ProductDetailSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="mb-6 h-3 w-64 rounded bg-gray-200" />
      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <div className="flex gap-2">
            <div className="h-5 w-16 rounded-full bg-gray-200" />
            <div className="h-5 w-20 rounded-full bg-gray-200" />
          </div>
          <div className="mt-3 h-8 w-full rounded bg-gray-200" />
          <div className="mt-2 h-4 w-32 rounded bg-gray-200" />
          <div className="mt-3 h-9 w-28 rounded bg-gray-200" />
          <div className="mt-5 flex gap-2">
            <div className="h-10 w-36 rounded-xl bg-gray-200" />
            <div className="h-10 w-28 rounded-xl bg-gray-200" />
          </div>
          <div className="mt-4 h-16 w-full rounded bg-gray-200" />
          <div className="mt-6 flex gap-4">
            <div className="h-10 w-32 rounded-full bg-gray-200" />
            <div className="h-5 w-24 rounded bg-gray-200" />
          </div>
          <div className="mt-4 flex gap-3">
            <div className="h-11 w-36 rounded-xl bg-gray-200" />
            <div className="h-11 w-36 rounded-xl bg-gray-200" />
          </div>
        </div>
        <div>
          <div className="aspect-square rounded-xl bg-gray-200" />
          <div className="mt-3 h-24 rounded-xl bg-gray-200" />
        </div>
      </div>
    </div>
  );
}

export default function ProductDetailClient({
  params,
  initialProduct,
}: {
  params: Promise<{ slug: string }>;
  initialProduct?: ApiProduct;
}) {
  const { slug } = use(params);
  const router = useRouter();
  const { data: product, isLoading, isError, error } = useProduct(slug, initialProduct);
  const { data: relatedData, isLoading: relatedLoading } = useProducts(
    {
      category_id: product?.category?.id,
      per_page: 3,
    },
    { enabled: !!product },
  );
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartUIStore((s) => s.open);
  const mounted = useHasMounted();
  const isAuthenticatedRaw = useAuthStore((s) => s.isAuthenticated);
  const isAuthenticated = mounted && isAuthenticatedRaw;

  const [qty, setQty] = useState(2);
  const [activeTab, setActiveTab] = useState("Description");
  const [activeImage, setActiveImage] = useState(0);
  const [emiModalOpen, setEmiModalOpen] = useState(false);
  const [specTab, setSpecTab] = useState<"parts" | "brand">("brand");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewComment, setReviewComment] = useState("");

  // Only fetch the full review list once the Review tab is actually opened —
  // the rating summary shown near the top comes from the product payload
  // itself (average_rating/review_count), so this doesn't need to block the
  // initial page render.
  const reviewsQuery = useProductReviews(slug, activeTab === "Review");
  const submitReview = useSubmitReview(slug);
  const wishlistQuery = useWishlist();
  const toggleWishlist = useToggleWishlist(slug);
  const isWishlisted = !!wishlistQuery.data?.some((p) => p.id === product?.id && p.source === product?.source);

  const price = Number(product?.effective_price ?? product?.sale_price ?? product?.price ?? 0);
  const hasPrice = product?.has_price ?? product?.price != null;
  const stockStatus = getStockStatus(product?.stock_quantity ?? 0);
  const badge = stockBadge[stockStatus];

  const inStock = stockStatus !== "out-of-stock";
  const canPurchase = hasPrice && inStock;

  const { data: settings } = useCmsSettings();
  const whatsappHref = product
    ? buildWhatsAppInquiryLink({
        phone: settings?.contact_phone,
        productName: `${product.name} (${product.sku})`,
        productUrl: productAbsoluteUrl(product.slug ?? product.detail?.slug ?? product.id),
        hasPrice,
        inStock,
      })
    : "#";

  const images = product?.images?.length
    ? [...product.images].sort((a, b) => a.sort_order - b.sort_order).map((img) => img.url)
    : product?.primary_image?.url
      ? [product.primary_image.url]
      : ["/images/placeholders/product.svg"];

  const relatedProducts = (relatedData?.items ?? [])
    .filter((p) => p.id !== product?.id)
    .map(mapApiProductToCard);

  useEffect(() => {
    if (!product) return;
    analytics.viewItem({
      id: product.id,
      name: product.name,
      price: Number(product.effective_price ?? product.sale_price ?? product.price ?? 0),
      category: product.category?.name,
      brand: product.brand?.name,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?.id, product?.source]);

  const handleAddToCart = () => {
    if (!product) return;
    addItem({
      id: product.id,
      source: product.source,
      sku: product.sku,
      name: product.name,
      price,
      quantity: qty,
      image: product.primary_image?.url ?? product.images?.[0]?.url,
    });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push("/checkout");
  };

  const handleToggleWishlist = () => {
    if (!isAuthenticated) {
      router.push(`/sign-in?next=/products/${slug}`);
      return;
    }
    if (!isWishlisted && product) {
      analytics.addToWishlist({ id: product.id, name: product.name, price });
    }
    toggleWishlist.mutate();
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    submitReview.mutate(
      { rating: reviewRating, title: reviewTitle || undefined, comment: reviewComment || undefined },
      {
        onSuccess: () => {
          setReviewTitle("");
          setReviewComment("");
          setReviewRating(5);
        },
      },
    );
  };

  const handleRelatedAddToCart = (
    apiId: number,
    source: "pos" | "website",
    sku: string,
    name: string,
    itemPrice: number,
    image: string,
  ) => {
    addItem({ id: apiId, source, sku, name, price: itemPrice, quantity: 1, image });
    openCart();
  };

  const handleRelatedBuyNow = (
    apiId: number,
    source: "pos" | "website",
    sku: string,
    name: string,
    itemPrice: number,
    image: string,
  ) => {
    handleRelatedAddToCart(apiId, source, sku, name, itemPrice, image);
    router.push("/checkout");
  };

  const partsLabel = product?.detail?.oem_number ?? product?.sku ?? "";
  const brandName = product?.brand?.name ?? "";
  const categoryName = product?.category?.name ?? "";
  const categorySlug = product?.category?.slug ?? "";

  return (
    <div className="bg-mv-bg">
        <div className="mv-container py-6">
          {isError && (
            <div className="mb-6">
              <ErrorMessage message={getErrorMessage(error)} />
            </div>
          )}

          {isLoading && <ProductDetailSkeleton />}

          {!isLoading && !isError && !product && (
            <ErrorMessage message="Product not found." />
          )}

          {!isLoading && !isError && product && (
            <>
          {/* Breadcrumb */}
          <nav className="mb-6 text-[12px] text-mv-muted">
            <Link href="/" className="hover:text-mv-primary">Home</Link>
            {" > "}
            <Link href="/products/all" className="hover:text-mv-primary">Products</Link>
            {" > "}
            {categorySlug ? (
              <>
                <Link href={`/products/all?category=${categorySlug}`} className="hover:text-mv-primary">{categoryName}</Link>
                {" > "}
              </>
            ) : null}
            <span className="text-mv-text">{product.name}</span>
          </nav>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Left: Product info */}
            <div>
              <div className="flex flex-wrap gap-2">
                {brandName && (
                  <span className="rounded-full bg-mv-blue-light px-3 py-0.5 text-[11px] font-semibold text-mv-primary">{brandName}</span>
                )}
                {categoryName && (
                  <span className="rounded-full bg-mv-blue-light px-3 py-0.5 text-[11px] font-semibold text-mv-primary">{categoryName}</span>
                )}
                <span className={cn("rounded-full px-3 py-0.5 text-[11px] font-semibold", badge.class)}>
                  {badge.label}
                </span>
              </div>
              <h1 className="mt-3 text-[22px] font-bold leading-tight text-mv-text md:text-[26px]">
                {product.name}
              </h1>
              <div className="mt-2 flex items-center gap-2">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={
                        i < Math.round(reviewsQuery.data?.stats.average ?? product.average_rating ?? 0)
                          ? "fill-amber-400 text-amber-400"
                          : "text-gray-200"
                      }
                    />
                  ))}
                </div>
                <span className="text-[12px] text-mv-muted">
                  {(() => {
                    const count = reviewsQuery.data?.stats.count ?? product.review_count ?? 0;
                    const average = reviewsQuery.data?.stats.average ?? product.average_rating ?? 0;
                    return count ? `${average} (${count} ${count === 1 ? "Review" : "Reviews"})` : "No reviews yet";
                  })()}
                </span>
              </div>
              <p className="mt-3 text-[28px] font-bold text-mv-primary">{formatPrice(price)}</p>

              {/* Spec tabs */}
              <div className="mt-5 flex gap-2">
                <button
                  type="button"
                  onClick={() => setSpecTab("parts")}
                  className={cn("rounded-xl border px-4 py-2 text-[12px] font-medium", specTab === "parts" ? "border-mv-primary text-mv-primary" : "border-mv-border text-mv-muted")}
                >
                  Parts List: {partsLabel.length > 10 ? `${partsLabel.slice(0, 10)}...` : partsLabel}
                </button>
                <button
                  type="button"
                  onClick={() => setSpecTab("brand")}
                  className={cn("rounded-xl border px-4 py-2 text-[12px] font-medium", specTab === "brand" ? "border-mv-primary bg-mv-blue-light text-mv-primary" : "border-mv-border text-mv-muted")}
                >
                  Brand: {brandName}
                </button>
              </div>
              <p className="mt-4 text-[12px] leading-relaxed text-mv-muted">
                {product.detail?.short_description ?? product.detail?.description ?? ""}
              </p>

              {/* Quantity & actions */}
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <div className="flex items-center rounded-full border border-mv-border bg-white">
                  <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-4 py-2 text-mv-muted hover:text-mv-text">
                    <Minus size={16} />
                  </button>
                  <span className="w-8 text-center text-[14px] font-semibold">{qty}</span>
                  <button type="button" onClick={() => setQty((q) => q + 1)} className="px-4 py-2 text-mv-muted hover:text-mv-text">
                    <Plus size={16} />
                  </button>
                </div>
                <p className="text-[14px] font-semibold text-mv-primary">Price: {formatPrice(price)}</p>
              </div>

              {canPurchase ? (
                <>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        handleAddToCart();
                        openCart();
                      }}
                      className="mv-btn-primary gap-2"
                    >
                      <ShoppingCart size={16} />
                      Add to cart
                    </button>
                    <button type="button" onClick={handleBuyNow} className="mv-btn-red gap-2">
                      Buy Now
                      <ArrowRight size={16} />
                    </button>
                  </div>
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] py-3 text-[13px] font-bold text-white transition hover:bg-[#1fb855]"
                  >
                    Order on WhatsApp
                  </a>
                </>
              ) : (
                // Either no price is set yet (admin left it blank), or it's
                // out of stock — Buy Now / Add to Cart don't make sense
                // either way, so WhatsApp (pre-filled with a price/pre-order
                // message + a link back to this page) is the only ordering
                // path shown.
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] py-3.5 text-[14px] font-bold text-white transition hover:bg-[#1fb855]"
                >
                  {inStock ? "Order on WhatsApp" : "Out of Stock — Pre-order on WhatsApp"}
                </a>
              )}
              {canPurchase ? (
                <>
                  <button
                    type="button"
                    onClick={() => setEmiModalOpen(true)}
                    className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-mv-primary py-3 text-[13px] font-semibold text-mv-primary transition hover:bg-mv-blue-light"
                  >
                    <ClipboardList size={16} />
                    Calculate EMI
                  </button>
                  <EmiCalculatorModal
                    open={emiModalOpen}
                    onClose={() => setEmiModalOpen(false)}
                    productName={product.name}
                    productPrice={price}
                  />
                </>
              ) : null}
              <div className="mt-3 flex gap-3">
                <button type="button" className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-mv-primary py-2.5 text-[12px] font-semibold text-mv-primary">
                  <Share2 size={14} />
                  Share
                </button>
                <button
                  type="button"
                  onClick={handleToggleWishlist}
                  disabled={toggleWishlist.isPending}
                  className={cn(
                    "flex flex-1 items-center justify-center gap-1.5 rounded-xl border py-2.5 text-[12px] font-semibold transition disabled:opacity-60",
                    isWishlisted ? "border-mv-red bg-mv-red text-white" : "border-mv-red text-mv-red",
                  )}
                >
                  <Heart size={14} className={isWishlisted ? "fill-white" : undefined} />
                  {isWishlisted ? "Wishlisted" : "Wish List"}
                </button>
              </div>
            </div>

            {/* Right: Images */}
            <div>
              <div className="relative aspect-square overflow-hidden rounded-xl border border-mv-border bg-white p-8">
                <Image src={images[activeImage] ?? "/images/placeholders/product.svg"} alt={product.name} fill className="object-contain" />
              </div>
              <div className="relative mt-3 rounded-xl border border-mv-border bg-white p-3">
                <span className="absolute left-4 top-2 text-[11px] font-medium text-mv-muted">{activeImage + 1}/{images.length}</span>
                <div className="mt-4 flex justify-center gap-2">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setActiveImage(i)}
                      className={cn("relative h-16 w-16 overflow-hidden rounded-lg border-2", activeImage === i ? "border-mv-primary" : "border-mv-border")}
                    >
                      <Image src={img} alt="" fill className="object-contain p-1" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Info tabs */}
          <div className="mt-12">
            <div className="mx-auto flex w-fit rounded-full border border-mv-border bg-white p-1">
              {infoTabs.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={cn("rounded-full px-5 py-2 text-[12px] font-semibold transition", activeTab === tab ? "bg-mv-primary text-white" : "text-mv-muted hover:text-mv-text")}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="mt-6 rounded-xl border border-mv-border bg-white p-6">
              {activeTab === "Description" && (
                <p className="text-[13px] leading-relaxed text-mv-muted">
                  {product.detail?.description ?? product.detail?.short_description ?? "No description available."}
                </p>
              )}
              {activeTab === "Specs" && (
                product.detail?.specifications?.length ? (
                  <dl className="grid gap-4 sm:grid-cols-2">
                    {product.detail.specifications.map((spec, i) => (
                      <div key={i}>
                        <dt className="text-[12px] font-semibold text-mv-text">{spec.label}</dt>
                        <dd className="mt-1 text-[13px] text-mv-muted">{spec.value}</dd>
                      </div>
                    ))}
                  </dl>
                ) : (
                  <p className="text-[13px] text-mv-muted">No specifications available.</p>
                )
              )}
              {activeTab === "Compatibility" && (
                <div className="space-y-4 text-[13px] text-mv-muted">
                  {product.detail?.compatible_brands?.length ? (
                    <div>
                      <p className="font-semibold text-mv-text">Compatible Brands</p>
                      <p className="mt-1">{product.detail.compatible_brands.join(", ")}</p>
                    </div>
                  ) : null}
                  {product.detail?.compatible_models?.length ? (
                    <div>
                      <p className="font-semibold text-mv-text">Compatible Models</p>
                      <p className="mt-1">{product.detail.compatible_models.join(", ")}</p>
                    </div>
                  ) : null}
                  {product.detail?.compatible_years?.length ? (
                    <div>
                      <p className="font-semibold text-mv-text">Compatible Years</p>
                      <p className="mt-1">{product.detail.compatible_years.join(", ")}</p>
                    </div>
                  ) : null}
                  {product.detail?.compatible_engines?.length ? (
                    <div>
                      <p className="font-semibold text-mv-text">Compatible Engines</p>
                      <p className="mt-1">{product.detail.compatible_engines.join(", ")}</p>
                    </div>
                  ) : null}
                  {!product.detail?.compatible_brands?.length &&
                    !product.detail?.compatible_models?.length &&
                    !product.detail?.compatible_years?.length &&
                    !product.detail?.compatible_engines?.length && (
                      <p>No compatibility information available.</p>
                    )}
                </div>
              )}
              {activeTab === "Review" && (
                <div className="space-y-6">
                  {isAuthenticated ? (
                    <form onSubmit={handleSubmitReview} className="rounded-xl border border-mv-border bg-mv-bg p-4">
                      <p className="text-[12px] font-semibold text-mv-text">Write a Review</p>
                      <div className="mt-2 flex gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <button key={i} type="button" onClick={() => setReviewRating(i + 1)}>
                            <Star
                              size={20}
                              className={i < reviewRating ? "fill-amber-400 text-amber-400" : "text-gray-300"}
                            />
                          </button>
                        ))}
                      </div>
                      <input
                        type="text"
                        placeholder="Title (optional)"
                        value={reviewTitle}
                        onChange={(e) => setReviewTitle(e.target.value)}
                        className="mt-3 w-full rounded-lg border border-mv-border px-3 py-2 text-[13px] outline-none focus:border-mv-primary"
                        maxLength={150}
                      />
                      <textarea
                        placeholder="Share your experience with this part..."
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        rows={3}
                        className="mt-2 w-full rounded-lg border border-mv-border px-3 py-2 text-[13px] outline-none focus:border-mv-primary"
                        maxLength={2000}
                      />
                      {submitReview.isError ? (
                        <div className="mt-2">
                          <ErrorMessage message={getErrorMessage(submitReview.error)} />
                        </div>
                      ) : null}
                      <button
                        type="submit"
                        disabled={submitReview.isPending}
                        className="mt-3 flex items-center gap-2 rounded-lg bg-mv-primary px-4 py-2 text-[12px] font-semibold text-white disabled:opacity-60"
                      >
                        {submitReview.isPending ? <Loader2 size={14} className="animate-spin" /> : null}
                        Submit Review
                      </button>
                    </form>
                  ) : (
                    <p className="rounded-xl border border-mv-border bg-mv-bg p-4 text-[13px] text-mv-muted">
                      <Link href="/sign-in" className="font-semibold text-mv-primary hover:underline">
                        Sign in
                      </Link>{" "}
                      to write a review.
                    </p>
                  )}

                  {reviewsQuery.isLoading ? (
                    <p className="text-[13px] text-mv-muted">Loading reviews...</p>
                  ) : reviewsQuery.data?.items.length ? (
                    <div className="space-y-4">
                      {reviewsQuery.data.items.map((review) => (
                        <div key={review.id} className="border-b border-mv-border pb-4 last:border-0">
                          <div className="flex items-center justify-between">
                            <p className="text-[13px] font-semibold text-mv-text">{review.author}</p>
                            <span className="text-[11px] text-mv-muted">
                              {new Date(review.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="mt-1 flex">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star key={i} size={12} className={i < review.rating ? "fill-amber-400 text-amber-400" : "text-gray-200"} />
                            ))}
                          </div>
                          {review.title ? <p className="mt-1 text-[13px] font-semibold text-mv-text">{review.title}</p> : null}
                          {review.comment ? <p className="mt-1 text-[13px] text-mv-muted">{review.comment}</p> : null}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[13px] text-mv-muted">No reviews yet. Be the first to review this product.</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Why Choose */}
          <div className="mt-12 text-center">
            <h2 className="text-[20px] font-bold text-mv-primary">Why Choose Moto Vessel?</h2>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {whyChoose.map((item, i) => (
                <div key={i} className="rounded-xl border border-mv-border bg-white p-4">
                  <p className="text-[16px] font-bold text-mv-primary">{item.title}</p>
                  <p className="mt-1 text-[10px] text-mv-muted">{item.sub}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Related Products */}
          <div className="mt-12 pb-8">
            <span className="mx-auto block w-fit rounded-full bg-mv-blue-light px-4 py-1 text-[11px] font-semibold text-mv-primary">
              You Might Also Like
            </span>
            <h2 className="mt-3 text-center text-[22px] font-bold text-mv-text">Related Products</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {relatedLoading &&
                Array.from({ length: 3 }).map((_, i) => <ProductCardSkeleton key={i} />)}
              {!relatedLoading &&
                relatedProducts.map((p) => {
                const relatedBadge = stockBadge[p.stockStatus ?? "in-stock"];
                const apiProduct = relatedData?.items.find((item) => item.id === p.id);
                const relatedInStock = (p.stockStatus ?? "in-stock") !== "out-of-stock";
                const relatedCanPurchase = p.hasPrice && relatedInStock;
                const relatedWhatsappHref = buildWhatsAppInquiryLink({
                  phone: settings?.contact_phone,
                  productName: p.name,
                  productUrl: productAbsoluteUrl(p.slug ?? p.id),
                  hasPrice: p.hasPrice ?? true,
                  inStock: relatedInStock,
                });
                return (
                  <article key={p.id} className="overflow-hidden rounded-xl border border-mv-border bg-white shadow-sm">
                    <Link href={`/products/${p.slug ?? p.id}`} prefetch={false} className="relative block aspect-[4/3] bg-mv-bg p-4">
                      <span className={cn("absolute right-3 top-3 rounded-full px-2 py-0.5 text-[10px] font-semibold", relatedBadge.class)}>
                        {relatedBadge.label}
                      </span>
                      <Image src={p.image} alt={p.name} width={200} height={150} className="h-full w-full object-contain" />
                    </Link>
                    <div className="p-4">
                      <span className="rounded-full bg-mv-blue-light px-2 py-0.5 text-[10px] font-semibold text-mv-primary">{p.category}</span>
                      <h3 className="mt-2 text-[13px] font-semibold text-mv-text">{p.name}</h3>
                      <div className="mt-1 flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} size={11} className={i < Math.round(p.rating) ? "fill-amber-400 text-amber-400" : "text-gray-200"} />
                        ))}
                      </div>
                      <p className="mt-2 text-[15px] font-bold">{formatPrice(p.price)}</p>
                      <div className="mt-3 flex gap-2">
                        {relatedCanPurchase ? (
                          <>
                            <button
                              type="button"
                              onClick={() =>
                                handleRelatedAddToCart(
                                  apiProduct?.id ?? p.id,
                                  apiProduct?.source ?? p.source ?? "pos",
                                  apiProduct?.sku ?? `SKU-${p.id}`,
                                  p.name,
                                  p.price,
                                  p.image,
                                )
                              }
                              className="flex-1 rounded-xl border border-mv-primary py-2 text-[11px] font-semibold text-mv-primary"
                            >
                              Add to Cart
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                handleRelatedBuyNow(
                                  apiProduct?.id ?? p.id,
                                  apiProduct?.source ?? p.source ?? "pos",
                                  apiProduct?.sku ?? `SKU-${p.id}`,
                                  p.name,
                                  p.price,
                                  p.image,
                                )
                              }
                              className="flex-1 rounded-xl bg-mv-primary py-2 text-[11px] font-semibold text-white"
                            >
                              Buy Now
                            </button>
                          </>
                        ) : (
                          <a
                            href={relatedWhatsappHref}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 rounded-xl bg-[#25D366] py-2 text-center text-[11px] font-semibold text-white"
                          >
                            {relatedInStock ? "Order on WhatsApp" : "Contact on WhatsApp"}
                          </a>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
              {!relatedLoading && relatedProducts.length === 0 && (
                <p className="col-span-full text-center text-[13px] text-mv-muted">No related products found.</p>
              )}
            </div>
            <div className="mt-6 flex justify-center gap-2">
              <button type="button" className="flex h-8 w-8 items-center justify-center rounded-full border border-mv-border text-mv-muted hover:border-mv-primary hover:text-mv-primary">
                <ChevronLeft size={16} />
              </button>
              <button type="button" className="flex h-8 w-8 items-center justify-center rounded-full border border-mv-border text-mv-muted hover:border-mv-primary hover:text-mv-primary">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
            </>
          )}
        </div>
    </div>
  );
}
