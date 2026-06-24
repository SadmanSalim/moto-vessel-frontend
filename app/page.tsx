"use client";

import { CategorySlider } from "@/components/home/CategorySlider";
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
import { useReveal } from "@/hooks/useReveal";

export default function Home() {
  useReveal();

  return (
    <>
      <HeroSection />
      <CategorySlider />
      <VehicleFilterBar />
      <FeaturedPartsSection />
      <ValuePromiseSection />
      <MobileAppSection />
      <EmergencyBanner />
      <VideoGallery />
      <TestimonialSection />
      <PremiumBrands />
      <ScrollToTop />
    </>
  );
}
