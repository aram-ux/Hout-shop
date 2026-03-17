/**
 * Generator script — maakt een CSV van nieuwe produktcategorieën
 * afgeleid uit de bestaande Gizia panelen-voorraad.
 *
 * Productcategorieën:
 *   1. Vensterbanken  — panelen verzaagd tot smalle stroken
 *   2. Wandplanken    — zwevende planken voor aan de muur
 *   3. Tafelbladen    — grote panelen gepositioneerd als tafelbladen
 *   4. Bureabladen    — panelen voor bureau/werkblad
 *   5. Traptreden     — panelen verzaagd tot traptrede-afmetingen
 *
 * Gebruik:
 *   node scripts/generate-new-products-csv.mjs
 *
 * Output: scripts/data/new-products.csv
 */

import { writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outputPath = resolve(__dirname, "data/new-products.csv");

// ─── Pricing per product type & thickness ───────────────────────
// VKP/m² = verkoopprijs per m², AKP = VKP / 1.45 (~45% marge)

const PRICING = {
  // Vensterbanken — verzaagd + kantafwerking → premium
  "vensterbank-eik-a-20":   { vkpM2: 155, akpM2: 106.90 },
  "vensterbank-eik-a-30":   { vkpM2: 250, akpM2: 172.41 },
  "vensterbank-eik-a-40":   { vkpM2: 270, akpM2: 186.21 },
  "vensterbank-rustiek-21": { vkpM2: 115, akpM2: 79.31 },
  "vensterbank-rustiek-40": { vkpM2: 185, akpM2: 127.59 },
  "vensterbank-not-20":     { vkpM2: 310, akpM2: 213.79 },

  // Wandplanken — iets hoger dan vensterbanken (precisie + afwerking)
  "wandplank-eik-a-20":   { vkpM2: 160, akpM2: 110.34 },
  "wandplank-eik-a-30":   { vkpM2: 255, akpM2: 175.86 },
  "wandplank-eik-a-40":   { vkpM2: 275, akpM2: 189.66 },
  "wandplank-rustiek-40": { vkpM2: 195, akpM2: 134.48 },

  // Tafelbladen — bestaande panelen, geen verzaging nodig
  "tafelblad-eik-a-30":   { vkpM2: 210, akpM2: 144.83 },
  "tafelblad-eik-a-40":   { vkpM2: 220, akpM2: 151.72 },
  "tafelblad-rustiek-40": { vkpM2: 165, akpM2: 113.79 },

  // Bureabladen — panelen op werkbladformaat
  "bureaublad-eik-a-20": { vkpM2: 150, akpM2: 103.45 },

  // Traptreden — verzaagd tot trede-afmetingen
  "traptrede-eik-a-20": { vkpM2: 155, akpM2: 106.90 },
  "traptrede-eik-a-30": { vkpM2: 250, akpM2: 172.41 },
  "traptrede-eik-a-40": { vkpM2: 270, akpM2: 186.21 },
};

// ─── Product definitions ────────────────────────────────────────
// Elke entry: { type, wood, quality, thickness, sizes: [[lengte, breedte], ...] }

const products = [
  // ═══════════════════════════════════════════════════════════════
  // VENSTERBANKEN — Eik Kwaliteit A
  // ═══════════════════════════════════════════════════════════════
  {
    type: "vensterbank", wood: "eik", quality: "Kwaliteit A", thickness: 20,
    pricingKey: "vensterbank-eik-a-20",
    group1: "VENSTERBANKEN",
    sizes: [
      [1000, 200], [1000, 250],
      [1200, 200], [1200, 250],
      [1400, 250],
      [1600, 250], [1600, 300],
      [2000, 250], [2000, 300],
      [2200, 250], [2200, 300],
      [2500, 250], [2500, 300],
    ],
  },
  {
    type: "vensterbank", wood: "eik", quality: "Kwaliteit A", thickness: 30,
    pricingKey: "vensterbank-eik-a-30",
    group1: "VENSTERBANKEN",
    sizes: [
      [1000, 200], [1000, 250], [1000, 300],
      [1300, 250], [1300, 300],
      [2000, 250], [2000, 300],
      [2200, 250], [2200, 300],
    ],
  },
  {
    type: "vensterbank", wood: "eik", quality: "Kwaliteit A", thickness: 40,
    pricingKey: "vensterbank-eik-a-40",
    group1: "VENSTERBANKEN",
    sizes: [
      [1000, 200], [1000, 250], [1000, 300],
      [1300, 250], [1300, 300],
      [1600, 250], [1600, 300],
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // VENSTERBANKEN — Eik Rustiek
  // ═══════════════════════════════════════════════════════════════
  {
    type: "vensterbank", wood: "eik", quality: "Rustiek", thickness: 21,
    pricingKey: "vensterbank-rustiek-21",
    group1: "VENSTERBANKEN",
    sizes: [
      [1400, 250], [1400, 300],
      [1600, 250], [1600, 300],
      [1800, 250], [1800, 300],
    ],
  },
  {
    type: "vensterbank", wood: "eik", quality: "Rustiek", thickness: 40,
    pricingKey: "vensterbank-rustiek-40",
    group1: "VENSTERBANKEN",
    sizes: [
      [1000, 250], [1000, 300],
      [1300, 250], [1300, 300],
      [1600, 250], [1600, 300],
      [2000, 250], [2000, 300],
      [2500, 250], [2500, 300],
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // VENSTERBANKEN — Notelaar (walnut)
  // ═══════════════════════════════════════════════════════════════
  {
    type: "vensterbank", wood: "notelaar", quality: "", thickness: 20,
    pricingKey: "vensterbank-not-20",
    group1: "VENSTERBANKEN",
    sizes: [
      [1000, 200], [1000, 250],
      [1600, 200], [1600, 250],
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // WANDPLANKEN — Eik Kwaliteit A
  // ═══════════════════════════════════════════════════════════════
  {
    type: "wandplank", wood: "eik", quality: "Kwaliteit A", thickness: 20,
    pricingKey: "wandplank-eik-a-20",
    group1: "WANDPLANKEN",
    sizes: [
      [800, 200], [800, 250],
      [1000, 200], [1000, 250],
      [1200, 200], [1200, 250],
      [1600, 200], [1600, 250],
    ],
  },
  {
    type: "wandplank", wood: "eik", quality: "Kwaliteit A", thickness: 30,
    pricingKey: "wandplank-eik-a-30",
    group1: "WANDPLANKEN",
    sizes: [
      [800, 200], [800, 250],
      [1000, 200], [1000, 250], [1000, 300],
    ],
  },
  {
    type: "wandplank", wood: "eik", quality: "Kwaliteit A", thickness: 40,
    pricingKey: "wandplank-eik-a-40",
    group1: "WANDPLANKEN",
    sizes: [
      [800, 200], [800, 250], [800, 300],
      [1000, 200], [1000, 250], [1000, 300],
      [1200, 250], [1200, 300],
      [1600, 250], [1600, 300],
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // WANDPLANKEN — Eik Rustiek
  // ═══════════════════════════════════════════════════════════════
  {
    type: "wandplank", wood: "eik", quality: "Rustiek", thickness: 40,
    pricingKey: "wandplank-rustiek-40",
    group1: "WANDPLANKEN",
    sizes: [
      [1000, 250], [1000, 300],
      [1300, 250], [1300, 300],
      [1600, 250], [1600, 300],
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // TAFELBLADEN — Eik Kwaliteit A
  // ═══════════════════════════════════════════════════════════════
  {
    type: "tafelblad", wood: "eik", quality: "Kwaliteit A", thickness: 30,
    pricingKey: "tafelblad-eik-a-30",
    group1: "TAFELBLADEN",
    sizes: [
      [1000, 600], [1000, 1100],
      [1300, 1100],
      [2000, 1100],
      [2200, 1100],
      [2300, 1100],
    ],
  },
  {
    type: "tafelblad", wood: "eik", quality: "Kwaliteit A", thickness: 40,
    pricingKey: "tafelblad-eik-a-40",
    group1: "TAFELBLADEN",
    sizes: [
      [1000, 600], [1300, 600],
      [1400, 1100],
      [1600, 1100],
      [2000, 1000],
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // TAFELBLADEN — Eik Rustiek
  // ═══════════════════════════════════════════════════════════════
  {
    type: "tafelblad", wood: "eik", quality: "Rustiek", thickness: 40,
    pricingKey: "tafelblad-rustiek-40",
    group1: "TAFELBLADEN",
    sizes: [
      [1300, 1100],
      [1600, 1100],
      [1800, 1000],
      [2000, 1100],
      [2500, 1100],
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // BUREABLADEN — Eik Kwaliteit A
  // ═══════════════════════════════════════════════════════════════
  {
    type: "bureaublad", wood: "eik", quality: "Kwaliteit A", thickness: 20,
    pricingKey: "bureaublad-eik-a-20",
    group1: "BUREABLADEN",
    sizes: [
      [1200, 530],
      [1400, 650],
      [1600, 650],
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // TRAPTREDEN — Eik Kwaliteit A
  // ═══════════════════════════════════════════════════════════════
  {
    type: "traptrede", wood: "eik", quality: "Kwaliteit A", thickness: 20,
    pricingKey: "traptrede-eik-a-20",
    group1: "TRAPTREDEN",
    sizes: [
      [900, 280], [1000, 280], [1100, 280], [1200, 280],
    ],
  },
  {
    type: "traptrede", wood: "eik", quality: "Kwaliteit A", thickness: 30,
    pricingKey: "traptrede-eik-a-30",
    group1: "TRAPTREDEN",
    sizes: [
      [900, 280], [1000, 280], [1100, 280],
    ],
  },
  {
    type: "traptrede", wood: "eik", quality: "Kwaliteit A", thickness: 40,
    pricingKey: "traptrede-eik-a-40",
    group1: "TRAPTREDEN",
    sizes: [
      [1000, 280], [1200, 280], [1300, 280],
    ],
  },
];

// ─── Helpers ────────────────────────────────────────────────────

function euroFmt(n) {
  return ` € ${n.toFixed(2).replace(".", ",")} `;
}

function m2Fmt(n) {
  return n.toFixed(4).replace(".", ",");
}

function buildDescription(type, wood, quality, lengte, breedte, dikte) {
  const woodName = wood === "notelaar" ? "Notelaar" : "Eiken";
  const qualityStr = quality ? ` ${quality}` : "";
  const typeLabels = {
    vensterbank: "vensterbank",
    wandplank: "wandplank",
    tafelblad: "tafelblad",
    bureaublad: "bureaublad",
    traptrede: "traptrede",
  };
  const label = typeLabels[type] || type;
  return `${woodName} ${label}${qualityStr} ${lengte}x${breedte}x${dikte}mm`;
}

function buildMancode(type, wood, quality, lengte, breedte, dikte) {
  const woodCode = wood === "notelaar" ? "Not" : "Eik";
  const typeCode = {
    vensterbank: "VB",
    wandplank: "WP",
    tafelblad: "TB",
    bureaublad: "BB",
    traptrede: "TT",
  }[type] || "XX";
  const qualityCode = quality === "Rustiek" ? " R" : "";
  return `${woodCode}${qualityCode} ${typeCode} ${dikte} ${lengte}-${breedte}`;
}

// ─── Generate CSV ───────────────────────────────────────────────

const header = "product_id;accountancy;group1;mancode;brand;itemnumber;barcode;description;active;Dikte;Breedte;Lengte;m²;€/m² AKP;€/m² VKP;AKP €/stk;VKP €/stk;Marge";

const rows = [header];
let count = 0;

for (const product of products) {
  const { type, wood, quality, thickness, pricingKey, group1, sizes } = product;
  const pricing = PRICING[pricingKey];

  for (const [lengte, breedte] of sizes) {
    const m2 = (lengte * breedte) / 1_000_000;
    const akpStk = Math.round(m2 * pricing.akpM2 * 100) / 100;
    const vkpStk = Math.round(m2 * pricing.vkpM2 * 100) / 100;

    const description = buildDescription(type, wood, quality, lengte, breedte, thickness);
    const mancode = buildMancode(type, wood, quality, lengte, breedte, thickness);

    const row = [
      "",                          // product_id (auto)
      "Decotrap",                  // accountancy
      group1,                      // group1
      mancode,                     // mancode
      "Decotrap",                  // brand
      mancode,                     // itemnumber
      "",                          // barcode
      description,                 // description
      "1",                         // active
      thickness,                   // Dikte
      breedte,                     // Breedte
      lengte,                      // Lengte
      m2Fmt(m2),                   // m²
      euroFmt(pricing.akpM2),      // €/m² AKP
      euroFmt(pricing.vkpM2),      // €/m² VKP
      euroFmt(akpStk),             // AKP €/stk
      euroFmt(vkpStk),             // VKP €/stk
      "45%",                       // Marge
    ].join(";");

    rows.push(row);
    count++;
  }
}

const csv = rows.join("\n");
writeFileSync(outputPath, csv, "utf-8");

console.log(`\n✅ ${count} productrijen gegenereerd → ${outputPath}\n`);

// ─── Summary ────────────────────────────────────────────────────

const summary = new Map();
for (const product of products) {
  const key = `${product.type} ${product.wood} ${product.quality || ""} ${product.thickness}mm`.trim();
  summary.set(key, (summary.get(key) || 0) + product.sizes.length);
}

console.log("📦 Overzicht per productgroep:\n");
for (const [name, count] of summary) {
  console.log(`   ${name}: ${count} maten`);
}
console.log(`\n   Totaal: ${count} productrijen\n`);
