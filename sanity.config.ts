"use client";

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./src/sanity/schemas";

const projectId = "7bs5g90g";
const dataset = "production";

export default defineConfig({
  name: "hout-shop",
  title: "Hout-Shop CMS",
  projectId,
  dataset,
  basePath: "/studio",
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            S.listItem()
              .title("Products")
              .child(
                S.documentTypeList("product").title("Products")
              ),
            S.listItem()
              .title("Categories")
              .child(
                S.documentTypeList("category").title("Categories")
              ),
            S.listItem()
              .title("Orders")
              .child(
                S.documentTypeList("order")
                  .title("Orders")
                  .defaultOrdering([{ field: "_createdAt", direction: "desc" }])
              ),
            S.divider(),
            S.listItem()
              .title("Home Page")
              .child(
                S.document()
                  .schemaType("homePage")
                  .documentId("homePage")
                  .title("Home Page")
              ),
            S.listItem()
              .title("About Page")
              .child(
                S.document()
                  .schemaType("aboutPage")
                  .documentId("aboutPage")
                  .title("About Page")
              ),
            S.listItem()
              .title("Site Settings")
              .child(
                S.document()
                  .schemaType("siteSettings")
                  .documentId("siteSettings")
              ),
          ]),
    }),
    visionTool({ defaultApiVersion: "2024-01-01" }),
  ],
  schema: {
    types: schemaTypes,
  },
});
