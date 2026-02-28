import { setRequestLocale, getTranslations } from "next-intl/server";
import Image from "next/image";
import { Award, Leaf, Wrench, Heart, Shield, Star } from "lucide-react";
import Container from "@/components/ui/Container";
import { client } from "@/sanity/lib/client";
import { aboutPageQuery } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import { getLocalizedValue } from "@/types";
import { buildAlternates, buildOpenGraph, SITE_NAME } from "@/lib/seo";
import type { AboutPage as AboutPageType } from "@/types";
import type { Locale } from "@/i18n/routing";
import type { Metadata } from "next";
import type { LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  award: Award,
  leaf: Leaf,
  wrench: Wrench,
  heart: Heart,
  shield: Shield,
  star: Star,
};

export const revalidate = 60;

const aboutPaths: Record<Locale, string> = {
  nl: "/over-ons",
  fr: "/a-propos",
  en: "/about",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const l = locale as Locale;
  const t = await getTranslations({ locale, namespace: "about" });

  const title = `${t("title")} | ${SITE_NAME}`;
  const description = t("description");

  return {
    title,
    description,
    alternates: buildAlternates(aboutPaths),
    openGraph: buildOpenGraph(l, {
      title,
      description,
    }),
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "about" });
  const l = locale as Locale;

  let aboutData: AboutPageType | null = null;
  try {
    aboutData = await client.fetch(aboutPageQuery);
  } catch {
    // Sanity not configured yet
  }

  return (
    <section className="py-12 lg:py-16">
      <Container>
        {/* Hero */}
        <div className="max-w-3xl mb-16">
          <span className="text-gold-dark font-medium text-sm uppercase tracking-wider">
            {getLocalizedValue(aboutData?.pageSubtitle, l) || t("subtitle")}
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-oak-800 mt-2 mb-6 font-[family-name:var(--font-heading)]">
            {getLocalizedValue(aboutData?.pageTitle, l) || t("title")}
          </h1>
          <p className="text-lg text-oak-600 leading-relaxed">
            {getLocalizedValue(aboutData?.pageDescription, l) || t("description")}
          </p>
        </div>

        {/* Story */}
        <div className="grid lg:grid-cols-2 gap-16 mb-20">
          <div>
            <h2 className="text-2xl font-bold text-oak-800 mb-4 font-[family-name:var(--font-heading)]">
              {getLocalizedValue(aboutData?.storyTitle, l) || t("story")}
            </h2>
            <p className="text-oak-600 leading-relaxed">
              {getLocalizedValue(aboutData?.storyText, l) || t("storyText")}
            </p>
          </div>
          <div className="bg-oak-100 rounded-2xl aspect-video overflow-hidden flex items-center justify-center relative">
            {aboutData?.storyImage?.asset ? (
              <Image
                src={urlFor(aboutData.storyImage).width(800).height(450).quality(80).url()}
                alt={getLocalizedValue(aboutData.storyImage.alt, l) || "Workshop"}
                fill
                className="object-cover"
              />
            ) : (
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-3 bg-oak-200 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-oak-400"
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
                <p className="text-oak-400 text-sm">Workshop photo</p>
              </div>
            )}
          </div>
        </div>

        {/* Values */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {aboutData?.values && aboutData.values.length > 0
            ? aboutData.values.map((value, i) => {
                const IconComp = iconMap[value.icon || "award"] || Award;
                return (
                  <div
                    key={i}
                    className="bg-white p-6 rounded-xl border border-oak-200"
                  >
                    <div className="w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center mb-4">
                      <IconComp className="w-6 h-6 text-gold-dark" />
                    </div>
                    <h3 className="font-semibold text-oak-800 mb-2">
                      {getLocalizedValue(value.title, l)}
                    </h3>
                    <p className="text-sm text-oak-500 leading-relaxed">
                      {getLocalizedValue(value.description, l)}
                    </p>
                  </div>
                );
              })
            : [
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
              ].map((value, i) => (
                <div
                  key={i}
                  className="bg-white p-6 rounded-xl border border-oak-200"
                >
                  <div className="w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center mb-4">
                    <value.icon className="w-6 h-6 text-gold-dark" />
                  </div>
                  <h3 className="font-semibold text-oak-800 mb-2">{value.title}</h3>
                  <p className="text-sm text-oak-500 leading-relaxed">
                    {value.desc}
                  </p>
                </div>
              ))}
        </div>

        {/* Quality & Sustainability */}
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-oak-800 text-white p-8 rounded-2xl">
            <h3 className="text-xl font-bold mb-3 font-[family-name:var(--font-heading)]">
              {getLocalizedValue(aboutData?.qualityTitle, l) || t("quality")}
            </h3>
            <p className="text-oak-300 leading-relaxed">
              {getLocalizedValue(aboutData?.qualityText, l) || t("qualityText")}
            </p>
          </div>
          <div className="bg-forest/5 border border-forest/20 p-8 rounded-2xl">
            <h3 className="text-xl font-bold text-forest-dark mb-3 font-[family-name:var(--font-heading)]">
              {getLocalizedValue(aboutData?.sustainableTitle, l) || t("sustainable")}
            </h3>
            <p className="text-oak-600 leading-relaxed">
              {getLocalizedValue(aboutData?.sustainableText, l) || t("sustainableText")}
            </p>
          </div>
        </div>

        {/* Photo Gallery from CMS */}
        {aboutData?.gallery && aboutData.gallery.length > 0 && (
          <div className="mt-20">
            <h2 className="text-2xl font-bold text-oak-800 mb-8 text-center font-[family-name:var(--font-heading)]">
              {t("title")}
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {aboutData.gallery.map((image, index) => (
                image.asset && (
                  <div key={index} className="relative aspect-[4/3] rounded-xl overflow-hidden group">
                    <Image
                      src={urlFor(image).width(600).height(450).quality(80).url()}
                      alt={getLocalizedValue(image.alt, l) || `Gallery ${index + 1}`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {image.caption && (
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <p className="text-white text-sm">
                          {getLocalizedValue(image.caption, l)}
                        </p>
                      </div>
                    )}
                  </div>
                )
              ))}
            </div>
          </div>
        )}

        {/* Team Photo from CMS */}
        {aboutData?.teamPhoto?.asset && (
          <div className="mt-16 text-center">
            <div className="relative max-w-2xl mx-auto aspect-[3/2] rounded-2xl overflow-hidden">
              <Image
                src={urlFor(aboutData.teamPhoto).width(800).height(533).quality(80).url()}
                alt={getLocalizedValue(aboutData.teamPhoto.alt, l) || "Team"}
                fill
                className="object-cover"
              />
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}
