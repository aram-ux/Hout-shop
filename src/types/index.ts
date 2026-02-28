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
  aboutImage?: SanityImage;
  featuredBanner?: SanityImage;
  trustBadges?: (SanityImage & { label?: LocalizedString })[];
}

export interface AboutPage {
  storyImage?: SanityImage;
  gallery?: (SanityImage & { caption?: LocalizedString })[];
  teamPhoto?: SanityImage;
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
