"use client";

import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { TreePine, Facebook, Instagram, Linkedin } from "lucide-react";
import Container from "../ui/Container";
import type { Locale } from "@/i18n/routing";

export default function Footer() {
  const t = useTranslations("footer");
  const tn = useTranslations("nav");
  const tc = useTranslations("common");
  const locale = useLocale() as Locale;

  const prefix = locale === "nl" ? "" : `/${locale}`;

  const getPath = (key: string) => {
    const paths: Record<string, Record<Locale, string>> = {
      products: { nl: "/producten", fr: "/produits", en: "/products" },
      about: { nl: "/over-ons", fr: "/a-propos", en: "/about" },
      contact: { nl: "/contact", fr: "/contact", en: "/contact" },
    };
    return `${prefix}${paths[key]?.[locale] || ""}`;
  };

  return (
    <footer className="bg-oak-800 text-oak-200">
      {/* Main Footer */}
      <Container>
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href={`${prefix}/` || "/"} className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-gold rounded-lg flex items-center justify-center">
                <TreePine className="w-5 h-5 text-oak-900" />
              </div>
              <span className="text-lg font-bold text-white font-[family-name:var(--font-heading)]">
                {tc("shopName")}
              </span>
            </Link>
            <p className="text-oak-300 text-sm leading-relaxed mb-6">
              {t("description")}
            </p>
            {/* Social Links */}
            <div className="flex gap-3">
              <a
                href="#"
                className="w-9 h-9 bg-oak-700 rounded-lg flex items-center justify-center hover:bg-oak-600 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 bg-oak-700 rounded-lg flex items-center justify-center hover:bg-oak-600 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 bg-oak-700 rounded-lg flex items-center justify-center hover:bg-oak-600 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">{t("quickLinks")}</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href={getPath("products")}
                  className="text-oak-300 hover:text-gold transition-colors text-sm"
                >
                  {tn("products")}
                </Link>
              </li>
              <li>
                <Link
                  href={getPath("about")}
                  className="text-oak-300 hover:text-gold transition-colors text-sm"
                >
                  {tn("about")}
                </Link>
              </li>
              <li>
                <Link
                  href={getPath("contact")}
                  className="text-oak-300 hover:text-gold transition-colors text-sm"
                >
                  {tn("contact")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-white font-semibold mb-4">
              {t("customerService")}
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-oak-300 hover:text-gold transition-colors text-sm"
                >
                  {t("faq")}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-oak-300 hover:text-gold transition-colors text-sm"
                >
                  {t("returnPolicy")}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-oak-300 hover:text-gold transition-colors text-sm"
                >
                  {t("termsConditions")}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-oak-300 hover:text-gold transition-colors text-sm"
                >
                  {t("privacyPolicy")}
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold mb-4">{tn("contact")}</h3>
            <ul className="space-y-3 text-sm text-oak-300">
              <li>
                <span className="block text-oak-400 text-xs uppercase tracking-wider mb-0.5">
                  Email
                </span>
                <a
                  href="mailto:info@hout-shop.com"
                  className="hover:text-gold transition-colors"
                >
                  info@hout-shop.com
                </a>
              </li>
              <li>
                <span className="block text-oak-400 text-xs uppercase tracking-wider mb-0.5">
                  Telefoon
                </span>
                <a
                  href="tel:+3200000000"
                  className="hover:text-gold transition-colors"
                >
                  +32 (0)00 00 00 00
                </a>
              </li>
              <li>
                <span className="block text-oak-400 text-xs uppercase tracking-wider mb-0.5">
                  {t("vatLabel")}
                </span>
                <span>BE 0000.000.000</span>
              </li>
            </ul>
          </div>
        </div>
      </Container>

      {/* Bottom Bar */}
      <div className="border-t border-oak-700">
        <Container>
          <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-oak-400 text-sm">
              {t("copyright", { year: new Date().getFullYear() })}
            </p>
            <div className="flex items-center gap-4">
              <span className="text-oak-500 text-xs">iDEAL</span>
              <span className="text-oak-500 text-xs">Bancontact</span>
              <span className="text-oak-500 text-xs">Visa</span>
              <span className="text-oak-500 text-xs">Mastercard</span>
            </div>
          </div>
        </Container>
      </div>
    </footer>
  );
}
