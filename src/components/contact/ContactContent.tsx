"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from "lucide-react";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import { getLocalizedValue } from "@/types";
import type { ContactPage } from "@/types";
import type { Locale } from "@/i18n/routing";

interface ContactContentProps {
  contactData?: ContactPage | null;
}

export default function ContactContent({ contactData }: ContactContentProps) {
  const t = useTranslations("contact");
  const tc = useTranslations("common");
  const locale = useLocale() as Locale;
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate form submission
    await new Promise((r) => setTimeout(r, 1000));
    setSubmitted(true);
    setLoading(false);
  };

  const inputClasses =
    "w-full px-4 py-3 bg-white border border-oak-300 rounded-lg text-oak-900 focus:border-gold focus:ring-1 focus:ring-gold outline-none text-sm";
  const labelClasses = "block text-sm font-medium text-oak-700 mb-1.5";

  return (
    <section className="py-12 lg:py-16">
      <Container>
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-oak-800 mb-4 font-[family-name:var(--font-heading)]">
            {getLocalizedValue(contactData?.pageTitle, locale) || t("title")}
          </h1>
          <p className="text-lg text-oak-500">
            {getLocalizedValue(contactData?.pageDescription, locale) || t("description")}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            {submitted ? (
              <div className="bg-forest/5 border border-forest/20 rounded-xl p-8 text-center">
                <CheckCircle className="w-12 h-12 text-forest mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-oak-800 mb-2">
                  {tc("submit")}
                </h3>
                <p className="text-oak-600">{t("form.success")}</p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="bg-white rounded-xl border border-oak-200 p-6 sm:p-8"
              >
                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className={labelClasses}>{t("form.name")} *</label>
                    <input type="text" required className={inputClasses} />
                  </div>
                  <div>
                    <label className={labelClasses}>{t("form.email")} *</label>
                    <input type="email" required className={inputClasses} />
                  </div>
                  <div>
                    <label className={labelClasses}>{t("form.phone")}</label>
                    <input type="tel" className={inputClasses} />
                  </div>
                  <div>
                    <label className={labelClasses}>
                      {t("form.subject")} *
                    </label>
                    <select required className={inputClasses}>
                      <option value="">{t("form.subject")}...</option>
                      <option value="general">
                        {t("form.subjects.general")}
                      </option>
                      <option value="quote">{t("form.subjects.quote")}</option>
                      <option value="order">{t("form.subjects.order")}</option>
                      <option value="custom">
                        {t("form.subjects.custom")}
                      </option>
                      <option value="other">{t("form.subjects.other")}</option>
                    </select>
                  </div>
                </div>

                <div className="mb-6">
                  <label className={labelClasses}>{t("form.message")} *</label>
                  <textarea
                    required
                    rows={6}
                    className={inputClasses}
                  ></textarea>
                </div>

                <Button variant="gold" size="lg" loading={loading} type="submit">
                  <Send className="w-4 h-4" />
                  {t("form.send")}
                </Button>
              </form>
            )}
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-oak-200 p-6">
              <div className="space-y-5">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-gold/10 rounded-lg flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-gold-dark" />
                  </div>
                  <div>
                    <h4 className="font-medium text-oak-800 text-sm">
                      {t("info.address")}
                    </h4>
                    <p className="text-oak-500 text-sm mt-0.5">
                      {contactData?.address?.street || "Voorbeeld Straat 123"}
                      <br />
                      {contactData?.address?.postalCode || "3000"}{" "}
                      {contactData?.address?.city || "Leuven"}
                      <br />
                      {contactData?.address?.country || "België"}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-gold/10 rounded-lg flex items-center justify-center">
                    <Phone className="w-5 h-5 text-gold-dark" />
                  </div>
                  <div>
                    <h4 className="font-medium text-oak-800 text-sm">
                      {t("info.phone")}
                    </h4>
                    <a
                      href={`tel:${contactData?.phone || "+3200000000"}`}
                      className="text-oak-500 text-sm mt-0.5 hover:text-gold-dark transition-colors"
                    >
                      {contactData?.phone || "+32 (0)00 00 00 00"}
                    </a>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-gold/10 rounded-lg flex items-center justify-center">
                    <Mail className="w-5 h-5 text-gold-dark" />
                  </div>
                  <div>
                    <h4 className="font-medium text-oak-800 text-sm">
                      {t("info.email")}
                    </h4>
                    <a
                      href={`mailto:${contactData?.email || "info@hout-shop.com"}`}
                      className="text-oak-500 text-sm mt-0.5 hover:text-gold-dark transition-colors"
                    >
                      {contactData?.email || "info@hout-shop.com"}
                    </a>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-gold/10 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-gold-dark" />
                  </div>
                  <div>
                    <h4 className="font-medium text-oak-800 text-sm">
                      {t("info.hours")}
                    </h4>
                    <p className="text-oak-500 text-sm mt-0.5">
                      {getLocalizedValue(contactData?.openingHours, locale) || t("info.hoursValue")}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map */}
            {contactData?.googleMapsEmbed ? (
              <div className="rounded-xl h-64 overflow-hidden border border-oak-200">
                <iframe
                  src={contactData.googleMapsEmbed}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Google Maps"
                />
              </div>
            ) : (
              <div className="bg-oak-100 rounded-xl h-64 flex items-center justify-center border border-oak-200">
                <div className="text-center">
                  <MapPin className="w-8 h-8 text-oak-400 mx-auto mb-2" />
                  <p className="text-oak-400 text-sm">
                    Google Maps integration
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
