import type { Locale } from "@/i18n/routing";
import type { LocalizedString, StandardSize } from "@/types";

/**
 * Format a price in Euro currency
 */
export function formatPrice(price: number, locale: Locale = "nl"): string {
  const localeMap: Record<string, string> = {
    nl: "nl-BE",
    fr: "fr-BE",
    en: "en-GB",
  };

  return new Intl.NumberFormat(localeMap[locale] || "nl-BE", {
    style: "currency",
    currency: "EUR",
  }).format(price);
}

/**
 * Get the localized value from a LocalizedString
 */
export function localize(
  field: LocalizedString | undefined | null,
  locale: Locale
): string {
  if (!field) return "";
  return field[locale] || field.nl || field.en || "";
}

/**
 * Find the closest standard size that covers the requested dimensions.
 * "Covers" means the standard size's width >= requested width AND height >= requested height.
 * Among all covering sizes, pick the one with the smallest area (closest fit).
 * Returns null if no standard size can cover the requested dimensions.
 */
export function findClosestStandardSize(
  widthCm: number,
  heightCm: number,
  standardSizes: StandardSize[]
): StandardSize | null {
  // Filter sizes that can cover the requested dimensions
  const coveringSizes = standardSizes.filter(
    (s) => s.width >= widthCm && s.height >= heightCm
  );

  if (coveringSizes.length === 0) {
    // Also try rotated (swap width/height of standard sizes)
    const rotatedCovering = standardSizes.filter(
      (s) => s.height >= widthCm && s.width >= heightCm
    );
    if (rotatedCovering.length === 0) return null;
    // Pick smallest area among rotated covering sizes
    return rotatedCovering.reduce((best, s) => {
      const area = s.width * s.height;
      const bestArea = best.width * best.height;
      return area < bestArea ? s : best;
    });
  }

  // Pick the one with the smallest area (closest fit)
  return coveringSizes.reduce((best, s) => {
    const area = s.width * s.height;
    const bestArea = best.width * best.height;
    return area < bestArea ? s : best;
  });
}

/**
 * Calculate price for custom dimensions based on the closest standard size + surcharge.
 */
export function calculateCustomPrice(
  widthCm: number,
  heightCm: number,
  standardSizes: StandardSize[],
  surcharge: number
): { price: number; matchedSize: StandardSize } | null {
  const matched = findClosestStandardSize(widthCm, heightCm, standardSizes);
  if (!matched) return null;
  return {
    price: Math.round((matched.price + surcharge) * 100) / 100,
    matchedSize: matched,
  };
}

/**
 * Calculate shipping cost
 */
export function calculateShipping(
  subtotal: number,
  freeThreshold: number = 500,
  standardCost: number = 29.95
): number {
  return subtotal >= freeThreshold ? 0 : standardCost;
}

/**
 * Calculate VAT (21% Belgian/Dutch)
 */
export function calculateVAT(amount: number): number {
  return Math.round(amount * 0.21 * 100) / 100;
}

/**
 * Generate a unique order number
 */
export function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `HS-${timestamp}-${random}`;
}

/**
 * Class name utility (simplified cn)
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}
