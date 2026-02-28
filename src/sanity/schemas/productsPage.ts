import { defineField, defineType } from "sanity";

export default defineType({
  name: "productsPage",
  title: "Products Page",
  type: "document",
  fields: [
    defineField({
      name: "pageTitle",
      title: "Page Title",
      description: "Main heading on the products page",
      type: "object",
      fields: [
        { name: "nl", type: "string", title: "Nederlands" },
        { name: "fr", type: "string", title: "Français" },
        { name: "en", type: "string", title: "English" },
      ],
    }),
    defineField({
      name: "pageSubtitle",
      title: "Page Subtitle",
      description: "Descriptive text below the title",
      type: "object",
      fields: [
        { name: "nl", type: "text", title: "Nederlands", rows: 2 },
        { name: "fr", type: "text", title: "Français", rows: 2 },
        { name: "en", type: "text", title: "English", rows: 2 },
      ],
    }),
    defineField({
      name: "heroBanner",
      title: "Products Page Banner",
      description: "Optional banner/hero image for the products page",
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
    }),
    defineField({
      name: "emptyStateMessage",
      title: "Empty State Message",
      description: "Message shown when there are no products",
      type: "object",
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
        title: "Products Page",
      };
    },
  },
});
