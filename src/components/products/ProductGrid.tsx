"use client";

import { useTranslations, useLocale } from "next-intl";
import { useState } from "react";
import ProductCard from "./ProductCard";
import type { Product, Category } from "@/types";
import type { Locale } from "@/i18n/routing";
import { localize } from "@/lib/utils";

interface ProductGridProps {
  products: Product[];
  categories?: Category[];
}

export default function ProductGrid({ products, categories }: ProductGridProps) {
  const t = useTranslations("products");
  const locale = useLocale() as Locale;
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filteredProducts = activeCategory
    ? products.filter(
        (p) => p.category?.slug.current === activeCategory
      )
    : products;

  return (
    <div>
      {/* Category Filter */}
      {categories && categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
              activeCategory === null
                ? "bg-oak-800 text-white"
                : "bg-oak-100 text-oak-600 hover:bg-oak-200"
            }`}
          >
            {t("filterAll")}
          </button>
          {categories.map((category) => (
            <button
              key={category._id}
              onClick={() => setActiveCategory(category.slug.current)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                activeCategory === category.slug.current
                  ? "bg-oak-800 text-white"
                  : "bg-oak-100 text-oak-600 hover:bg-oak-200"
              }`}
            >
              {localize(category.title, locale)}
            </button>
          ))}
        </div>
      )}

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-oak-500 text-lg">{t("noProducts")}</p>
        </div>
      )}
    </div>
  );
}
