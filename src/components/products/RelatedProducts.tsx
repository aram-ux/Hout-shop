"use client";

import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { localize, formatPrice } from "@/lib/utils";
import type { Product } from "@/types";
import type { Locale } from "@/i18n/routing";

interface RelatedProductsProps {
  products: Product[];
}

export default function RelatedProducts({ products }: RelatedProductsProps) {
  const locale = useLocale() as Locale;
  const t = useTranslations("products");

  if (products.length === 0) return null;

  const prefix = locale === "nl" ? "" : `/${locale}`;
  const productPath: Record<Locale, string> = {
    nl: "/producten",
    fr: "/produits",
    en: "/products",
  };

  return (
    <section className="mt-16 pt-12 border-t border-oak-200">
      <h2 className="text-2xl font-bold text-oak-800 mb-6 font-[family-name:var(--font-heading)]">
        {locale === "nl"
          ? "Gerelateerde producten"
          : locale === "fr"
            ? "Produits similaires"
            : "Related products"}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.slice(0, 3).map((product) => {
          const title = localize(product.title, locale);
          const sizes = Array.isArray(product.standardSizes) ? product.standardSizes : [];
          const lowestPrice = sizes.length > 0
            ? sizes.reduce((min, size) => (size.price < min ? size.price : min), sizes[0]?.price || 0)
            : 0;
          const href = `${prefix}${productPath[locale]}/${product.slug.current}`;

          return (
            <Link key={product._id} href={href} className="group block">
              <article className="bg-white rounded-xl border border-oak-200 overflow-hidden hover:shadow-lg hover:border-oak-300 transition-all duration-300">
                <div className="relative aspect-[4/3] bg-oak-100 overflow-hidden">
                  {product.mainImage ? (
                    <Image
                      src={urlFor(product.mainImage).width(400).height(300).url()}
                      alt={localize(product.mainImage.alt, locale) || title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-oak-300">
                      <span className="text-sm">{title}</span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-oak-800 text-sm group-hover:text-gold-dark transition-colors line-clamp-1">
                    {title}
                  </h3>
                  {lowestPrice > 0 && (
                    <p className="text-sm text-oak-500 mt-1">
                      {t("startingFrom")}{" "}
                      <span className="font-semibold text-gold-dark">
                        {formatPrice(lowestPrice, locale)}
                      </span>
                    </p>
                  )}
                </div>
              </article>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
