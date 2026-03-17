import { setRequestLocale, getTranslations } from "next-intl/server";
import {
  Shield,
  TreePine,
  Ruler,
  Layers,
  CheckCircle,
  Info,
  CircleDot,
} from "lucide-react";
import Container from "@/components/ui/Container";
import { client } from "@/sanity/lib/client";
import { infoPageQuery } from "@/sanity/lib/queries";
import { getLocalizedValue } from "@/types";
import { buildAlternates, buildOpenGraph, SITE_NAME } from "@/lib/seo";
import type { InfoPage as InfoPageType } from "@/types";
import type { Locale } from "@/i18n/routing";
import type { Metadata } from "next";

export const revalidate = 60;

const infoPaths: Record<Locale, string> = {
  nl: "/info",
  fr: "/info",
  en: "/info",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const l = locale as Locale;
  const t = await getTranslations({ locale, namespace: "info" });

  const title = `${t("title")} | ${SITE_NAME}`;
  const description = t("description");

  return {
    title,
    description,
    alternates: buildAlternates(infoPaths),
    openGraph: buildOpenGraph(l, {
      title,
      description,
    }),
  };
}

export default async function InfoPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "info" });
  const l = locale as Locale;

  let data: InfoPageType | null = null;
  try {
    data = await client.fetch(infoPageQuery);
  } catch {
    // Sanity not configured yet — fall back to translations
  }

  return (
    <section className="py-12 lg:py-16">
      <Container>
        {/* Hero */}
        <div className="max-w-3xl mb-16">
          <span className="text-gold-dark font-medium text-sm uppercase tracking-wider">
            {getLocalizedValue(data?.pageSubtitle, l) || t("subtitle")}
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-oak-800 mt-2 mb-6 font-[family-name:var(--font-heading)]">
            {getLocalizedValue(data?.pageTitle, l) || t("title")}
          </h1>
          <p className="text-lg text-oak-600 leading-relaxed">
            {getLocalizedValue(data?.pageDescription, l) || t("description")}
          </p>
        </div>

        {/* Kwaliteiten / Qualities */}
        <div className="mb-20" id="kwaliteiten">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-gold-dark" />
            </div>
            <h2 className="text-2xl font-bold text-oak-800 font-[family-name:var(--font-heading)]">
              {getLocalizedValue(data?.qualitiesTitle, l) || t("qualities.title")}
            </h2>
          </div>
          <p className="text-oak-600 mb-8 max-w-3xl">
            {getLocalizedValue(data?.qualitiesIntro, l) || t("qualities.intro")}
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data?.qualities && data.qualities.length > 0
              ? data.qualities.map((quality, idx) => (
                  <div
                    key={idx}
                    className="bg-white p-6 rounded-xl border border-oak-200 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle className="w-5 h-5 text-gold-dark" />
                      <h3 className="font-semibold text-oak-800 text-lg">
                        {getLocalizedValue(quality.name, l)}
                      </h3>
                    </div>
                    <p className="text-oak-600 text-sm leading-relaxed">
                      {getLocalizedValue(quality.description, l)}
                    </p>
                    {quality.features && quality.features.length > 0 && (
                      <ul className="mt-4 space-y-2">
                        {quality.features.map((feature, fi) => {
                          const val = getLocalizedValue(feature, l);
                          if (!val) return null;
                          return (
                            <li
                              key={fi}
                              className="flex items-start gap-2 text-sm text-oak-500"
                            >
                              <CircleDot className="w-3.5 h-3.5 mt-0.5 text-gold-dark flex-shrink-0" />
                              <span>{val}</span>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                ))
              : (["ab", "rustic", "prime"] as const).map((quality) => (
                  <div
                    key={quality}
                    className="bg-white p-6 rounded-xl border border-oak-200 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle className="w-5 h-5 text-gold-dark" />
                      <h3 className="font-semibold text-oak-800 text-lg">
                        {t(`qualities.${quality}.name`)}
                      </h3>
                    </div>
                    <p className="text-oak-600 text-sm leading-relaxed">
                      {t(`qualities.${quality}.description`)}
                    </p>
                    <ul className="mt-4 space-y-2">
                      {([0, 1, 2] as const).map((i) => {
                        const key = `qualities.${quality}.features.${i}`;
                        try {
                          const val = t(key);
                          if (val && val !== key) {
                            return (
                              <li
                                key={i}
                                className="flex items-start gap-2 text-sm text-oak-500"
                              >
                                <CircleDot className="w-3.5 h-3.5 mt-0.5 text-gold-dark flex-shrink-0" />
                                <span>{val}</span>
                              </li>
                            );
                          }
                        } catch {
                          return null;
                        }
                        return null;
                      })}
                    </ul>
                  </div>
                ))}
          </div>
        </div>

        {/* Lamelopbouw / Panel Construction */}
        <div className="mb-20" id="panelen">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center">
              <Layers className="w-6 h-6 text-gold-dark" />
            </div>
            <h2 className="text-2xl font-bold text-oak-800 font-[family-name:var(--font-heading)]">
              {getLocalizedValue(data?.panelsTitle, l) || t("panels.title")}
            </h2>
          </div>
          <p className="text-oak-600 mb-8 max-w-3xl">
            {getLocalizedValue(data?.panelsIntro, l) || t("panels.intro")}
          </p>
          <div className="grid sm:grid-cols-2 gap-6">
            {data?.panels && data.panels.length > 0
              ? data.panels.map((panel, idx) => (
                  <div
                    key={idx}
                    className="bg-white p-6 rounded-xl border border-oak-200 hover:shadow-md transition-shadow"
                  >
                    <h3 className="font-semibold text-oak-800 text-lg mb-2">
                      {getLocalizedValue(panel.name, l)}
                    </h3>
                    <p className="text-oak-600 text-sm leading-relaxed">
                      {getLocalizedValue(panel.description, l)}
                    </p>
                  </div>
                ))
              : (["fingerJoint", "continuous", "threeLayer", "singleLayer"] as const).map(
                  (panel) => (
                    <div
                      key={panel}
                      className="bg-white p-6 rounded-xl border border-oak-200 hover:shadow-md transition-shadow"
                    >
                      <h3 className="font-semibold text-oak-800 text-lg mb-2">
                        {t(`panels.${panel}.name`)}
                      </h3>
                      <p className="text-oak-600 text-sm leading-relaxed">
                        {t(`panels.${panel}.description`)}
                      </p>
                    </div>
                  )
                )}
          </div>
        </div>

        {/* Afkomst / Origins */}
        <div className="mb-20" id="herkomst">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center">
              <TreePine className="w-6 h-6 text-gold-dark" />
            </div>
            <h2 className="text-2xl font-bold text-oak-800 font-[family-name:var(--font-heading)]">
              {getLocalizedValue(data?.originsTitle, l) || t("origins.title")}
            </h2>
          </div>
          <p className="text-oak-600 mb-8 max-w-3xl">
            {getLocalizedValue(data?.originsIntro, l) || t("origins.intro")}
          </p>
          <div className="grid sm:grid-cols-2 gap-6">
            {data?.origins && data.origins.length > 0
              ? data.origins.map((origin, idx) => (
                  <div
                    key={idx}
                    className="bg-white p-6 rounded-xl border border-oak-200 hover:shadow-md transition-shadow"
                  >
                    <h3 className="font-semibold text-oak-800 text-lg mb-2">
                      {getLocalizedValue(origin.name, l)}
                    </h3>
                    <p className="text-oak-600 text-sm leading-relaxed">
                      {getLocalizedValue(origin.description, l)}
                    </p>
                  </div>
                ))
              : (["european", "french", "slavonian", "american"] as const).map(
                  (origin) => (
                    <div
                      key={origin}
                      className="bg-white p-6 rounded-xl border border-oak-200 hover:shadow-md transition-shadow"
                    >
                      <h3 className="font-semibold text-oak-800 text-lg mb-2">
                        {t(`origins.${origin}.name`)}
                      </h3>
                      <p className="text-oak-600 text-sm leading-relaxed">
                        {t(`origins.${origin}.description`)}
                      </p>
                    </div>
                  )
                )}
          </div>
        </div>

        {/* Afmetingen / Dimensions */}
        <div className="mb-20" id="afmetingen">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center">
              <Ruler className="w-6 h-6 text-gold-dark" />
            </div>
            <h2 className="text-2xl font-bold text-oak-800 font-[family-name:var(--font-heading)]">
              {getLocalizedValue(data?.dimensionsTitle, l) || t("dimensions.title")}
            </h2>
          </div>
          <p className="text-oak-600 mb-8 max-w-3xl">
            {getLocalizedValue(data?.dimensionsIntro, l) || t("dimensions.intro")}
          </p>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white rounded-xl border border-oak-200 overflow-hidden">
              <thead>
                <tr className="bg-oak-50">
                  <th className="text-left p-4 text-sm font-semibold text-oak-800 border-b border-oak-200">
                    {getLocalizedValue(data?.dimensionsPropertyLabel, l) || t("dimensions.property")}
                  </th>
                  <th className="text-left p-4 text-sm font-semibold text-oak-800 border-b border-oak-200">
                    {getLocalizedValue(data?.dimensionsRangeLabel, l) || t("dimensions.range")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {data?.dimensions && data.dimensions.length > 0
                  ? data.dimensions.map((dim, i) => (
                      <tr
                        key={i}
                        className={
                          i % 2 === 0 ? "bg-white" : "bg-oak-50/50"
                        }
                      >
                        <td className="p-4 text-sm text-oak-700 font-medium border-b border-oak-100">
                          {getLocalizedValue(dim.label, l)}
                        </td>
                        <td className="p-4 text-sm text-oak-600 border-b border-oak-100">
                          {getLocalizedValue(dim.value, l)}
                        </td>
                      </tr>
                    ))
                  : (["thickness", "width", "length", "lamella"] as const).map(
                      (dim, i) => (
                        <tr
                          key={dim}
                          className={
                            i % 2 === 0 ? "bg-white" : "bg-oak-50/50"
                          }
                        >
                          <td className="p-4 text-sm text-oak-700 font-medium border-b border-oak-100">
                            {t(`dimensions.${dim}.label`)}
                          </td>
                          <td className="p-4 text-sm text-oak-600 border-b border-oak-100">
                            {t(`dimensions.${dim}.value`)}
                          </td>
                        </tr>
                      )
                    )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Algemene productinfo / General Product Info */}
        <div className="mb-20" id="algemeen">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center">
              <Info className="w-6 h-6 text-gold-dark" />
            </div>
            <h2 className="text-2xl font-bold text-oak-800 font-[family-name:var(--font-heading)]">
              {getLocalizedValue(data?.generalTitle, l) || t("general.title")}
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white rounded-xl border border-oak-200 overflow-hidden">
              <thead>
                <tr className="bg-oak-50">
                  <th className="text-left p-4 text-sm font-semibold text-oak-800 border-b border-oak-200">
                    {getLocalizedValue(data?.generalPropertyLabel, l) || t("general.property")}
                  </th>
                  <th className="text-left p-4 text-sm font-semibold text-oak-800 border-b border-oak-200">
                    {getLocalizedValue(data?.generalValueLabel, l) || t("general.value")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {data?.generalInfo && data.generalInfo.length > 0
                  ? data.generalInfo.map((prop, i) => (
                      <tr
                        key={i}
                        className={
                          i % 2 === 0 ? "bg-white" : "bg-oak-50/50"
                        }
                      >
                        <td className="p-4 text-sm text-oak-700 font-medium border-b border-oak-100">
                          {getLocalizedValue(prop.label, l)}
                        </td>
                        <td className="p-4 text-sm text-oak-600 border-b border-oak-100">
                          {getLocalizedValue(prop.value, l)}
                        </td>
                      </tr>
                    ))
                  : (
                      [
                        "moisture",
                        "finish",
                        "structure",
                        "lamella",
                        "glue",
                        "certification",
                      ] as const
                    ).map((prop, i) => (
                      <tr
                        key={prop}
                        className={
                          i % 2 === 0 ? "bg-white" : "bg-oak-50/50"
                        }
                      >
                        <td className="p-4 text-sm text-oak-700 font-medium border-b border-oak-100">
                          {t(`general.${prop}.label`)}
                        </td>
                        <td className="p-4 text-sm text-oak-600 border-b border-oak-100">
                          {t(`general.${prop}.value`)}
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-oak-800 text-white p-8 sm:p-12 rounded-2xl text-center">
          <h2 className="text-2xl font-bold mb-4 font-[family-name:var(--font-heading)]">
            {getLocalizedValue(data?.ctaTitle, l) || t("cta.title")}
          </h2>
          <p className="text-oak-300 mb-6 max-w-xl mx-auto">
            {getLocalizedValue(data?.ctaText, l) || t("cta.text")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={
                locale === "nl"
                  ? "/producten"
                  : locale === "fr"
                  ? `/${locale}/produits`
                  : `/${locale}/products`
              }
              className="inline-flex items-center justify-center px-6 py-3 bg-gold text-oak-900 font-semibold rounded-lg hover:bg-gold-light transition-colors"
            >
              {getLocalizedValue(data?.ctaProductsLabel, l) || t("cta.products")}
            </a>
            <a
              href={locale === "nl" ? "/contact" : `/${locale}/contact`}
              className="inline-flex items-center justify-center px-6 py-3 border border-oak-500 text-white font-semibold rounded-lg hover:bg-oak-700 transition-colors"
            >
              {getLocalizedValue(data?.ctaContactLabel, l) || t("cta.contact")}
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}
