import { defineField, defineType } from "sanity";

export default defineType({
  name: "contactPage",
  title: "Contact Page",
  type: "document",
  groups: [
    { name: "content", title: "Page Content", default: true },
    { name: "info", title: "Contact Info" },
    { name: "form", title: "Form Settings" },
  ],
  fields: [
    // ---- Page Content ----
    defineField({
      name: "pageTitle",
      title: "Page Title",
      description: "Main heading on the contact page",
      type: "object",
      group: "content",
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
      group: "content",
      fields: [
        { name: "nl", type: "text", title: "Nederlands", rows: 3 },
        { name: "fr", type: "text", title: "Français", rows: 3 },
        { name: "en", type: "text", title: "English", rows: 3 },
      ],
    }),
    defineField({
      name: "heroImage",
      title: "Contact Page Image",
      description: "Optional image displayed on the contact page",
      type: "image",
      group: "content",
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

    // ---- Contact Info ----
    defineField({
      name: "address",
      title: "Address",
      type: "object",
      group: "info",
      fields: [
        { name: "street", type: "string", title: "Street" },
        { name: "city", type: "string", title: "City" },
        { name: "postalCode", type: "string", title: "Postal Code" },
        { name: "country", type: "string", title: "Country" },
      ],
    }),
    defineField({
      name: "phone",
      title: "Phone Number",
      type: "string",
      group: "info",
    }),
    defineField({
      name: "email",
      title: "Email Address",
      type: "string",
      group: "info",
    }),
    defineField({
      name: "openingHours",
      title: "Opening Hours",
      type: "object",
      group: "info",
      fields: [
        { name: "nl", type: "string", title: "Nederlands" },
        { name: "fr", type: "string", title: "Français" },
        { name: "en", type: "string", title: "English" },
      ],
    }),
    defineField({
      name: "googleMapsEmbed",
      title: "Google Maps Embed URL",
      description: "Paste the Google Maps embed URL (from iframe src) to show a map",
      type: "url",
      group: "info",
    }),

    // ---- Form Settings ----
    defineField({
      name: "formSuccessMessage",
      title: "Form Success Message",
      description: "Message shown after form submission",
      type: "object",
      group: "form",
      fields: [
        { name: "nl", type: "text", title: "Nederlands", rows: 2 },
        { name: "fr", type: "text", title: "Français", rows: 2 },
        { name: "en", type: "text", title: "English", rows: 2 },
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Contact Page",
      };
    },
  },
});
