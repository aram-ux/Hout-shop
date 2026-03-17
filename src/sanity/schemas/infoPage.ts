import { defineField, defineType } from "sanity";

export default defineType({
  name: "infoPage",
  title: "Info Page (Productinformatie)",
  type: "document",
  groups: [
    { name: "hero", title: "Page Header", default: true },
    { name: "qualities", title: "Qualities" },
    { name: "panels", title: "Panel Types" },
    { name: "origins", title: "Origins" },
    { name: "dimensions", title: "Dimensions" },
    { name: "general", title: "General Info" },
    { name: "cta", title: "Call to Action" },
  ],
  fields: [
    // ---- Page Header ----
    defineField({
      name: "pageTitle",
      title: "Page Title",
      description: "Main heading (e.g. 'Productinformatie')",
      type: "object",
      group: "hero",
      fields: [
        { name: "nl", type: "string", title: "Nederlands" },
        { name: "fr", type: "string", title: "Français" },
        { name: "en", type: "string", title: "English" },
      ],
    }),
    defineField({
      name: "pageSubtitle",
      title: "Page Subtitle",
      description: "Small text above the title (e.g. 'Alles over onze eiken panelen')",
      type: "object",
      group: "hero",
      fields: [
        { name: "nl", type: "string", title: "Nederlands" },
        { name: "fr", type: "string", title: "Français" },
        { name: "en", type: "string", title: "English" },
      ],
    }),
    defineField({
      name: "pageDescription",
      title: "Page Description",
      description: "Intro paragraph below the title",
      type: "object",
      group: "hero",
      fields: [
        { name: "nl", type: "text", title: "Nederlands", rows: 4 },
        { name: "fr", type: "text", title: "Français", rows: 4 },
        { name: "en", type: "text", title: "English", rows: 4 },
      ],
    }),

    // ---- Qualities Section ----
    defineField({
      name: "qualitiesTitle",
      title: "Qualities Section Title",
      description: "Heading for the wood quality grades section",
      type: "object",
      group: "qualities",
      fields: [
        { name: "nl", type: "string", title: "Nederlands" },
        { name: "fr", type: "string", title: "Français" },
        { name: "en", type: "string", title: "English" },
      ],
    }),
    defineField({
      name: "qualitiesIntro",
      title: "Qualities Intro Text",
      type: "object",
      group: "qualities",
      fields: [
        { name: "nl", type: "text", title: "Nederlands", rows: 3 },
        { name: "fr", type: "text", title: "Français", rows: 3 },
        { name: "en", type: "text", title: "English", rows: 3 },
      ],
    }),
    defineField({
      name: "qualities",
      title: "Quality Grades",
      description: "Wood quality grades (e.g. A/B, Rustiek, Prime)",
      type: "array",
      group: "qualities",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "name",
              title: "Name",
              type: "object",
              fields: [
                { name: "nl", type: "string", title: "Nederlands" },
                { name: "fr", type: "string", title: "Français" },
                { name: "en", type: "string", title: "English" },
              ],
            },
            {
              name: "description",
              title: "Description",
              type: "object",
              fields: [
                { name: "nl", type: "text", title: "Nederlands", rows: 3 },
                { name: "fr", type: "text", title: "Français", rows: 3 },
                { name: "en", type: "text", title: "English", rows: 3 },
              ],
            },
            {
              name: "features",
              title: "Features / Bullet Points",
              type: "array",
              of: [
                {
                  type: "object",
                  fields: [
                    { name: "nl", type: "string", title: "Nederlands" },
                    { name: "fr", type: "string", title: "Français" },
                    { name: "en", type: "string", title: "English" },
                  ],
                  preview: {
                    select: { title: "nl" },
                  },
                },
              ],
            },
          ],
          preview: {
            select: { title: "name.nl", subtitle: "description.nl" },
          },
        },
      ],
    }),

    // ---- Panels Section ----
    defineField({
      name: "panelsTitle",
      title: "Panels Section Title",
      description: "Heading for the panel construction types section",
      type: "object",
      group: "panels",
      fields: [
        { name: "nl", type: "string", title: "Nederlands" },
        { name: "fr", type: "string", title: "Français" },
        { name: "en", type: "string", title: "English" },
      ],
    }),
    defineField({
      name: "panelsIntro",
      title: "Panels Intro Text",
      type: "object",
      group: "panels",
      fields: [
        { name: "nl", type: "text", title: "Nederlands", rows: 3 },
        { name: "fr", type: "text", title: "Français", rows: 3 },
        { name: "en", type: "text", title: "English", rows: 3 },
      ],
    }),
    defineField({
      name: "panels",
      title: "Panel Types",
      description: "Different panel construction types",
      type: "array",
      group: "panels",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "name",
              title: "Name",
              type: "object",
              fields: [
                { name: "nl", type: "string", title: "Nederlands" },
                { name: "fr", type: "string", title: "Français" },
                { name: "en", type: "string", title: "English" },
              ],
            },
            {
              name: "description",
              title: "Description",
              type: "object",
              fields: [
                { name: "nl", type: "text", title: "Nederlands", rows: 4 },
                { name: "fr", type: "text", title: "Français", rows: 4 },
                { name: "en", type: "text", title: "English", rows: 4 },
              ],
            },
          ],
          preview: {
            select: { title: "name.nl", subtitle: "description.nl" },
          },
        },
      ],
    }),

    // ---- Origins Section ----
    defineField({
      name: "originsTitle",
      title: "Origins Section Title",
      description: "Heading for the wood origins section",
      type: "object",
      group: "origins",
      fields: [
        { name: "nl", type: "string", title: "Nederlands" },
        { name: "fr", type: "string", title: "Français" },
        { name: "en", type: "string", title: "English" },
      ],
    }),
    defineField({
      name: "originsIntro",
      title: "Origins Intro Text",
      type: "object",
      group: "origins",
      fields: [
        { name: "nl", type: "text", title: "Nederlands", rows: 3 },
        { name: "fr", type: "text", title: "Français", rows: 3 },
        { name: "en", type: "text", title: "English", rows: 3 },
      ],
    }),
    defineField({
      name: "origins",
      title: "Wood Origins",
      description: "Different wood origins (e.g. European, French, Slavonian)",
      type: "array",
      group: "origins",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "name",
              title: "Name",
              type: "object",
              fields: [
                { name: "nl", type: "string", title: "Nederlands" },
                { name: "fr", type: "string", title: "Français" },
                { name: "en", type: "string", title: "English" },
              ],
            },
            {
              name: "description",
              title: "Description",
              type: "object",
              fields: [
                { name: "nl", type: "text", title: "Nederlands", rows: 4 },
                { name: "fr", type: "text", title: "Français", rows: 4 },
                { name: "en", type: "text", title: "English", rows: 4 },
              ],
            },
          ],
          preview: {
            select: { title: "name.nl", subtitle: "description.nl" },
          },
        },
      ],
    }),

    // ---- Dimensions Section ----
    defineField({
      name: "dimensionsTitle",
      title: "Dimensions Section Title",
      type: "object",
      group: "dimensions",
      fields: [
        { name: "nl", type: "string", title: "Nederlands" },
        { name: "fr", type: "string", title: "Français" },
        { name: "en", type: "string", title: "English" },
      ],
    }),
    defineField({
      name: "dimensionsIntro",
      title: "Dimensions Intro Text",
      type: "object",
      group: "dimensions",
      fields: [
        { name: "nl", type: "text", title: "Nederlands", rows: 3 },
        { name: "fr", type: "text", title: "Français", rows: 3 },
        { name: "en", type: "text", title: "English", rows: 3 },
      ],
    }),
    defineField({
      name: "dimensionsPropertyLabel",
      title: "Table Header — Property",
      description: "Column header for dimension property (e.g. 'Eigenschap')",
      type: "object",
      group: "dimensions",
      fields: [
        { name: "nl", type: "string", title: "Nederlands" },
        { name: "fr", type: "string", title: "Français" },
        { name: "en", type: "string", title: "English" },
      ],
    }),
    defineField({
      name: "dimensionsRangeLabel",
      title: "Table Header — Range",
      description: "Column header for dimension range (e.g. 'Bereik')",
      type: "object",
      group: "dimensions",
      fields: [
        { name: "nl", type: "string", title: "Nederlands" },
        { name: "fr", type: "string", title: "Français" },
        { name: "en", type: "string", title: "English" },
      ],
    }),
    defineField({
      name: "dimensions",
      title: "Dimension Rows",
      description: "Rows in the dimensions table",
      type: "array",
      group: "dimensions",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "label",
              title: "Label (e.g. Dikte, Breedte)",
              type: "object",
              fields: [
                { name: "nl", type: "string", title: "Nederlands" },
                { name: "fr", type: "string", title: "Français" },
                { name: "en", type: "string", title: "English" },
              ],
            },
            {
              name: "value",
              title: "Value (e.g. 18 mm / 20 mm / 26 mm)",
              type: "object",
              fields: [
                { name: "nl", type: "string", title: "Nederlands" },
                { name: "fr", type: "string", title: "Français" },
                { name: "en", type: "string", title: "English" },
              ],
            },
          ],
          preview: {
            select: { title: "label.nl", subtitle: "value.nl" },
          },
        },
      ],
    }),

    // ---- General Info Section ----
    defineField({
      name: "generalTitle",
      title: "General Info Section Title",
      type: "object",
      group: "general",
      fields: [
        { name: "nl", type: "string", title: "Nederlands" },
        { name: "fr", type: "string", title: "Français" },
        { name: "en", type: "string", title: "English" },
      ],
    }),
    defineField({
      name: "generalPropertyLabel",
      title: "Table Header — Property",
      description: "Column header for general info property",
      type: "object",
      group: "general",
      fields: [
        { name: "nl", type: "string", title: "Nederlands" },
        { name: "fr", type: "string", title: "Français" },
        { name: "en", type: "string", title: "English" },
      ],
    }),
    defineField({
      name: "generalValueLabel",
      title: "Table Header — Value",
      description: "Column header for general info value",
      type: "object",
      group: "general",
      fields: [
        { name: "nl", type: "string", title: "Nederlands" },
        { name: "fr", type: "string", title: "Français" },
        { name: "en", type: "string", title: "English" },
      ],
    }),
    defineField({
      name: "generalInfo",
      title: "General Info Rows",
      description: "Rows in the general product info table",
      type: "array",
      group: "general",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "label",
              title: "Label (e.g. Vochtigheid, Afwerking)",
              type: "object",
              fields: [
                { name: "nl", type: "string", title: "Nederlands" },
                { name: "fr", type: "string", title: "Français" },
                { name: "en", type: "string", title: "English" },
              ],
            },
            {
              name: "value",
              title: "Value",
              type: "object",
              fields: [
                { name: "nl", type: "string", title: "Nederlands" },
                { name: "fr", type: "string", title: "Français" },
                { name: "en", type: "string", title: "English" },
              ],
            },
          ],
          preview: {
            select: { title: "label.nl", subtitle: "value.nl" },
          },
        },
      ],
    }),

    // ---- CTA Section ----
    defineField({
      name: "ctaTitle",
      title: "CTA Title",
      description: "Heading for the call-to-action section at the bottom",
      type: "object",
      group: "cta",
      fields: [
        { name: "nl", type: "string", title: "Nederlands" },
        { name: "fr", type: "string", title: "Français" },
        { name: "en", type: "string", title: "English" },
      ],
    }),
    defineField({
      name: "ctaText",
      title: "CTA Text",
      description: "Supporting text under the CTA heading",
      type: "object",
      group: "cta",
      fields: [
        { name: "nl", type: "text", title: "Nederlands", rows: 3 },
        { name: "fr", type: "text", title: "Français", rows: 3 },
        { name: "en", type: "text", title: "English", rows: 3 },
      ],
    }),
    defineField({
      name: "ctaProductsLabel",
      title: "Products Button Label",
      type: "object",
      group: "cta",
      fields: [
        { name: "nl", type: "string", title: "Nederlands" },
        { name: "fr", type: "string", title: "Français" },
        { name: "en", type: "string", title: "English" },
      ],
    }),
    defineField({
      name: "ctaContactLabel",
      title: "Contact Button Label",
      type: "object",
      group: "cta",
      fields: [
        { name: "nl", type: "string", title: "Nederlands" },
        { name: "fr", type: "string", title: "Français" },
        { name: "en", type: "string", title: "English" },
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Info Page (Productinformatie)",
      };
    },
  },
});
