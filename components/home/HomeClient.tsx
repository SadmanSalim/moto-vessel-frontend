"use client";

import { CategorySlider } from "@/components/home/CategorySlider";
import { CtaBannerSection } from "@/components/home/CtaBannerSection";
import { CustomSection } from "@/components/home/CustomSection";
import { EmergencyBanner } from "@/components/home/EmergencyBanner";
import { FeaturedPartsSection } from "@/components/home/FeaturedPartsSection";
import { HeroSection } from "@/components/home/HeroSection";
import { MobileAppSection } from "@/components/home/MobileAppSection";
import { PremiumBrands } from "@/components/home/PremiumBrands";
import { ScrollToTop } from "@/components/home/ScrollToTop";
import { TestimonialSection } from "@/components/home/TestimonialSection";
import { ValuePromiseSection } from "@/components/home/ValuePromiseSection";
import { VehicleFilterBar } from "@/components/home/VehicleFilterBar";
import { VideoGallery } from "@/components/home/VideoGallery";
import { useCmsHomepage } from "@/hooks/useCms";
import { useReveal } from "@/hooks/useReveal";
import { isSectionVisible } from "@/lib/cmsHelpers";
import type { CmsHomepageData } from "@/services/cmsService";
import type { Banner, Category, PaginatedProducts } from "@/types";

export default function HomeClient({
  initialBanners,
  initialHomepage,
  initialFeaturedProducts,
  initialCategories,
}: {
  initialBanners: Banner[];
  initialHomepage: CmsHomepageData | null;
  initialFeaturedProducts: PaginatedProducts | null;
  initialCategories?: Category[];
}) {
  useReveal();
  const { data: homepage } = useCmsHomepage(initialHomepage ?? undefined);
  const sections = homepage?.sections;

  // Admin-added sections (Filament > Content Management > Homepage Sections)
  // render here, in the order set in the admin panel.
  const customSections = (sections ?? [])
    .filter((s) => s.section_type === "custom" && s.is_visible)
    .sort((a, b) => a.sort_order - b.sort_order);

  return (
    <>
      {isSectionVisible(sections, "hero") ? <HeroSection initialBanners={initialBanners} /> : null}
      <CategorySlider initialCategories={initialCategories} />
      {isSectionVisible(sections, "vehicle_finder") ? <VehicleFilterBar /> : null}
      {isSectionVisible(sections, "featured_products") ? (
        <FeaturedPartsSection initialProducts={initialFeaturedProducts ?? undefined} />
      ) : null}
      {isSectionVisible(sections, "features") ? <ValuePromiseSection /> : null}
      <MobileAppSection />
      <EmergencyBanner />
      {isSectionVisible(sections, "cta_banner") ? <CtaBannerSection /> : null}
      <VideoGallery />
      {isSectionVisible(sections, "brands_section") ? <PremiumBrands /> : null}
      {isSectionVisible(sections, "testimonials") ? <TestimonialSection /> : null}
      {customSections.map((section) => (
        <CustomSection key={section.section_key} section={section} />
      ))}
      <ScrollToTop />
    </>
  );
}
