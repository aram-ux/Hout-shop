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

    // ---- Featured Section ----
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
