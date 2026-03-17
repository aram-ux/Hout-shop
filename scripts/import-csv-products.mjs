/**
 * Import-script — leest een CSV (puntkomma-gescheiden) van panelen
 * en importeert ze als producten in Sanity.
 *
 * Gebruik:
 *   node --env-file=.env.local scripts/import-csv-products.mjs
 *
 * Optioneel:
 *   --dry-run      Alleen tonen wat er geïmporteerd zou worden (geen Sanity-wijzigingen)
 *   --file=<pad>   Pad naar CSV-bestand (default: scripts/data/export_productgroup.csv)
 *   --keep         Bestaande producten NIET verwijderen
 */

import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// ─── CLI flags ──────────────────────────────────────────────────
const args = process.argv.slice(2);
const DRY_RUN = args.includes("--dry-run");
const KEEP_EXISTING = args.includes("--keep");
const fileFlag = args.find((a) => a.startsWith("--file="));
const csvPath = fileFlag
  ? resolve(fileFlag.split("=")[1])
  : resolve(__dirname, "data/export_productgroup.csv");

// ─── Sanity client (lazy loaded — niet nodig bij --dry-run) ────
let client = null;
async function getSanityClient() {
  if (client) return client;
  const { createClient } = await import("@sanity/client");
  client = createClient({
    projectId: "7bs5g90g",
    dataset: "production",
    apiVersion: "2024-01-01",
    token: process.env.SANITY_API_TOKEN,
    useCdn: false,
  });
  return client;
}

// ─── Helpers ────────────────────────────────────────────────────

/** Parse een Europees bedrag-string naar een number. Bijv: " € 60,77 " → 60.77 */
function parsePrice(str) {
  if (!str || str === "0" || str === "0.0000") return 0;
  const cleaned = str.replace(/[€\s]/g, "").replace(",", ".");
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : Math.round(num * 100) / 100;
}

/** Parse afmetingen uit description. Bijv: "Eiken paneel Kwaliteit A 1000x600x12mm" → {lengte:1000, breedte:600, dikte:12} */
function parseDimensionsFromDescription(desc) {
  // Zoek patroon: getal x getal x getal (mm)
  const match = desc.match(/(\d+)\s*x\s*(\d+)\s*x\s*(\d+)\s*mm/i);
  if (!match) return null;
  return {
    lengte: parseInt(match[1], 10),  // in mm
    breedte: parseInt(match[2], 10), // in mm
    dikte: parseInt(match[3], 10),   // in mm
  };
}

/** Bepaal producttype uit de description */
function detectProductType(desc) {
  const lower = desc.toLowerCase();
  if (lower.includes("vensterbank")) return "vensterbank";
  if (lower.includes("wandplank")) return "wandplank";
  if (lower.includes("tafelblad")) return "tafelblad";
  if (lower.includes("bureaublad")) return "bureaublad";
  if (lower.includes("traptrede")) return "traptrede";
  if (lower.includes("trapneus")) return "trapneus";
  if (lower.includes("paneel")) return "paneel";
  return "overig";
}

/** Bepaal houtsoort uit de description */
function detectWoodType(desc) {
  const lower = desc.toLowerCase();
  if (lower.includes("notelaar")) return "walnut";
  return "european-oak";
}

/** Bepaal kwaliteit uit description of group1 kolom */
function detectQuality(desc, group1) {
  const lower = (desc + " " + (group1 || "")).toLowerCase();
  if (lower.includes("rustiek")) return "rustiek";
  if (lower.includes("kwaliteit a") || lower.includes("panelen") && !lower.includes("rustiek")) return "kwaliteit-a";
  return "kwaliteit-a"; // default
}

/** Maak een URL-veilige slug */
function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[àáâãäå]/g, "a")
    .replace(/[èéêë]/g, "e")
    .replace(/[ìíîï]/g, "i")
    .replace(/[òóôõö]/g, "o")
    .replace(/[ùúûü]/g, "u")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// ─── CSV parsing ────────────────────────────────────────────────

