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
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

export default function Home() {
  return (
    <>
      <Header />
      <main>
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
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
