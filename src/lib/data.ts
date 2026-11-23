/**
 * Data the docs render as tables. Everything comes from the files the gateway itself uses
 * (packages/providers/catalog.json and prices.json, packages/core/src/plans.ts), so the docs can
 * never disagree with what the gateway does. Nothing here is typed by hand.
 */
import { PLAN_ORDER, PLANS, THROTTLE_REQUESTS_PER_MINUTE, type Plan } from "@openpike/core/plans";
import { activeFormats, allCatalogEntries, isRoutable, type CatalogEntry, type Format } from "@openpike/providers";
import pricesFile from "@openpike/providers/prices.json";

export { PLAN_ORDER, PLANS, THROTTLE_REQUESTS_PER_MINUTE, type Plan };

export interface PriceTier {
  above_prompt_tokens: number;
  input: number;
  output: number;
  cached_input?: number;
}

export interface PriceChange {
  from: string;
  input?: number;
  output?: number;
  cached_input?: number;
}

export interface PriceEntry {
  input: number;
  output: number;
  cached_input?: number;
  cache_write?: number;
  cache_write_1h?: number;
  tiers?: PriceTier[];
  changes?: PriceChange[];
  note?: string;
  source: string;
  as_of: string;
}

const prices = (pricesFile as unknown as { prices: Record<string, PriceEntry> }).prices;

export const ENDPOINT_OF: Record<Format, string> = {
  chat: "/v1/chat/completions",
  messages: "/v1/messages",
  systemone: "/v1/systemone",
  responses: "/v1/responses",
};

export type ProviderStatus = "tested" | "available" | "unavailable";

export interface ProviderRow {
  slug: string;
  name: string;
  tier: string;
  status: ProviderStatus;
  /** For tested providers: each tested endpoint and the date it last passed the live smoke test. */
  tested: { endpoint: string; date: string }[];
  endpoints: string[];
  exampleModels: string[];
  pricedModels: number;
}

/** Every priced model of a provider, in the order of prices.json. */
export function pricedModels(slug: string): [string, PriceEntry][] {
  return Object.entries(prices).filter(([id]) => id.split("/")[0] === slug);
}

function statusOf(entry: CatalogEntry): ProviderStatus {
  if (!isRoutable(entry)) return "unavailable";
  return entry.liveTested && Object.keys(entry.liveTested).length > 0 ? "tested" : "available";
}

/**
 * One row per catalog provider OpenPike may route to one day. Routable providers first (native, then
 * compatible), each by name. Providers of tier "excluded" (not chat models, or test entries) are left out.
 */
export function providerRows(): ProviderRow[] {
  const listed = allCatalogEntries().filter((entry) => entry.tier !== "excluded");
  const rows = listed.map((entry): ProviderRow => {
    const status = statusOf(entry);
    const formats = isRoutable(entry) ? activeFormats(entry) : (entry.formats ?? []);
    const priced = pricedModels(entry.slug);
    return {
      slug: entry.slug,
      name: entry.name,
      tier: entry.tier,
      status,
      tested: Object.entries(entry.liveTested ?? {}).map(([format, date]) => ({ endpoint: ENDPOINT_OF[format as Format], date: date as string })),
      endpoints: formats.map((f) => ENDPOINT_OF[f]),
      exampleModels: priced.slice(0, 3).map(([id]) => id),
      pricedModels: priced.length,
    };
  });
  const rank = (r: ProviderRow) => (r.status === "unavailable" ? 2 : r.tier === "native" ? 0 : 1);
  return rows.sort((a, b) => rank(a) - rank(b) || a.name.localeCompare(b.name));
}

export function providerRow(slug: string): ProviderRow {
  const row = providerRows().find((r) => r.slug === slug);
  if (!row) throw new Error(`Unknown provider in the docs: ${slug}`);
  return row;
}

/** "$1.25" style price per 1M tokens. */
export function usd(perMillion: number | undefined): string {
  if (perMillion === undefined) return "-";
  return `$${perMillion < 0.1 ? perMillion.toFixed(3) : perMillion.toFixed(2)}`;
}

export function statusLabel(row: ProviderRow): string {
  if (row.status === "tested") return `Tested (${[...new Set(row.tested.map((t) => t.date))].join(", ")})`;
  if (row.status === "available") return "Available";
  return "Not yet available";
}

export function requestsLabel(n: number): string {
  return n.toLocaleString("en-US");
}
