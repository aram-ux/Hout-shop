import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["nl", "fr", "en"],
  defaultLocale: "nl",
  localePrefix: "as-needed",
  pathnames: {
    "/": "/",
    "/products": {
      nl: "/producten",
      fr: "/produits",
      en: "/products",
    },
    "/products/[slug]": {
      nl: "/producten/[slug]",
      fr: "/produits/[slug]",
      en: "/products/[slug]",
    },
    "/cart": {
      nl: "/winkelwagen",
      fr: "/panier",
      en: "/cart",
    },
    "/checkout": {
      nl: "/afrekenen",
      fr: "/paiement",
      en: "/checkout",
    },
    "/checkout/success": {
      nl: "/afrekenen/succes",
      fr: "/paiement/succes",
      en: "/checkout/success",
    },
    "/about": {
      nl: "/over-ons",
      fr: "/a-propos",
      en: "/about",
    },
    "/contact": {
      nl: "/contact",
      fr: "/contact",
      en: "/contact",
    },
  },
});

export type Pathnames = keyof typeof routing.pathnames;
export type Locale = (typeof routing.locales)[number];
