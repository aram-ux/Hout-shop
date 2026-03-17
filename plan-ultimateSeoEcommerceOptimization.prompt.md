# Plan: Ultieme SEO & E-commerce Optimalisatie Hout-Shop

De website heeft al een **sterke SEO-basis** — JSON-LD schemas (Organization, WebSite, LocalBusiness, Product, Breadcrumb), hreflang alternates voor nl/fr/en, sitemap, Open Graph + Twitter Cards, en ISR caching. Maar er zijn cruciale gaten die conversie en vindbaarheid belemmeren. Dit plan dicht die gaten in 6 fasen.

---

## Fase 1: Kritieke Data & Verificatie (blocker voor alles)

1. **Bedrijfsgegevens invullen** in `src/lib/seo.ts` — `ORGANIZATION.address` (straat, stad, postcode), `contactPoint` (telefoon, email), geo-coördinaten, en social media URLs staan allemaal **leeg**. Zonder deze data zijn de LocalBusiness en Organization schemas ongeldig → géén rich results in Google.

2. **Google Search Console verificatie** — De `verification.google` in `src/app/layout.tsx` is uitgecommentarieerd. Activeren, registreren, en sitemap.xml indienen.

3. **Info-pagina aan sitemap toevoegen** — `/info` ontbreekt in `staticRoutes` van `src/app/sitemap.ts`. Die pagina bevat uitgebreide productkennis en wordt nu niet via de sitemap geïndexeerd.

---

## Fase 2: Technische SEO Verbeteringen

4. **Sanity CDN inschakelen** — `src/sanity/lib/client.ts` heeft `useCdn: false`. Op `true` zetten voor de published client → snellere LCP, betere Core Web Vitals.

5. **404-, Error- en Loading-pagina's** — Er zijn geen `not-found.tsx`, `error.tsx`, of `loading.tsx` bestanden. Aanmaken met gelokaliseerde content en links naar producten. Voorkomt harde bounces.

6. **Zoekfunctie implementeren** — De `websiteJsonLd()` in `src/lib/seo.ts` claimt een SearchAction op `?q=`, maar er **bestaat geen zoekfunctionaliteit**. Zoekbalk in Header + filtering op de productpagina implementeren. Maakt het schema geldig → kans op Google Sitelinks Search Box.

7. **Alt-tekst optimalisatie** — Audit alle `<Image>` componenten. Formaat: `{Productnaam} - {houtsoort} eiken paneel - Hout-Shop`.

8. **Heading hiërarchie** — Valideer exact 1 `<h1>` per pagina met logische h2/h3 structuur.

---

## Fase 3: Analytics & Tracking

9. **Google Analytics 4 integreren** — Via `next/script` met gtag.js. Component in layout toevoegen.

10. **E-commerce event tracking** — `view_item`, `add_to_cart`, `begin_checkout`, `purchase` events instellen voor volledige funnel-analyse.

11. **Cookie consent banner** — AVG/GDPR-compliant banner. Wettelijk verplicht in BE/NL. Analytics pas laden na consent.

---

## Fase 4: Content SEO

12. **FAQ-pagina met FAQ Schema** — Nieuwe pagina + Sanity schema + `FAQPage` JSON-LD. Topics: levertijden, op maat zagen, FSC, retourbeleid. → FAQ rich results in Google.

13. **Blog/kennisbank** — Sanity `blogPost` schema + `Article` JSON-LD + nieuwe routes. Content topics: houtsoort keuze, onderhoud, massief vs. meerlaags, FSC-certificering, interieurinspiratie. → Long-tail traffic en topical authority.

14. **Interne linking strategie** — "Gerelateerde producten" op productpagina's, visuele breadcrumbs op alle pagina's, kruislinks vanuit info/blog naar producten.

15. **Meta descriptions verfijnen** — Elke pagina een unieke, locale-specifieke beschrijving met CTA. Formaat: `{Wat} | {USP} | {CTA}`.

---

## Fase 5: E-commerce Conversie (**kritiek**)

