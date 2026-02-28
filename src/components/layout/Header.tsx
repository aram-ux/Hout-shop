"use client";

import { useTranslations, useLocale } from "next-intl";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { ShoppingBag, Menu, X, TreePine } from "lucide-react";
import { useCartStore } from "@/lib/store/cart";
import LanguageSwitcher from "./LanguageSwitcher";
import Container from "../ui/Container";
import type { Locale } from "@/i18n/routing";

export default function Header() {
  const t = useTranslations("nav");
  const tc = useTranslations("common");
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const totalItems = useCartStore((s) => s.getTotalItems());
  const toggleCart = useCartStore((s) => s.toggleCart);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 20);
    }
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const prefix = locale === "nl" ? "" : `/${locale}`;

  const navLinks = [
    { href: `${prefix}/`, label: t("home") },
    { href: `${prefix}/producten`, label: t("products") },
    { href: `${prefix}/over-ons`, label: t("about") },
    { href: `${prefix}/contact`, label: t("contact") },
  ];

  // Adjust paths for each locale
  const getPath = (key: string) => {
    const paths: Record<string, Record<Locale, string>> = {
      products: { nl: "/producten", fr: "/produits", en: "/products" },
      about: { nl: "/over-ons", fr: "/a-propos", en: "/about" },
      contact: { nl: "/contact", fr: "/contact", en: "/contact" },
      cart: { nl: "/winkelwagen", fr: "/panier", en: "/cart" },
    };
    return `${prefix}${paths[key]?.[locale] || ""}`;
  };

  const links = [
    { href: `${prefix}/` || "/", label: t("home") },
    { href: getPath("products"), label: t("products") },
    { href: getPath("about"), label: t("about") },
    { href: getPath("contact"), label: t("contact") },
  ];

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-oak-200/50"
          : "bg-white"
      }`}
    >
      <Container>
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link
            href={`${prefix}/` || "/"}
            className="flex items-center gap-2 group"
          >
            <div className="w-9 h-9 bg-oak-800 rounded-lg flex items-center justify-center group-hover:bg-oak-700 transition-colors">
              <TreePine className="w-5 h-5 text-gold" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-oak-800 leading-tight font-[family-name:var(--font-heading)]">
                {tc("shopName")}
              </span>
              <span className="text-[10px] text-oak-400 tracking-wider uppercase leading-tight hidden sm:block">
                {tc("tagline")}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {links.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href !== `${prefix}/` &&
                  link.href !== "/" &&
                  pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? "text-oak-900 bg-oak-100"
                      : "text-oak-600 hover:text-oak-900 hover:bg-oak-50"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right side: Language, Cart */}
          <div className="flex items-center gap-2">
            <LanguageSwitcher />

            <button
              onClick={toggleCart}
              className="relative flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-oak-700 hover:text-oak-900 hover:bg-oak-100 rounded-lg transition-colors cursor-pointer"
              aria-label={t("cart")}
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-gold text-oak-900 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-oak-700 hover:text-oak-900 hover:bg-oak-100 rounded-lg transition-colors cursor-pointer"
              aria-label="Menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="lg:hidden border-t border-oak-200 py-4 animate-fade-in">
            <div className="flex flex-col gap-1">
              {links.map((link) => {
                const isActive =
                  pathname === link.href ||
                  (link.href !== `${prefix}/` &&
                    link.href !== "/" &&
                    pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-4 py-3 text-base font-medium rounded-lg transition-colors ${
                      isActive
                        ? "text-oak-900 bg-oak-100"
                        : "text-oak-600 hover:text-oak-900 hover:bg-oak-50"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </nav>
        )}
      </Container>
    </header>
  );
}
