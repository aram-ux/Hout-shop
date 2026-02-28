import { defineField, defineType } from "sanity";

export default defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Site Title",
      type: "object",
      fields: [
        { name: "nl", type: "string", title: "Nederlands" },
        { name: "fr", type: "string", title: "Français" },
        { name: "en", type: "string", title: "English" },
      ],
    }),
    defineField({
      name: "description",
      title: "Site Description",
      type: "object",
      fields: [
        { name: "nl", type: "text", title: "Nederlands" },
        { name: "fr", type: "text", title: "Français" },
        { name: "en", type: "text", title: "English" },
      ],
    }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      options: { hotspot: true },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alt Text",
          initialValue: "Hout-Shop Logo",
        },
      ],
    }),
    defineField({
      name: "favicon",
      title: "Favicon",
      description: "Small icon shown in browser tabs (ideally 32x32 or 512x512 PNG)",
      type: "image",
    }),
    defineField({
      name: "ogImage",
      title: "Default Open Graph Image",
      description: "Default social sharing image when no page-specific image is set (1200x630 recommended)",
      type: "image",
      options: { hotspot: true },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alt Text",
        },
      ],
    }),
    defineField({
      name: "contactEmail",
      title: "Contact Email",
      type: "string",
    }),
    defineField({
      name: "contactPhone",
      title: "Contact Phone",
      type: "string",
    }),
    defineField({
      name: "address",
      title: "Address",
      type: "object",
      fields: [
        { name: "street", type: "string", title: "Street" },
        { name: "city", type: "string", title: "City" },
        { name: "postalCode", type: "string", title: "Postal Code" },
        { name: "country", type: "string", title: "Country" },
      ],
    }),
    defineField({
      name: "vatNumber",
      title: "VAT Number",
      type: "string",
    }),
    defineField({
      name: "socialLinks",
      title: "Social Media Links",
      type: "object",
      fields: [
        { name: "facebook", type: "url", title: "Facebook" },
        { name: "instagram", type: "url", title: "Instagram" },
        { name: "linkedin", type: "url", title: "LinkedIn" },
        { name: "pinterest", type: "url", title: "Pinterest" },
      ],
    }),
    defineField({
      name: "shippingInfo",
      title: "Shipping Information",
      type: "object",
      fields: [
        {
          name: "freeShippingThreshold",
          title: "Free Shipping Above (€)",
          type: "number",
        },
        {
          name: "standardShippingCost",
          title: "Standard Shipping Cost (€)",
          type: "number",
        },
        {
          name: "estimatedDeliveryDays",
          title: "Estimated Delivery (days)",
          type: "number",
        },
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Site Settings",
      };
    },
  },
});
