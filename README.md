# ðŸªµ Hout-Shop â€” Eiken Panelen Webshop

Een moderne e-commerce webshop voor eiken panelen, gebouwd met Next.js, Sanity CMS en Mollie betalingen. Meertalig (NL/FR/EN) en volledig aanpasbaar via het CMS.

## Kenmerken

- **Productcatalogus** â€” Tot 50+ producten met standaardmaten en maatwerk-calculator
- **Maatwerk-calculator** â€” Klanten voeren breedte, hoogte en dikte in; prijs wordt per mÂ² berekend
- **Winkelwagen** â€” Persisted cart met Zustand (blijft bewaard na herladen)
- **Checkout & Betaling** â€” Mollie integratie (iDEAL, Bancontact, Visa, Mastercard, etc.)
- **Meertalig** â€” Nederlands, Frans en Engels met next-intl
- **CMS-beheer** â€” Sanity Studio (/studio) voor producten, categorieÃ«n, bestellingen en site-instellingen
- **Responsive design** â€” Mobiel-first oak-themed design met Tailwind CSS

## Tech Stack

| Technologie | Doel |
|---|---|
| [Next.js 16](https://nextjs.org/) | React framework (App Router) |
| [Sanity CMS](https://sanity.io/) | Headless CMS voor content |
| [Mollie](https://mollie.com/) | Betalingsverwerking |
| [next-intl](https://next-intl-docs.vercel.app/) | Internationalisatie (NL/FR/EN) |
| [Tailwind CSS v4](https://tailwindcss.com/) | Styling |
| [Zustand](https://zustand-demo.pmnd.rs/) | Cart state management |
| [Framer Motion](https://www.framer.com/motion/) | Animaties |
| [Lucide React](https://lucide.dev/) | Iconen |

## Aan de slag

### Vereisten

- Node.js 18+
- npm of yarn
- Een [Sanity.io](https://sanity.io) account (gratis tier beschikbaar)
- Een [Mollie](https://mollie.com) account (test-modus beschikbaar)

### 1. Installatie

```bash
cd Hout-Shop
npm install
```

### 2. Sanity project aanmaken

1. Ga naar [sanity.io/manage](https://www.sanity.io/manage) en maak een nieuw project aan
2. Noteer je **Project ID**
3. Maak een API token aan (Editor-rechten) onder **API â†’ Tokens**

### 3. Mollie instellen

1. Maak een account aan op [mollie.com](https://www.mollie.com)
2. Ga naar **Developers â†’ API-sleutels** in je Mollie dashboard
3. Kopieer je **Test API-sleutel** (begint met `test_`)

### 4. Omgevingsvariabelen

Kopieer `.env.example` naar `.env.local` en vul de waarden in:

```bash
cp .env.example .env.local
```

```env
# Sanity CMS
NEXT_PUBLIC_SANITY_PROJECT_ID=je-project-id    # Van sanity.io/manage
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
SANITY_API_TOKEN=je-sanity-token               # API token met Editor-rechten

# Mollie Payments
MOLLIE_API_KEY=test_xxxxxxxxxxxxxx             # Mollie test API-sleutel
NEXT_PUBLIC_MOLLIE_PROFILE_ID=pfl-xxxxx        # Mollie profiel ID

# App
NEXT_PUBLIC_BASE_URL=http://localhost:3000     # Je applicatie URL
```

### 5. Development starten

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in je browser.

### 6. Sanity Studio

Navigeer naar [http://localhost:3000/studio](http://localhost:3000/studio) om het CMS te openen. Hier kun je:

- **Producten** toevoegen met meertalige titels, beschrijvingen, afbeeldingen, standaardmaten en maatwerk-configuratie
- **CategorieÃ«n** beheren
- **Bestellingen** inzien en opvolgen
- **Site-instellingen** aanpassen (contactgegevens, verzendkosten, BTW-nummer, etc.)

## Projectstructuur

```
src/
â”œâ”€â”€ app/
â”‚   â”œâ”€â”€ [locale]/           # Taal-specifieke pagina's
â”‚   â”‚   â”œâ”€â”€ page.tsx        # Homepage
â”‚   â”‚   â”œâ”€â”€ products/       # Productcatalogus & detail
â”‚   â”‚   â”œâ”€â”€ cart/           # Winkelwagen
â”‚   â”‚   â”œâ”€â”€ checkout/       # Afrekenen & succes
â”‚   â”‚   â”œâ”€â”€ about/          # Over ons
â”‚   â”‚   â””â”€â”€ contact/        # Contact
â”‚   â”œâ”€â”€ api/                # API routes
â”‚   â”‚   â”œâ”€â”€ checkout/       # Mollie betaling aanmaken
â”‚   â”‚   â”œâ”€â”€ webhook/mollie/ # Mollie webhook (status updates)
â”‚   â”‚   â””â”€â”€ calculate-price/# Maatwerk prijsberekening
â”‚   â””â”€â”€ studio/             # Sanity Studio
â”œâ”€â”€ components/
â”‚   â”œâ”€â”€ ui/                 # Button, Container, Badge
â”‚   â”œâ”€â”€ layout/             # Header, Footer, LanguageSwitcher
â”‚   â”œâ”€â”€ home/               # Hero, Featured, Trust, About
â”‚   â”œâ”€â”€ products/           # ProductCard, Grid, Detail, Calculator
â”‚   â””â”€â”€ cart/               # CartDrawer
â”œâ”€â”€ i18n/                   # Internationalisatie config
â”œâ”€â”€ lib/                    # Utilities, cart store, Mollie client
â”œâ”€â”€ sanity/                 # Sanity schemas, client, queries
â”œâ”€â”€ types/                  # TypeScript types
â””â”€â”€ middleware.ts           # next-intl routing middleware
messages/
â”œâ”€â”€ nl.json                 # Nederlandse vertalingen
â”œâ”€â”€ fr.json                 # Franse vertalingen
â””â”€â”€ en.json                 # Engelse vertalingen
```

## Content toevoegen in Sanity

### Product aanmaken

1. Open `/studio` â†’ **Products** â†’ **Create**
2. Vul in:
   - **Titel** (NL/FR/EN) en **slug**
   - **Beschrijving** (NL/FR/EN)
   - **Afbeeldingen** (upload of sleep)
   - **Houtsoort** en **afwerking**
   - **Standaardmaten** met prijzen
   - **Maatwerk** (aan/uit) met min/max afmetingen en prijs per mÂ²
   - **Categorie** koppeling
3. Publiceer

### Site-instellingen

Ga naar **Site Settings** in de Studio om te configureren:
- Bedrijfsnaam, logo en contactgegevens
- Adres en BTW-nummer
- Verzendkosten en gratis-verzenddrempel
- Social media links

## Deployment op Vercel

### Inhoudsopgave deployment

1. [Vereisten](#vereisten-deployment)
2. [Project aanmaken](#project-aanmaken-op-vercel)
3. [Environment variabelen](#environment-variabelen-instellen)
4. [Build-instellingen](#build-instellingen)
5. [Domein & DNS](#domein--dns-configuratie)
6. [Sanity productie-config](#sanity-configuratie-voor-productie)
7. [Mollie webhook](#mollie-webhook-configuratie)
8. [Preview deployments](#preview-deployments--branches)
9. [Caching & performance](#caching--performance)
10. [Monitoring & logging](#monitoring--logging)
11. [Troubleshooting](#troubleshooting)
12. [Go-live checklist](#go-live-checklist)

---

### Vereisten deployment

| Onderdeel             | Details                                                                 |
| --------------------- | ----------------------------------------------------------------------- |
| **Git repository**    | Push je code naar GitHub, GitLab of Bitbucket                           |
| **Vercel account**    | Gratis of Pro â€” [vercel.com](https://vercel.com)                        |
| **Node.js**           | >= 18.x (Vercel gebruikt standaard Node 20)                             |
| **Sanity project**    | Project ID: `7bs5g90g`, dataset: `production`                           |
| **Sanity API token**  | Token met **write**-rechten (voor orders & webhooks)                    |
| **Mollie account**    | Live API-key van [mollie.com](https://mollie.com)                       |
| **Domeinnaam**        | Bijv. `hout-shop.com` (optioneel, Vercel geeft ook een `.vercel.app` URL) |

---

### Project aanmaken op Vercel

#### Via de Vercel Dashboard

1. Log in op [vercel.com/dashboard](https://vercel.com/dashboard)
2. Klik op **"Add Newâ€¦"** â†’ **"Project"**
3. Importeer je Git-repository (GitHub/GitLab/Bitbucket)
4. Selecteer de **Hout-Shop** repository
5. Vercel detecteert automatisch dat het een **Next.js** project is

#### Via de Vercel CLI

```bash
npm i -g vercel
vercel login
vercel
```

Volg de interactieve prompts om het project te koppelen.

---

### Environment variabelen instellen

Ga naar **Project Settings** â†’ **Environment Variables** in de Vercel dashboard.

#### Vereiste variabelen

| Variabele                            | Waarde                          | Omgevingen                  | Beschrijving                                      |
| ------------------------------------ | ------------------------------- | --------------------------- | ------------------------------------------------- |
| `NEXT_PUBLIC_SANITY_PROJECT_ID`      | `7bs5g90g`                      | Production, Preview, Dev    | Sanity project ID                                 |
| `NEXT_PUBLIC_SANITY_DATASET`         | `production`                    | Production, Preview, Dev    | Sanity dataset naam                               |
| `NEXT_PUBLIC_SANITY_API_VERSION`     | `2024-01-01`                    | Production, Preview, Dev    | Sanity API versie                                 |
| `SANITY_API_TOKEN`                   | `sk...`                         | Production, Preview         | Sanity write token (voor orders & preview)         |
| `MOLLIE_API_KEY`                     | `live_...`                      | Production                  | Mollie **live** API-key                            |
| `MOLLIE_API_KEY`                     | `test_...`                      | Preview, Dev                | Mollie **test** API-key                            |
| `NEXT_PUBLIC_BASE_URL`              | `https://www.hout-shop.com`      | Production                  | Publieke URL (voor Mollie redirects & webhooks)    |
| `NEXT_PUBLIC_SITE_URL`              | `https://www.hout-shop.com`      | Production                  | Publieke URL (voor SEO, sitemap, robots.txt)       |

> **Let op:** Gebruik voor Preview deployments `NEXT_PUBLIC_BASE_URL` = `https://jouw-project.vercel.app` of laat Vercel de `VERCEL_URL` automatisch invullen.

#### Variabelen instellen via CLI

```bash
vercel env add SANITY_API_TOKEN production
vercel env add MOLLIE_API_KEY production
vercel env add NEXT_PUBLIC_BASE_URL production
vercel env add NEXT_PUBLIC_SITE_URL production
```

#### Dynamische preview URL

Voor preview deployments kun je `NEXT_PUBLIC_BASE_URL` dynamisch laten bepalen. In code wordt dit als fallback gebruikt:

```typescript
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
  || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
```

---

### Build-instellingen

Vercel detecteert automatisch de juiste instellingen voor Next.js. Controleer in **Project Settings** â†’ **General**:

| Instelling           | Waarde          |
| -------------------- | --------------- |
| **Framework Preset** | Next.js         |
| **Build Command**    | `npm run build` |
| **Output Directory** | `.next`         |
| **Install Command**  | `npm install`   |
| **Node.js Version**  | 20.x            |

**Root Directory:** laat leeg â€” `package.json` staat in de root.

> **Niet** `npm run dev` gebruiken als build command â€” dat is alleen voor lokale ontwikkeling.

---

### Domein & DNS configuratie

#### Domein toevoegen aan Vercel

1. Ga naar **Project Settings** â†’ **Domains**
2. Voeg toe: `hout-shop.com` en `www.hout-shop.com`
3. Vercel geeft DNS-records die je moet instellen

#### DNS-records instellen

Bij je domeinregistrar (bijv. Combell, Cloudflare, TransIP):

| Type    | Naam  | Waarde                   | TTL  |
| ------- | ----- | ------------------------ | ---- |
| `A`     | `@`   | `76.76.21.21`            | 3600 |
| `CNAME` | `www` | `cname.vercel-dns.com.`  | 3600 |

> De exacte IP-adressen worden getoond in de Vercel dashboard. Gebruik altijd de waarden die Vercel aangeeft.

#### SSL/TLS

Vercel regelt automatisch een **gratis SSL-certificaat** (Let's Encrypt) zodra de DNS-records correct zijn ingesteld. Dit kan tot 24 uur duren.

#### Redirect instellen (www â†” apex)

In **Project Settings** â†’ **Domains**, stel een redirect in:
- `hout-shop.com` â†’ redirect naar `www.hout-shop.com` (of andersom)

Dit is belangrijk voor SEO â€” kies Ã©Ã©n canonieke URL.

---

### Sanity configuratie voor productie

#### CORS origins toevoegen

Ga naar [sanity.io/manage](https://sanity.io/manage) â†’ je project â†’ **API** â†’ **CORS origins**:

| Origin                              | Allow credentials |
| ----------------------------------- | ----------------- |
| `https://www.hout-shop.com`          | âœ…                |
| `https://hout-shop.com`              | âœ…                |
| `https://jouw-project.vercel.app`   | âœ…                |
| `http://localhost:3000`             | âœ…                |

#### API token aanmaken

1. Ga naar **API** â†’ **Tokens**
2. Maak een token met **Editor** rechten (nodig voor het aanmaken van orders)
3. Kopieer de token en sla deze op als `SANITY_API_TOKEN` in Vercel

#### Sanity Studio toegang

Het Sanity Studio is beschikbaar op `/studio` (bijv. `https://www.hout-shop.com/studio`). Alleen gebruikers die zijn uitgenodigd voor het Sanity-project hebben toegang.

#### Webhook voor revalidatie (optioneel)

Om pagina's automatisch te herladen wanneer content wijzigt in Sanity:

1. Ga naar **Sanity Manage** â†’ **API** â†’ **Webhooks**
2. Maak een webhook:
   - **URL:** `https://www.hout-shop.com/api/revalidate`
   - **Trigger:** Create, Update, Delete
   - **Filter:** `_type in ["product", "category", "homePage", "aboutPage", "siteSettings"]`
   - **Projection:** `{_type, slug}`

> Hiervoor moet je een `/api/revalidate` route aanmaken in de applicatie.

---

### Mollie webhook configuratie

#### Hoe de Mollie webhook werkt

Wanneer een klant een betaling voltooit (of annuleert), stuurt Mollie een POST-request naar:

```
https://www.hout-shop.com/api/webhook/mollie
```

Deze endpoint update de orderstatus in Sanity (â†’ `paid`, `cancelled`, etc.).

#### Webhook URL

De webhook URL wordt **automatisch** meegegeven bij het aanmaken van een betaling via `NEXT_PUBLIC_BASE_URL`:

```typescript
webhookUrl: `${baseUrl}/api/webhook/mollie`
```

Zorg ervoor dat `NEXT_PUBLIC_BASE_URL` correct is ingesteld op je productiedomein.

#### Test vs. live modus

| Omgeving    | API-key prefix | Beschrijving                                    |
| ----------- | -------------- | ----------------------------------------------- |
| Production  | `live_`        | Echte betalingen â€” gebruik altijd live key       |
| Preview/Dev | `test_`        | Testbetalingen â€” geen echt geld                  |

In de [Mollie dashboard](https://www.mollie.com/dashboard):
1. Ga naar **Developers** â†’ **API keys**
2. Kopieer de juiste key en stel in als `MOLLIE_API_KEY` in Vercel

#### Webhook testen

In test-modus kun je betalingen simuleren via de Mollie test-omgeving. De webhook wordt dan ook aangeroepen op je preview URL.

> **Belangrijk:** Mollie kan geen webhooks sturen naar `localhost`. Gebruik [ngrok](https://ngrok.com) of een preview deployment voor lokaal testen.

---

### Preview deployments & branches

#### Automatische preview deployments

Vercel maakt automatisch een preview deployment voor elke **pull request** en **branch push** (behalve de production branch).

- Preview URL: `https://jouw-project-<hash>.vercel.app`
- Gebruikt de **Preview** environment variabelen

#### Branch-specifieke omgevingen

Je kunt per branch andere environment variabelen instellen:

1. Ga naar **Settings** â†’ **Environment Variables**
2. Selecteer **Preview** en voeg optioneel een **Branch** filter toe

#### Protection (Vercel Pro)

Met Vercel Pro kun je preview deployments beveiligen met:
- **Password protection**
- **Vercel Authentication** (alleen teamleden)

---

### Caching & performance

#### ISR (Incremental Static Regeneration)

Next.js hervalideert pagina's op basis van de `revalidate` waarde in je page components. Vercel ondersteunt dit out-of-the-box.

#### Afbeeldingen

Sanity-afbeeldingen worden geladen via `cdn.sanity.io`. De `next.config.ts` staat dit domein al toe:

```typescript
images: {
  remotePatterns: [
    { protocol: "https", hostname: "cdn.sanity.io" },
  ],
}
```

Next.js Image Optimization op Vercel comprimeert en cachet afbeeldingen automatisch.

#### Edge Network

Vercel distribueert je site automatisch over hun **Edge Network** (100+ locaties wereldwijd). Statische assets en gecachte pagina's worden geserveerd vanuit de dichtstbijzijnde locatie.

#### Custom caching headers (optioneel)

Voeg aan `next.config.ts` caching headers toe voor statische assets:

```typescript
const nextConfig: NextConfig = {
  // ...bestaande config
  async headers() {
    return [
      {
        source: "/images/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
};
```

---

### Monitoring & logging

#### Vercel Logs

- Ga naar je project â†’ **Logs** tab
- Filter op **Build**, **Runtime (Serverless)** of **Edge**
- Bekijk errors van API routes (`/api/checkout`, `/api/webhook/mollie`)

#### Vercel Analytics (optioneel)

Activeer **Web Analytics** en **Speed Insights** via **Project Settings** â†’ **Analytics**:

```bash
npm install @vercel/analytics @vercel/speed-insights
```

Voeg toe aan je root layout (`src/app/layout.tsx`):

```tsx
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

// In je layout component:
<Analytics />
<SpeedInsights />
```

#### Externe monitoring (aanbevolen voor productie)

| Tool                | Doel                                      |
| ------------------- | ----------------------------------------- |
| **UptimeRobot**     | Uptime monitoring (gratis)                |
| **Sentry**          | Error tracking & performance monitoring   |
| **Google Analytics** | Bezoekersstatistieken                     |
| **Search Console**  | SEO performance & indexering              |

---

### Troubleshooting

#### Build faalt

| Fout                                    | Oplossing                                                        |
| --------------------------------------- | ---------------------------------------------------------------- |
| `Missing MOLLIE_API_KEY`                | Voeg `MOLLIE_API_KEY` toe aan environment variabelen             |
| `Missing SANITY_API_TOKEN`              | Voeg `SANITY_API_TOKEN` toe aan environment variabelen           |
| TypeScript errors                       | Run lokaal `npx tsc --noEmit` en los fouten op                   |
| `Module not found`                      | Controleer `package.json` dependencies en run `npm install`       |

#### Mollie webhook werkt niet

1. Controleer dat `NEXT_PUBLIC_BASE_URL` het juiste productiedomein bevat
2. Controleer in Mollie dashboard of de webhook calls succesvol zijn
3. Bekijk de **Runtime Logs** in Vercel voor errors in `/api/webhook/mollie`
4. Zorg dat `SANITY_API_TOKEN` is ingesteld (de webhook schrijft naar Sanity)

#### Sanity Studio laadt niet

1. Controleer CORS origins in Sanity Manage
2. Controleer dat `NEXT_PUBLIC_SANITY_PROJECT_ID` correct is ingesteld
3. De Studio is beschikbaar op `/studio` â€” niet op de root URL

#### Afbeeldingen laden niet

1. Controleer dat `cdn.sanity.io` in `next.config.ts` staat (remote patterns)
2. Controleer dat afbeeldingen gepubliceerd zijn in Sanity

#### i18n / routing problemen

De app ondersteunt drie talen met gelocaliseerde URL's:

| Taal       | Prefix         | Voorbeeld product URL     |
| ---------- | -------------- | ------------------------- |
| Nederlands | `/` (standaard) | `/producten/eiken-paneel` |
| Frans      | `/fr`          | `/fr/produits/eiken-paneel` |
| Engels     | `/en`          | `/en/products/eiken-paneel` |

Als pagina's een 404 geven, controleer de `matcher` in `src/middleware.ts`.

---

### Go-live checklist

#### Environment & Config

- [ ] Alle environment variabelen ingesteld in Vercel (Production)
- [ ] `NEXT_PUBLIC_BASE_URL` wijst naar productiedomein
- [ ] `NEXT_PUBLIC_SITE_URL` wijst naar productiedomein
- [ ] `MOLLIE_API_KEY` is de **live** key (niet test)
- [ ] `SANITY_API_TOKEN` heeft write-rechten

#### Domein & DNS

- [ ] Domein toegevoegd aan Vercel project
- [ ] DNS-records correct ingesteld (A + CNAME)
- [ ] SSL-certificaat actief (groen slotje)
- [ ] www-redirect ingesteld

#### Sanity

- [ ] CORS origins ingesteld voor productiedomein
- [ ] Alle content gepubliceerd (geen drafts in productie)
- [ ] Producten, categorieÃ«n & pagina's aanwezig

#### Mollie

- [ ] Mollie account geactiveerd (KYC voltooid)
- [ ] Gewenste betaalmethoden ingeschakeld (iDEAL, Bancontact, etc.)
- [ ] Test-betaling succesvol afgerond op preview deployment
- [ ] Webhook bereikbaar op `https://www.hout-shop.com/api/webhook/mollie`

#### SEO

- [ ] `robots.ts` staat crawling toe op productie
- [ ] `sitemap.ts` genereert correcte URL's met productiedomein
- [ ] Bedrijfsgegevens ingevuld in `src/lib/seo.ts` (adres, telefoon, email)
- [ ] Google Search Console geconfigureerd
- [ ] Open Graph afbeeldingen aanwezig

#### Functioneel

- [ ] Producten laden correct
- [ ] Winkelwagen werkt
- [ ] Checkout flow compleet (redirect naar Mollie â†’ betaling â†’ success pagina)
- [ ] Orderstatus wordt bijgewerkt na betaling (Sanity check)
- [ ] Alle drie talen werken (NL, FR, EN)
- [ ] Contactformulier werkt
- [ ] Mobiele weergave getest

---

### Handige deployment commando's

```bash
# Lokaal builden (test voor deploy)
npm run build

# Vercel CLI deploy (preview)
vercel

# Vercel CLI deploy (productie)
vercel --prod

# TypeScript check
npx tsc --noEmit

# Linting
npm run lint
```

---

### Architectuur overzicht

```
Browser
  â”‚
  â”œâ”€â”€ Next.js App (Vercel Edge Network)
  â”‚     â”œâ”€â”€ Meertalige pagina's (NL/FR/EN)
  â”‚     â”œâ”€â”€ /studio â†’ Sanity Studio
  â”‚     â”œâ”€â”€ /api/checkout â†’ Mollie Payment creatie
  â”‚     â”œâ”€â”€ /api/webhook/mollie â†’ Payment status updates
  â”‚     â””â”€â”€ /api/calculate-price â†’ Prijs berekening
  â”‚
  â”œâ”€â”€ Sanity CMS (cdn.sanity.io)
  â”‚     â”œâ”€â”€ Producten & categorieÃ«n
  â”‚     â”œâ”€â”€ Pagina content (Home, About)
  â”‚     â”œâ”€â”€ Site-instellingen
  â”‚     â””â”€â”€ Orders
  â”‚
  â””â”€â”€ Mollie (payments.mollie.com)
        â”œâ”€â”€ iDEAL, Bancontact, etc.
        â””â”€â”€ Webhook â†’ /api/webhook/mollie
```

## Veelgestelde vragen

**Hoe schakel ik over naar live betalingen?**
Vervang je Mollie test API-sleutel door je live API-sleutel in `.env.local`.

**Hoe voeg ik een nieuwe taal toe?**
1. Voeg de locale toe in `src/i18n/routing.ts`
2. Maak een nieuw vertaalbestand aan in `messages/`
3. Voeg de locale toe aan `generateStaticParams` in de layout

**Hoe pas ik het kleurenschema aan?**
Bewerk de `@theme` sectie in `src/app/globals.css`.

**Hoe voeg ik een nieuwe productcategorie toe?**
Ga naar Sanity Studio â†’ Categories â†’ Create.

## Licentie

PrivÃ© project â€” alle rechten voorbehouden.