console.log(`\n📂 Bestand: ${csvPath}`);
if (DRY_RUN) console.log("🔍 DRY RUN — er wordt niets naar Sanity geschreven\n");

const raw = readFileSync(csvPath, "utf-8");
const lines = raw.split(/\r?\n/).filter((l) => l.trim());

// Header
const headers = lines[0].split(";").map((h) => h.trim());
console.log(`📋 Kolommen: ${headers.slice(0, 18).join(", ")}\n`);

// Parse alle rijen
const rows = [];
for (let i = 1; i < lines.length; i++) {
  const cols = lines[i].split(";");
  const row = {};
  headers.forEach((h, idx) => {
    row[h] = (cols[idx] || "").trim();
  });
  rows.push(row);
}

console.log(`📊 ${rows.length} rijen gevonden in CSV\n`);

// ─── Analyse & groepering ───────────────────────────────────────

// Filter rijen met geldige afmetingen
const validRows = [];
const skippedRows = [];

for (const row of rows) {
  const desc = row.description || "";

  // Probeer eerst de kolom-waarden (betrouwbaarder dan description)
  const colDikte = parseInt(row["Dikte"], 10);
  const colBreedte = parseInt(row["Breedte"], 10);
  const colLengte = parseInt(row["Lengte"], 10);

  let dims;
  if (colDikte > 0 && colBreedte > 0 && colLengte > 0) {
    dims = { lengte: colLengte, breedte: colBreedte, dikte: colDikte };
  } else {
    // Fallback: parse uit description
    dims = parseDimensionsFromDescription(desc);
  }

  if (!dims) {
    skippedRows.push({ reason: "Geen afmetingen gevonden", desc });
    continue;
  }

  const type = detectProductType(desc);
  const quality = detectQuality(desc, row.group1);
  const woodType = detectWoodType(desc);
  const activeNum = parseInt(row.active, 10) || 0;

  // Probeer VKP stukprijs
  const vkpStk = parsePrice(row["VKP €/stk"]);

  validRows.push({
    ...row,
    dims,
    type,
    quality,
    woodType,
    activeNum,
    vkpStk,
    vkpM2: parsePrice(row["€/m² VKP"]),
    akpStk: parsePrice(row["AKP €/stk"]),
    akpM2: parsePrice(row["€/m² AKP"]),
  });
}

console.log(`✅ ${validRows.length} geldige rijen`);
console.log(`⏭️  ${skippedRows.length} overgeslagen rijen`);
if (skippedRows.length > 0) {
  console.log("   Redenen:");
  const reasons = {};
  skippedRows.forEach((s) => {
    reasons[s.reason] = (reasons[s.reason] || 0) + 1;
  });
  Object.entries(reasons).forEach(([r, c]) => console.log(`   - ${r}: ${c}x`));
}
console.log();

// Groepeer: type + dikte → 1 Sanity-product
// Elke combinatie (lengte × breedte) wordt een standardSize
const groups = new Map();

for (const row of validRows) {
  const key = `${row.type}-${row.woodType}-${row.quality}-${row.dims.dikte}mm`;

  if (!groups.has(key)) {
    groups.set(key, {
      type: row.type,
      quality: row.quality,
      woodType: row.woodType,
      dikte: row.dims.dikte,
      sizes: [],
      hasAnyPrice: false,
      hasAnyActive: false,
      vkpM2Values: [],
    });
  }

  const group = groups.get(key);

  group.sizes.push({
    // In Sanity schema: width/height zijn in cm, thickness in mm
    width: row.dims.breedte / 10,   // mm → cm
    height: row.dims.lengte / 10,   // mm → cm
    thickness: row.dims.dikte,       // al in mm
    price: row.vkpStk,
    _key: `s${group.sizes.length + 1}`,
  });

  if (row.vkpStk > 0) group.hasAnyPrice = true;
  if (row.activeNum > 0) group.hasAnyActive = true;
  if (row.vkpM2 > 0) group.vkpM2Values.push(row.vkpM2);
}

