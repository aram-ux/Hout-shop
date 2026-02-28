"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { ShoppingBag, Lock } from "lucide-react";
import { useCartStore } from "@/lib/store/cart";
import {
  localize,
  formatPrice,
  calculateShipping,
  calculateVAT,
} from "@/lib/utils";
import { urlFor } from "@/sanity/lib/image";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import type { Locale } from "@/i18n/routing";

export default function CheckoutPage() {
  const t = useTranslations("checkout");
  const tc = useTranslations("common");
  const locale = useLocale() as Locale;

  const items = useCartStore((s) => s.items);
  const getSubtotal = useCartStore((s) => s.getSubtotal);

  const [loading, setLoading] = useState(false);
  const [sameAsBilling, setSameAsBilling] = useState(true);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    shippingStreet: "",
    shippingCity: "",
    shippingPostalCode: "",
    shippingCountry: "BE" as "BE" | "NL",
    billingStreet: "",
    billingCity: "",
    billingPostalCode: "",
    billingCountry: "BE",
    companyName: "",
    vatNumber: "",
    notes: "",
  });

  const subtotal = getSubtotal();
  const shipping = calculateShipping(subtotal);
  const total = subtotal + shipping;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            productTitle: localize(item.productTitle, locale),
            productSlug: item.productSlug,
            width: item.width,
            height: item.height,
            thickness: item.thickness,
            isCustomSize: item.isCustomSize,
            unitPrice: item.unitPrice,
            quantity: item.quantity,
          })),
          customer: {
            ...form,
            sameAsBilling,
          },
          locale,
          subtotal,
          shipping,
          total,
        }),
      });

      const data = await response.json();
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    } catch (error) {
      console.error("Checkout error:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field: string, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
  };

  const inputClasses =
    "w-full px-4 py-3 bg-white border border-oak-300 rounded-lg text-oak-900 focus:border-gold focus:ring-1 focus:ring-gold outline-none text-sm";
  const labelClasses = "block text-sm font-medium text-oak-700 mb-1.5";

  return (
    <section className="py-12 lg:py-16">
      <Container>
        <h1 className="text-3xl sm:text-4xl font-bold text-oak-800 mb-8 font-[family-name:var(--font-heading)]">
          {t("title")}
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Form */}
            <div className="lg:col-span-2 space-y-8">
              {/* Customer Info */}
              <div className="bg-white rounded-xl border border-oak-200 p-6">
                <h2 className="text-lg font-semibold text-oak-800 mb-6">
                  {t("customerInfo")}
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClasses}>{t("firstName")} *</label>
                    <input
                      type="text"
                      required
                      value={form.firstName}
                      onChange={(e) => updateField("firstName", e.target.value)}
                      className={inputClasses}
                    />
                  </div>
                  <div>
                    <label className={labelClasses}>{t("lastName")} *</label>
                    <input
                      type="text"
                      required
                      value={form.lastName}
                      onChange={(e) => updateField("lastName", e.target.value)}
                      className={inputClasses}
                    />
                  </div>
                  <div>
                    <label className={labelClasses}>{t("email")} *</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => updateField("email", e.target.value)}
                      className={inputClasses}
                    />
                  </div>
                  <div>
                    <label className={labelClasses}>{t("phone")}</label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => updateField("phone", e.target.value)}
                      className={inputClasses}
                    />
                  </div>
                  <div>
                    <label className={labelClasses}>
                      {t("companyName")}{" "}
                      <span className="text-oak-400">({tc("optional")})</span>
                    </label>
                    <input
                      type="text"
                      value={form.companyName}
                      onChange={(e) =>
                        updateField("companyName", e.target.value)
                      }
                      className={inputClasses}
                    />
                  </div>
                  <div>
                    <label className={labelClasses}>
                      {t("vatNumber")}{" "}
                      <span className="text-oak-400">({tc("optional")})</span>
                    </label>
                    <input
                      type="text"
                      value={form.vatNumber}
                      onChange={(e) => updateField("vatNumber", e.target.value)}
                      className={inputClasses}
                      placeholder="BE0000000000"
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white rounded-xl border border-oak-200 p-6">
                <h2 className="text-lg font-semibold text-oak-800 mb-6">
                  {t("shippingAddress")}
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className={labelClasses}>{t("street")} *</label>
                    <input
                      type="text"
                      required
                      value={form.shippingStreet}
                      onChange={(e) =>
                        updateField("shippingStreet", e.target.value)
                      }
                      className={inputClasses}
                    />
                  </div>
                  <div>
                    <label className={labelClasses}>{t("postalCode")} *</label>
                    <input
                      type="text"
                      required
                      value={form.shippingPostalCode}
                      onChange={(e) =>
                        updateField("shippingPostalCode", e.target.value)
                      }
                      className={inputClasses}
                    />
                  </div>
                  <div>
                    <label className={labelClasses}>{t("city")} *</label>
                    <input
                      type="text"
                      required
                      value={form.shippingCity}
                      onChange={(e) =>
                        updateField("shippingCity", e.target.value)
                      }
                      className={inputClasses}
                    />
                  </div>
                  <div>
                    <label className={labelClasses}>{t("country")} *</label>
                    <select
                      value={form.shippingCountry}
                      onChange={(e) =>
                        updateField("shippingCountry", e.target.value)
                      }
                      className={inputClasses}
                    >
                      <option value="BE">{t("countries.BE")}</option>
                      <option value="NL">{t("countries.NL")}</option>
                    </select>
                  </div>
                </div>

                {/* Same as billing */}
                <label className="flex items-center gap-3 mt-6 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sameAsBilling}
                    onChange={(e) => setSameAsBilling(e.target.checked)}
                    className="w-4 h-4 rounded border-oak-300 text-gold focus:ring-gold"
                  />
                  <span className="text-sm text-oak-700">
                    {t("sameAsShipping")}
                  </span>
                </label>
              </div>

              {/* Billing Address (if different) */}
              {!sameAsBilling && (
                <div className="bg-white rounded-xl border border-oak-200 p-6 animate-fade-in">
                  <h2 className="text-lg font-semibold text-oak-800 mb-6">
                    {t("billingAddress")}
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className={labelClasses}>{t("street")} *</label>
                      <input
                        type="text"
                        required
                        value={form.billingStreet}
                        onChange={(e) =>
                          updateField("billingStreet", e.target.value)
                        }
                        className={inputClasses}
                      />
                    </div>
                    <div>
                      <label className={labelClasses}>
                        {t("postalCode")} *
                      </label>
                      <input
                        type="text"
                        required
                        value={form.billingPostalCode}
                        onChange={(e) =>
                          updateField("billingPostalCode", e.target.value)
                        }
                        className={inputClasses}
                      />
                    </div>
                    <div>
                      <label className={labelClasses}>{t("city")} *</label>
                      <input
                        type="text"
                        required
                        value={form.billingCity}
                        onChange={(e) =>
                          updateField("billingCity", e.target.value)
                        }
                        className={inputClasses}
                      />
                    </div>
                    <div>
                      <label className={labelClasses}>{t("country")} *</label>
                      <select
                        value={form.billingCountry}
                        onChange={(e) =>
                          updateField("billingCountry", e.target.value)
                        }
                        className={inputClasses}
                      >
                        <option value="BE">{t("countries.BE")}</option>
                        <option value="NL">{t("countries.NL")}</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Notes */}
              <div className="bg-white rounded-xl border border-oak-200 p-6">
                <label className={labelClasses}>
                  {t("notes")}{" "}
                  <span className="text-oak-400">({tc("optional")})</span>
                </label>
                <textarea
                  value={form.notes}
                  onChange={(e) => updateField("notes", e.target.value)}
                  rows={3}
                  className={inputClasses}
                />
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl border border-oak-200 p-6 sticky top-24">
                <h2 className="text-lg font-semibold text-oak-800 mb-4">
                  {t("orderSummary")}
                </h2>

                {/* Items */}
                <div className="space-y-3 mb-6">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-3 pb-3 border-b border-oak-100"
                    >
                      <div className="flex-shrink-0 w-12 h-12 bg-oak-100 rounded-lg overflow-hidden">
                        {item.productImage ? (
                          <Image
                            src={urlFor(item.productImage)
                              .width(96)
                              .height(96)
                              .url()}
                            alt={localize(item.productTitle, locale)}
                            width={48}
                            height={48}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ShoppingBag className="w-4 h-4 text-oak-300" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-oak-800 truncate">
                          {localize(item.productTitle, locale)}
                        </p>
                        <p className="text-xs text-oak-500">
                          {item.width}×{item.height}cm × {item.quantity}
                        </p>
                      </div>
                      <span className="text-sm font-semibold text-oak-800 whitespace-nowrap">
                        {formatPrice(item.unitPrice * item.quantity, locale)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-oak-500">{tc("subtotal")}</span>
                    <span className="text-oak-800">
                      {formatPrice(subtotal, locale)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-oak-500">{tc("shipping")}</span>
                    <span className="text-oak-800">
                      {shipping === 0
                        ? tc("free")
                        : formatPrice(shipping, locale)}
                    </span>
                  </div>
                  <div className="border-t border-oak-200 pt-2 flex justify-between">
                    <span className="font-semibold">{tc("total")}</span>
                    <span className="text-xl font-bold text-oak-800">
                      {formatPrice(total, locale)}
                    </span>
                  </div>
                  <p className="text-xs text-oak-400">{tc("vat")}</p>
                </div>

                {/* Pay Button */}
                <Button
                  type="submit"
                  variant="gold"
                  size="lg"
                  className="w-full"
                  loading={loading}
                  disabled={items.length === 0}
                >
                  <Lock className="w-4 h-4" />
                  {loading ? t("processing") : t("payWithMollie")}
                </Button>

                <p className="text-xs text-oak-400 text-center mt-3">
                  🔒 Veilig betalen via Mollie — iDEAL, Bancontact, Visa,
                  Mastercard
                </p>
              </div>
            </div>
          </div>
        </form>
      </Container>
    </section>
  );
}
