import { defineField, defineType } from "sanity";

export default defineType({
  name: "homePage",
  title: "Home Page",
  type: "document",
  groups: [
    { name: "hero", title: "Hero Section", default: true },
    { name: "about", title: "About Preview" },
    { name: "featured", title: "Featured Section" },
    { name: "trust", title: "Trust Section" },
  ],
  fields: [
    // ---- Hero Section ----
    defineField({
      name: "heroImage",
      title: "Hero Background Image",
      description: "Large hero image displayed as the background of the hero section",
      type: "image",
      group: "hero",
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
      name: "heroAccentImage",
      title: "Hero Accent Image",
      description: "Decorative product image shown on the right side of the hero (desktop only)",
      type: "image",
      group: "hero",
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
      name: "heroTagline",
      title: "Hero Tagline",
      description: "Small text above the main heading (e.g. 'Premium Belgisch Eikenhout')",
      type: "object",
      group: "hero",
      fields: [
        { name: "nl", type: "string", title: "Nederlands" },
        { name: "fr", type: "string", title: "Français" },
        { name: "en", type: "string", title: "English" },
      ],
    }),
    defineField({
      name: "heroTitle",
      title: "Hero Title",
      description: "Main heading in the hero section",
      type: "object",
      group: "hero",
      fields: [
        { name: "nl", type: "string", title: "Nederlands" },
        { name: "fr", type: "string", title: "Français" },
        { name: "en", type: "string", title: "English" },
      ],
    }),
    defineField({
      name: "heroSubtitle",
      title: "Hero Subtitle",
      description: "Descriptive text below the hero heading",
      type: "object",
      group: "hero",
      fields: [
        { name: "nl", type: "text", title: "Nederlands", rows: 3 },
        { name: "fr", type: "text", title: "Français", rows: 3 },
        { name: "en", type: "text", title: "English", rows: 3 },
      ],
    }),
    defineField({
      name: "heroCta",
      title: "Hero Primary Button Text",
      description: "Text for the main CTA button (e.g. 'Ontdek onze collectie')",
      type: "object",
      group: "hero",
      fields: [
        { name: "nl", type: "string", title: "Nederlands" },
        { name: "fr", type: "string", title: "Français" },
        { name: "en", type: "string", title: "English" },
      ],
    }),
    defineField({
      name: "heroSecondaryCta",
      title: "Hero Secondary Button Text",
      description: "Text for the secondary CTA button (e.g. 'Op maat bestellen')",
      type: "object",
      group: "hero",
      fields: [
        { name: "nl", type: "string", title: "Nederlands" },
        { name: "fr", type: "string", title: "Français" },
        { name: "en", type: "string", title: "English" },
      ],
    }),

    // ---- About Preview Section ----
    defineField({
      name: "aboutImage",
      title: "About Preview Image",
      description: "Image shown in the about preview section on the homepage",
      type: "image",
      group: "about",
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
      name: "aboutPreviewTitle",
      title: "About Preview Title",
      description: "Title shown in the about preview section",
      type: "object",
      group: "about",
      fields: [
        { name: "nl", type: "string", title: "Nederlands" },
        { name: "fr", type: "string", title: "Français" },
        { name: "en", type: "string", title: "English" },
      ],
    }),
    defineField({
      name: "aboutPreviewSubtitle",
      title: "About Preview Subtitle",
      description: "Small text above the about title",
      type: "object",
      group: "about",
      fields: [
        { name: "nl", type: "string", title: "Nederlands" },
        { name: "fr", type: "string", title: "Français" },
        { name: "en", type: "string", title: "English" },
      ],
    }),
    defineField({
      name: "aboutPreviewDescription",
      title: "About Preview Description",
      description: "Description text in the about preview section",
      type: "object",
      group: "about",
      fields: [
        { name: "nl", type: "text", title: "Nederlands", rows: 4 },
        { name: "fr", type: "text", title: "Français", rows: 4 },
        { name: "en", type: "text", title: "English", rows: 4 },
      ],
    }),
    defineField({
      name: "aboutPreviewCta",
      title: "About Preview Button Text",
      description: "Text for the 'Read more' button",
      type: "object",
      group: "about",
      fields: [
        { name: "nl", type: "string", title: "Nederlands" },
        { name: "fr", type: "string", title: "Français" },
        { name: "en", type: "string", title: "English" },
      ],
    }),

    // ---- Featured Section ----
    defineField({
      name: "featuredTitle",
      title: "Featured Section Title",
      description: "Title for the featured products section",
      type: "object",
      group: "featured",
      fields: [
        { name: "nl", type: "string", title: "Nederlands" },
        { name: "fr", type: "string", title: "Français" },
        { name: "en", type: "string", title: "English" },
      ],
    }),
    defineField({
      name: "featuredSubtitle",
      title: "Featured Section Subtitle",
      description: "Subtitle for the featured products section",
      type: "object",
      group: "featured",
      fields: [
        { name: "nl", type: "text", title: "Nederlands", rows: 2 },
        { name: "fr", type: "text", title: "Français", rows: 2 },
        { name: "en", type: "text", title: "English", rows: 2 },
      ],
    }),
    defineField({
      name: "featuredBanner",
      title: "Featured Section Banner",
      description: "Optional background or decorative image for the featured products section",
      type: "image",
      group: "featured",
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

    // ---- Trust Section ----
    defineField({
      name: "trustItems",
      title: "Trust Features",
      description: "Trust/benefit items shown in the trust bar (e.g. free shipping, quality guarantee)",
      type: "array",
      group: "trust",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "icon",
              title: "Icon",
              type: "string",
              options: {
                list: [
                  { title: "Truck (Shipping)", value: "truck" },
                  { title: "Shield (Quality)", value: "shield" },
                  { title: "Headphones (Support)", value: "headphones" },
                  { title: "Lock (Security)", value: "lock" },
                  { title: "Award (Certificate)", value: "award" },
                  { title: "Leaf (Sustainable)", value: "leaf" },
                  { title: "Heart (Care)", value: "heart" },
                  { title: "Star (Premium)", value: "star" },
                ],
              },
            },
            {
              name: "title",
              title: "Title",
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
                { name: "nl", type: "string", title: "Nederlands" },
                { name: "fr", type: "string", title: "Français" },
                { name: "en", type: "string", title: "English" },
              ],
            },
          ],
          preview: {
            select: {
              title: "title.nl",
              subtitle: "description.nl",
            },
          },
        },
      ],
    }),
    defineField({
      name: "trustBadges",
      title: "Trust Badges / Certification Logos",
      description: "Logos for certifications like FSC, CE, etc.",
      type: "array",
      group: "trust",
      of: [
        {
          type: "image",
          options: { hotspot: false },
          fields: [
            {
              name: "label",
              type: "object",
              title: "Label",
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
  ],
  preview: {
    prepare() {
      return {
        title: "Home Page",
      };
    },
  },
});