// ─── Sanity-producten bouwen ────────────────────────────────────

const CATEGORY_MAP = {
  paneel: "cat-panelen",
  trapneus: "cat-panelen",
  vensterbank: "cat-vensterbanken",
  wandplank: "cat-wandplanken",
  tafelblad: "cat-tafelbladen",
  bureaublad: "cat-bureabladen",
  traptrede: "cat-traptreden",
};

const QUALITY_LABELS = {
  "kwaliteit-a": { nl: "Kwaliteit A", fr: "Qualité A", en: "Quality A" },
  "rustiek":     { nl: "Rustiek", fr: "Rustique", en: "Rustic" },
};

/** Bouw een productnaam per type, kwaliteit, dikte en houtsoort */
function buildTitle(type, quality, dikte, woodType) {
  const q = QUALITY_LABELS[quality] || QUALITY_LABELS["kwaliteit-a"];
  const isWalnut = woodType === "walnut";
  const woodNl = isWalnut ? "Notelaar" : "Eiken";
  const woodFr = isWalnut ? "Noyer" : "Chêne";
  const woodEn = isWalnut ? "Walnut" : "Oak";
  const qStr = isWalnut ? "" : ` ${q.nl}`;
  const qStrFr = isWalnut ? "" : ` ${q.fr}`;
  const qStrEn = isWalnut ? "" : ` ${q.en}`;

  switch (type) {
    case "vensterbank":
      return {
        nl: `${woodNl} vensterbank${qStr} – ${dikte}mm`,
        fr: `Appui de fenêtre en ${woodFr.toLowerCase()}${qStrFr} – ${dikte}mm`,
        en: `${woodEn} Window Sill${qStrEn} – ${dikte}mm`,
      };
    case "wandplank":
      return {
        nl: `${woodNl} wandplank${qStr} – ${dikte}mm`,
        fr: `Étagère murale en ${woodFr.toLowerCase()}${qStrFr} – ${dikte}mm`,
        en: `${woodEn} Wall Shelf${qStrEn} – ${dikte}mm`,
      };
    case "tafelblad":
      return {
        nl: `${woodNl} tafelblad${qStr} – ${dikte}mm`,
        fr: `Plateau de table en ${woodFr.toLowerCase()}${qStrFr} – ${dikte}mm`,
        en: `${woodEn} Table Top${qStrEn} – ${dikte}mm`,
      };
    case "bureaublad":
      return {
        nl: `${woodNl} bureaublad${qStr} – ${dikte}mm`,
        fr: `Plateau de bureau en ${woodFr.toLowerCase()}${qStrFr} – ${dikte}mm`,
        en: `${woodEn} Desk Top${qStrEn} – ${dikte}mm`,
      };
    case "traptrede":
      return {
        nl: `${woodNl} traptrede${qStr} – ${dikte}mm`,
        fr: `Marche d'escalier en ${woodFr.toLowerCase()}${qStrFr} – ${dikte}mm`,
        en: `${woodEn} Stair Tread${qStrEn} – ${dikte}mm`,
      };
    case "paneel":
      return {
        nl: `${woodNl} paneel${qStr} – ${dikte}mm`,
        fr: `Panneau en ${woodFr.toLowerCase()}${qStrFr} – ${dikte}mm`,
        en: `${woodEn} Panel${qStrEn} – ${dikte}mm`,
      };
    case "trapneus":
      return {
        nl: `Trapneus ${woodNl.toLowerCase()} – ${dikte}mm`,
        fr: `Nez de marche en ${woodFr.toLowerCase()} – ${dikte}mm`,
        en: `${woodEn} Stair Nose – ${dikte}mm`,
      };
    default:
      return {
        nl: `${woodNl} product${qStr} – ${dikte}mm`,
        fr: `Produit en ${woodFr.toLowerCase()}${qStrFr} – ${dikte}mm`,
        en: `${woodEn} product${qStrEn} – ${dikte}mm`,
      };
  }
}

