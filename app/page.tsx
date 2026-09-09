import HomeClient from "@/components/home/HomeClient";
import { fetchCmsHomepage, fetchFeaturedProducts, fetchHeroBanners, fetchNavCategories } from "@/lib/serverApi";

// Server component so the hero banner, homepage section config, the
// default "Best Selling" product tab, and the category strip are all
// fetched at build time and baked into the static HTML, instead of the
// previous all-client-side setup where nothing below the header could
// render real content until multiple sequential API calls resolved in the
// browser (and CategorySlider in particular briefly showed a hardcoded
// placeholder category list every time).
export default async function Home() {
  const [initialBanners, initialHomepage, initialFeaturedProducts, initialCategories] = await Promise.all([
    fetchHeroBanners(),
    fetchCmsHomepage(),
    fetchFeaturedProducts(4),
    fetchNavCategories(),
  ]);

  return (
    <HomeClient
      initialBanners={initialBanners}
      initialHomepage={initialHomepage}
      initialFeaturedProducts={initialFeaturedProducts}
      initialCategories={initialCategories}
    />
  );
}
