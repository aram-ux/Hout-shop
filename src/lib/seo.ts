import type { Metadata } from "next";
import type { Locale } from "@/i18n/routing";
import { routing } from "@/i18n/routing";

// ---- Site Configuration ----
// Update SITE_URL to your production domain before deploying
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.hout-shop.com";

export const SITE_NAME = "Hout-Shop";

export const ORGANIZATION = {
  name: "Hout-Shop",
  legalName: "Hout-Shop BV",
  url: SITE_URL,
  logo: `${SITE_URL}/images/logo.png`,
  description: {
    nl: "Belgisch familiebedrijf gespecialiseerd in premium eiken panelen. Levering in België en Nederland.",
    fr: "Entreprise familiale belge spécialisée dans les panneaux de chêne premium. Livraison en Belgique et aux Pays-Bas.",
    en: "Belgian family business specializing in premium oak panels. Delivery in Belgium and the Netherlands.",
  },
  address: {
    streetAddress: "", // Vul in met echt adres
    addressLocality: "", // Vul in met stad
    postalCode: "", // Vul in met postcode
    addressCountry: "BE",
  },
  contactPoint: {
    telephone: "", // Vul in met telefoonnummer
    email: "", // Vul in met emailadres
  },
};

// ---- Helper: Build locale-prefixed path ----
export function getLocalePath(locale: Locale, path: string): string {
  if (locale === routing.defaultLocale) {
    return path === "/" ? "" : path;
  }
  return `/${locale}${path}`;
}

// ---- Helper: Build absolute URL ----
export function getAbsoluteUrl(path: string): string {
  return `${SITE_URL}${path}`;
}

// ---- Helper: Build hreflang alternates ----
export function buildAlternates(
  pathnames: Record<Locale, string>
): Metadata["alternates"] {
  const languages: Record<string, string> = {};

  for (const locale of routing.locales) {
    const localePath = getLocalePath(
      locale as Locale,
      pathnames[locale as Locale]
    );
    languages[locale] = getAbsoluteUrl(localePath);
  }

  // x-default points to the default locale
  const defaultPath = getLocalePath(
    routing.defaultLocale as Locale,
    pathnames[routing.defaultLocale as Locale]
  );
  languages["x-default"] = getAbsoluteUrl(defaultPath);

  return {
    canonical: languages[routing.defaultLocale],
    languages,
  };
}

// ---- Helper: Default Open Graph ----
export function buildOpenGraph(
  locale: Locale,
  overrides: {
    title?: string;
    description?: string;
    url?: string;
    images?: { url: string; width?: number; height?: number; alt?: string }[];
    type?: "website" | "article";
  } = {}
): NonNullable<Metadata["openGraph"]> {
  const localeMap: Record<Locale, string> = {
    nl: "nl_BE",
    fr: "fr_BE",
    en: "en_GB",
  };

  return {
    siteName: SITE_NAME,
    locale: localeMap[locale],
    type: overrides.type || "website",
    title: overrides.title,
    description: overrides.description,
    url: overrides.url,
    images: overrides.images || [
      {
        url: `${SITE_URL}/images/og-default.jpg`,
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} - Premium Eiken Panelen`,
      },
    ],
  };
}

// ---- JSON-LD: Organization ----
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: ORGANIZATION.name,
    legalName: ORGANIZATION.legalName,
    url: ORGANIZATION.url,
    logo: ORGANIZATION.logo,
    description: ORGANIZATION.description.nl,
    address: {
      "@type": "PostalAddress",
      ...ORGANIZATION.address,
    },
    ...(ORGANIZATION.contactPoint.telephone && {
      contactPoint: {
        "@type": "ContactPoint",
        telephone: ORGANIZATION.contactPoint.telephone,
        email: ORGANIZATION.contactPoint.email,
        contactType: "customer service",
        availableLanguage: ["Dutch", "French", "English"],
      },
    }),
    sameAs: [
      // Voeg je social media URLs toe
      // "https://www.facebook.com/hout-shop",
      // "https://www.instagram.com/hout-shop",
    ],
  };
}

// ---- JSON-LD: WebSite (voor sitelinks search box) ----
export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/producten?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

// ---- JSON-LD: Product ----
export function productJsonLd(product: {
  name: string;
  description: string;
  slug: string;
  image?: string;
  price?: number;
  inStock: boolean;
  category?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    url: `${SITE_URL}/producten/${product.slug}`,
    ...(product.image && { image: product.image }),
    ...(product.category && { category: product.category }),
    brand: {
      "@type": "Brand",
      name: SITE_NAME,
    },
    ...(product.price && {
      offers: {
        "@type": "Offer",
        priceCurrency: "EUR",
        price: product.price,
        availability: product.inStock
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
        seller: {
          "@type": "Organization",
          name: SITE_NAME,
        },
        shippingDetails: {
          "@type": "OfferShippingDetails",
          shippingRate: {
            "@type": "MonetaryAmount",
            value: "0",
            currency: "EUR",
          },
          shippingDestination: [
            {
              "@type": "DefinedRegion",
              addressCountry: "BE",
            },
            {
              "@type": "DefinedRegion",
              addressCountry: "NL",
            },
          ],
          deliveryTime: {
            "@type": "ShippingDeliveryTime",
            handlingTime: {
              "@type": "QuantitativeValue",
              minValue: 1,
              maxValue: 3,
              unitCode: "DAY",
            },
            transitTime: {
              "@type": "QuantitativeValue",
              minValue: 2,
              maxValue: 5,
              unitCode: "DAY",
            },
          },
        },
      },
    }),
  };
}

// ---- JSON-LD: BreadcrumbList ----
export function breadcrumbJsonLd(
  items: { name: string; url: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

// ---- JSON-LD: LocalBusiness ----
export function localBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Store",
    name: ORGANIZATION.name,
    url: ORGANIZATION.url,
    logo: ORGANIZATION.logo,
    image: `${SITE_URL}/images/og-default.jpg`,
    description: ORGANIZATION.description.nl,
    address: {
      "@type": "PostalAddress",
      ...ORGANIZATION.address,
    },
    ...(ORGANIZATION.contactPoint.telephone && {
      telephone: ORGANIZATION.contactPoint.telephone,
    }),
    priceRange: "€€",
    currenciesAccepted: "EUR",
    paymentAccepted: "iDEAL, Bancontact, Credit Card",
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "08:00",
        closes: "17:00",
      },
    ],
    geo: {
      "@type": "GeoCoordinates",
      // Vul in met echte coördinaten
      latitude: "",
      longitude: "",
    },
    areaServed: [
      { "@type": "Country", name: "Belgium" },
      { "@type": "Country", name: "Netherlands" },
    ],
  };
}
