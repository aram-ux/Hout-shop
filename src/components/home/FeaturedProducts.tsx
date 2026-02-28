"use client";

import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Container from "../ui/Container";
import ProductCard from "../products/ProductCard";
import Button from "../ui/Button";
import type { Product } from "@/types";
import type { Locale } from "@/i18n/routing";

interface FeaturedProductsProps {
  products: Product[];
}

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  const t = useTranslations("featured");
  const tc = useTranslations("common");
  const locale = useLocale() as Locale;
  const prefix = locale === "nl" ? "" : `/${locale}`;

  const getProductsPath = () => {
    const paths: Record<Locale, string> = {
      nl: "/producten",
      fr: "/produits",
      en: "/products",
    };
    return `${prefix}${paths[locale]}`;
  };

  return (
    <section className="py-20 lg:py-28">
      <Container>
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-oak-800 mb-4 font-[family-name:var(--font-heading)]">
            {t("title")}
          </h2>
          <p className="text-lg text-oak-500 max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </div>

        {/* Product Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-oak-100 rounded-2xl">
            <div className="w-16 h-16 mx-auto mb-4 bg-oak-200 rounded-full flex items-center justify-center">
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
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-oak-700 mb-2">
              Producten worden binnenkort toegevoegd
            </h3>
            <p className="text-oak-500 text-sm">
              Voeg producten toe via het Sanity CMS dashboard (
              <code className="bg-oak-200 px-1 rounded">/studio</code>)
            </p>
          </div>
        )}

        {/* View All CTA */}
        {products.length > 0 && (
          <div className="text-center mt-12">
            <Link href={getProductsPath()}>
              <Button variant="outline" size="lg">
                {tc("viewAll")}
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        )}
      </Container>
    </section>
  );
}
