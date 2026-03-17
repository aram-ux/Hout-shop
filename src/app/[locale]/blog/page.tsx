import { setRequestLocale, getTranslations } from "next-intl/server";
import { client } from "@/sanity/lib/client";
import { allBlogPostsQuery } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import Container from "@/components/ui/Container";
import { buildAlternates, buildOpenGraph, SITE_NAME, SITE_URL, breadcrumbJsonLd } from "@/lib/seo";
import { localize } from "@/lib/utils";
import { getLocalizedValue } from "@/types";
import type { BlogPost } from "@/types";
import type { Locale } from "@/i18n/routing";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Calendar, ArrowRight } from "lucide-react";

export const revalidate = 60;

const blogPaths: Record<Locale, string> = {
  nl: "/kennisbank",
  fr: "/blog",
  en: "/blog",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const l = locale as Locale;
  const t = await getTranslations({ locale, namespace: "blog" });

  const title = `${t("title")} | ${SITE_NAME}`;
  const description = t("subtitle");

  return {
    title,
    description,
    alternates: buildAlternates(blogPaths),
    openGraph: buildOpenGraph(l, {
      title,
      description,
    }),
  };
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const l = locale as Locale;

  let posts: BlogPost[] = [];
  try {
    posts = await client.fetch(allBlogPostsQuery);
  } catch {
    // Sanity not configured yet
  }

  const t = await getTranslations({ locale, namespace: "blog" });
  const prefix = locale === "nl" ? "" : `/${locale}`;
  const blogPath = blogPaths[l];

  const breadcrumbLd = breadcrumbJsonLd([
    { name: "Home", url: SITE_URL },
    { name: t("title"), url: `${SITE_URL}${prefix}${blogPath}` },
  ]);

  return (
    <section className="py-12 lg:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      <Container>
        {/* Page Header */}
        <div className="mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-oak-800 mb-4 font-[family-name:var(--font-heading)]">
            {t("title")}
          </h1>
          <p className="text-lg text-oak-500 max-w-2xl">
            {t("subtitle")}
          </p>
        </div>

        {/* Blog Grid */}
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => {
              const title = localize(post.title, l);
              const excerpt = localize(post.excerpt, l);
              const imageUrl = post.mainImage
                ? urlFor(post.mainImage).width(600).height(400).url()
                : null;

              return (
                <Link
                  key={post._id}
                  href={`${prefix}${blogPath}/${post.slug.current}`}
                  className="group bg-white rounded-2xl overflow-hidden border border-oak-100 hover:border-oak-200 hover:shadow-lg transition-all duration-300"
                >
                  {/* Image */}
                  {imageUrl && (
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={imageUrl}
                        alt={getLocalizedValue(post.mainImage?.alt, l) || title || ""}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-6">
                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {post.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="text-xs px-2 py-1 bg-oak-50 text-oak-600 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <h2 className="text-lg font-semibold text-oak-800 mb-2 group-hover:text-gold-dark transition-colors font-[family-name:var(--font-heading)]">
                      {title}
                    </h2>

                    {excerpt && (
                      <p className="text-oak-500 text-sm line-clamp-3 mb-4">
                        {excerpt}
                      </p>
                    )}

                    <div className="flex items-center justify-between">
                      {post.publishedAt && (
                        <div className="flex items-center gap-1.5 text-oak-400 text-xs">
                          <Calendar className="w-3.5 h-3.5" />
                          <time dateTime={post.publishedAt}>
                            {new Date(post.publishedAt).toLocaleDateString(
                              l === "nl" ? "nl-BE" : l === "fr" ? "fr-BE" : "en-GB",
                              { year: "numeric", month: "long", day: "numeric" }
                            )}
                          </time>
                        </div>
                      )}
                      <span className="flex items-center gap-1 text-gold-dark text-sm font-medium group-hover:gap-2 transition-all">
                        {t("readMore")}
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-oak-500 text-lg">{t("noPosts")}</p>
          </div>
        )}
      </Container>
    </section>
  );
}
