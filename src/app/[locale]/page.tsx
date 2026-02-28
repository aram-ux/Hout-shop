import { setRequestLocale, getTranslations } from "next-intl/server";
import { client } from "@/sanity/lib/client";
import { featuredProductsQuery, homePageQuery } from "@/sanity/lib/queries";
import HeroSection from "@/components/home/HeroSection";
import TrustSection from "@/components/home/TrustSection";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import AboutPreview from "@/components/home/AboutPreview";
import { buildAlternates, buildOpenGraph, SITE_NAME, SITE_URL } from "@/lib/seo";
import type { Product, HomePage } from "@/types";
import type { Locale } from "@/i18n/routing";
import type { Metadata } from "next";

export const revalidate = 60;

const descriptions: Record<Locale, string> = {
  nl: "Belgisch familiebedrijf gespecialiseerd in premium eiken panelen. Op maat gezaagd eikenhout met levering in België en Nederland. ✓ FSC-gecertificeerd ✓ Gratis verzending vanaf €500",
  fr: "Entreprise familiale belge spécialisée dans les panneaux de chêne premium. Chêne sur mesure avec livraison en Belgique et aux Pays-Bas.",
  en: "Belgian family business specializing in premium oak panels. Custom-cut oak wood with delivery in Belgium and the Netherlands.",
};

const titles: Record<Locale, string> = {
  nl: `Premium Eiken Panelen | ${SITE_NAME} - Belgisch Familiebedrijf`,
  fr: `Panneaux de Chêne Premium | ${SITE_NAME} - Entreprise Familiale Belge`,
  en: `Premium Oak Panels | ${SITE_NAME} - Belgian Family Business`,
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const l = locale as Locale;

  return {
    title: titles[l],
    description: descriptions[l],
    alternates: buildAlternates({ nl: "/", fr: "/", en: "/" }),
    openGraph: buildOpenGraph(l, {
      title: titles[l],
      description: descriptions[l],
      url: SITE_URL,
    }),
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  let products: Product[] = [];
  let homePageData: HomePage | null = null;
  try {
    [products, homePageData] = await Promise.all([
      client.fetch(featuredProductsQuery),
      client.fetch(homePageQuery),
    ]);
  } catch {
    // Sanity not configured yet — show empty state
  }

  return (
    <>
      <HeroSection homePageData={homePageData} />
      <TrustSection homePageData={homePageData} />
      <FeaturedProducts products={products} homePageData={homePageData} />
      <AboutPreview homePageData={homePageData} />
    </>
  );
}
