"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { useCookieConsent } from "./CookieConsent";

// Replace with your actual GA4 Measurement ID
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export default function GoogleAnalytics() {
  const consent = useCookieConsent();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    function onConsentUpdate() {
      const stored = localStorage.getItem("hout-shop-cookie-consent");
      if (stored === "granted" && GA_MEASUREMENT_ID) {
        setLoaded(true);
      }
    }

    // Check on mount
    onConsentUpdate();

    // Listen for consent changes
    window.addEventListener("cookie-consent-update", onConsentUpdate);
    return () =>
      window.removeEventListener("cookie-consent-update", onConsentUpdate);
  }, []);

  // Don't render if no consent or no measurement ID
  if (!loaded || !GA_MEASUREMENT_ID) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', {
            page_path: window.location.pathname,
            cookie_flags: 'SameSite=None;Secure',
          });
        `}
      </Script>
    </>
  );
}
