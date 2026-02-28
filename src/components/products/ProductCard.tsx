"use client";

import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag } from "lucide-react";
import Badge from "../ui/Badge";
import { urlFor } from "@/sanity/lib/image";
import { localize, formatPrice } from "@/lib/utils";
import type { Product } from "@/types";
import type { Locale } from "@/i18n/routing";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const locale = useLocale() as Locale;
  const t = useTranslations("products");
  const tc = useTranslations("common");

  const prefix = locale === "nl" ? "" : `/${locale}`;
  const productPath: Record<Locale, string> = {
    nl: "/producten",
    fr: "/produits",
    en: "/products",
  };
  const href = `${prefix}${productPath[locale]}/${product.slug.current}`;

  const title = localize(product.title, locale);
  const description = localize(product.shortDescription, locale);
  const sizes = Array.isArray(product.standardSizes) ? product.standardSizes : [];
  const lowestPrice = sizes.length > 0
    ? sizes.reduce((min, size) => (size.price < min ? size.price : min), sizes[0]?.price || 0)
    : 0;

  return (
    <Link href={href} className="group block">
      <article className="bg-white rounded-xl border border-oak-200 overflow-hidden hover:shadow-lg hover:border-oak-300 transition-all duration-300">
        {/* Image */}
        <div className="relative aspect-[4/3] bg-oak-100 overflow-hidden">
          {product.mainImage ? (
            <Image
              src={urlFor(product.mainImage).width(600).height(450).url()}
              alt={localize(product.mainImage.alt, locale) || title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-2 bg-oak-200 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-oak-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <span className="text-oak-400 text-xs">No image</span>
              </div>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            {product.featured && (
              <Badge variant="gold">{tc("featured")}</Badge>
            )}
            {!product.inStock && (
              <Badge variant="default">{tc("outOfStock")}</Badge>
            )}
          </div>

          {/* Quick Add Overlay */}
          <div className="absolute inset-0 bg-oak-900/0 group-hover:bg-oak-900/10 transition-colors duration-300 flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100">
            <span className="bg-white/90 backdrop-blur-sm text-oak-800 px-4 py-2 rounded-lg text-sm font-medium shadow-sm flex items-center gap-2">
              <ShoppingBag className="w-4 h-4" />
              {tc("viewProduct")}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Category */}
          {product.category && (
            <span className="text-xs text-gold-dark font-medium uppercase tracking-wider">
              {localize(product.category.title, locale)}
            </span>
          )}

          {/* Title */}
          <h3 className="text-lg font-semibold text-oak-800 mt-1 mb-2 group-hover:text-oak-600 transition-colors line-clamp-1">
            {title}
          </h3>

          {/* Short Description */}
          {description && (
            <p className="text-oak-500 text-sm line-clamp-2 mb-4">
              {description}
            </p>
          )}

          {/* Price & Meta */}
          <div className="flex items-end justify-between">
            <div>
              {lowestPrice ? (
                <div className="flex items-baseline gap-1">
                  <span className="text-xs text-oak-400">
                    {t("startingFrom")}
                  </span>
                  <span className="text-xl font-bold text-oak-800">
                    {formatPrice(lowestPrice, locale)}
                  </span>
                </div>
              ) : (
                <span className="text-sm text-oak-400">
                  {t("customAvailable")}
                </span>
              )}
            </div>

            {/* Wood type indicator */}
            {product.woodType && (
              <span className="text-xs text-oak-400 bg-oak-100 px-2 py-1 rounded">
                {t(`woodTypes.${product.woodType}`)}
              </span>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}
