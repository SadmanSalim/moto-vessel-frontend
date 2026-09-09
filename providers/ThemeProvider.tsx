"use client";

import { useEffect } from "react";
import { useCmsTheme } from "@/hooks/useCms";
import type { CmsTheme } from "@/services/cmsService";

// Google Fonts already bundled at build time via next/font (see app/layout.tsx)
// — for these we just point the CSS variable at the font next/font already
// loaded, no network request needed. Anything else the admin picks from the
// Theme & Branding font list is fetched from Google Fonts at runtime.
//
// Quicksand was missing from this map, so even when the admin's configured
// heading_font_family was literally "Quicksand" — the same font already
// self-hosted and painted via next/font on first render — applyFont() fell
// through to the runtime-fetch branch below. That branch immediately sets
// --font-heading to `'Quicksand', system-ui, sans-serif` before the newly
// injected Google Fonts <link> has finished loading, so the browser can't
// resolve a font literally named "Quicksand" yet and drops to system-ui for
// a beat, then swaps again once the CDN stylesheet arrives — the exact
// "looks right on load, changes right after the theme API call resolves"
// flash. Mapping it here keeps it on the already-loaded next/font variable,
// same as Inter, so the CMS theme call is a no-op for the font that's
// already showing.
const BUILT_IN_FONTS: Record<string, string> = {
  Inter: "var(--font-inter)",
  Quicksand: "var(--font-quicksand)",
};

function applyFont(cssVar: string, fontName: string | undefined) {
  if (!fontName || typeof document === "undefined") return;

  const builtIn = BUILT_IN_FONTS[fontName];
  if (builtIn) {
    document.documentElement.style.setProperty(cssVar, builtIn);
    return;
  }

  const linkId = `google-font-${fontName.replace(/\s+/g, "-").toLowerCase()}`;
  if (!document.getElementById(linkId)) {
    const link = document.createElement("link");
    link.id = linkId;
    link.rel = "stylesheet";
    link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontName)}:wght@400;500;600;700;800&display=swap`;
    document.head.appendChild(link);
  }

  document.documentElement.style.setProperty(cssVar, `'${fontName}', system-ui, sans-serif`);
}

/**
 * Applies admin-configured brand colors, fonts, and corner style (Filament >
 * Settings > Theme & Branding) as CSS custom properties on <html>. Every
 * mv-* Tailwind color utility (bg-mv-primary, text-mv-primary, etc.) and the
 * body/heading font-family in globals.css read from these same variables,
 * so this restyles the whole site without any component changes.
 */
export default function ThemeProvider({
  children,
  initialTheme,
}: {
  children: React.ReactNode;
  initialTheme?: CmsTheme | null;
}) {
  const { data: theme } = useCmsTheme(initialTheme ?? undefined);

  useEffect(() => {
    if (!theme) return;

    const root = document.documentElement.style;
    const map: Record<string, string | undefined> = {
      "--mv-primary": theme.primary_color,
      "--mv-primary-dark": theme.primary_color,
      "--mv-navy": theme.secondary_color,
      "--mv-navy-deep": theme.secondary_color,
      "--mv-accent-sky": theme.accent_color,
      "--mv-text": theme.text_color,
      "--mv-bg": theme.background_color,
    };

    Object.entries(map).forEach(([cssVar, value]) => {
      if (value) root.setProperty(cssVar, value);
    });

    if (theme.border_radius) {
      const radius = theme.border_radius === "sharp" ? "0px" : theme.border_radius === "pill" ? "24px" : "12px";
      root.setProperty("--mv-radius-xl", radius);
    }

    applyFont("--font-body", theme.font_family);
    applyFont("--font-heading", theme.heading_font_family);
  }, [theme]);

  return <>{children}</>;
}
