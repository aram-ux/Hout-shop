import { setRequestLocale, getTranslations } from "next-intl/server";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import type { Locale } from "@/i18n/routing";

export default async function CheckoutSuccessPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ orderNumber?: string }>;
}) {
  const { locale } = await params;
  const search = await searchParams;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "checkout.success" });
  const prefix = locale === "nl" ? "" : `/${locale}`;

  return (
    <section className="py-20 lg:py-32">
      <Container>
        <div className="max-w-lg mx-auto text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-forest/10 rounded-full flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-forest" />
          </div>

          <h1 className="text-3xl font-bold text-oak-800 mb-4 font-[family-name:var(--font-heading)]">
            {t("title")}
          </h1>
          <p className="text-oak-500 mb-8">{t("description")}</p>

          {search.orderNumber && (
            <div className="bg-oak-50 rounded-xl border border-oak-200 p-6 mb-8">
              <span className="text-sm text-oak-500">{t("orderNumber")}</span>
              <p className="text-2xl font-bold text-oak-800 mt-1">
                {search.orderNumber}
              </p>
            </div>
          )}

          <Link href={`${prefix}/`}>
            <Button variant="gold" size="lg">
              {t("backToShop")}
            </Button>
          </Link>
        </div>
      </Container>
    </section>
  );
}
