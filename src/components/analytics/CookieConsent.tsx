"use client";

import { useState, useEffect, useCallback } from "react";
import { X, Cookie } from "lucide-react";
import Button from "@/components/ui/Button";

const CONSENT_KEY = "hout-shop-cookie-consent";

type ConsentState = "granted" | "denied" | null;

function getStoredConsent(): ConsentState {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(CONSENT_KEY) as ConsentState;
}

export function useCookieConsent() {
  const [consent, setConsent] = useState<ConsentState>(null);

  useEffect(() => {
    setConsent(getStoredConsent());
  }, []);

  return consent;
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = getStoredConsent();
    if (!stored) {
      // Small delay so it doesn't flash on page load
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = useCallback(() => {
    localStorage.setItem(CONSENT_KEY, "granted");
    setVisible(false);
    window.dispatchEvent(new Event("cookie-consent-update"));
  }, []);

  const deny = useCallback(() => {
    localStorage.setItem(CONSENT_KEY, "denied");
    setVisible(false);
    window.dispatchEvent(new Event("cookie-consent-update"));
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 p-4 sm:p-6">
      <div className="mx-auto max-w-2xl bg-white rounded-xl border border-oak-200 shadow-lg p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 bg-gold/10 rounded-lg flex items-center justify-center">
            <Cookie className="w-5 h-5 text-gold-dark" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-oak-800 text-sm mb-1">
              Cookies & Privacy
            </h3>
            <p className="text-oak-500 text-sm leading-relaxed">
              Wij gebruiken cookies om uw ervaring te verbeteren en ons
              websiteverkeer te analyseren. Door te accepteren gaat u akkoord
              met het gebruik van analytische cookies.
            </p>
          </div>
          <button
            onClick={deny}
            className="flex-shrink-0 text-oak-400 hover:text-oak-600 transition-colors"
            aria-label="Sluiten"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex gap-3 mt-4 justify-end">
          <Button variant="outline" size="sm" onClick={deny}>
            Weigeren
          </Button>
          <Button variant="gold" size="sm" onClick={accept}>
            Accepteren
          </Button>
        </div>
      </div>
    </div>
  );
}
