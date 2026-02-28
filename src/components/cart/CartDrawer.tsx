"use client";

import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { X, Minus, Plus, ShoppingBag, ArrowRight } from "lucide-react";
import { useCartStore } from "@/lib/store/cart";
import { localize, formatPrice, calculateShipping, calculateVAT } from "@/lib/utils";
import { urlFor } from "@/sanity/lib/image";
import Button from "../ui/Button";
import type { Locale } from "@/i18n/routing";

export default function CartDrawer() {
  const t = useTranslations("cart");
  const tc = useTranslations("common");
  const tn = useTranslations("nav");
  const locale = useLocale() as Locale;

  const items = useCartStore((s) => s.items);
  const isOpen = useCartStore((s) => s.isOpen);
  const closeCart = useCartStore((s) => s.closeCart);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const getSubtotal = useCartStore((s) => s.getSubtotal);

  const prefix = locale === "nl" ? "" : `/${locale}`;
  const cartPath: Record<Locale, string> = {
    nl: "/winkelwagen",
    fr: "/panier",
    en: "/cart",
  };
  const checkoutPath: Record<Locale, string> = {
    nl: "/afrekenen",
    fr: "/paiement",
    en: "/checkout",
  };

  const subtotal = getSubtotal();
  const shipping = calculateShipping(subtotal);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-50 transition-opacity"
        onClick={closeCart}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl animate-slide-in-right flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-oak-200">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-oak-800" />
            <h2 className="text-lg font-semibold text-oak-800">{t("title")}</h2>
            <span className="bg-oak-100 text-oak-600 text-xs font-medium px-2 py-0.5 rounded-full">
              {items.length}
            </span>
          </div>
          <button
            onClick={closeCart}
            className="p-2 text-oak-400 hover:text-oak-700 hover:bg-oak-100 rounded-lg transition-colors cursor-pointer"
            aria-label={tc("close")}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 bg-oak-100 rounded-full flex items-center justify-center mb-4">
                <ShoppingBag className="w-8 h-8 text-oak-300" />
              </div>
              <h3 className="text-lg font-medium text-oak-700 mb-2">
                {t("empty")}
              </h3>
              <p className="text-oak-500 text-sm mb-6">{t("emptyDescription")}</p>
              <Button onClick={closeCart} variant="secondary" size="sm">
                {t("continueShopping")}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-3 bg-oak-50 rounded-lg"
                >
                  {/* Image */}
                  <div className="flex-shrink-0 w-20 h-20 bg-oak-200 rounded-lg overflow-hidden">
                    {item.productImage ? (
                      <Image
                        src={urlFor(item.productImage)
                          .width(160)
                          .height(160)
                          .url()}
                        alt={localize(item.productTitle, locale)}
                        width={80}
                        height={80}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingBag className="w-6 h-6 text-oak-400" />
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-oak-800 text-sm truncate">
                      {localize(item.productTitle, locale)}
                    </h4>
                    <p className="text-xs text-oak-500 mt-0.5">
                      {item.width} × {item.height} {tc("cm")} — {item.thickness}{" "}
                      {tc("mm")}
                      {item.isCustomSize && (
                        <span className="ml-1 text-gold-dark">
                          ({tc("customSize")})
                        </span>
                      )}
                    </p>

                    <div className="flex items-center justify-between mt-2">
                      {/* Quantity */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="w-7 h-7 flex items-center justify-center bg-white border border-oak-300 rounded text-oak-600 hover:bg-oak-100 cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center text-sm font-medium text-oak-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="w-7 h-7 flex items-center justify-center bg-white border border-oak-300 rounded text-oak-600 hover:bg-oak-100 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Price */}
                      <span className="font-semibold text-oak-800 text-sm">
                        {formatPrice(item.unitPrice * item.quantity, locale)}
                      </span>
                    </div>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="flex-shrink-0 p-1 text-oak-400 hover:text-error transition-colors cursor-pointer"
                    aria-label={t("remove")}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-oak-200 p-6 bg-oak-50">
            {/* Totals */}
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-oak-500">{tc("subtotal")}</span>
                <span className="font-medium text-oak-800">
                  {formatPrice(subtotal, locale)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-oak-500">{tc("shipping")}</span>
                <span className="font-medium text-oak-800">
                  {shipping === 0 ? tc("free") : formatPrice(shipping, locale)}
                </span>
              </div>
              <div className="flex justify-between text-base font-semibold pt-2 border-t border-oak-200">
                <span className="text-oak-800">{tc("total")}</span>
                <span className="text-oak-800">
                  {formatPrice(subtotal + shipping, locale)}
                </span>
              </div>
              <p className="text-xs text-oak-400">{tc("vat")}</p>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <Link
                href={`${prefix}${checkoutPath[locale]}`}
                onClick={closeCart}
              >
                <Button variant="gold" className="w-full" size="lg">
                  {t("checkout")}
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Button
                variant="ghost"
                className="w-full"
                onClick={closeCart}
              >
                {t("continueShopping")}
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
