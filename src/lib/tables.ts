/**
 * Generated tables, as plain header and row data. The Astro components render them as HTML and the
 * Markdown export (page .md files, llms-full.txt) renders the same rows as Markdown tables.
 */
import { PLAN_ORDER, PLANS, pricedModels, providerRows, requestsLabel, statusLabel, THROTTLE_REQUESTS_PER_MINUTE, usd, type ProviderStatus } from "./data";

export interface Cell {
  text: string;
  /** Docs path to link to, when the cell links somewhere. */
  href?: string;
  code?: boolean;
}

export interface Table {
  headers: string[];
  rows: Cell[][];
}

const NATIVE_PAGES = new Set(["openai", "anthropic", "google-ai-studio", "deepseek", "typesafe", "openrouter"]);

export function providerTable(statuses: ProviderStatus[]): Table {
  const rows = providerRows().filter((r) => statuses.includes(r.status));
  if (statuses.includes("unavailable") && statuses.length === 1) {
    return {
      headers: ["Provider", "Slug"],
      rows: rows.map((r) => [{ text: r.name }, { text: r.slug, code: true }]),
    };
  }
  return {
    headers: ["Provider", "Status", "Endpoints", "Example model names", "Prices"],
    rows: rows.map((r) => [
      { text: r.name, href: NATIVE_PAGES.has(r.slug) ? `/docs/providers/${r.slug}/` : undefined },
      { text: statusLabel(r) },
      { text: r.endpoints.join(", "), code: true },
      r.exampleModels.length ? { text: r.exampleModels.join(", "), code: true } : { text: `${r.slug}/<model id>`, code: true },
      { text: r.pricedModels ? `${r.pricedModels} models` : "Unpriced" },
    ]),
  };
}

export function priceTable(slug: string): Table {
  const models = pricedModels(slug);
  const hasCacheWrite = models.some(([, p]) => p.cache_write !== undefined);
  const headers = ["Model", "Input", "Cached input", ...(hasCacheWrite ? ["Cache write"] : []), "Output", "Notes", "As of"];
  return {
    headers,
    rows: models.map(([id, p]) => {
      const notes: string[] = [];
      for (const t of p.tiers ?? []) notes.push(`Above ${requestsLabel(t.above_prompt_tokens)} prompt tokens: ${usd(t.input)} in, ${usd(t.output)} out`);
      for (const c of p.changes ?? []) notes.push(`From ${c.from}: ${usd(c.input ?? p.input)} in, ${usd(c.output ?? p.output)} out`);
      if (p.cache_write_1h !== undefined) notes.push(`1-hour cache write ${usd(p.cache_write_1h)}`);
      if (p.note) notes.push(p.note);
      return [
        { text: id, code: true },
        { text: usd(p.input) },
        { text: usd(p.cached_input) },
        ...(hasCacheWrite ? [{ text: usd(p.cache_write) }] : []),
        { text: usd(p.output) },
        { text: notes.join(". ") || "-" },
        { text: p.as_of, href: undefined },
      ];
    }),
  };
}

export function priceSource(slug: string): string | null {
  return pricedModels(slug)[0]?.[1].source ?? null;
}

export function planTable(): Table {
  const yes = (b: boolean) => (b ? "Yes" : "No");
  const plans = PLAN_ORDER.map((id) => PLANS[id]);
  const row = (label: string, f: (p: (typeof plans)[number]) => string): Cell[] => [{ text: label }, ...plans.map((p) => ({ text: f(p) }))];
  return {
    headers: ["", ...plans.map((p) => p.name)],
    rows: [
      row("Price", (p) => (p.monthlyPrice ? `$${p.monthlyPrice}/month or $${requestsLabel(p.annualPrice)}/year` : "$0")),
      row("Requests a month", (p) => requestsLabel(p.monthlyRequests)),
      row("Active virtual keys", (p) => (p.maxVirtualKeys === null ? "Unlimited" : String(p.maxVirtualKeys))),
      row("Log retention", (p) => `${p.logRetentionDays} days`),
      row("Loop detection", (p) => yes(p.loopDetection)),
      row("Slack alerts", (p) => yes(p.slackAlerts)),
      row("Audit log", (p) => yes(p.auditLog)),
      row("Prompt logging", (p) => yes(p.promptLogging)),
    ],
  };
}

export const THROTTLE = THROTTLE_REQUESTS_PER_MINUTE;

function escapeCell(text: string): string {
  return text.replace(/\|/g, "\\|").replace(/\n/g, " ");
}

export function tableToMarkdown(table: Table, origin = "https://openpike.dev"): string {
  const cell = (c: Cell) => {
    let t = escapeCell(c.text);
    if (c.code) t = t.split(", ").map((s) => `\`${s}\``).join(", ");
    return c.href ? `[${t}](${origin}${c.href})` : t;
  };
  const head = `| ${table.headers.map(escapeCell).join(" | ")} |`;
  const sep = `| ${table.headers.map(() => "---").join(" | ")} |`;
  return [head, sep, ...table.rows.map((r) => `| ${r.map(cell).join(" | ")} |`)].join("\n");
}