16. **Contactformulier werkend maken** — `ContactContent.tsx` **simuleert een submit maar verstuurt niets**. API route aanmaken + email service (bijv. Resend). Momenteel gaan alle klantberichten verloren!

17. **Product reviews/beoordelingen** — Sanity `review` schema + `AggregateRating` in Product JSON-LD → review sterren in Google zoekresultaten. Significant hogere CTR.

18. **Newsletter/email capture** — Email capture in Footer met incentive ("10% korting op eerste bestelling"). Integreren met email service.

19. **Social sharing knoppen** — WhatsApp, Facebook, Pinterest (extra relevant voor interieur/hout niche) op productpagina's.

20. **"Recent bekeken" en "Gerelateerde producten"** — localStorage tracking + categorie-gebaseerde suggesties.

21. **Urgentie- en vertrouwenssignalen** — "Gratis verzending vanaf €500" badge op producten, levertijdindicator, betaalmethode logos.

---

## Fase 6: Geavanceerde Optimalisaties

22. **Performance** — Skeleton loading states, Suspense boundaries, dynamic imports voor below-the-fold componenten. Core Web Vitals monitoren.

23. **Uitgebreide Rich Snippets** — `CollectionPage` schema voor productoverzicht, `ItemList` voor lijsten, `HowTo` voor blog-artikelen.

24. **Kortingscode systeem** — Sanity `coupon` schema + checkout validatie.

25. **Abandoned cart recovery** — Detectie bij verlaten checkout + notificatie bij terugkeer.

---

## Relevante bestanden

| Bestand | Actie |
|---|---|
| `src/lib/seo.ts` | Bedrijfsdata invullen, nieuwe JSON-LD schemas toevoegen |
| `src/app/layout.tsx` | Google verificatie uncomment |
| `src/app/sitemap.ts` | Info + FAQ + Blog routes |
| `src/sanity/lib/client.ts` | `useCdn: true` |
| `src/components/contact/ContactContent.tsx` | Echt werkend maken |
| `src/components/layout/Header.tsx` | Zoekfunctie |
| `src/components/layout/Footer.tsx` | Newsletter capture |
| `src/components/products/ProductDetail.tsx` | Reviews, gerelateerde producten, social share |
| `src/i18n/routing.ts` | Nieuwe routes (faq, blog) |
| `src/sanity/schemas/` | Nieuwe schemas (faq, blogPost, review, coupon) |

---

## Verificatie

1. **Google Rich Results Test** — Test elke pagina op valid structured data
2. **PageSpeed Insights** — LCP, FID, CLS desktop + mobiel
3. **Google Search Console** — Indexering, crawl-fouten, sitemap na deploy
4. **Schema.org Validator** — Alle JSON-LD scripts valideren
5. **Lighthouse audit** — SEO + Performance + Accessibility scores
6. **Hreflang Testing Tool** — Valideer hreflang implementatie
7. **Functionele test** — Contactformulier verstuurt daadwerkelijk emails
8. **E-commerce funnel test** — Volledig bestelproces + GA4 events verificatie

---

## Beslissingen

- **Scope IN:** Alle SEO, analytics, content en conversie-optimalisatie binnen de bestaande Next.js + Sanity stack
- **Scope UIT:** User accounts/login, betaalde ads setup, betaalde SEO-tools
- **Prioriteit:** Fase 1 + contactformulier (stap 16) zijn **absolute blokkers** — zonder werkende bedrijfsgegevens en contactmogelijkheid is de rest minder effectief

## Verdere overwegingen

1. **Email service:** Resend (modern, simpel) vs. SendGrid (gratis tier) vs. Sanity webhook? → Aanbeveling: **Resend**
2. **Cookie consent:** Eigen implementatie (lightweight) vs. externe library? → Aanbeveling: **eigen** voor performance
3. **Blog content:** Wie schrijft? AI-ondersteund is prima, maar moet door een houtexpert gereviewd worden voor Google's E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness)
