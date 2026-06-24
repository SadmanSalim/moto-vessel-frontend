import type { Metadata } from "next";
import { Inter, Quicksand } from "next/font/google";
import RoadAnimation from "@/components/RoadAnimation";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Moto Vessel - Premium Automotive Parts & Services",
  description:
    "Shop genuine auto parts, explore premium brands, and access emergency roadside services. Built for performance and trust.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${quicksand.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="relative z-[2] flex min-h-screen flex-col" suppressHydrationWarning>
        <RoadAnimation />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
