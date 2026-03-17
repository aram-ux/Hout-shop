"use client";

import { useTranslations, useLocale } from "next-intl";
import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import ProductCard from "./ProductCard";
import type { Product, Category } from "@/types";
import type { Locale } from "@/i18n/routing";
import { localize } from "@/lib/utils";
import { trackViewItemList } from "@/lib/analytics";

interface ProductGridProps {
  products: Product[];
  categories?: Category[];
}

export default function ProductGrid({ products, categories }: ProductGridProps) {
  const t = useTranslations("products");
  const locale = useLocale() as Locale;
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Track product list view on mount
  useEffect(() => {
    if (products.length > 0) {
      trackViewItemList(
        products.map((p) => ({
          id: p._id,
          name: localize(p.title, locale) || "",
          category: localize(p.category?.title, locale) || "",
          price: Array.isArray(p.standardSizes) && p.standardSizes.length > 0
            ? p.standardSizes.reduce((min, s) => (s.price < min ? s.price : min), p.standardSizes[0]?.price || 0)
            : undefined,
        }))
      );
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredProducts = products.filter((p) => {
    const matchesCategory =
      !activeCategory || p.category?.slug.current === activeCategory;

    if (!searchQuery.trim()) return matchesCategory;

    const q = searchQuery.toLowerCase();
    const title = localize(p.title, locale)?.toLowerCase() || "";
    const desc = localize(p.shortDescription, locale)?.toLowerCase() || "";
    const wood = p.woodType?.toLowerCase() || "";
    const finish = p.finish?.toLowerCase() || "";
    const cat = localize(p.category?.title, locale)?.toLowerCase() || "";

    const matchesSearch =
      title.includes(q) ||
      desc.includes(q) ||
      wood.includes(q) ||
      finish.includes(q) ||
      cat.includes(q);

    return matchesCategory && matchesSearch;
  });

  return (
    <div>
      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-oak-400" />
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t("searchPlaceholder")}
          className="w-full pl-12 pr-10 py-3 bg-white border border-oak-200 rounded-xl text-oak-800 placeholder-oak-400 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-colors"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-oak-400 hover:text-oak-600 cursor-pointer"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

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
