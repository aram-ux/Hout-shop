import { defineField, defineType } from "sanity";

export default defineType({
  name: "blogPost",
  title: "Blog Post",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "media", title: "Media" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Title",
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
      name: "excerpt",
      title: "Excerpt",
      type: "object",
      group: "content",
      fields: [
        { name: "nl", type: "text", title: "Nederlands", rows: 3 },
        { name: "fr", type: "text", title: "Français", rows: 3 },
        { name: "en", type: "text", title: "English", rows: 3 },
      ],
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "object",
      group: "content",
      fields: [
        {
          name: "nl",
          type: "array",
          title: "Nederlands",
          of: [
            { type: "block" },
            {
              type: "image",
              options: { hotspot: true },
              fields: [
                {
                  name: "alt",
                  type: "string",
                  title: "Alt text",
                },
                {
                  name: "caption",
                  type: "string",
                  title: "Caption",
                },
              ],
            },
          ],
        },
        {
          name: "fr",
          type: "array",
          title: "Français",
          of: [
            { type: "block" },
            {
              type: "image",
              options: { hotspot: true },
              fields: [
                {
                  name: "alt",
                  type: "string",
                  title: "Alt text",
                },
                {
                  name: "caption",
                  type: "string",
                  title: "Caption",
                },
              ],
            },
          ],
        },
        {
          name: "en",
          type: "array",
          title: "English",
          of: [
            { type: "block" },
            {
              type: "image",
              options: { hotspot: true },
              fields: [
                {
                  name: "alt",
                  type: "string",
                  title: "Alt text",
                },
                {
                  name: "caption",
                  type: "string",
                  title: "Caption",
                },
              ],
            },
          ],
        },
      ],
    }),
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
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
      group: "content",
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "string",
      group: "content",
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      group: "content",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
    defineField({
      name: "seoTitle",
      title: "SEO Title",
      type: "object",
      group: "seo",
      fields: [
        { name: "nl", type: "string", title: "Nederlands" },
        { name: "fr", type: "string", title: "Français" },
        { name: "en", type: "string", title: "English" },
      ],
    }),
    defineField({
      name: "seoDescription",
      title: "SEO Description",
      type: "object",
      group: "seo",
      fields: [
        { name: "nl", type: "text", title: "Nederlands", rows: 2 },
        { name: "fr", type: "text", title: "Français", rows: 2 },
        { name: "en", type: "text", title: "English", rows: 2 },
      ],
    }),
  ],
  preview: {
    select: {
      title: "title.nl",
      subtitle: "publishedAt",
      media: "mainImage",
    },
    prepare({ title, subtitle, media }) {
      return {
        title: title || "Untitled",
        subtitle: subtitle
          ? new Date(subtitle).toLocaleDateString("nl-BE")
          : "No date",
        media,
      };
    },
  },
  orderings: [
    {
      title: "Published (newest)",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
});
