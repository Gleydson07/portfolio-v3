import { codeInput } from "@sanity/code-input";
import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { sanityDataset, sanityProjectId } from "./sanity/env";
import { schemaTypes } from "./sanity/schemaTypes";

export default defineConfig({
  name: "default",
  title: "Gleydson Santos — Blog",
  projectId: sanityProjectId ?? "missing-project-id",
  dataset: sanityDataset,
  basePath: "/studio",
  plugins: [structureTool(), visionTool(), codeInput()],
  schema: { types: schemaTypes },
});