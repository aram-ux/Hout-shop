import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/studio/",
          "/afrekenen/",
          "/checkout/",
          "/paiement/",
          "/winkelwagen",
          "/cart",
          "/panier",
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
