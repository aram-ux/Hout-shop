"use client";

import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Ruler } from "lucide-react";
import Button from "../ui/Button";
import Container from "../ui/Container";
import { urlFor } from "@/sanity/lib/image";
import { getLocalizedValue } from "@/types";
import type { HomePage } from "@/types";
import type { Locale } from "@/i18n/routing";

interface HeroSectionProps {
  homePageData?: HomePage | null;
}

export default function HeroSection({ homePageData }: HeroSectionProps) {
  const t = useTranslations("hero");
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
    <section className="relative overflow-hidden bg-oak-800">
      {/* Background Image from CMS */}
      {homePageData?.heroImage?.asset && (
        <Image
          src={urlFor(homePageData.heroImage).width(1920).quality(80).url()}
          alt={getLocalizedValue(homePageData.heroImage.alt, locale) || "Hero background"}
          fill
          priority
          className="object-cover opacity-20"
        />
      )}

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent 40px,
              rgba(201, 168, 76, 0.15) 40px,
              rgba(201, 168, 76, 0.15) 41px
            ),
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 80px,
              rgba(201, 168, 76, 0.08) 80px,
              rgba(201, 168, 76, 0.08) 81px
            )`,
          }}
        />
      </div>

      {/* Decorative wood grain circle */}
      <div className="absolute -right-32 -top-32 w-96 h-96 rounded-full bg-gold/5 blur-3xl" />
      <div className="absolute -left-32 -bottom-32 w-96 h-96 rounded-full bg-gold/5 blur-3xl" />

      <Container>
        <div className="relative py-24 sm:py-32 lg:py-40">
          <div className="max-w-3xl">
            {/* Tagline */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gold/10 border border-gold/20 rounded-full mb-8">
              <div className="w-1.5 h-1.5 bg-gold rounded-full" />
              <span className="text-gold text-sm font-medium">
                {getLocalizedValue(homePageData?.heroTagline, locale) || "Premium Belgisch Eikenhout"}
              </span>
            </div>

            {/* Main heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-[1.1] mb-6 font-[family-name:var(--font-heading)]">
              {t("title")}
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-oak-300 leading-relaxed mb-10 max-w-2xl">
              {t("subtitle")}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href={getProductsPath()}>
                <Button variant="gold" size="lg">
                  {t("cta")}
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link href={getProductsPath()}>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-oak-600 text-oak-200 hover:bg-oak-700 hover:border-oak-500"
                >
                  <Ruler className="w-5 h-5" />
                  {t("secondaryCta")}
                </Button>
              </Link>
            </div>
          </div>

          {/* Decorative Image */}
          <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 w-[400px] h-[500px]">
            <div className="relative w-full h-full">
              {/* Decorative frame */}
              <div className="absolute inset-0 border-2 border-gold/20 rounded-2xl transform rotate-3" />
              <div className="absolute inset-4 bg-gradient-to-br from-oak-700 to-oak-900 rounded-xl overflow-hidden">
                {homePageData?.heroAccentImage?.asset ? (
                  <Image
                    src={urlFor(homePageData.heroAccentImage).width(800).height(1000).quality(80).url()}
                    alt={getLocalizedValue(homePageData.heroAccentImage.alt, locale) || "Eikenhout product"}
                    fill
                    className="object-cover"
                  />
                ) : (
                  /* Placeholder when no image set */
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gold/10 flex items-center justify-center">
                        <svg
                          className="w-12 h-12 text-gold/40"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <p className="text-oak-400 text-xs">
                        Add image via Sanity CMS
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Container>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
    </section>
  );
}
