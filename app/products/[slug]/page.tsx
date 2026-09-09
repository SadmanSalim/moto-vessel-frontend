import type { Metadata } from "next";
import ProductDetailClient from "@/components/products/ProductDetailClient";
import {
  fetchProduct,
  fetchProductSlugs,
  productMetaDescription,
  productMetaImage,
} from "@/lib/serverApi";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  // Now that this runs as a live `next start` server (not `output:
  // 'export'`), a product slug missing from this list isn't a dead end
  // any more — Next's default `dynamicParams: true` means it just renders
  // that page on-demand on its first request and caches the result, same
  // as any other page here (see the REVALIDATE_* comment in
  // lib/serverApi.ts). Pre-building the current catalog here is still worth
  // doing though: it means the ~3,300 products that exist as of any given
  // deploy are already-rendered and instant on first load, instead of
  // every one of them paying a cold-render on its very first visit. 20000
  // is comfortably above that with headroom to grow — bump this (or switch
  // to a dedicated slugs-only endpoint) if the catalog ever approaches it.
  const slugs = await fetchProductSlugs(20000);

  if (slugs.length === 0) {
    // If NEXT_PUBLIC_API_URL (.env.production) isn't reachable from the
    // machine running `npm run build`, this comes back empty and every
    // product page would silently render on-demand instead of being
    // pre-built — not broken, just needlessly slow for the whole catalog
    // on its first visit after each deploy. Failing loudly here surfaces
    // that immediately instead of it going unnoticed.
    throw new Error(
      `generateStaticParams() for /products/[slug] got 0 product slugs back from ${process.env.NEXT_PUBLIC_API_URL ?? "(no NEXT_PUBLIC_API_URL set)"}. ` +
        "The backend API must be live and reachable from the machine running `npm run build` — check that the URL is correct and the server is up before rebuilding."
    );
  }

  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await fetchProduct(slug);

  if (!product) {
    return { title: "Product Not Found | MotoVessel" };
  }

  const image = productMetaImage(product);

  return {
    title: `${product.name} | MotoVessel`,
    description: productMetaDescription(product),
    openGraph: {
      title: product.name,
      description: productMetaDescription(product),
      images: image ? [image] : [],
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  // Reuses the same build-time fetch generateMetadata already needs, and
  // passes it down as initialData so the page shows real content
  // immediately instead of a skeleton followed by a second, redundant
  // client-side fetch of the exact same product.
  const initialProduct = await fetchProduct(slug);
  return <ProductDetailClient params={params} initialProduct={initialProduct ?? undefined} />;
}
