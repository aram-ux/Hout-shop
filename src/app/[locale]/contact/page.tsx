import { setRequestLocale, getTranslations } from "next-intl/server";
import ContactContent from "@/components/contact/ContactContent";
import { buildAlternates, buildOpenGraph, SITE_NAME } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";
import type { Metadata } from "next";

const contactPaths: Record<Locale, string> = {
  nl: "/contact",
  fr: "/contact",
  en: "/contact",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const l = locale as Locale;
  const t = await getTranslations({ locale, namespace: "contact" });

  const title = `${t("title")} | ${SITE_NAME}`;
  const description = t("description");

  return {
    title,
    description,
    alternates: buildAlternates(contactPaths),
    openGraph: buildOpenGraph(l, {
      title,
      description,
    }),
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <ContactContent />;
}
