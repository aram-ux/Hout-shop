import { defineField, defineType } from "sanity";

export default defineType({
  name: "product",
  title: "Product",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "media", title: "Media" },
    { name: "pricing", title: "Pricing & Sizes" },
    { name: "details", title: "Details" },
  ],
  fields: [
    // --- Content Group ---
    defineField({
      name: "title",
      title: "Product Name",
      type: "object",
      group: "content",
      fields: [
        { name: "nl", type: "string", title: "Nederlands" },
        { name: "fr", type: "string", title: "Français" },
        { name: "en", type: "string", title: "English" },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "content",
      options: {
        source: "title.nl",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "shortDescription",
      title: "Short Description",
      type: "object",
      group: "content",
      fields: [
        { name: "nl", type: "text", title: "Nederlands", rows: 3 },
        { name: "fr", type: "text", title: "Français", rows: 3 },
        { name: "en", type: "text", title: "English", rows: 3 },
      ],
    }),
    defineField({
      name: "description",
      title: "Full Description",
      type: "object",
      group: "content",
      fields: [
        {
          name: "nl",
          type: "array",
          title: "Nederlands",
          of: [{ type: "block" }],
        },
        {
          name: "fr",
          type: "array",
          title: "Français",
          of: [{ type: "block" }],
        },
        {
          name: "en",
          type: "array",
          title: "English",
          of: [{ type: "block" }],
        },
      ],
    }),

    // --- Media Group ---
    defineField({
      name: "mainImage",
      title: "Main Image",
      type: "image",
      group: "media",
      options: { hotspot: true },
      fields: [
        {
          name: "alt",
          type: "object",
          title: "Alt Text",
          fields: [
            { name: "nl", type: "string", title: "Nederlands" },
            { name: "fr", type: "string", title: "Français" },
            { name: "en", type: "string", title: "English" },
          ],
        },
      ],
    }),
    defineField({
      name: "images",
      title: "Image Gallery",
      type: "array",
      group: "media",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            {
              name: "alt",
              type: "object",
              title: "Alt Text",
              fields: [
                { name: "nl", type: "string", title: "Nederlands" },
                { name: "fr", type: "string", title: "Français" },
                { name: "en", type: "string", title: "English" },
              ],
            },
          ],
        },
      ],
    }),

    // --- Pricing & Sizes Group ---
    defineField({
      name: "standardSizes",
      title: "Standard Sizes",
      type: "array",
      group: "pricing",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "width",
              title: "Width (cm)",
              type: "number",
              validation: (Rule) => Rule.required().positive(),
            },
            {
              name: "height",
              title: "Height (cm)",
              type: "number",
              validation: (Rule) => Rule.required().positive(),
            },
            {
              name: "thickness",
              title: "Thickness (mm)",
              type: "number",
              validation: (Rule) => Rule.required().positive(),
            },
            {
              name: "price",
              title: "Price (€)",
              type: "number",
              validation: (Rule) => Rule.required().positive(),
            },
          ],
          preview: {
            select: {
              width: "width",
              height: "height",
              thickness: "thickness",
              price: "price",
            },
            prepare({ width, height, thickness, price }) {
              return {
                title: `${width} × ${height} cm — ${thickness}mm`,
                subtitle: `€${price?.toFixed(2)}`,
              };
            },
          },
        },
      ],
    }),
    defineField({
      name: "customDimensions",
      title: "Custom Dimensions",
      type: "object",
      group: "pricing",
      fields: [
        {
          name: "enabled",
          title: "Allow Custom Dimensions",
          type: "boolean",
          initialValue: false,
        },
        {
          name: "minWidth",
          title: "Minimum Width (cm)",
          type: "number",
        },
        {
          name: "maxWidth",
          title: "Maximum Width (cm)",
          type: "number",
        },
        {
          name: "minHeight",
          title: "Minimum Height (cm)",
          type: "number",
        },
        {
          name: "maxHeight",
          title: "Maximum Height (cm)",
          type: "number",
        },
        {
          name: "availableThicknesses",
          title: "Available Thicknesses (mm)",
          type: "array",
          of: [{ type: "number" }],
        },
        {
          name: "customSizeSurcharge",
          title: "Custom Size Surcharge (€)",
          type: "number",
          description:
            "Extra charge added on top of the closest matching standard size price.",
          initialValue: 25,
        },
      ],
    }),

    // --- Details Group ---
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      group: "details",
      to: [{ type: "category" }],
    }),
    defineField({
      name: "woodType",
      title: "Wood Type",
      type: "string",
      group: "details",
      options: {
        list: [
          { title: "European Oak", value: "european-oak" },
          { title: "American White Oak", value: "american-white-oak" },
          { title: "French Oak", value: "french-oak" },
          { title: "Slavonian Oak", value: "slavonian-oak" },
          { title: "Walnut", value: "walnut" },
        ],
      },
    }),
    defineField({
      name: "finish",
      title: "Finish",
      type: "string",
      group: "details",
      options: {
        list: [
          { title: "Raw / Unfinished", value: "raw" },
          { title: "Oiled", value: "oiled" },
          { title: "Lacquered", value: "lacquered" },
          { title: "Brushed", value: "brushed" },
          { title: "Smoked", value: "smoked" },
          { title: "White Washed", value: "whitewashed" },
        ],
      },
    }),
    defineField({
      name: "specifications",
      title: "Specifications",
      type: "array",
      group: "details",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "label",
              title: "Label",
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
            select: {
              label: "label.nl",
              value: "value.nl",
            },
            prepare({ label, value }) {
              return {
                title: label || "Specification",
                subtitle: value,
              };
            },
          },
        },
      ],
    }),
    defineField({
      name: "inStock",
      title: "In Stock",
      type: "boolean",
      group: "details",
      initialValue: true,
    }),
    defineField({
      name: "featured",
      title: "Featured Product",
      type: "boolean",
      group: "details",
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: "title.nl",
      media: "mainImage",
      inStock: "inStock",
      category: "category.title.nl",
    },
    prepare({ title, media, inStock, category }) {
      return {
        title: title || "Untitled Product",
        subtitle: `${category || "No category"} ${inStock ? "✓" : "✗ Out of stock"}`,
        media,
      };
    },
  },
});
