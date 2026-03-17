import { setRequestLocale, getTranslations } from "next-intl/server";
import { client } from "@/sanity/lib/client";
import { allProductsQuery, allCategoriesQuery, productsPageQuery } from "@/sanity/lib/queries";
import Container from "@/components/ui/Container";
import ProductGrid from "@/components/products/ProductGrid";
import { buildAlternates, buildOpenGraph, SITE_NAME, SITE_URL, collectionPageJsonLd, breadcrumbJsonLd } from "@/lib/seo";
import { localize } from "@/lib/utils";
import { urlFor } from "@/sanity/lib/image";
import { getLocalizedValue } from "@/types";
import type { Product, Category, ProductsPage as ProductsPageType } from "@/types";
import type { Locale } from "@/i18n/routing";
import type { Metadata } from "next";

export const revalidate = 60;

const productPaths: Record<Locale, string> = {
  nl: "/producten",
  fr: "/produits",
  en: "/products",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const l = locale as Locale;
  const t = await getTranslations({ locale, namespace: "products" });

  const title = `${t("title")} | ${SITE_NAME}`;
  const description = t("subtitle");

  return {
    title,
    description,
    alternates: buildAlternates(productPaths),
    openGraph: buildOpenGraph(l, {
      title,
      description,
    }),
  };
}

export default async function ProductsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  let products: Product[] = [];
  let categories: Category[] = [];
  let pageData: ProductsPageType | null = null;

  try {
    [products, categories, pageData] = await Promise.all([
      client.fetch(allProductsQuery),
      client.fetch(allCategoriesQuery),
      client.fetch(productsPageQuery),
    ]);
  } catch {
    // Sanity not configured yet
  }

  const t = await getTranslations({ locale, namespace: "products" });
  const l = locale as Locale;

  const prefix = locale === "nl" ? "" : `/${locale}`;
  const productPathMap: Record<Locale, string> = {
    nl: "/producten",
    fr: "/produits",
    en: "/products",
  };

  // Build CollectionPage JSON-LD
  const collectionLd = collectionPageJsonLd(
    products.map((p) => ({
      name: localize(p.title, l),
      url: `${SITE_URL}${prefix}${productPathMap[l]}/${p.slug.current}`,
      image: p.mainImage ? urlFor(p.mainImage).width(600).height(450).url() : undefined,
      price: Array.isArray(p.standardSizes) && p.standardSizes.length > 0
        ? p.standardSizes.reduce((min, s) => (s.price < min ? s.price : min), p.standardSizes[0]?.price || 0)
        : undefined,
    }))
  );

  const breadcrumbLd = breadcrumbJsonLd([
    { name: "Home", url: SITE_URL },
    { name: t("title"), url: `${SITE_URL}${prefix}${productPathMap[l]}` },
  ]);

  return (
    <section className="py-12 lg:py-16">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      <Container>
        {/* Page Header */}
        <div className="mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-oak-800 mb-4 font-[family-name:var(--font-heading)]">
            {getLocalizedValue(pageData?.pageTitle, l) || t("title")}
          </h1>
          <p className="text-lg text-oak-500 max-w-2xl">
            {getLocalizedValue(pageData?.pageSubtitle, l) || t("subtitle")}
          </p>
        </div>

        {/* Products */}
        <ProductGrid products={products} categories={categories} />
      </Container>
    </section>
  );
}
