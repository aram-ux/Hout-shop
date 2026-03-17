import { useTranslations } from "next-intl";
import Link from "next/link";
import { Home, Search } from "lucide-react";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";

export default function NotFound() {
  const t = useTranslations("nav");

  return (
    <section className="py-20 lg:py-32">
      <Container>
        <div className="max-w-lg mx-auto text-center">
          <p className="text-6xl font-bold text-gold mb-4 font-[family-name:var(--font-heading)]">
            404
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-oak-800 mb-4 font-[family-name:var(--font-heading)]">
            Pagina niet gevonden
          </h1>
          <p className="text-oak-500 mb-8">
            De pagina die u zoekt bestaat niet of is verplaatst.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/">
              <Button variant="gold" size="lg">
                <Home className="w-4 h-4" />
                {t("home")}
              </Button>
            </Link>
            <Link href="/producten">
              <Button variant="outline" size="lg">
                <Search className="w-4 h-4" />
                {t("products")}
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
