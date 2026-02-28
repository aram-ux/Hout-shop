"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Ruler, Calculator, Info } from "lucide-react";
import Button from "../ui/Button";
import { formatPrice, calculateCustomPrice } from "@/lib/utils";
import { useCartStore } from "@/lib/store/cart";
import type { Product, CustomDimensions, StandardSize } from "@/types";
import type { Locale } from "@/i18n/routing";

interface CustomDimensionCalculatorProps {
  product: Product;
  customDimensions: CustomDimensions;
}

export default function CustomDimensionCalculator({
  product,
  customDimensions,
}: CustomDimensionCalculatorProps) {
  const t = useTranslations("products");
  const tc = useTranslations("common");
  const locale = useLocale() as Locale;
  const addItem = useCartStore((s) => s.addItem);

  const [width, setWidth] = useState(customDimensions.minWidth || 10);
  const [height, setHeight] = useState(customDimensions.minHeight || 10);
  const [thickness, setThickness] = useState(
    customDimensions.availableThicknesses?.[0] || 18
  );
  const [calculatedPrice, setCalculatedPrice] = useState<number | null>(null);
  const [matchedSize, setMatchedSize] = useState<StandardSize | null>(null);
  const [noMatch, setNoMatch] = useState(false);

  const handleCalculate = () => {
    const standardSizes = product.standardSizes || [];
    const surcharge = customDimensions.customSizeSurcharge || 0;

    const result = calculateCustomPrice(width, height, standardSizes, surcharge);

    if (!result) {
      setCalculatedPrice(null);
      setMatchedSize(null);
      setNoMatch(true);
      return;
    }

    setCalculatedPrice(result.price);
    setMatchedSize(result.matchedSize);
    setNoMatch(false);
  };

  const handleAddToCart = () => {
    if (!calculatedPrice) return;

    addItem({
      productId: product._id,
      productTitle: product.title,
      productSlug: product.slug.current,
      productImage: product.mainImage,
      width,
      height,
      thickness,
      isCustomSize: true,
      unitPrice: calculatedPrice,
      quantity: 1,
    });
  };

  return (
    <div className="bg-oak-50 rounded-xl border border-oak-200 p-6">
      <div className="flex items-center gap-2 mb-6">
        <Ruler className="w-5 h-5 text-gold-dark" />
        <h3 className="font-semibold text-oak-800">{t("orCustomSize")}</h3>
      </div>

      <div className="space-y-4">
        {/* Width */}
        <div>
          <label className="block text-sm font-medium text-oak-700 mb-1">
            {tc("width")} ({tc("cm")})
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={width}
              onChange={(e) => setWidth(Number(e.target.value))}
              min={customDimensions.minWidth}
              max={customDimensions.maxWidth}
              className="flex-1 px-3 py-2 bg-white border border-oak-300 rounded-lg text-oak-900 focus:border-gold focus:ring-1 focus:ring-gold outline-none text-sm"
            />
            <span className="text-xs text-oak-400 whitespace-nowrap">
              {customDimensions.minWidth} – {customDimensions.maxWidth} {tc("cm")}
            </span>
          </div>
        </div>

        {/* Height */}
        <div>
          <label className="block text-sm font-medium text-oak-700 mb-1">
            {tc("height")} ({tc("cm")})
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
              min={customDimensions.minHeight}
              max={customDimensions.maxHeight}
              className="flex-1 px-3 py-2 bg-white border border-oak-300 rounded-lg text-oak-900 focus:border-gold focus:ring-1 focus:ring-gold outline-none text-sm"
            />
            <span className="text-xs text-oak-400 whitespace-nowrap">
              {customDimensions.minHeight} – {customDimensions.maxHeight} {tc("cm")}
            </span>
          </div>
        </div>

        {/* Thickness */}
        {customDimensions.availableThicknesses?.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-oak-700 mb-1">
              {tc("thickness")} ({tc("mm")})
            </label>
            <div className="flex gap-2 flex-wrap">
              {customDimensions.availableThicknesses.map((t) => (
                <button
                  key={t}
                  onClick={() => setThickness(t)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                    thickness === t
                      ? "bg-oak-800 text-white"
                      : "bg-white border border-oak-300 text-oak-600 hover:border-oak-400"
                  }`}
                >
                  {t} {tc("mm")}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Surcharge info */}
        {customDimensions.customSizeSurcharge > 0 && (
          <div className="text-sm text-oak-500 bg-white px-3 py-2 rounded-lg border border-oak-200">
            <Info className="w-4 h-4 inline-block mr-1" />
            {t("customSurchargeInfo", {
              surcharge: formatPrice(customDimensions.customSizeSurcharge, locale),
            })}
          </div>
        )}

        {/* Calculate Button */}
        <Button onClick={handleCalculate} variant="secondary" className="w-full">
          {t("calculatePrice")}
        </Button>

        {/* No match warning */}
        {noMatch && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {t("noMatchingSize")}
          </div>
        )}

        {/* Calculated Price */}
        {calculatedPrice !== null && matchedSize && (
          <div className="bg-white border-2 border-gold/30 rounded-lg p-4 text-center">
            <span className="text-sm text-oak-500 block mb-1">
              {t("calculatedPrice")} ({width} × {height} {tc("cm")})
            </span>
            <span className="text-2xl font-bold text-oak-800">
              {formatPrice(calculatedPrice, locale)}
            </span>
            <span className="text-xs text-oak-400 block mt-1">
              {t("basedOnSize", {
                width: matchedSize.width,
                height: matchedSize.height,
              })}{" "}
              + {formatPrice(customDimensions.customSizeSurcharge || 0, locale)}{" "}
              {t("surcharge")}
            </span>
            <Button
              variant="gold"
              className="w-full mt-3"
              onClick={handleAddToCart}
            >
              {tc("addToCart")}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
