import { defineField, defineType } from "sanity";

export default defineType({
  name: "aboutPage",
  title: "About Page",
  type: "document",
  fields: [
    defineField({
      name: "storyImage",
      title: "Story / Workshop Image",
      description: "Image shown alongside the 'Our Story' section",
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
      name: "gallery",
      title: "Photo Gallery",
      description: "Gallery of workshop, product and team photos",
      type: "array",
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
