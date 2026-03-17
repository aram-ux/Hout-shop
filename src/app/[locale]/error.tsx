"use client";

import { useTranslations } from "next-intl";
import { RefreshCw, Home } from "lucide-react";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("nav");

  return (
    <section className="py-20 lg:py-32">
      <Container>
        <div className="max-w-lg mx-auto text-center">
          <p className="text-6xl font-bold text-error mb-4 font-[family-name:var(--font-heading)]">
            Oops
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-oak-800 mb-4 font-[family-name:var(--font-heading)]">
            Er ging iets fout
          </h1>
          <p className="text-oak-500 mb-8">
            Er is een onverwachte fout opgetreden. Probeer het opnieuw of ga
            terug naar de homepagina.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="gold" size="lg" onClick={reset}>
              <RefreshCw className="w-4 h-4" />
              Opnieuw proberen
            </Button>
            <a href="/">
              <Button variant="outline" size="lg">
                <Home className="w-4 h-4" />
                {t("home")}
              </Button>
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}
