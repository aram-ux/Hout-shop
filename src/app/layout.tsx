import type { Metadata } from "next";
import { SITE_URL, SITE_NAME } from "@/lib/seo";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | Premium Eiken Panelen`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Belgisch familiebedrijf gespecialiseerd in premium eiken panelen. Op maat gezaagd eikenhout met levering in België en Nederland. ✓ FSC-gecertificeerd ✓ Gratis verzending vanaf €500",
  keywords: [
    "eiken panelen",
    "eikenhout",
    "houten panelen",
    "eiken platen",
    "panneaux de chêne",
    "oak panels",
    "hout op maat",
    "eiken meubelpaneel",
    "Belgisch eikenhout",
    "FSC hout",
    "houten wandpanelen",
    "eiken tafelblad",
    "massief eiken",
    "hout kopen",
    "hout webshop België",
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  formatDetection: {
    email: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "nl_BE",
    alternateLocale: ["fr_BE", "en_GB"],
    title: `${SITE_NAME} | Premium Eiken Panelen`,
    description:
      "Belgisch familiebedrijf gespecialiseerd in premium eiken panelen. Op maat gezaagd eikenhout met levering in België en Nederland.",
    url: SITE_URL,
    images: [
      {
        url: `/images/og-default.jpg`,
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} - Premium Eiken Panelen`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | Premium Eiken Panelen`,
    description:
      "Belgisch familiebedrijf gespecialiseerd in premium eiken panelen. Levering in België en Nederland.",
    images: [`/images/og-default.jpg`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Voeg je verificatiecodes in zodra je die hebt:
    // google: "je-google-verificatie-code",
    // yandex: "je-yandex-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