function buildDescription(type, quality, dikte, woodType) {
  const q = QUALITY_LABELS[quality] || QUALITY_LABELS["kwaliteit-a"];
  const isWalnut = woodType === "walnut";
  const woodNl = isWalnut ? "notelaar" : "eiken";
  const woodFr = isWalnut ? "noyer" : "chêne";
  const woodEn = isWalnut ? "walnut" : "oak";

  switch (type) {
    case "vensterbank":
      return {
        nl: `Massief ${woodNl} vensterbank, ${q.nl.toLowerCase()}, dikte ${dikte}mm. Op maat gezaagd uit massief paneel. Ideaal als raamdorpel of vensterplank.`,
        fr: `Appui de fenêtre en ${woodFr} massif, ${q.fr.toLowerCase()}, épaisseur ${dikte}mm. Découpé sur mesure à partir de panneaux massifs.`,
        en: `Solid ${woodEn} window sill, ${q.en.toLowerCase()}, thickness ${dikte}mm. Cut to size from solid panels. Ideal as a windowsill or window ledge.`,
      };
    case "wandplank":
      return {
        nl: `Massief ${woodNl} wandplank, ${q.nl.toLowerCase()}, dikte ${dikte}mm. Perfecte zwevende plank voor uw interieur. Kant-en-klaar afgewerkt.`,
        fr: `Étagère murale en ${woodFr} massif, ${q.fr.toLowerCase()}, épaisseur ${dikte}mm. Parfaite étagère flottante pour votre intérieur.`,
        en: `Solid ${woodEn} wall shelf, ${q.en.toLowerCase()}, thickness ${dikte}mm. Perfect floating shelf for your interior. Ready finished.`,
      };
    case "tafelblad":
      return {
        nl: `Massief ${woodNl} tafelblad, ${q.nl.toLowerCase()}, dikte ${dikte}mm. Geschikt als eet- of werktafelblad. Beschikbaar in diverse standaardafmetingen.`,
        fr: `Plateau de table en ${woodFr} massif, ${q.fr.toLowerCase()}, épaisseur ${dikte}mm. Convient comme plateau de table à manger ou de travail.`,
        en: `Solid ${woodEn} table top, ${q.en.toLowerCase()}, thickness ${dikte}mm. Suitable as dining or work table top. Available in various standard sizes.`,
      };
    case "bureaublad":
      return {
        nl: `Massief ${woodNl} bureaublad, ${q.nl.toLowerCase()}, dikte ${dikte}mm. Ideaal voor een bureau of werkblad. Stevig en duurzaam.`,
        fr: `Plateau de bureau en ${woodFr} massif, ${q.fr.toLowerCase()}, épaisseur ${dikte}mm. Idéal pour un bureau ou plan de travail.`,
        en: `Solid ${woodEn} desk top, ${q.en.toLowerCase()}, thickness ${dikte}mm. Ideal for a desk or worktop. Sturdy and durable.`,
      };
    case "traptrede":
      return {
        nl: `Massief ${woodNl} traptrede, ${q.nl.toLowerCase()}, dikte ${dikte}mm. Op maat gezaagd voor uw trap. Beschikbaar als renovatietrede of massieve trede.`,
        fr: `Marche d'escalier en ${woodFr} massif, ${q.fr.toLowerCase()}, épaisseur ${dikte}mm. Découpée sur mesure pour votre escalier.`,
        en: `Solid ${woodEn} stair tread, ${q.en.toLowerCase()}, thickness ${dikte}mm. Cut to size for your staircase. Available as renovation or solid tread.`,
      };
    case "paneel":
      return {
        nl: `Massief ${woodNl} paneel, ${q.nl.toLowerCase()}, dikte ${dikte}mm. Beschikbaar in diverse standaardafmetingen. Geschikt voor meubels, wandbekleding, trappen en interieurtoepassingen.`,
        fr: `Panneau en ${woodFr} massif, ${q.fr.toLowerCase()}, épaisseur ${dikte}mm. Disponible en plusieurs dimensions standard. Convient pour meubles, revêtements muraux, escaliers et applications intérieures.`,
        en: `Solid ${woodEn} panel, ${q.en.toLowerCase()}, thickness ${dikte}mm. Available in various standard sizes. Suitable for furniture, wall cladding, stairs and interior applications.`,
      };
    case "trapneus":
      return {
        nl: `${woodNl.charAt(0).toUpperCase() + woodNl.slice(1)} trapneus, ${dikte}mm dik. Perfecte afwerking voor uw ${woodNl} trap.`,
        fr: `Nez de marche en ${woodFr}, épaisseur ${dikte}mm. Finition parfaite pour votre escalier en ${woodFr}.`,
        en: `${woodEn.charAt(0).toUpperCase() + woodEn.slice(1)} stair nose, ${dikte}mm thick. Perfect finish for your ${woodEn} staircase.`,
      };
    default:
      return {
        nl: `${woodNl.charAt(0).toUpperCase() + woodNl.slice(1)} product ${q.nl.toLowerCase()}, ${dikte}mm dik.`,
        fr: `Produit en ${woodFr} ${q.fr.toLowerCase()}, épaisseur ${dikte}mm.`,
        en: `${woodEn.charAt(0).toUpperCase() + woodEn.slice(1)} product ${q.en.toLowerCase()}, ${dikte}mm thick.`,
      };
  }
}

