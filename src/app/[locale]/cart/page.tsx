"use client";

import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import {
  Minus,
  Plus,
  X,
  ShoppingBag,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { useCartStore } from "@/lib/store/cart";
import { localize, formatPrice, calculateShipping } from "@/lib/utils";
import { urlFor } from "@/sanity/lib/image";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import type { Locale } from "@/i18n/routing";

export default function CartPage() {
  const t = useTranslations("cart");
  const tc = useTranslations("common");
  const locale = useLocale() as Locale;

  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const getSubtotal = useCartStore((s) => s.getSubtotal);

  const prefix = locale === "nl" ? "" : `/${locale}`;
  const productsPath: Record<Locale, string> = {
    nl: "/producten",
    fr: "/produits",
    en: "/products",
  };
  const checkoutPath: Record<Locale, string> = {
    nl: "/afrekenen",
    fr: "/paiement",
    en: "/checkout",
  };

  const subtotal = getSubtotal();
  const shipping = calculateShipping(subtotal);
  const total = subtotal + shipping;

  return (
    <section className="py-12 lg:py-16">
      <Container>
        <h1 className="text-3xl sm:text-4xl font-bold text-oak-800 mb-8 font-[family-name:var(--font-heading)]">
          {t("title")}
        </h1>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-6 bg-oak-100 rounded-full flex items-center justify-center">
              <ShoppingBag className="w-10 h-10 text-oak-300" />
            </div>
            <h2 className="text-xl font-semibold text-oak-700 mb-2">
              {t("empty")}
            </h2>
            <p className="text-oak-500 mb-8 max-w-md mx-auto">
              {t("emptyDescription")}
            </p>
            <Link href={`${prefix}${productsPath[locale]}`}>
              <Button variant="gold" size="lg">
                <ArrowLeft className="w-5 h-5" />
                {t("continueShopping")}
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-4 bg-white rounded-xl border border-oak-200"
                >
                  {/* Image */}
                  <div className="flex-shrink-0 w-24 h-24 bg-oak-100 rounded-lg overflow-hidden">
                    {item.productImage ? (
                      <Image
                        src={urlFor(item.productImage)
                          .width(192)
                          .height(192)
                          .url()}
                        alt={localize(item.productTitle, locale)}
                        width={96}
                        height={96}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingBag className="w-8 h-8 text-oak-300" />
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-oak-800">
                      {localize(item.productTitle, locale)}
                    </h3>
                    <p className="text-sm text-oak-500 mt-1">
                      {t("size")}: {item.width} × {item.height} {tc("cm")} —{" "}
                      {item.thickness} {tc("mm")}
                      {item.isCustomSize && (
                        <span className="ml-2 text-gold-dark font-medium">
                          ({tc("customSize")})
                        </span>
                      )}
                    </p>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="w-8 h-8 flex items-center justify-center bg-oak-100 rounded-lg text-oak-600 hover:bg-oak-200 cursor-pointer"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center font-medium text-oak-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="w-8 h-8 flex items-center justify-center bg-oak-100 rounded-lg text-oak-600 hover:bg-oak-200 cursor-pointer"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Price */}
                      <span className="text-lg font-bold text-oak-800">
                        {formatPrice(item.unitPrice * item.quantity, locale)}
                      </span>
                    </div>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="flex-shrink-0 p-2 text-oak-400 hover:text-error hover:bg-error-light rounded-lg transition-colors cursor-pointer"
                    aria-label={t("remove")}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl border border-oak-200 p-6 sticky top-24">
                <h2 className="text-lg font-semibold text-oak-800 mb-4">
                  {tc("total")}
                </h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-oak-500">{tc("subtotal")}</span>
                    <span className="font-medium text-oak-800">
                      {formatPrice(subtotal, locale)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-oak-500">{tc("shipping")}</span>
                    <span className="font-medium text-oak-800">
                      {shipping === 0
                        ? tc("free")
                        : formatPrice(shipping, locale)}
                    </span>
                  </div>
                  {shipping > 0 && (
                    <p className="text-xs text-gold-dark">
                      {tc("freeShippingFrom", { amount: "500" })}
                    </p>
                  )}
                  <div className="border-t border-oak-200 pt-3 flex justify-between">
                    <span className="font-semibold text-oak-800">{tc("total")}</span>
                    <span className="text-xl font-bold text-oak-800">
                      {formatPrice(total, locale)}
                    </span>
                  </div>
                  <p className="text-xs text-oak-400">{tc("vat")}</p>
                </div>

                <Link href={`${prefix}${checkoutPath[locale]}`}>
                  <Button variant="gold" className="w-full" size="lg">
                    {t("checkout")}
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>

                <Link href={`${prefix}${productsPath[locale]}`}>
                  <Button variant="ghost" className="w-full mt-2">
                    {t("continueShopping")}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}
