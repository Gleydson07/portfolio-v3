import { createClient } from "next-sanity";
import { isSanityConfigured, sanityDataset, sanityProjectId } from "@/sanity/env";

export const sanityApiVersion = "2024-01-01";

export const client = createClient({
  projectId: sanityProjectId ?? "placeholder",
  dataset: sanityDataset,
  apiVersion: sanityApiVersion,
  useCdn: true,
});

export function getSanityClient() {
  if (!isSanityConfigured) {
    return null;
  }

  return client;
}
