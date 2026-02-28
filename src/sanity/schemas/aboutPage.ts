import { defineField, defineType } from "sanity";

export default defineType({
  name: "aboutPage",
  title: "About Page",
  type: "document",
  groups: [
    { name: "hero", title: "Page Header", default: true },
    { name: "story", title: "Our Story" },
    { name: "values", title: "Values" },
    { name: "quality", title: "Quality & Sustainability" },
    { name: "gallery", title: "Photos & Gallery" },
  ],
  fields: [
    // ---- Page Header ----
    defineField({
      name: "pageTitle",
      title: "Page Title",
      description: "Main heading on the about page",
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
      description: "Small text above the title (e.g. 'Passie voor Eikenhout')",
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
      description: "Intro text below the title",
      type: "object",
      group: "hero",
      fields: [
        { name: "nl", type: "text", title: "Nederlands", rows: 4 },
        { name: "fr", type: "text", title: "Français", rows: 4 },
        { name: "en", type: "text", title: "English", rows: 4 },
      ],
    }),

    // ---- Story Section ----
    defineField({
      name: "storyTitle",
      title: "Story Section Title",
      description: "Title for the 'Our Story' section",
      type: "object",
      group: "story",
      fields: [
        { name: "nl", type: "string", title: "Nederlands" },
        { name: "fr", type: "string", title: "Français" },
        { name: "en", type: "string", title: "English" },
      ],
    }),
    defineField({
      name: "storyText",
      title: "Story Text",
      description: "The story/history text",
      type: "object",
      group: "story",
      fields: [
        { name: "nl", type: "text", title: "Nederlands", rows: 6 },
        { name: "fr", type: "text", title: "Français", rows: 6 },
        { name: "en", type: "text", title: "English", rows: 6 },
      ],
    }),
    defineField({
      name: "storyImage",
      title: "Story / Workshop Image",
      description: "Image shown alongside the 'Our Story' section",
      type: "image",
      group: "story",
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

    // ---- Values Section ----
    defineField({
      name: "values",
      title: "Values",
      description: "Company values displayed as cards",
      type: "array",
      group: "values",
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
                  { title: "Award (Quality)", value: "award" },
                  { title: "Leaf (Sustainable)", value: "leaf" },
                  { title: "Wrench (Craftsmanship)", value: "wrench" },
                  { title: "Heart (Service)", value: "heart" },
                  { title: "Shield (Trust)", value: "shield" },
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
                { name: "nl", type: "text", title: "Nederlands", rows: 3 },
                { name: "fr", type: "text", title: "Français", rows: 3 },
                { name: "en", type: "text", title: "English", rows: 3 },
              ],
            },
          ],
          preview: {
            select: { title: "title.nl", subtitle: "description.nl" },
          },
        },
      ],
    }),

    // ---- Quality & Sustainability ----
    defineField({
      name: "qualityTitle",
      title: "Quality Section Title",
      type: "object",
      group: "quality",
      fields: [
        { name: "nl", type: "string", title: "Nederlands" },
        { name: "fr", type: "string", title: "Français" },
        { name: "en", type: "string", title: "English" },
      ],
    }),
    defineField({
      name: "qualityText",
      title: "Quality Section Text",
      type: "object",
      group: "quality",
      fields: [
        { name: "nl", type: "text", title: "Nederlands", rows: 4 },
        { name: "fr", type: "text", title: "Français", rows: 4 },
        { name: "en", type: "text", title: "English", rows: 4 },
      ],
    }),
    defineField({
      name: "sustainableTitle",
      title: "Sustainability Section Title",
      type: "object",
      group: "quality",
      fields: [
        { name: "nl", type: "string", title: "Nederlands" },
        { name: "fr", type: "string", title: "Français" },
        { name: "en", type: "string", title: "English" },
      ],
    }),
    defineField({
      name: "sustainableText",
      title: "Sustainability Section Text",
      type: "object",
      group: "quality",
      fields: [
        { name: "nl", type: "text", title: "Nederlands", rows: 4 },
        { name: "fr", type: "text", title: "Français", rows: 4 },
        { name: "en", type: "text", title: "English", rows: 4 },
      ],
    }),

    // ---- Gallery & Photos ----
    defineField({
      name: "gallery",
      title: "Photo Gallery",
      description: "Gallery of workshop, product and team photos",
      type: "array",
      group: "gallery",
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
            {
              name: "caption",
              type: "object",
              title: "Caption",
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
    defineField({
      name: "teamPhoto",
      title: "Team Photo",
      description: "Photo of the team or owner",
      type: "image",
      group: "gallery",
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
  ],
  preview: {
    prepare() {
      return {
        title: "About Page",
      };
    },
  },
});
