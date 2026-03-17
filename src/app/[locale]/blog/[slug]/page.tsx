import { setRequestLocale, getTranslations } from "next-intl/server";
import { client } from "@/sanity/lib/client";
import { blogPostBySlugQuery, allBlogPostsQuery } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import Container from "@/components/ui/Container";
import { buildOpenGraph, SITE_NAME, SITE_URL, breadcrumbJsonLd } from "@/lib/seo";
import { localize } from "@/lib/utils";
import { getLocalizedValue } from "@/types";
import type { BlogPost } from "@/types";
import type { Locale } from "@/i18n/routing";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PortableText, type PortableTextBlock } from "@portabletext/react";
import { Calendar, User, ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

export const revalidate = 60;

const blogPaths: Record<Locale, string> = {
  nl: "/kennisbank",
  fr: "/blog",
  en: "/blog",
};

export async function generateStaticParams() {
  const posts = await client.fetch<{ slug: { current: string } }[]>(
    `*[_type == "blogPost" && !(_id in path("drafts.**"))]{slug}`
  );
  return posts.map((post) => ({ slug: post.slug.current }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const l = locale as Locale;
  const post: BlogPost | null = await client.fetch(blogPostBySlugQuery, { slug });

  if (!post) return { title: "Not Found" };

  const title = getLocalizedValue(post.seoTitle, l) || localize(post.title, l) || "";
  const description =
    getLocalizedValue(post.seoDescription, l) || localize(post.excerpt, l) || "";

  const prefix = locale === "nl" ? "" : `/${locale}`;
  const url = `${SITE_URL}${prefix}${blogPaths[l]}/${slug}`;

  const imageUrl = post.mainImage
    ? urlFor(post.mainImage).width(1200).height(630).url()
    : undefined;

  return {
    title: `${title} | ${SITE_NAME}`,
    description,
    openGraph: buildOpenGraph(l, {
      title,
      description,
      url,
      type: "article",
      ...(imageUrl && {
        images: [{ url: imageUrl, width: 1200, height: 630, alt: title }],
      }),
    }),
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const l = locale as Locale;

  const post: BlogPost | null = await client.fetch(blogPostBySlugQuery, { slug });

  if (!post) notFound();

  const t = await getTranslations({ locale, namespace: "blog" });
  const prefix = locale === "nl" ? "" : `/${locale}`;
  const blogPath = blogPaths[l];

  const title = localize(post.title, l);
  const body = (post.body?.[l] || post.body?.nl) as PortableTextBlock[] | undefined;
  const imageUrl = post.mainImage
    ? urlFor(post.mainImage).width(1200).height(600).url()
    : null;

  const breadcrumbLd = breadcrumbJsonLd([
    { name: "Home", url: SITE_URL },
    { name: t("title"), url: `${SITE_URL}${prefix}${blogPath}` },
    { name: title || "", url: `${SITE_URL}${prefix}${blogPath}/${slug}` },
  ]);

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description: localize(post.excerpt, l),
    ...(imageUrl && { image: imageUrl }),
    ...(post.publishedAt && { datePublished: post.publishedAt }),
    ...(post.author && {
      author: { "@type": "Person", name: post.author },
    }),
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    mainEntityOfPage: `${SITE_URL}${prefix}${blogPath}/${slug}`,
  };

  return (
    <article className="py-12 lg:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />

      <Container>
        {/* Back link */}
        <Link
          href={`${prefix}${blogPath}`}
          className="inline-flex items-center gap-2 text-oak-500 hover:text-oak-800 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          {t("backToBlog")}
        </Link>

        {/* Header */}
        <header className="mb-10 max-w-3xl">
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-3 py-1 bg-oak-50 text-oak-600 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-oak-800 mb-4 font-[family-name:var(--font-heading)]">
            {title}
          </h1>

          <div className="flex items-center gap-4 text-oak-400 text-sm">
            {post.publishedAt && (
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                <time dateTime={post.publishedAt}>
                  {new Date(post.publishedAt).toLocaleDateString(
                    l === "nl" ? "nl-BE" : l === "fr" ? "fr-BE" : "en-GB",
                    { year: "numeric", month: "long", day: "numeric" }
                  )}
                </time>
              </div>
            )}
            {post.author && (
              <div className="flex items-center gap-1.5">
                <User className="w-4 h-4" />
                <span>{post.author}</span>
              </div>
            )}
          </div>
        </header>

        {/* Featured Image */}
        {imageUrl && (
          <div className="relative h-64 sm:h-80 lg:h-[28rem] rounded-2xl overflow-hidden mb-10">
            <Image
              src={imageUrl}
              alt={getLocalizedValue(post.mainImage?.alt, l) || title || ""}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1200px) 100vw, 1200px"
            />
          </div>
        )}

        {/* Body */}
        {body && (
          <div className="max-w-3xl prose prose-lg prose-oak mx-auto">
            <PortableText
              value={body}
              components={{
                types: {
                  image: ({ value }) => {
                    if (!value?.asset) return null;
                    return (
                      <figure className="my-8">
                        <Image
                          src={urlFor(value).width(800).url()}
                          alt={value.alt || ""}
                          width={800}
                          height={450}
                          className="rounded-xl w-full"
                        />
                        {value.caption && (
                          <figcaption className="text-center text-oak-400 text-sm mt-2">
                            {value.caption}
                          </figcaption>
                        )}
                      </figure>
                    );
                  },
                },
              }}
            />
          </div>
        )}
      </Container>
    </article>
  );
}
