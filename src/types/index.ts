import type { Locale } from "@/i18n/routing";

// ---- Sanity Types ----

export interface LocalizedString {
  nl?: string;
  fr?: string;
  en?: string;
}

export interface LocalizedBlock {
  nl?: unknown[];
  fr?: unknown[];
  en?: unknown[];
}

export interface SanityImage {
  _type: "image";
  asset: {
    _ref: string;
    _type: "reference";
  };
  hotspot?: {
    x: number;
    y: number;
    height: number;
    width: number;
  };
  alt?: LocalizedString;
}

export interface StandardSize {
  _key: string;
  width: number;
  height: number;
  thickness: number;
  price: number;
}

export interface CustomDimensions {
  enabled: boolean;
  minWidth: number;
  maxWidth: number;
  minHeight: number;
  maxHeight: number;
  availableThicknesses: number[];
  customSizeSurcharge: number;
}

export interface Specification {
  _key: string;
  label: LocalizedString;
  value: LocalizedString;
}

export interface Product {
  _id: string;
  title: LocalizedString;
  slug: { current: string };
  shortDescription?: LocalizedString;
  description?: LocalizedBlock;
  mainImage?: SanityImage;
  images?: SanityImage[];
  category?: Category;
  standardSizes?: StandardSize[];
  customDimensions?: CustomDimensions;
  woodType?: string;
  finish?: string;
  specifications?: Specification[];
  inStock: boolean;
  featured: boolean;
}

export interface Category {
  _id: string;
  title: LocalizedString;
  slug: { current: string };
  description?: LocalizedString;
  image?: SanityImage;
}

export interface SiteSettings {
  title?: LocalizedString;
  description?: LocalizedString;
  logo?: SanityImage;
  favicon?: SanityImage;
  ogImage?: SanityImage & { alt?: string };
  contactEmail?: string;
  contactPhone?: string;
  address?: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  vatNumber?: string;
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    pinterest?: string;
  };
  shippingInfo?: {
    freeShippingThreshold: number;
    standardShippingCost: number;
    estimatedDeliveryDays: number;
  };
}

export interface HomePage {
  heroImage?: SanityImage;
  heroAccentImage?: SanityImage;
  heroTagline?: LocalizedString;
  heroTitle?: LocalizedString;
  heroSubtitle?: LocalizedString;
  heroCta?: LocalizedString;
  heroSecondaryCta?: LocalizedString;
  aboutImage?: SanityImage;
  aboutPreviewTitle?: LocalizedString;
  aboutPreviewSubtitle?: LocalizedString;
  aboutPreviewDescription?: LocalizedString;
  aboutPreviewCta?: LocalizedString;
  featuredTitle?: LocalizedString;
  featuredSubtitle?: LocalizedString;
  featuredBanner?: SanityImage;
  trustItems?: {
    icon?: string;
    title?: LocalizedString;
    description?: LocalizedString;
  }[];
  trustBadges?: (SanityImage & { label?: LocalizedString })[];
}

export interface AboutPage {
  pageTitle?: LocalizedString;
  pageSubtitle?: LocalizedString;
  pageDescription?: LocalizedString;
  storyTitle?: LocalizedString;
  storyText?: LocalizedString;
  storyImage?: SanityImage;
  values?: {
    icon?: string;
    title?: LocalizedString;
    description?: LocalizedString;
  }[];
  qualityTitle?: LocalizedString;
  qualityText?: LocalizedString;
  sustainableTitle?: LocalizedString;
  sustainableText?: LocalizedString;
  gallery?: (SanityImage & { caption?: LocalizedString })[];
  teamPhoto?: SanityImage;
}

export interface ContactPage {
  pageTitle?: LocalizedString;
  pageDescription?: LocalizedString;
  heroImage?: SanityImage;
  address?: {
    street?: string;
    city?: string;
    postalCode?: string;
    country?: string;
  };
  phone?: string;
  email?: string;
  openingHours?: LocalizedString;
  googleMapsEmbed?: string;
  formSuccessMessage?: LocalizedString;
}

export interface ProductsPage {
  pageTitle?: LocalizedString;
  pageSubtitle?: LocalizedString;
  heroBanner?: SanityImage;
  emptyStateMessage?: LocalizedString;
}

export interface InfoPage {
  pageTitle?: LocalizedString;
  pageSubtitle?: LocalizedString;
  pageDescription?: LocalizedString;
  qualitiesTitle?: LocalizedString;
  qualitiesIntro?: LocalizedString;
  qualities?: {
    name?: LocalizedString;
    description?: LocalizedString;
    features?: LocalizedString[];
  }[];
  panelsTitle?: LocalizedString;
  panelsIntro?: LocalizedString;
  panels?: {
    name?: LocalizedString;
    description?: LocalizedString;
  }[];
  originsTitle?: LocalizedString;
  originsIntro?: LocalizedString;
  origins?: {
    name?: LocalizedString;
    description?: LocalizedString;
  }[];
  dimensionsTitle?: LocalizedString;
  dimensionsIntro?: LocalizedString;
  dimensionsPropertyLabel?: LocalizedString;
  dimensionsRangeLabel?: LocalizedString;
  dimensions?: {
    label?: LocalizedString;
    value?: LocalizedString;
  }[];
  generalTitle?: LocalizedString;
  generalPropertyLabel?: LocalizedString;
  generalValueLabel?: LocalizedString;
  generalInfo?: {
    label?: LocalizedString;
    value?: LocalizedString;
  }[];
  ctaTitle?: LocalizedString;
  ctaText?: LocalizedString;
  ctaProductsLabel?: LocalizedString;
  ctaContactLabel?: LocalizedString;
}

// ---- Cart Types ----

export interface CartItem {
  id: string; // unique key for cart item
  productId: string;
  productTitle: LocalizedString;
  productSlug: string;
  productImage?: SanityImage;
  width: number;
  height: number;
  thickness: number;
  isCustomSize: boolean;
  unitPrice: number;
  quantity: number;
}

// ---- Checkout Types ----

export interface CheckoutForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  shippingStreet: string;
  shippingCity: string;
  shippingPostalCode: string;
  shippingCountry: "BE" | "NL";
  billingStreet?: string;
  billingCity?: string;
  billingPostalCode?: string;
  billingCountry?: string;
  companyName?: string;
  vatNumber?: string;
  sameAsBilling: boolean;
  notes?: string;
}

// ---- Utility Types ----

export interface BlogPost {
  _id: string;
  title: LocalizedString;
  slug: { current: string };
  excerpt?: LocalizedString;
  body?: LocalizedBlock;
  mainImage?: SanityImage;
  publishedAt?: string;
  author?: string;
  tags?: string[];
  seoTitle?: LocalizedString;
  seoDescription?: LocalizedString;
}

export type LocalizedField<T> = {
  [key in Locale]?: T;
};

/**
 * Extract localized value from a LocalizedString based on current locale
 */
export function getLocalizedValue(
  field: LocalizedString | undefined | null,
  locale: Locale
): string {
  if (!field) return "";
  return field[locale] || field.nl || field.en || "";
}
