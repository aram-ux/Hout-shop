"use client";

import { useState, useMemo, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { ShoppingBag, Check, ChevronLeft, ChevronRight } from "lucide-react";
import Button from "../ui/Button";
import Badge from "../ui/Badge";
import Container from "../ui/Container";
import CustomDimensionCalculator from "./CustomDimensionCalculator";
import { urlFor } from "@/sanity/lib/image";
import { localize, formatPrice } from "@/lib/utils";
import { useCartStore } from "@/lib/store/cart";
import { trackViewItem, trackAddToCart } from "@/lib/analytics";
import type { Product, StandardSize } from "@/types";
import type { Locale } from "@/i18n/routing";

interface ProductDetailProps {
  product: Product;
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const t = useTranslations("products");
  const tc = useTranslations("common");
  const locale = useLocale() as Locale;
  const addItem = useCartStore((s) => s.addItem);

  // ---- Size selectors (cascading dropdowns) ----
  const sizes = product.standardSizes ?? [];

  const uniqueThicknesses = useMemo(
    () => [...new Set(sizes.map((s) => s.thickness))].sort((a, b) => a - b),
    [sizes]
  );

  const [selectedThickness, setSelectedThickness] = useState<number>(
    () => sizes[0]?.thickness ?? 0
  );
  const [selectedWidth, setSelectedWidth] = useState<number>(
    () => sizes[0]?.width ?? 0
  );
  const [selectedHeight, setSelectedHeight] = useState<number>(
    () => sizes[0]?.height ?? 0
  );

  const availableWidths = useMemo(
    () =>
      [
        ...new Set(
          sizes
            .filter((s) => s.thickness === selectedThickness)
            .map((s) => s.width)
        ),
      ].sort((a, b) => a - b),
    [sizes, selectedThickness]
  );

  const availableHeights = useMemo(
    () =>
      [
        ...new Set(
          sizes
            .filter(
              (s) =>
                s.thickness === selectedThickness &&
                s.width === selectedWidth
            )
            .map((s) => s.height)
        ),
      ].sort((a, b) => a - b),
    [sizes, selectedThickness, selectedWidth]
  );

  const selectedSize = useMemo(
    () =>
      sizes.find(
        (s) =>
          s.thickness === selectedThickness &&
          s.width === selectedWidth &&
          s.height === selectedHeight
      ) ?? null,
    [sizes, selectedThickness, selectedWidth, selectedHeight]
  );

  const handleThicknessChange = (thickness: number) => {
    setSelectedThickness(thickness);
    const widths = [
      ...new Set(
        sizes
          .filter((s) => s.thickness === thickness)
          .map((s) => s.width)
      ),
    ].sort((a, b) => a - b);
    const newWidth = widths[0] ?? 0;
    setSelectedWidth(newWidth);
    const heights = [
      ...new Set(
        sizes
          .filter(
            (s) => s.thickness === thickness && s.width === newWidth
          )
          .map((s) => s.height)
      ),
    ].sort((a, b) => a - b);
    setSelectedHeight(heights[0] ?? 0);
  };

  const handleWidthChange = (width: number) => {
    setSelectedWidth(width);
    const heights = [
      ...new Set(
        sizes
          .filter(
            (s) =>
              s.thickness === selectedThickness && s.width === width
          )
          .map((s) => s.height)
      ),
    ].sort((a, b) => a - b);
    setSelectedHeight(heights[0] ?? 0);
  };

  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);

  const allImages = [
    product.mainImage,
    ...(product.images || []),
  ].filter(Boolean);

  const title = localize(product.title, locale);

  // Track product view
  useEffect(() => {
    const lowestPrice = sizes.length > 0
      ? sizes.reduce((min, s) => (s.price < min ? s.price : min), sizes[0]?.price || 0)
      : 0;
    trackViewItem({
      id: product._id,
      name: title || "",
      category: localize(product.category?.title, locale) || "",
      price: lowestPrice,
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product._id]);

  const handleAddToCart = () => {
    if (!selectedSize) return;

    addItem({
      productId: product._id,
      productTitle: product.title,
      productSlug: product.slug.current,
      productImage: product.mainImage,
      width: selectedSize.width,
      height: selectedSize.height,
      thickness: selectedSize.thickness,
      isCustomSize: false,
      unitPrice: selectedSize.price,
      quantity,
    });

    setAddedToCart(true);
    trackAddToCart({
      id: product._id,
      name: title || "",
      category: localize(product.category?.title, locale) || "",
      price: selectedSize.price,
      quantity,
    });
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const nextImage = () => {
    setCurrentImageIndex((i) =>
      i < allImages.length - 1 ? i + 1 : 0
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((i) =>
      i > 0 ? i - 1 : allImages.length - 1
    );
  };

  return (
    <Container>
      <div className="grid lg:grid-cols-2 gap-12 py-8">
        {/* Left - Image Gallery */}
        <div>
          {/* Main Image */}
          <div className="relative aspect-square bg-oak-100 rounded-xl overflow-hidden mb-4">
            {allImages[currentImageIndex] ? (
              <Image
                src={urlFor(allImages[currentImageIndex]!)
                  .width(800)
                  .height(800)
                  .url()}
                alt={title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto mb-4 bg-oak-200 rounded-full flex items-center justify-center">
                    <svg
                      className="w-12 h-12 text-oak-400"
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
                  <p className="text-oak-400 text-sm">
                    Add images via Sanity CMS
                  </p>
                </div>
              </div>
            )}

            {/* Navigation arrows */}
            {allImages.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors cursor-pointer shadow"
                >
                  <ChevronLeft className="w-5 h-5 text-oak-800" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors cursor-pointer shadow"
                >
                  <ChevronRight className="w-5 h-5 text-oak-800" />
                </button>
              </>
            )}

            {/* Badges */}
            <div className="absolute top-4 left-4 flex gap-2">
              {product.featured && (
                <Badge variant="gold">{tc("featured")}</Badge>
              )}
              {!product.inStock && (
                <Badge variant="default">{tc("outOfStock")}</Badge>
              )}
            </div>
          </div>

          {/* Thumbnail Gallery */}
          {allImages.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {allImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors cursor-pointer ${
                    currentImageIndex === index
                      ? "border-gold"
                      : "border-oak-200 hover:border-oak-300"
                  }`}
                >
                  {img && (
                    <Image
                      src={urlFor(img).width(160).height(160).url()}
                      alt={`${title} ${index + 1}`}
                      width={80}
                      height={80}
                      className="object-cover w-full h-full"
                    />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right - Product Info */}
        <div>
          {/* Category */}
          {product.category && (
            <span className="text-sm text-gold-dark font-medium uppercase tracking-wider">
              {localize(product.category.title, locale)}
            </span>
          )}

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl font-bold text-oak-800 mt-2 mb-4 font-[family-name:var(--font-heading)]">
            {title}
          </h1>

          {/* Short Description */}
          {product.shortDescription && (
            <p className="text-oak-600 text-lg leading-relaxed mb-6">
              {localize(product.shortDescription, locale)}
            </p>
          )}

          {/* Wood Type & Finish */}
          <div className="flex flex-wrap gap-4 mb-6">
            {product.woodType && (
              <div className="text-sm">
                <span className="text-oak-400">{t("woodType")}: </span>
                <span className="font-medium text-oak-700">
                  {t(`woodTypes.${product.woodType}`)}
                </span>
              </div>
            )}
            {product.finish && (
              <div className="text-sm">
                <span className="text-oak-400">{t("finish")}: </span>
                <span className="font-medium text-oak-700">
                  {t(`finishes.${product.finish}`)}
                </span>
              </div>
            )}
          </div>

          {/* Standard Sizes — Dropdown Selectors */}
          {sizes.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-oak-800 mb-3">
                {t("availableSizes")}
              </h3>
              <div className="space-y-4">
                {/* Thickness selector */}
                {uniqueThicknesses.length > 1 ? (
                  <div>
                    <label className="block text-sm font-medium text-oak-600 mb-2">
                      {tc("thickness")} ({tc("mm")})
                    </label>
                    <div className="flex gap-2 flex-wrap">
                      {uniqueThicknesses.map((th) => (
                        <button
                          key={th}
                          onClick={() => handleThicknessChange(th)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                            selectedThickness === th
                              ? "bg-oak-800 text-white"
                              : "bg-white border border-oak-300 text-oak-600 hover:border-oak-400"
                          }`}
                        >
                          {th} {tc("mm")}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : uniqueThicknesses.length === 1 ? (
                  <div className="text-sm text-oak-500">
                    {tc("thickness")}:{" "}
                    <span className="font-medium text-oak-700">
                      {uniqueThicknesses[0]} {tc("mm")}
                    </span>
                  </div>
                ) : null}

                {/* Width & Height dropdowns */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-oak-600 mb-2">
                      {tc("width")} ({tc("cm")})
                    </label>
                    <select
                      value={selectedWidth}
                      onChange={(e) =>
                        handleWidthChange(Number(e.target.value))
                      }
                      className="w-full px-3 py-2.5 bg-white border border-oak-300 rounded-lg text-oak-800 font-medium focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none text-sm cursor-pointer"
                    >
                      {availableWidths.map((w) => (
                        <option key={w} value={w}>
                          {w} cm
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-oak-600 mb-2">
                      {tc("height")} ({tc("cm")})
                    </label>
                    <select
                      value={selectedHeight}
                      onChange={(e) =>
                        setSelectedHeight(Number(e.target.value))
                      }
                      className="w-full px-3 py-2.5 bg-white border border-oak-300 rounded-lg text-oak-800 font-medium focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none text-sm cursor-pointer"
                    >
                      {availableHeights.map((h) => (
                        <option key={h} value={h}>
                          {h} cm
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Selected size price */}
                {selectedSize && (
                  <div className="bg-gold/5 border-2 border-gold/30 rounded-lg p-4 flex items-center justify-between">
                    <span className="text-sm text-oak-600">
                      {selectedSize.width} × {selectedSize.height}{" "}
                      {tc("cm")} — {selectedSize.thickness} {tc("mm")}
                    </span>
                    <span className="text-2xl font-bold text-oak-800">
                      {formatPrice(selectedSize.price, locale)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Quantity + Add to Cart */}
          {selectedSize && product.inStock && (
            <div className="flex gap-3 mb-6">
              <div className="flex items-center border border-oak-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 text-oak-600 hover:bg-oak-100 transition-colors cursor-pointer"
                >
                  −
                </button>
                <span className="px-4 py-2 text-center font-medium text-oak-800 min-w-[48px]">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2 text-oak-600 hover:bg-oak-100 transition-colors cursor-pointer"
                >
                  +
                </button>
              </div>
              <Button
                variant="gold"
                size="lg"
                className="flex-1"
                onClick={handleAddToCart}
              >
                {addedToCart ? (
                  <>
                    <Check className="w-5 h-5" />
                    {tc("addToCart")} ✓
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5" />
                    {tc("addToCart")} — {formatPrice(selectedSize.price * quantity, locale)}
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Out of Stock Message */}
          {!product.inStock && (
            <div className="bg-oak-100 text-oak-600 px-4 py-3 rounded-lg mb-6 text-sm">
              {tc("outOfStock")}
            </div>
          )}

          {/* Custom Dimensions Calculator */}
          {product.customDimensions?.enabled && (
            <CustomDimensionCalculator
              product={product}
              customDimensions={product.customDimensions}
            />
          )}

          {/* Specifications */}
          {product.specifications && product.specifications.length > 0 && (() => {
            const filteredSpecs = product.specifications.filter(
              (spec) => !spec.label?.nl?.toLowerCase().includes("richtprijs per m")
            );
            if (filteredSpecs.length === 0) return null;
            return (
            <div className="mt-8 pt-8 border-t border-oak-200">
              <h3 className="font-semibold text-oak-800 mb-4">
                {t("specifications")}
              </h3>
              <dl className="space-y-3">
                {filteredSpecs.map((spec) => (
                  <div
                    key={spec._key}
                    className="flex justify-between text-sm"
                  >
                    <dt className="text-oak-500">
                      {localize(spec.label, locale)}
                    </dt>
                    <dd className="font-medium text-oak-800">
                      {localize(spec.value, locale)}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
            );
          })()}
        </div>
      </div>
    </Container>
  );
}
