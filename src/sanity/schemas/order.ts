import { defineField, defineType } from "sanity";

export default defineType({
  name: "order",
  title: "Order",
  type: "document",
  fields: [
    defineField({
      name: "orderNumber",
      title: "Order Number",
      type: "string",
      readOnly: true,
    }),
    defineField({
      name: "customerName",
      title: "Customer Name",
      type: "string",
    }),
    defineField({
      name: "customerEmail",
      title: "Customer Email",
      type: "string",
    }),
    defineField({
      name: "customerPhone",
      title: "Customer Phone",
      type: "string",
    }),
    defineField({
      name: "shippingAddress",
      title: "Shipping Address",
      type: "object",
      fields: [
        { name: "street", type: "string", title: "Street" },
        { name: "city", type: "string", title: "City" },
        { name: "postalCode", type: "string", title: "Postal Code" },
        { name: "country", type: "string", title: "Country" },
      ],
    }),
    defineField({
      name: "billingAddress",
      title: "Billing Address",
      type: "object",
      fields: [
        { name: "street", type: "string", title: "Street" },
        { name: "city", type: "string", title: "City" },
        { name: "postalCode", type: "string", title: "Postal Code" },
        { name: "country", type: "string", title: "Country" },
        { name: "vatNumber", type: "string", title: "VAT Number" },
        { name: "companyName", type: "string", title: "Company Name" },
      ],
    }),
    defineField({
      name: "items",
      title: "Order Items",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "productTitle", type: "string", title: "Product" },
            { name: "productSlug", type: "string", title: "Slug" },
            { name: "quantity", type: "number", title: "Quantity" },
            { name: "width", type: "number", title: "Width (cm)" },
            { name: "height", type: "number", title: "Height (cm)" },
            { name: "thickness", type: "number", title: "Thickness (mm)" },
            { name: "isCustomSize", type: "boolean", title: "Custom Size" },
            { name: "unitPrice", type: "number", title: "Unit Price (€)" },
            { name: "totalPrice", type: "number", title: "Total Price (€)" },
          ],
        },
      ],
    }),
    defineField({
      name: "subtotal",
      title: "Subtotal (€)",
      type: "number",
    }),
    defineField({
      name: "shippingCost",
      title: "Shipping Cost (€)",
      type: "number",
    }),
    defineField({
      name: "vatAmount",
      title: "VAT Amount (€)",
      type: "number",
    }),
    defineField({
      name: "totalAmount",
      title: "Total Amount (€)",
      type: "number",
    }),
    defineField({
      name: "status",
      title: "Order Status",
      type: "string",
      options: {
        list: [
          { title: "Pending Payment", value: "pending" },
          { title: "Paid", value: "paid" },
          { title: "Processing", value: "processing" },
          { title: "Shipped", value: "shipped" },
          { title: "Delivered", value: "delivered" },
          { title: "Cancelled", value: "cancelled" },
          { title: "Refunded", value: "refunded" },
        ],
      },
      initialValue: "pending",
    }),
    defineField({
      name: "molliePaymentId",
      title: "Mollie Payment ID",
      type: "string",
      readOnly: true,
    }),
    defineField({
      name: "locale",
      title: "Language",
      type: "string",
    }),
    defineField({
      name: "notes",
      title: "Customer Notes",
      type: "text",
    }),
  ],
  preview: {
    select: {
      orderNumber: "orderNumber",
      customer: "customerName",
      total: "totalAmount",
      status: "status",
    },
    prepare({ orderNumber, customer, total, status }) {
      const statusLabels: Record<string, string> = {
        pending: "⏳ Pending",
        paid: "✅ Paid",
        processing: "🔄 Processing",
        shipped: "📦 Shipped",
        delivered: "✓ Delivered",
        cancelled: "❌ Cancelled",
        refunded: "↩️ Refunded",
      };
      return {
        title: `#${orderNumber} — ${customer || "Unknown"}`,
        subtitle: `€${total?.toFixed(2) || "0.00"} — ${statusLabels[status] || status}`,
      };
    },
  },
  orderings: [
    {
      title: "Order Date (newest)",
      name: "createdDesc",
      by: [{ field: "_createdAt", direction: "desc" }],
    },
  ],
});