const sanityProducts = [];

for (const [key, group] of groups) {
  const title = buildTitle(group.type, group.quality, group.dikte, group.woodType);
  const slug = slugify(title.nl);

  // Sorteer standaardmaten op oppervlakte (klein → groot)
  const sortedSizes = group.sizes
    .sort((a, b) => a.width * a.height - b.width * b.height)
    .map((s, i) => ({ ...s, _key: `s${i + 1}` }));

  // Bereken min/max voor customDimensions
  const widths = sortedSizes.map((s) => s.width);
  const heights = sortedSizes.map((s) => s.height);

  // Gemiddelde VKP per m² (als die bekend is)
  const avgVkpM2 =
    group.vkpM2Values.length > 0
      ? Math.round(
          (group.vkpM2Values.reduce((a, b) => a + b, 0) /
            group.vkpM2Values.length) *
            100
        ) / 100
      : 0;

  const product = {
    _type: "product",
    title,
    slug: { _type: "slug", current: slug },
    shortDescription: buildDescription(group.type, group.quality, group.dikte, group.woodType),
    category: {
      _type: "reference",
      _ref: CATEGORY_MAP[group.type] || "cat-panelen",
    },
    woodType: group.woodType || "european-oak",
    finish: "raw",
    standardSizes: sortedSizes,
    customDimensions: {
      enabled: true,
      minWidth: Math.min(...widths),
      maxWidth: Math.max(...widths),
      minHeight: Math.min(...heights),
      maxHeight: Math.max(...heights),
      availableThicknesses: [group.dikte],
      customSizeSurcharge: 25,
    },
    specifications: [
      {
        label: { nl: "Houtsoort", fr: "Type de bois", en: "Wood type" },
        value: group.woodType === "walnut"
          ? { nl: "Notelaar", fr: "Noyer", en: "Walnut" }
          : { nl: "Europees eik", fr: "Chêne européen", en: "European oak" },
        _key: "sp1",
      },
      {
        label: { nl: "Kwaliteit", fr: "Qualité", en: "Quality" },
        value: (QUALITY_LABELS[group.quality] || QUALITY_LABELS["kwaliteit-a"]),
        _key: "sp2",
      },
      {
        label: { nl: "Dikte", fr: "Épaisseur", en: "Thickness" },
        value: {
          nl: `${group.dikte}mm`,
          fr: `${group.dikte}mm`,
          en: `${group.dikte}mm`,
        },
        _key: "sp3",
      },
    ],
    inStock: group.hasAnyActive,
    featured: group.type === "paneel",
  };

  // Richtprijs per m² niet meer toevoegen als specificatie
  // (wordt niet weergegeven op de website)

  sanityProducts.push(product);
}

