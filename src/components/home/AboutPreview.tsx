"use client";

import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Award, Leaf, Wrench, Heart } from "lucide-react";
import Button from "../ui/Button";
import Container from "../ui/Container";
import { urlFor } from "@/sanity/lib/image";
import { getLocalizedValue } from "@/types";
import type { HomePage } from "@/types";
import type { Locale } from "@/i18n/routing";

interface AboutPreviewProps {
  homePageData?: HomePage | null;
}

export default function AboutPreview({ homePageData }: AboutPreviewProps) {
  const t = useTranslations("about");
  const locale = useLocale() as Locale;
  const prefix = locale === "nl" ? "" : `/${locale}`;

  const getAboutPath = () => {
    const paths: Record<Locale, string> = {
      nl: "/over-ons",
      fr: "/a-propos",
      en: "/about",
    };
    return `${prefix}${paths[locale]}`;
  };

  const values = [
    {
      icon: Award,
      title: t("values.quality"),
      desc: t("values.qualityDesc"),
    },
    {
      icon: Leaf,
      title: t("values.sustainable"),
      desc: t("values.sustainableDesc"),
    },
    {
      icon: Wrench,
      title: t("values.craftsmanship"),
      desc: t("values.craftsmanshipDesc"),
    },
    {
      icon: Heart,
      title: t("values.service"),
      desc: t("values.serviceDesc"),
    },
  ];

  return (
    <section className="py-20 lg:py-28 bg-white">
      <Container>
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Text Content */}
          <div>
            <span className="text-gold-dark font-medium text-sm uppercase tracking-wider">
              {getLocalizedValue(homePageData?.aboutPreviewSubtitle, locale) || t("subtitle")}
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-oak-800 mt-2 mb-6 font-[family-name:var(--font-heading)]">
              {getLocalizedValue(homePageData?.aboutPreviewTitle, locale) || t("title")}
            </h2>
            <p className="text-oak-600 leading-relaxed mb-8">
              {getLocalizedValue(homePageData?.aboutPreviewDescription, locale) || t("description")}
            </p>

            <Link href={getAboutPath()}>
              <Button variant="secondary" size="md">
                {getLocalizedValue(homePageData?.aboutPreviewCta, locale) || t("story")}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          {/* Right - About Image or Values Grid */}
          {homePageData?.aboutImage?.asset ? (
            <div className="relative rounded-2xl overflow-hidden aspect-[4/3]">
              <Image
                src={urlFor(homePageData.aboutImage).width(800).height(600).quality(80).url()}
                alt={getLocalizedValue(homePageData.aboutImage.alt, locale) || "Over Hout-Shop"}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {values.map((value, index) => (
                <div
                  key={index}
                  className="p-6 bg-oak-50 rounded-xl border border-oak-200 hover:border-gold/30 hover:shadow-sm transition-all duration-300 group"
                >
                  <div className="w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-gold/20 transition-colors">
                    <value.icon className="w-6 h-6 text-gold-dark" />
                  </div>
                  <h3 className="font-semibold text-oak-800 mb-2">
                    {value.title}
                  </h3>
                  <p className="text-oak-500 text-sm leading-relaxed">
                    {value.desc}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
