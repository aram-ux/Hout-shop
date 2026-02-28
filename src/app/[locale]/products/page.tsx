import { setRequestLocale, getTranslations } from "next-intl/server";
import { client } from "@/sanity/lib/client";
import { allProductsQuery, allCategoriesQuery } from "@/sanity/lib/queries";
import Container from "@/components/ui/Container";
import ProductGrid from "@/components/products/ProductGrid";
import { buildAlternates, buildOpenGraph, SITE_NAME } from "@/lib/seo";
import type { Product, Category } from "@/types";
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

  try {
    [products, categories] = await Promise.all([
      client.fetch(allProductsQuery),
      client.fetch(allCategoriesQuery),
    ]);
  } catch {
    // Sanity not configured yet
  }

  const t = await getTranslations({ locale, namespace: "products" });

  return (
    <section className="py-12 lg:py-16">
      <Container>
        {/* Page Header */}
        <div className="mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-oak-800 mb-4 font-[family-name:var(--font-heading)]">
            {t("title")}
          </h1>
          <p className="text-lg text-oak-500 max-w-2xl">{t("subtitle")}</p>
        </div>

        {/* Products */}
        <ProductGrid products={products} categories={categories} />
      </Container>
    </section>
  );
}