// ─── Rapport ────────────────────────────────────────────────────

console.log("─".repeat(60));
console.log(`\n📦 ${sanityProducts.length} producten klaar om te importeren:\n`);

for (const p of sanityProducts) {
  const sizesWithPrice = p.standardSizes.filter((s) => s.price > 0).length;
  const sizesWithoutPrice = p.standardSizes.filter((s) => s.price === 0).length;

  console.log(`  📌 ${p.title.nl}`);
  console.log(`     Slug: ${p.slug.current}`);
  console.log(`     ${p.standardSizes.length} standaardmaten (${sizesWithPrice} met prijs, ${sizesWithoutPrice} zonder prijs)`);

  // Toon de standaardmaten
  for (const s of p.standardSizes) {
    const priceStr = s.price > 0 ? `€${s.price.toFixed(2)}` : "⚠️  geen prijs";
    console.log(
      `       ${s.height * 10} × ${s.width * 10} × ${s.thickness}mm  →  ${s.width}×${s.height}cm  ${priceStr}`
    );
  }
  console.log();
}

// Waarschuwing voor ontbrekende prijzen
const totalSizes = sanityProducts.reduce(
  (sum, p) => sum + p.standardSizes.length,
  0
);
const missingPrices = sanityProducts.reduce(
  (sum, p) => sum + p.standardSizes.filter((s) => s.price === 0).length,
  0
);

if (missingPrices > 0) {
  console.log(
    `⚠️  ${missingPrices} van ${totalSizes} standaardmaten hebben nog geen prijs (€0).`
  );
  console.log(
    `   Je kunt deze later aanvullen in Sanity Studio → Products → Pricing & Sizes.\n`
  );
}

// ─── Importeren naar Sanity ─────────────────────────────────────

if (DRY_RUN) {
  console.log("🔍 DRY RUN — klaar. Voer het script uit zonder --dry-run om te importeren.");
  process.exit(0);
}

