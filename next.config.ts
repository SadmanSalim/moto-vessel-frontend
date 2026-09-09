import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Used to be `output: 'export'` back when this ran on Hostinger's shared
  // hosting (no Node.js runtime — plain Apache serving files out of
  // public_html). Now that the site is on its own VPS with a live `next
  // start` process (same setup as moto-vessel-api, via PM2), static export
  // is gone: every fetch in lib/serverApi.ts carries `next: { revalidate }`
  // instead, so a page rendered once gets silently re-rendered with fresh
  // data in the background after that window elapses — admin panel changes
  // (banners, categories, homepage sections, product edits) show up on
  // their own without a manual rebuild+redeploy. trailingSlash is kept so
  // every existing indexed/bookmarked URL (e.g. /products/all/) keeps
  // resolving exactly as it did under static export.
  trailingSlash: true,
  images: {
    remotePatterns: [
      { protocol: "http", hostname: "localhost", port: "8000", pathname: "/storage/**" },
      { protocol: "http", hostname: "127.0.0.1", port: "8000", pathname: "/storage/**" },
      { protocol: "https", hostname: "api.motovessel.com", pathname: "/storage/**" },
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    // The running dev server keeps rejecting these remote patterns with
    // "url parameter is not allowed" even right after a fresh restart and a
    // deleted .next folder, which points to a config-loading problem on
    // this machine rather than the patterns themselves. Bypassing the
    // built-in optimizer sidesteps that entirely — next/image renders the
    // source URL as-is instead of proxying it through /_next/image, so
    // there's no domain allow-list check left to fail.
    unoptimized: true,
  },
  compress: true,
  poweredByHeader: false,
  experimental: {
    optimizePackageImports: ["lucide-react", "@tanstack/react-query"],
    // Don't keep a client-side RSC cache of visited pages; otherwise an
    // admin edit + on-demand revalidate still looks "stuck" when a shopper
    // navigates back to a page they already opened in this tab.
    staleTimes: { dynamic: 0, static: 0 },
  },
};

export default nextConfig;
