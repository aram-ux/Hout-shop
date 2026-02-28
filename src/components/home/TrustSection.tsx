"use client";

import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";
import { Truck, Shield, Headphones, Lock } from "lucide-react";
import Container from "../ui/Container";
import { urlFor } from "@/sanity/lib/image";
import { getLocalizedValue } from "@/types";
import type { HomePage } from "@/types";
import type { Locale } from "@/i18n/routing";

interface TrustSectionProps {
  homePageData?: HomePage | null;
}

export default function TrustSection({ homePageData }: TrustSectionProps) {
  const t = useTranslations("trust");
  const locale = useLocale() as Locale;

  const features = [
    {
      icon: Truck,
      title: t("freeShipping"),
      description: t("freeShippingDesc"),
    },
    {
      icon: Shield,
      title: t("quality"),
      description: t("qualityDesc"),
    },
    {
      icon: Headphones,
      title: t("support"),
      description: t("supportDesc"),
    },
    {
      icon: Lock,
      title: t("secure"),
      description: t("secureDesc"),
    },
  ];

  return (
    <section className="py-12 bg-oak-100 border-y border-oak-200">
      <Container>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 bg-gold/10 rounded-lg flex items-center justify-center">
                <feature.icon className="w-5 h-5 text-gold-dark" />
              </div>
              <div>
                <h3 className="font-semibold text-oak-800 text-sm">
                  {feature.title}
                </h3>
                <p className="text-oak-500 text-xs mt-0.5">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Badges / Certification Logos */}
        {homePageData?.trustBadges && homePageData.trustBadges.length > 0 && (
          <div className="mt-8 pt-8 border-t border-oak-200">
            <div className="flex flex-wrap items-center justify-center gap-8">
              {homePageData.trustBadges.map((badge, index) => (
                badge.asset && (
                  <div key={index} className="flex flex-col items-center gap-2">
                    <div className="relative w-16 h-16">
                      <Image
                        src={urlFor(badge).width(128).height(128).url()}
                        alt={getLocalizedValue(badge.label, locale) || `Certification ${index + 1}`}
                        fill
                        className="object-contain"
                      />
                    </div>
                    {badge.label && (
                      <span className="text-oak-500 text-xs text-center">
                        {getLocalizedValue(badge.label, locale)}
                      </span>
                    )}
                  </div>
                )
              ))}
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}
