import { getCollection } from "astro:content";
import type { DocEntry } from "./markdown";

export const SIDEBAR_ORDER = ["index", "quickstart", "concepts", "migrate-from-openrouter", "migrate-from-helicone", "integrations", "features", "providers", "recipes", "api", "resources"];

/** Written pages in reading order: grouped by section in sidebar order, then by sidebar order and title. */
export async function orderedDocs(): Promise<(DocEntry & { data: { title: string; description?: string; sidebar?: { order?: number } } })[]> {
  const docs = (await getCollection("docs", (e) => e.id !== "404")) as unknown as (DocEntry & { data: { title: string; description?: string; sidebar?: { order?: number } } })[];
  const section = (id: string) => {
    const first = id.split("/")[0] ?? "";
    const i = SIDEBAR_ORDER.indexOf(id.includes("/") ? first : id);
    return i === -1 ? (SIDEBAR_ORDER.indexOf(first) === -1 ? 99 : SIDEBAR_ORDER.indexOf(first)) : i;
  };
  return docs.sort(
    (a, b) =>
      section(a.id) - section(b.id) ||
      (a.data.sidebar?.order ?? 50) - (b.data.sidebar?.order ?? 50) ||
      a.data.title.localeCompare(b.data.title),
  );
}
