/**
 * Seed script — vul Sanity met categorieën en producten in batch.
 * Verwijdert eerst alle bestaande producten/categorieën, dan opnieuw aanmaken.
 *
 * Gebruik:  node --env-file=.env.local scripts/seed-products.mjs
 */

import { createClient } from "@sanity/client";

const client = createClient({
  projectId: "7bs5g90g",
  dataset: "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

// ─── Categorieën ────────────────────────────────────────────────
const categories = [
  {
    _id: "cat-panelen",
    _type: "category",
    title: { nl: "Panelen", fr: "Panneaux", en: "Panels" },
    slug: { _type: "slug", current: "panelen" },
    description: {
      nl: "Massief eiken panelen in diverse afmetingen en afwerkingen. Geschikt voor wand, vloer, plafond en meubels.",
      fr: "Panneaux en chêne massif en diverses dimensions et finitions. Pour murs, sols, plafonds et meubles.",
      en: "Solid oak panels in various sizes and finishes. Suitable for walls, floors, ceilings and furniture.",
    },
    order: 1,
  },
  {
    _id: "cat-venstertabletten",
    _type: "category",
    title: { nl: "Venstertabletten", fr: "Tablettes de fenêtre", en: "Window Sills" },
    slug: { _type: "slug", current: "venstertabletten" },
    description: {
      nl: "Eiken venstertabletten (vensterbanken) voor een warme, natuurlijke afwerking van je ramen.",
      fr: "Tablettes de fenêtre en chêne pour une finition chaleureuse et naturelle de vos fenêtres.",
      en: "Oak window sills for a warm, natural finish around your windows.",
    },
    order: 2,
  },
  {
    _id: "cat-werkbladen",
    _type: "category",
    title: { nl: "Werkbladen & tafelbladen", fr: "Plans de travail & plateaux", en: "Worktops & Table Tops" },
    slug: { _type: "slug", current: "werkbladen" },
    description: {
      nl: "Massief eiken werkbladen en tafelbladen, ideaal voor keuken, bureau of eetkamer.",
      fr: "Plans de travail et plateaux de table en chêne massif pour cuisine, bureau ou salle à manger.",
      en: "Solid oak worktops and table tops for kitchen, desk or dining room.",
    },
    order: 3,
  },
  {
    _id: "cat-akoestische-panelen",
    _type: "category",
    title: { nl: "Akoestische panelen", fr: "Panneaux acoustiques", en: "Acoustic Panels" },
    slug: { _type: "slug", current: "akoestische-panelen" },
    description: {
      nl: "Eiken akoestische panelen die geluid absorberen én stijlvol zijn.",
      fr: "Panneaux acoustiques en chêne qui absorbent le son avec style.",
      en: "Oak acoustic panels that absorb sound with style.",
    },
    order: 4,
  },
];

// ─── Producten ──────────────────────────────────────────────────
const products = [
  // ── Panelen ──
  {
    _type: "product",
    title: {
      nl: "Eiken paneel klassiek",
      fr: "Panneau en chêne classique",
      en: "Classic Oak Panel",
    },
    slug: { _type: "slug", current: "eiken-paneel-klassiek" },
    shortDescription: {
      nl: "Tijdloos eiken paneel met rechte nerven. Veelzijdig inzetbaar voor wand, vloer of meubels.",
      fr: "Panneau en chêne intemporel à veines droites. Polyvalent pour murs, sols ou meubles.",
      en: "Timeless oak panel with straight grain. Versatile for walls, floors or furniture.",
    },
    category: { _type: "reference", _ref: "cat-panelen" },
    woodType: "european-oak",
    finish: "oiled",
    standardSizes: [
      { width: 60, height: 120, thickness: 18, price: 89.95, _key: "s1" },
      { width: 80, height: 160, thickness: 18, price: 129.95, _key: "s2" },
      { width: 100, height: 200, thickness: 18, price: 169.95, _key: "s3" },
      { width: 120, height: 240, thickness: 22, price: 219.95, _key: "s4" },
    ],
    customDimensions: {
      enabled: true,
      minWidth: 20,
      maxWidth: 150,
      minHeight: 20,
      maxHeight: 300,
      availableThicknesses: [18, 22, 27],
      pricePerSquareMeter: 145.0,
    },
    specifications: [
      { label: { nl: "Houtsoort", fr: "Type de bois", en: "Wood type" }, value: { nl: "Europees eik", fr: "Chêne européen", en: "European oak" }, _key: "sp1" },
      { label: { nl: "Afwerking", fr: "Finition", en: "Finish" }, value: { nl: "Geolied", fr: "Huilé", en: "Oiled" }, _key: "sp2" },
      { label: { nl: "Vochtgehalte", fr: "Taux d'humidité", en: "Moisture content" }, value: { nl: "8-10%", fr: "8-10%", en: "8-10%" }, _key: "sp3" },
      { label: { nl: "Kwaliteit", fr: "Qualité", en: "Grade" }, value: { nl: "A/B (prime)", fr: "A/B (prime)", en: "A/B (prime)" }, _key: "sp4" },
    ],
    inStock: true,
    featured: true,
  },
  {
    _type: "product",
    title: {
      nl: "Eiken paneel rustiek",
      fr: "Panneau en chêne rustique",
      en: "Rustic Oak Panel",
    },
    slug: { _type: "slug", current: "eiken-paneel-rustiek" },
    shortDescription: {
      nl: "Rustiek eiken paneel met zichtbare noesten en natuurlijke kenmerken. Vol karakter.",
      fr: "Panneau en chêne rustique avec nœuds visibles et caractéristiques naturelles. Plein de caractère.",
      en: "Rustic oak panel with visible knots and natural features. Full of character.",
    },
    category: { _type: "reference", _ref: "cat-panelen" },
    woodType: "french-oak",
    finish: "brushed",
    standardSizes: [
      { width: 60, height: 120, thickness: 20, price: 79.95, _key: "s1" },
      { width: 80, height: 160, thickness: 20, price: 109.95, _key: "s2" },
      { width: 100, height: 200, thickness: 20, price: 149.95, _key: "s3" },
      { width: 120, height: 240, thickness: 22, price: 189.95, _key: "s4" },
    ],
    customDimensions: {
      enabled: true,
      minWidth: 20,
      maxWidth: 140,
      minHeight: 20,
      maxHeight: 280,
      availableThicknesses: [18, 20, 25],
      pricePerSquareMeter: 125.0,
    },
    specifications: [
      { label: { nl: "Houtsoort", fr: "Type de bois", en: "Wood type" }, value: { nl: "Frans eik", fr: "Chêne français", en: "French oak" }, _key: "sp1" },
      { label: { nl: "Afwerking", fr: "Finition", en: "Finish" }, value: { nl: "Geborsteld", fr: "Brossé", en: "Brushed" }, _key: "sp2" },
      { label: { nl: "Kwaliteit", fr: "Qualité", en: "Grade" }, value: { nl: "Rustiek (A/B)", fr: "Rustique (A/B)", en: "Rustic (A/B)" }, _key: "sp3" },
    ],
    inStock: true,
    featured: true,
  },
  {
    _type: "product",
    title: {
      nl: "Eiken paneel gerookt",
      fr: "Panneau en chêne fumé",
      en: "Smoked Oak Panel",
    },
    slug: { _type: "slug", current: "eiken-paneel-gerookt" },
    shortDescription: {
      nl: "Gerookt eiken paneel met diepe, warme bruintinten. Luxueuze uitstraling.",
      fr: "Panneau en chêne fumé aux tons bruns profonds et chaleureux. Aspect luxueux.",
      en: "Smoked oak panel with deep, warm brown tones. Luxurious appearance.",
    },
    category: { _type: "reference", _ref: "cat-panelen" },
    woodType: "european-oak",
    finish: "smoked",
    standardSizes: [
      { width: 60, height: 120, thickness: 18, price: 99.95, _key: "s1" },
      { width: 80, height: 160, thickness: 18, price: 139.95, _key: "s2" },
      { width: 100, height: 200, thickness: 18, price: 189.95, _key: "s3" },
      { width: 120, height: 240, thickness: 22, price: 249.95, _key: "s4" },
    ],
    customDimensions: {
      enabled: true,
      minWidth: 20,
      maxWidth: 130,
      minHeight: 20,
      maxHeight: 260,
      availableThicknesses: [18, 22],
      pricePerSquareMeter: 165.0,
    },
    specifications: [
      { label: { nl: "Houtsoort", fr: "Type de bois", en: "Wood type" }, value: { nl: "Europees eik", fr: "Chêne européen", en: "European oak" }, _key: "sp1" },
      { label: { nl: "Afwerking", fr: "Finition", en: "Finish" }, value: { nl: "Gerookt", fr: "Fumé", en: "Smoked" }, _key: "sp2" },
    ],
    inStock: true,
    featured: true,
  },
  {
    _type: "product",
    title: {
      nl: "Eiken paneel white wash",
      fr: "Panneau en chêne blanchi",
      en: "White Washed Oak Panel",
    },
    slug: { _type: "slug", current: "eiken-paneel-white-wash" },
    shortDescription: {
      nl: "Licht eiken paneel met white wash afwerking. Ideaal voor Scandinavische en moderne interieurs.",
      fr: "Panneau en chêne blanchi. Idéal pour les intérieurs scandinaves et modernes.",
      en: "Light oak panel with white wash finish. Ideal for Scandinavian and modern interiors.",
    },
    category: { _type: "reference", _ref: "cat-panelen" },
    woodType: "european-oak",
    finish: "whitewashed",
    standardSizes: [
      { width: 60, height: 120, thickness: 18, price: 94.95, _key: "s1" },
      { width: 80, height: 160, thickness: 18, price: 134.95, _key: "s2" },
      { width: 100, height: 200, thickness: 18, price: 174.95, _key: "s3" },
      { width: 120, height: 240, thickness: 22, price: 224.95, _key: "s4" },
    ],
    customDimensions: {
      enabled: true,
      minWidth: 20,
      maxWidth: 140,
      minHeight: 20,
      maxHeight: 280,
      availableThicknesses: [18, 22],
      pricePerSquareMeter: 155.0,
    },
    specifications: [
      { label: { nl: "Houtsoort", fr: "Type de bois", en: "Wood type" }, value: { nl: "Europees eik", fr: "Chêne européen", en: "European oak" }, _key: "sp1" },
      { label: { nl: "Afwerking", fr: "Finition", en: "Finish" }, value: { nl: "White wash", fr: "Blanchi", en: "White washed" }, _key: "sp2" },
    ],
    inStock: true,
    featured: false,
  },
  {
    _type: "product",
    title: {
      nl: "Eiken paneel gelakt",
      fr: "Panneau en chêne laqué",
      en: "Lacquered Oak Panel",
    },
    slug: { _type: "slug", current: "eiken-paneel-gelakt" },
    shortDescription: {
      nl: "Gelakt eiken paneel met gladde, beschermde afwerking. Onderhoudsarm en duurzaam.",
      fr: "Panneau en chêne laqué avec finition lisse et protégée. Facile d'entretien et durable.",
      en: "Lacquered oak panel with smooth, protected finish. Low maintenance and durable.",
    },
    category: { _type: "reference", _ref: "cat-panelen" },
    woodType: "european-oak",
    finish: "lacquered",
    standardSizes: [
      { width: 60, height: 120, thickness: 18, price: 94.95, _key: "s1" },
      { width: 80, height: 160, thickness: 18, price: 134.95, _key: "s2" },
      { width: 100, height: 200, thickness: 20, price: 179.95, _key: "s3" },
      { width: 120, height: 240, thickness: 22, price: 229.95, _key: "s4" },
    ],
    customDimensions: {
      enabled: true,
      minWidth: 20,
      maxWidth: 130,
      minHeight: 20,
      maxHeight: 260,
      availableThicknesses: [18, 20, 22],
      pricePerSquareMeter: 155.0,
    },
    specifications: [
      { label: { nl: "Houtsoort", fr: "Type de bois", en: "Wood type" }, value: { nl: "Europees eik", fr: "Chêne européen", en: "European oak" }, _key: "sp1" },
      { label: { nl: "Afwerking", fr: "Finition", en: "Finish" }, value: { nl: "Gelakt (mat)", fr: "Laqué (mat)", en: "Lacquered (matte)" }, _key: "sp2" },
    ],
    inStock: true,
    featured: false,
  },
  {
    _type: "product",
    title: {
      nl: "Eiken paneel onbehandeld",
      fr: "Panneau en chêne brut",
      en: "Raw Oak Panel",
    },
    slug: { _type: "slug", current: "eiken-paneel-onbehandeld" },
    shortDescription: {
      nl: "Onbehandeld eiken paneel. Zelf af te werken naar wens — oliën, lakken of beitsen.",
      fr: "Panneau en chêne brut. À finir soi-même — huiler, laquer ou teinter.",
      en: "Unfinished raw oak panel. Finish it yourself — oil, lacquer or stain.",
    },
    category: { _type: "reference", _ref: "cat-panelen" },
    woodType: "european-oak",
    finish: "raw",
    standardSizes: [
      { width: 60, height: 120, thickness: 18, price: 69.95, _key: "s1" },
      { width: 80, height: 160, thickness: 18, price: 99.95, _key: "s2" },
      { width: 100, height: 200, thickness: 20, price: 139.95, _key: "s3" },
      { width: 120, height: 240, thickness: 22, price: 179.95, _key: "s4" },
    ],
    customDimensions: {
      enabled: true,
      minWidth: 20,
      maxWidth: 150,
      minHeight: 20,
      maxHeight: 300,
      availableThicknesses: [18, 20, 22, 27],
      pricePerSquareMeter: 115.0,
    },
    specifications: [
      { label: { nl: "Houtsoort", fr: "Type de bois", en: "Wood type" }, value: { nl: "Europees eik", fr: "Chêne européen", en: "European oak" }, _key: "sp1" },
      { label: { nl: "Afwerking", fr: "Finition", en: "Finish" }, value: { nl: "Onbehandeld (ruw)", fr: "Non traité (brut)", en: "Unfinished (raw)" }, _key: "sp2" },
    ],
    inStock: true,
    featured: false,
  },
  {
    _type: "product",
    title: {
      nl: "Eiken paneel Slavonisch",
      fr: "Panneau en chêne de Slavonie",
      en: "Slavonian Oak Panel",
    },
    slug: { _type: "slug", current: "eiken-paneel-slavonisch" },
    shortDescription: {
      nl: "Premium Slavonisch eiken paneel met fijne, regelmatige nerven. Topkwaliteit.",
      fr: "Panneau premium en chêne de Slavonie aux veines fines et régulières. Qualité supérieure.",
      en: "Premium Slavonian oak panel with fine, regular grain. Top quality.",
    },
    category: { _type: "reference", _ref: "cat-panelen" },
    woodType: "slavonian-oak",
    finish: "oiled",
    standardSizes: [
      { width: 60, height: 120, thickness: 20, price: 119.95, _key: "s1" },
      { width: 80, height: 160, thickness: 20, price: 169.95, _key: "s2" },
      { width: 100, height: 200, thickness: 22, price: 229.95, _key: "s3" },
      { width: 120, height: 240, thickness: 22, price: 289.95, _key: "s4" },
    ],
    customDimensions: {
      enabled: true,
      minWidth: 20,
      maxWidth: 130,
      minHeight: 20,
      maxHeight: 260,
      availableThicknesses: [20, 22, 27],
      pricePerSquareMeter: 195.0,
    },
    specifications: [
      { label: { nl: "Houtsoort", fr: "Type de bois", en: "Wood type" }, value: { nl: "Slavonisch eik", fr: "Chêne de Slavonie", en: "Slavonian oak" }, _key: "sp1" },
      { label: { nl: "Afwerking", fr: "Finition", en: "Finish" }, value: { nl: "Geolied", fr: "Huilé", en: "Oiled" }, _key: "sp2" },
      { label: { nl: "Kwaliteit", fr: "Qualité", en: "Grade" }, value: { nl: "AA (premium)", fr: "AA (premium)", en: "AA (premium)" }, _key: "sp3" },
    ],
    inStock: true,
    featured: false,
  },
  {
    _type: "product",
    title: {
      nl: "Eiken paneel 3D blok",
      fr: "Panneau 3D en chêne",
      en: "3D Block Oak Panel",
    },
    slug: { _type: "slug", current: "eiken-paneel-3d-blok" },
    shortDescription: {
      nl: "3D eiken paneel met blokpatroon voor een opvallend accent aan je wand.",
      fr: "Panneau 3D en chêne avec motif bloc pour un accent saisissant sur votre mur.",
      en: "3D oak panel with block pattern for a striking wall accent.",
    },
    category: { _type: "reference", _ref: "cat-panelen" },
    woodType: "american-white-oak",
    finish: "oiled",
    standardSizes: [
      { width: 30, height: 30, thickness: 25, price: 29.95, _key: "s1" },
      { width: 60, height: 60, thickness: 25, price: 89.95, _key: "s2" },
      { width: 60, height: 120, thickness: 25, price: 159.95, _key: "s3" },
    ],
    customDimensions: { enabled: false },
    specifications: [
      { label: { nl: "Houtsoort", fr: "Type de bois", en: "Wood type" }, value: { nl: "Amerikaans wit eik", fr: "Chêne blanc américain", en: "American white oak" }, _key: "sp1" },
      { label: { nl: "Patroon", fr: "Motif", en: "Pattern" }, value: { nl: "3D blokken", fr: "Blocs 3D", en: "3D blocks" }, _key: "sp2" },
    ],
    inStock: true,
    featured: false,
  },

  // ── Venstertabletten ──
  {
    _type: "product",
    title: {
      nl: "Eiken venstertablet klassiek",
      fr: "Tablette de fenêtre en chêne classique",
      en: "Classic Oak Window Sill",
    },
    slug: { _type: "slug", current: "eiken-venstertablet-klassiek" },
    shortDescription: {
      nl: "Massief eiken venstertablet met afgeronde voorkant. Tijdloze elegantie voor elk raam.",
      fr: "Tablette de fenêtre en chêne massif avec bord arrondi. Élégance intemporelle pour chaque fenêtre.",
      en: "Solid oak window sill with rounded front edge. Timeless elegance for any window.",
    },
    category: { _type: "reference", _ref: "cat-venstertabletten" },
    woodType: "european-oak",
    finish: "oiled",
    standardSizes: [
      { width: 20, height: 100, thickness: 27, price: 59.95, _key: "s1" },
      { width: 20, height: 120, thickness: 27, price: 69.95, _key: "s2" },
      { width: 25, height: 100, thickness: 27, price: 69.95, _key: "s3" },
      { width: 25, height: 120, thickness: 27, price: 79.95, _key: "s4" },
      { width: 25, height: 150, thickness: 30, price: 99.95, _key: "s5" },
      { width: 30, height: 150, thickness: 30, price: 119.95, _key: "s6" },
    ],
    customDimensions: {
      enabled: true,
      minWidth: 15,
      maxWidth: 45,
      minHeight: 50,
      maxHeight: 250,
      availableThicknesses: [22, 27, 30, 35],
      pricePerSquareMeter: 185.0,
    },
    specifications: [
      { label: { nl: "Houtsoort", fr: "Type de bois", en: "Wood type" }, value: { nl: "Europees eik", fr: "Chêne européen", en: "European oak" }, _key: "sp1" },
      { label: { nl: "Afwerking", fr: "Finition", en: "Finish" }, value: { nl: "Geolied", fr: "Huilé", en: "Oiled" }, _key: "sp2" },
      { label: { nl: "Randafwerking", fr: "Finition de bord", en: "Edge finish" }, value: { nl: "Afgerond (R3)", fr: "Arrondi (R3)", en: "Rounded (R3)" }, _key: "sp3" },
    ],
    inStock: true,
    featured: true,
  },
  {
    _type: "product",
    title: {
      nl: "Eiken venstertablet rustiek",
      fr: "Tablette de fenêtre en chêne rustique",
      en: "Rustic Oak Window Sill",
    },
    slug: { _type: "slug", current: "eiken-venstertablet-rustiek" },
    shortDescription: {
      nl: "Rustiek eiken venstertablet met natuurlijke noesten. Authentieke charme.",
      fr: "Tablette de fenêtre en chêne rustique avec nœuds naturels. Charme authentique.",
      en: "Rustic oak window sill with natural knots. Authentic charm.",
    },
    category: { _type: "reference", _ref: "cat-venstertabletten" },
    woodType: "french-oak",
    finish: "brushed",
    standardSizes: [
      { width: 20, height: 100, thickness: 27, price: 54.95, _key: "s1" },
      { width: 20, height: 120, thickness: 27, price: 64.95, _key: "s2" },
      { width: 25, height: 120, thickness: 27, price: 74.95, _key: "s3" },
      { width: 25, height: 150, thickness: 30, price: 89.95, _key: "s4" },
      { width: 30, height: 150, thickness: 30, price: 109.95, _key: "s5" },
    ],
    customDimensions: {
      enabled: true,
      minWidth: 15,
      maxWidth: 40,
      minHeight: 50,
      maxHeight: 220,
      availableThicknesses: [22, 27, 30],
      pricePerSquareMeter: 160.0,
    },
    specifications: [
      { label: { nl: "Houtsoort", fr: "Type de bois", en: "Wood type" }, value: { nl: "Frans eik", fr: "Chêne français", en: "French oak" }, _key: "sp1" },
      { label: { nl: "Afwerking", fr: "Finition", en: "Finish" }, value: { nl: "Geborsteld", fr: "Brossé", en: "Brushed" }, _key: "sp2" },
      { label: { nl: "Kwaliteit", fr: "Qualité", en: "Grade" }, value: { nl: "Rustiek", fr: "Rustique", en: "Rustic" }, _key: "sp3" },
    ],
    inStock: true,
    featured: false,
  },
  {
    _type: "product",
    title: {
      nl: "Eiken venstertablet extra breed",
      fr: "Tablette de fenêtre en chêne extra large",
      en: "Extra Wide Oak Window Sill",
    },
    slug: { _type: "slug", current: "eiken-venstertablet-extra-breed" },
    shortDescription: {
      nl: "Extra breed eiken venstertablet, ideaal als zitplek of decoratief plateau bij het raam.",
      fr: "Tablette de fenêtre en chêne extra large, idéale comme assise ou plateau décoratif.",
      en: "Extra wide oak window sill, ideal as a window seat or decorative shelf.",
    },
    category: { _type: "reference", _ref: "cat-venstertabletten" },
    woodType: "european-oak",
    finish: "oiled",
    standardSizes: [
      { width: 35, height: 120, thickness: 30, price: 119.95, _key: "s1" },
      { width: 35, height: 150, thickness: 30, price: 139.95, _key: "s2" },
      { width: 40, height: 150, thickness: 30, price: 159.95, _key: "s3" },
      { width: 40, height: 200, thickness: 35, price: 199.95, _key: "s4" },
      { width: 45, height: 200, thickness: 35, price: 229.95, _key: "s5" },
    ],
    customDimensions: {
      enabled: true,
      minWidth: 30,
      maxWidth: 60,
      minHeight: 80,
      maxHeight: 250,
      availableThicknesses: [27, 30, 35],
      pricePerSquareMeter: 210.0,
    },
    specifications: [
      { label: { nl: "Houtsoort", fr: "Type de bois", en: "Wood type" }, value: { nl: "Europees eik", fr: "Chêne européen", en: "European oak" }, _key: "sp1" },
      { label: { nl: "Afwerking", fr: "Finition", en: "Finish" }, value: { nl: "Geolied", fr: "Huilé", en: "Oiled" }, _key: "sp2" },
      { label: { nl: "Max. belasting", fr: "Charge max.", en: "Max. load" }, value: { nl: "80 kg", fr: "80 kg", en: "80 kg" }, _key: "sp3" },
    ],
    inStock: true,
    featured: false,
  },

  // ── Werkbladen & Tafelbladen ──
  {
    _type: "product",
    title: {
      nl: "Eiken tafelblad massief",
      fr: "Plateau de table en chêne massif",
      en: "Solid Oak Table Top",
    },
    slug: { _type: "slug", current: "eiken-tafelblad-massief" },
    shortDescription: {
      nl: "Massief eiken tafelblad, ideaal als eetkamertafel of bureau.",
      fr: "Plateau de table en chêne massif, idéal pour table à manger ou bureau.",
      en: "Solid oak table top, ideal for dining tables or desks.",
    },
    category: { _type: "reference", _ref: "cat-werkbladen" },
    woodType: "slavonian-oak",
    finish: "oiled",
    standardSizes: [
      { width: 80, height: 160, thickness: 40, price: 349.95, _key: "s1" },
      { width: 90, height: 180, thickness: 40, price: 429.95, _key: "s2" },
      { width: 90, height: 200, thickness: 40, price: 489.95, _key: "s3" },
      { width: 100, height: 220, thickness: 45, price: 579.95, _key: "s4" },
    ],
    customDimensions: {
      enabled: true,
      minWidth: 60,
      maxWidth: 120,
      minHeight: 100,
      maxHeight: 300,
      availableThicknesses: [30, 40, 45, 50],
      pricePerSquareMeter: 285.0,
    },
    specifications: [
      { label: { nl: "Houtsoort", fr: "Type de bois", en: "Wood type" }, value: { nl: "Slavonisch eik", fr: "Chêne de Slavonie", en: "Slavonian oak" }, _key: "sp1" },
      { label: { nl: "Afwerking", fr: "Finition", en: "Finish" }, value: { nl: "Geolied", fr: "Huilé", en: "Oiled" }, _key: "sp2" },
      { label: { nl: "Verlijming", fr: "Collage", en: "Bonding" }, value: { nl: "Vingerlas D4 watervast", fr: "Abouté D4 étanche", en: "Finger jointed D4 waterproof" }, _key: "sp3" },
    ],
    inStock: true,
    featured: true,
  },
  {
    _type: "product",
    title: {
      nl: "Eiken werkblad keuken",
      fr: "Plan de travail cuisine en chêne",
      en: "Oak Kitchen Worktop",
    },
    slug: { _type: "slug", current: "eiken-werkblad-keuken" },
    shortDescription: {
      nl: "Robuust eiken werkblad voor de keuken, waterbestendig afgewerkt.",
      fr: "Plan de travail en chêne robuste pour la cuisine, finition étanche.",
      en: "Robust oak kitchen worktop with water-resistant finish.",
    },
    category: { _type: "reference", _ref: "cat-werkbladen" },
    woodType: "european-oak",
    finish: "lacquered",
    standardSizes: [
      { width: 62, height: 200, thickness: 38, price: 299.95, _key: "s1" },
      { width: 62, height: 250, thickness: 38, price: 369.95, _key: "s2" },
      { width: 62, height: 300, thickness: 40, price: 449.95, _key: "s3" },
    ],
    customDimensions: {
      enabled: true,
      minWidth: 40,
      maxWidth: 80,
      minHeight: 100,
      maxHeight: 350,
      availableThicknesses: [27, 38, 40],
      pricePerSquareMeter: 265.0,
    },
    specifications: [
      { label: { nl: "Houtsoort", fr: "Type de bois", en: "Wood type" }, value: { nl: "Europees eik", fr: "Chêne européen", en: "European oak" }, _key: "sp1" },
      { label: { nl: "Afwerking", fr: "Finition", en: "Finish" }, value: { nl: "Gelakt (food-safe)", fr: "Laqué (alimentaire)", en: "Lacquered (food-safe)" }, _key: "sp2" },
      { label: { nl: "Waterbestendig", fr: "Résistant à l'eau", en: "Water resistant" }, value: { nl: "Ja", fr: "Oui", en: "Yes" }, _key: "sp3" },
    ],
    inStock: true,
    featured: false,
  },

  // ── Akoestische panelen ──
  {
    _type: "product",
    title: {
      nl: "Eiken akoestisch latpaneel",
      fr: "Panneau acoustique à lattes en chêne",
      en: "Oak Acoustic Slat Panel",
    },
    slug: { _type: "slug", current: "eiken-akoestisch-latpaneel" },
    shortDescription: {
      nl: "Akoestisch latpaneel in eik met viltrug. Vermindert echo en galm, ziet er prachtig uit.",
      fr: "Panneau acoustique à lattes en chêne avec feutre. Réduit l'écho et la réverbération, magnifique.",
      en: "Oak acoustic slat panel with felt backing. Reduces echo and looks beautiful.",
    },
    category: { _type: "reference", _ref: "cat-akoestische-panelen" },
    woodType: "european-oak",
    finish: "oiled",
    standardSizes: [
      { width: 60, height: 240, thickness: 22, price: 149.95, _key: "s1" },
      { width: 60, height: 270, thickness: 22, price: 169.95, _key: "s2" },
      { width: 60, height: 300, thickness: 22, price: 189.95, _key: "s3" },
    ],
    customDimensions: { enabled: false },
    specifications: [
      { label: { nl: "Houtsoort", fr: "Type de bois", en: "Wood type" }, value: { nl: "Europees eik", fr: "Chêne européen", en: "European oak" }, _key: "sp1" },
      { label: { nl: "Afwerking", fr: "Finition", en: "Finish" }, value: { nl: "Geolied", fr: "Huilé", en: "Oiled" }, _key: "sp2" },
      { label: { nl: "Absorptie", fr: "Absorption", en: "Absorption" }, value: { nl: "NRC 0.85", fr: "NRC 0.85", en: "NRC 0.85" }, _key: "sp3" },
      { label: { nl: "Achterzijde", fr: "Arrière", en: "Backing" }, value: { nl: "Akoestisch vilt (zwart)", fr: "Feutre acoustique (noir)", en: "Acoustic felt (black)" }, _key: "sp4" },
    ],
    inStock: true,
    featured: true,
  },
  {
    _type: "product",
    title: {
      nl: "Eiken akoestisch latpaneel gerookt",
      fr: "Panneau acoustique à lattes en chêne fumé",
      en: "Smoked Oak Acoustic Slat Panel",
    },
    slug: { _type: "slug", current: "eiken-akoestisch-latpaneel-gerookt" },
    shortDescription: {
      nl: "Gerookt eiken akoestisch latpaneel. Combineert premium design met geluidsdemping.",
      fr: "Panneau acoustique à lattes en chêne fumé. Combine design premium et absorption sonore.",
      en: "Smoked oak acoustic slat panel. Combines premium design with sound absorption.",
    },
    category: { _type: "reference", _ref: "cat-akoestische-panelen" },
    woodType: "european-oak",
    finish: "smoked",
    standardSizes: [
      { width: 60, height: 240, thickness: 22, price: 169.95, _key: "s1" },
      { width: 60, height: 270, thickness: 22, price: 189.95, _key: "s2" },
      { width: 60, height: 300, thickness: 22, price: 209.95, _key: "s3" },
    ],
    customDimensions: { enabled: false },
    specifications: [
      { label: { nl: "Houtsoort", fr: "Type de bois", en: "Wood type" }, value: { nl: "Europees eik (gerookt)", fr: "Chêne européen (fumé)", en: "European oak (smoked)" }, _key: "sp1" },
      { label: { nl: "Absorptie", fr: "Absorption", en: "Absorption" }, value: { nl: "NRC 0.85", fr: "NRC 0.85", en: "NRC 0.85" }, _key: "sp3" },
      { label: { nl: "Achterzijde", fr: "Arrière", en: "Backing" }, value: { nl: "Akoestisch vilt (zwart)", fr: "Feutre acoustique (noir)", en: "Acoustic felt (black)" }, _key: "sp4" },
    ],
    inStock: true,
    featured: false,
  },
];

// ─── Site Settings ──────────────────────────────────────────────
const siteSettings = {
  _id: "siteSettings",
  _type: "siteSettings",
  title: "Hout-Shop",
  description: {
    nl: "Premium eiken panelen en venstertabletten. Belgische kwaliteit, geleverd in België en Nederland.",
    fr: "Panneaux en chêne premium et tablettes de fenêtre. Qualité belge, livraison en Belgique et aux Pays-Bas.",
    en: "Premium oak panels and window sills. Belgian quality, delivered in Belgium and the Netherlands.",
  },
  contactEmail: "info@hout-shop.com",
  contactPhone: "+32 3 123 45 67",
  address: {
    street: "Eikenlaan 42",
    city: "Antwerpen",
    postalCode: "2000",
    country: "België",
  },
  vatNumber: "BE 0123.456.789",
  shippingInfo: {
    freeShippingThreshold: 500,
    standardShippingCost: 29.95,
    estimatedDeliveryDays: "5-8",
  },
};

// ─── Deploy ─────────────────────────────────────────────────────
async function seed() {
  console.log("🌱 Seeding Sanity dataset...\n");

  // 0. Delete all existing products and categories
  console.log("🗑️  Deleting existing products and categories...");
  await client.delete({ query: '*[_type == "product"]' });
  await client.delete({ query: '*[_type == "category"]' });
  console.log("   ✓ Cleaned up\n");

  // 1. Create categories
  console.log("📁 Creating categories...");
  const catTransaction = client.transaction();
  for (const cat of categories) {
    catTransaction.createOrReplace(cat);
  }
  await catTransaction.commit();
  console.log(`   ✓ ${categories.length} categories created\n`);

  // 2. Create products
  console.log("📦 Creating products...");
  const prodTransaction = client.transaction();
  for (const product of products) {
    prodTransaction.create(product);
  }
  await prodTransaction.commit();
  console.log(`   ✓ ${products.length} products created\n`);

  // 3. Create/update site settings
  console.log("⚙️  Updating site settings...");
  await client.createOrReplace(siteSettings);
  console.log("   ✓ Site settings updated\n");

  console.log("✅ Done! Open /studio to see your content.");
  console.log(`   ${categories.length} categories`);
  console.log(`   ${products.length} products`);
  console.log(`   1 site settings document`);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err.message);
  process.exit(1);
});
