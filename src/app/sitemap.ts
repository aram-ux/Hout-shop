import type { MetadataRoute } from "next";
import { client } from "@/sanity/lib/client";
import { allProductsQuery, allBlogPostsQuery } from "@/sanity/lib/queries";
import { SITE_URL } from "@/lib/seo";
import { routing } from "@/i18n/routing";
import type { Product } from "@/types";
import type { Locale } from "@/i18n/routing";

// Define pathnames for each route per locale
const staticRoutes: { path: Record<Locale, string>; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  {
    path: { nl: "/", fr: "/", en: "/" },
    priority: 1.0,
    changeFrequency: "weekly",
  },
  {
    path: { nl: "/producten", fr: "/produits", en: "/products" },
    priority: 0.9,
    changeFrequency: "daily",
  },
  {
    path: { nl: "/over-ons", fr: "/a-propos", en: "/about" },
    priority: 0.7,
    changeFrequency: "monthly",
  },
  {
    path: { nl: "/contact", fr: "/contact", en: "/contact" },
    priority: 0.7,
    changeFrequency: "monthly",
  },
  {
    path: { nl: "/info", fr: "/info", en: "/info" },
    priority: 0.8,
    changeFrequency: "monthly",
  },
  {
    path: { nl: "/kennisbank", fr: "/blog", en: "/blog" },
    priority: 0.8,
    changeFrequency: "weekly",
  },
];

function getLocalePath(locale: Locale, path: string): string {
  if (locale === routing.defaultLocale) {
    return path === "/" ? "" : path;
  }
  return `/${locale}${path}`;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  // Static routes with alternates
  for (const route of staticRoutes) {
    const languages: Record<string, string> = {};
    for (const locale of routing.locales) {
      const localePath = getLocalePath(locale as Locale, route.path[locale as Locale]);
      languages[locale] = `${SITE_URL}${localePath}`;
    }
    // x-default
    const defaultPath = getLocalePath(
      routing.defaultLocale as Locale,
      route.path[routing.defaultLocale as Locale]
    );
    languages["x-default"] = `${SITE_URL}${defaultPath}`;

    // Add one entry per locale
    for (const locale of routing.locales) {
      const localePath = getLocalePath(locale as Locale, route.path[locale as Locale]);
      entries.push({
        url: `${SITE_URL}${localePath}`,
        lastModified: new Date(),
        changeFrequency: route.changeFrequency,
        priority: route.priority,
        alternates: { languages },
      });
    }
  }

  // Dynamic product routes
  try {
    const products: Product[] = await client.fetch(allProductsQuery);

    for (const product of products) {
      const slug = product.slug.current;

      const productPaths: Record<Locale, string> = {
        nl: `/producten/${slug}`,
        fr: `/produits/${slug}`,
        en: `/products/${slug}`,
      };

      const languages: Record<string, string> = {};
      for (const locale of routing.locales) {
        const localePath = getLocalePath(locale as Locale, productPaths[locale as Locale]);
        languages[locale] = `${SITE_URL}${localePath}`;
      }
      const defaultPath = getLocalePath(
        routing.defaultLocale as Locale,
        productPaths[routing.defaultLocale as Locale]
      );
      languages["x-default"] = `${SITE_URL}${defaultPath}`;

      for (const locale of routing.locales) {
        const localePath = getLocalePath(locale as Locale, productPaths[locale as Locale]);
        entries.push({
          url: `${SITE_URL}${localePath}`,
          lastModified: new Date(),
          changeFrequency: "weekly",
          priority: 0.8,
          alternates: { languages },
        });
      }
    }
  } catch {
    // Sanity not configured — skip product URLs
  }

  // Dynamic blog post routes
  try {
    const posts: { slug: { current: string } }[] = await client.fetch(allBlogPostsQuery);

    for (const post of posts) {
      const slug = post.slug.current;

      const blogPaths: Record<Locale, string> = {
        nl: `/kennisbank/${slug}`,
        fr: `/blog/${slug}`,
        en: `/blog/${slug}`,
      };

      const languages: Record<string, string> = {};
      for (const locale of routing.locales) {
        const localePath = getLocalePath(locale as Locale, blogPaths[locale as Locale]);
        languages[locale] = `${SITE_URL}${localePath}`;
      }
      const defaultPath = getLocalePath(
        routing.defaultLocale as Locale,
        blogPaths[routing.defaultLocale as Locale]
      );
      languages["x-default"] = `${SITE_URL}${defaultPath}`;

      for (const locale of routing.locales) {
        const localePath = getLocalePath(locale as Locale, blogPaths[locale as Locale]);
        entries.push({
          url: `${SITE_URL}${localePath}`,
          lastModified: new Date(),
          changeFrequency: "monthly" as const,
          priority: 0.7,
          alternates: { languages },
        });
      }
    }
  } catch {
    // Sanity not configured — skip blog URLs
  }

  return entries;
}
