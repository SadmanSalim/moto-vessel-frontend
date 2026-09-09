"use client";

import Script from "next/script";
import { useCmsSettings } from "@/hooks/useCms";

const GA4_ID_ENV = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID;
const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;
const META_PIXEL_ID_ENV = process.env.NEXT_PUBLIC_META_PIXEL_ID;

// Placeholder values ship in .env.* so the app runs out of the box with no
// pixel IDs configured. Anything still containing "XXXX" (or left blank)
// is treated as "not set up yet" so we never fire requests at bogus IDs.
function isConfigured(id?: string): id is string {
  return !!id && !id.includes("XXXX");
}

/**
 * Loads gtag.js (GA4 + Google Ads), an optional GTM container, and the Meta
 * Pixel base code. Rendered once from the root layout. Every event in
 * lib/analytics.ts calls window.gtag()/window.fbq(), which these scripts
 * define — GA4 and the Meta Pixel are the two events fire against by
 * default, so those two IDs come from Settings → General → SEO in the admin
 * panel (falling back to the env vars below if left blank there). GTM and
 * Google Ads aren't in the admin panel yet, so those still come from env
 * vars only. Whichever ID is missing simply has its script skipped —
 * events keep firing through gtag/fbq either way, they just have nowhere
 * to land until an ID is set.
 */
export default function AnalyticsScripts() {
  // Wait for Settings to resolve before deciding what to render, so we
  // never inject gtag.js with the env placeholder and then re-inject it a
  // moment later with the admin-configured ID.
  const { data: settings, isLoading } = useCmsSettings();

  if (isLoading) return null;

  const GA4_ID = settings?.google_analytics_id || GA4_ID_ENV;
  const META_PIXEL_ID = settings?.meta_pixel_id || META_PIXEL_ID_ENV;

  const gtmEnabled = isConfigured(GTM_ID);
  const ga4Enabled = isConfigured(GA4_ID);
  const adsEnabled = isConfigured(GOOGLE_ADS_ID);
  const metaEnabled = isConfigured(META_PIXEL_ID);

  return (
    <>
      {gtmEnabled ? (
        <>
          <Script id="gtm-base" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`}
          </Script>
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
              title="gtm"
            />
          </noscript>
        </>
      ) : null}

      {ga4Enabled || adsEnabled ? (
        <>
          <Script
            id="gtag-lib"
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${ga4Enabled ? GA4_ID : GOOGLE_ADS_ID}`}
          />
          <Script id="gtag-init" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
gtag('js', new Date());
${ga4Enabled ? `gtag('config', '${GA4_ID}');` : ""}
${adsEnabled ? `gtag('config', '${GOOGLE_ADS_ID}');` : ""}`}
          </Script>
        </>
      ) : null}

      {metaEnabled ? (
        <>
          <Script id="meta-pixel" strategy="afterInteractive">
            {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${META_PIXEL_ID}');
fbq('track', 'PageView');`}
          </Script>
          <noscript>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              height="1"
              width="1"
              style={{ display: "none" }}
              src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
              alt=""
            />
          </noscript>
        </>
      ) : null}
    </>
  );
}
