import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { client } from "@/sanity/lib/client";
import { productBySlugQuery, allProductsQuery } from "@/sanity/lib/queries";
import { localize } from "@/lib/utils";
import { urlFor } from "@/sanity/lib/image";
import Container from "@/components/ui/Container";
import ProductDetail from "@/components/products/ProductDetail";
import {
  buildAlternates,
  buildOpenGraph,
  productJsonLd,
  breadcrumbJsonLd,
  SITE_URL,
  SITE_NAME,
} from "@/lib/seo";
import type { Product } from "@/types";
import type { Locale } from "@/i18n/routing";
import type { Metadata } from "next";

export const revalidate = 60;

export async function generateStaticParams() {
  try {
    const products: Product[] = await client.fetch(allProductsQuery);
    return products.map((product) => ({ slug: product.slug.current }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const l = locale as Locale;
  try {
    const product: Product = await client.fetch(productBySlugQuery, { slug });
    if (!product) return {};

    const title = localize(product.title, l);
    const description = localize(product.shortDescription, l);
    const imageUrl = product.mainImage
      ? urlFor(product.mainImage).width(1200).height(630).url()
      : undefined;

    return {
      title: `${title} | ${SITE_NAME}`,
      description,
      alternates: buildAlternates({
        nl: `/producten/${slug}`,
        fr: `/produits/${slug}`,
        en: `/products/${slug}`,
      }),
      openGraph: buildOpenGraph(l, {
        title: `${title} | ${SITE_NAME}`,
        description,
        type: "article",
        ...(imageUrl && {
          images: [
            {
              url: imageUrl,
              width: 1200,
              height: 630,
              alt: title,
            },
          ],
        }),
      }),
    };
  } catch {
    return {};
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  let product: Product | null = null;
  try {
    product = await client.fetch(productBySlugQuery, { slug });
  } catch {
    // Sanity not configured
  }

  if (!product) {
    notFound();
  }

  const prefix = locale === "nl" ? "" : `/${locale}`;
  const productsPath: Record<string, string> = {
    nl: "/producten",
    fr: "/produits",
    en: "/products",
  };

  // Build JSON-LD for this product
  const l = locale as Locale;
  const title = localize(product.title, l);
  const description = localize(product.shortDescription, l) || "";
  const imageUrl = product.mainImage
    ? urlFor(product.mainImage).width(1200).height(630).url()
    : undefined;
  const sizes = Array.isArray(product.standardSizes)
    ? product.standardSizes
    : [];
  const lowestPrice =
    sizes.length > 0
      ? sizes.reduce(
          (min, size) => (size.price < min ? size.price : min),
          sizes[0]?.price || 0
        )
      : undefined;
  const categoryTitle = product.category
    ? localize(product.category.title, l)
    : undefined;

  const productLd = productJsonLd({
    name: title,
    description,
    slug: product.slug.current,
    image: imageUrl,
    price: lowestPrice,
    inStock: product.inStock,
    category: categoryTitle,
  });

  const productsLabel: Record<string, string> = {
    nl: "Producten",
    fr: "Produits",
    en: "Products",
  };

  const breadcrumbLd = breadcrumbJsonLd([
    { name: "Home", url: SITE_URL },
    {
      name: productsLabel[locale] || "Products",
      url: `${SITE_URL}${prefix}${productsPath[locale]}`,
    },
    {
      name: title,
      url: `${SITE_URL}${prefix}${productsPath[locale]}/${product.slug.current}`,
    },
  ]);

  return (
    <section className="py-8">
      {/* Product JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      <Container>
        {/* Back link */}
        <Link
          href={`${prefix}${productsPath[locale]}`}
          className="inline-flex items-center gap-2 text-sm text-oak-500 hover:text-oak-800 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          {locale === "nl"
            ? "Terug naar producten"
            : locale === "fr"
              ? "Retour aux produits"
              : "Back to products"}
        </Link>
      </Container>

      <ProductDetail product={product} />
    </section>
  );
}