async function importToSanity() {
  const client = await getSanityClient();
  console.log("🚀 Importeren naar Sanity...\n");

  if (!KEEP_EXISTING) {
    console.log("🗑️  Bestaande producten verwijderen...");
    await client.delete({ query: '*[_type == "product"]' });
    console.log("   ✓ Bestaande producten verwijderd\n");
  }

  // Controleer of categorieën bestaan, zo niet → aanmaken
  console.log("📁 Categorieën controleren...");
  const existingCats = await client.fetch('*[_type == "category"]._id');

  // Verzamel alle benodigde categorieën uit de producten
  const neededCats = [...new Set(sanityProducts.map((p) => p.category._ref))];
  const missingCats = neededCats.filter((id) => !existingCats.includes(id));

  const CATEGORY_DEFS = {
    "cat-panelen": {
      title: { nl: "Panelen", fr: "Panneaux", en: "Panels" },
      slug: "panelen",
      description: {
        nl: "Massief eiken panelen in diverse afmetingen. Geschikt voor meubels, wand, vloer, plafond en trappen.",
        fr: "Panneaux en chêne massif en diverses dimensions. Pour meubles, murs, sols, plafonds et escaliers.",
        en: "Solid oak panels in various sizes. Suitable for furniture, walls, floors, ceilings and stairs.",
      },
      order: 1,
    },
    "cat-vensterbanken": {
      title: { nl: "Vensterbanken", fr: "Appuis de fenêtre", en: "Window Sills" },
      slug: "vensterbanken",
      description: {
        nl: "Massief houten vensterbanken op maat gezaagd. Eik en notelaar in diverse diktes en lengtes.",
        fr: "Appuis de fenêtre en bois massif découpés sur mesure. Chêne et noyer en diverses épaisseurs et longueurs.",
        en: "Solid wood window sills cut to size. Oak and walnut in various thicknesses and lengths.",
      },
      order: 2,
    },
    "cat-wandplanken": {
      title: { nl: "Wandplanken", fr: "Étagères murales", en: "Wall Shelves" },
      slug: "wandplanken",
      description: {
        nl: "Massief houten wandplanken. Perfect als zwevende plank voor uw interieur.",
        fr: "Étagères murales en bois massif. Parfaites comme étagères flottantes pour votre intérieur.",
        en: "Solid wood wall shelves. Perfect as floating shelves for your interior.",
      },
      order: 3,
    },
    "cat-tafelbladen": {
      title: { nl: "Tafelbladen", fr: "Plateaux de table", en: "Table Tops" },
      slug: "tafelbladen",
      description: {
        nl: "Massief houten tafelbladen in diverse afmetingen. Geschikt als eet- of werktafel.",
        fr: "Plateaux de table en bois massif en diverses dimensions. Pour table à manger ou de travail.",
        en: "Solid wood table tops in various sizes. Suitable as dining or work table.",
      },
      order: 4,
    },
    "cat-bureabladen": {
      title: { nl: "Bureabladen", fr: "Plateaux de bureau", en: "Desk Tops" },
      slug: "bureabladen",
      description: {
        nl: "Massief houten bureabladen. Ideaal voor een stijlvol en duurzaam bureau of werkblad.",
        fr: "Plateaux de bureau en bois massif. Idéals pour un bureau élégant et durable.",
        en: "Solid wood desk tops. Ideal for a stylish and durable desk or worktop.",
      },
      order: 5,
    },
    "cat-traptreden": {
      title: { nl: "Traptreden", fr: "Marches d'escalier", en: "Stair Treads" },
      slug: "traptreden",
      description: {
        nl: "Massief houten traptreden op maat. Beschikbaar als renovatietrede of massieve trede in diverse houtsoorten.",
        fr: "Marches d'escalier en bois massif sur mesure. Disponibles pour rénovation ou en marches massives.",
        en: "Solid wood stair treads cut to size. Available as renovation or solid treads in various wood types.",
      },
      order: 6,
    },
  };

  if (missingCats.length > 0) {
    console.log(`   Ontbrekende categorie(ën) aanmaken: ${missingCats.join(", ")}`);
    const catTx = client.transaction();
    for (const catId of missingCats) {
      const def = CATEGORY_DEFS[catId];
      if (def) {
        catTx.createOrReplace({
          _id: catId,
          _type: "category",
          title: def.title,
          slug: { _type: "slug", current: def.slug },
          description: def.description,
          order: def.order,
        });
      }
    }
    await catTx.commit();
    console.log("   ✓ Categorieën aangemaakt\n");
  } else {
    console.log("   ✓ Alle categorieën bestaan al\n");
  }

  // Producten in batches van 10 importeren
  const BATCH_SIZE = 10;
  let created = 0;

  for (let i = 0; i < sanityProducts.length; i += BATCH_SIZE) {
    const batch = sanityProducts.slice(i, i + BATCH_SIZE);
    const tx = client.transaction();
    for (const product of batch) {
      tx.create(product);
    }
    await tx.commit();
    created += batch.length;
    console.log(`   ✓ ${created}/${sanityProducts.length} producten aangemaakt`);
  }

  console.log(`\n✅ Import klaar!`);
  console.log(`   ${sanityProducts.length} producten geïmporteerd`);
  console.log(`   ${totalSizes} standaardmaten totaal`);
  if (missingPrices > 0) {
    console.log(
      `   ⚠️  ${missingPrices} maten zonder prijs — vul deze aan in Sanity Studio`
    );
  }
  console.log(`\n   Open /studio om je producten te bekijken.`);
}

importToSanity().catch((err) => {
  console.error("❌ Import mislukt:", err.message);
  process.exit(1);
});
