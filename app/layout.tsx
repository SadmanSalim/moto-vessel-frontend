import type { Metadata } from "next";
import { Inter, Quicksand } from "next/font/google";
import { Suspense } from "react";
import AnalyticsRouteTracker from "@/components/analytics/AnalyticsRouteTracker";
import AnalyticsScripts from "@/components/analytics/AnalyticsScripts";
import { CartSidebar } from "@/components/cart/CartSidebar";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import QueryProvider from "@/providers/QueryProvider";
import StorefrontLiveSync from "@/components/StorefrontLiveSync";
import ThemeProvider from "@/providers/ThemeProvider";
import { fetchCmsFooter, fetchCmsNavMenus, fetchCmsSettings, fetchCmsTheme, fetchStores } from "@/lib/serverApi";
import "./globals.css";

// display: "optional" instead of "swap" — "swap" is what was causing the
// visible flash (browser paints with the fallback system font immediately,
// then swaps to Inter/Quicksand once it loads mid-render). "optional"
// gives the font a very short window to be ready; if it isn't, the page
// just uses the fallback for that load instead of swapping fonts visibly
// later. Once the (self-hosted, cached) font file has loaded once, it's
// ready well within that window on every subsequent page.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "optional",
});

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
  display: "optional",
});

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Moto Vessel - Premium Automotive Parts & Services",
  description:
    "Shop genuine auto parts, explore premium brands, and access emergency roadside services. Built for performance and trust.",
};

// Async server component — this layout wraps every page, so Header, Footer,
// and ThemeProvider previously had zero build-time data (unlike the
// homepage body, which was already seeded via lib/serverApi.ts). That meant
// the nav links, logo, brand colors/fonts, and footer branches were 100%
// client-fetched and visibly popped in after the shell had already painted,
// on every single page load. Fetching them here at build time and passing
// them down as initialData mirrors the same fix already applied to app/page.tsx.
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [initialNavMenus, initialSettings, initialTheme, initialFooter, initialStores] = await Promise.all([
    fetchCmsNavMenus(),
    fetchCmsSettings(),
    fetchCmsTheme(),
    fetchCmsFooter(),
    fetchStores(),
  ]);

  return (
    <html lang="en" className={`${inter.variable} ${quicksand.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="relative z-[2] flex min-h-screen flex-col" suppressHydrationWarning>
        <QueryProvider>
          <StorefrontLiveSync />
          <AnalyticsScripts />
          <Suspense fallback={null}>
            <AnalyticsRouteTracker />
          </Suspense>
          <ThemeProvider initialTheme={initialTheme}>
            <Header initialNavMenus={initialNavMenus} initialSettings={initialSettings} />
            <main className="flex-1">{children}</main>
            <Footer initialFooter={initialFooter} initialStores={initialStores} />
            <MobileBottomNav />
            <CartSidebar />
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
