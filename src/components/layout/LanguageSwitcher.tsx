"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { Globe } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const localeLabels: Record<Locale, string> = {
  nl: "NL",
  fr: "FR",
  en: "EN",
};

const localeFull: Record<Locale, string> = {
  nl: "Nederlands",
  fr: "Français",
  en: "English",
};

export default function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function switchLocale(newLocale: Locale) {
    // Replace the current locale in the pathname
    const segments = pathname.split("/");
    if (routing.locales.includes(segments[1] as Locale)) {
      segments[1] = newLocale;
    } else {
      segments.splice(1, 0, newLocale);
    }
    router.push(segments.join("/") || "/");
    setIsOpen(false);
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2 py-1.5 text-sm font-medium text-oak-700 hover:text-oak-900 hover:bg-oak-100 rounded-lg transition-colors cursor-pointer"
        aria-label="Change language"
      >
        <Globe className="w-4 h-4" />
        <span>{localeLabels[locale]}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-oak-200 py-1 min-w-[140px] z-50">
          {routing.locales.map((loc) => (
            <button
              key={loc}
              onClick={() => switchLocale(loc)}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-oak-50 transition-colors cursor-pointer ${
                loc === locale
                  ? "text-gold-dark font-semibold bg-gold/5"
                  : "text-oak-700"
              }`}
            >
              <span className="font-medium mr-2">{localeLabels[loc]}</span>
              <span className="text-oak-400">{localeFull[loc]}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
