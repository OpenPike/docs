/**
 * Turns a docs page (Markdown or MDX source) into plain Markdown for "Copy page as Markdown",
 * /docs/<page>.md, and llms-full.txt. The pages use a small, fixed set of components, each of
 * which has a Markdown equivalent here; anything else fails the build so nothing is silently lost.
 */
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import type { ProviderStatus } from "./data";
import { exampleFiles } from "./examples";
import { planTable, priceSource, priceTable, providerTable, tableToMarkdown } from "./tables";

const ORIGIN = "https://openpike.dev";

export interface DocEntry {
  id: string;
  body?: string;
  filePath?: string;
  data: { title: string; description?: string };
}

function attrs(tag: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const m of tag.matchAll(/([a-zA-Z]+)=(?:"([^"]*)"|\{([^}]*)\})/g)) out[m[1]!] = m[2] ?? m[3] ?? "";
  return out;
}

const ASIDE_LABEL: Record<string, string> = { note: "Note", tip: "Tip", caution: "Caution", danger: "Warning" };

export function toMarkdown(entry: DocEntry): string {
  const file = entry.filePath ? resolve(entry.filePath) : "";
  let body = entry.body ?? "";

  // Raw example imports: import name from "../examples/x.py?raw";
  const imports = new Map<string, string>();
  body = body.replace(/^import\s+(\w+)\s+from\s+["']([^"']+)\?raw["'];?\s*$/gm, (_m, name: string, path: string) => {
    imports.set(name, readFileSync(resolve(dirname(file), path), "utf8").replace(/\s+$/, ""));
    return "";
  });
  // Other imports (components) carry no content.
  body = body.replace(/^import\s+.+$/gm, "");

  body = body.replace(/<Code\b([^>]*?)\/>/g, (_m, a: string) => {
    const at = attrs(a);
    const code = imports.get(at.code ?? "") ?? at.code ?? "";
    const title = at.title ? `${at.title}\n\n` : "";
    return `${title}\`\`\`${at.lang ?? ""}\n${code}\n\`\`\``;
  });
  body = body.replace(/<Example\b([^>]*?)\/>/g, (_m, a: string) => {
    const at = attrs(a);
    return exampleFiles(at.name!, at.only?.split(","))
      .map((v) => `**${v.label}** (${v.file})\n\n\`\`\`${v.lang}\n${v.code}\n\`\`\``)
      .join("\n\n");
  });
  body = body.replace(/<ProviderTable\b([^>]*?)\/>/g, (_m, a: string) => tableToMarkdown(providerTable(attrs(a).status!.split(",").map((s) => s.trim()) as ProviderStatus[])));
  body = body.replace(/<PriceTable\b([^>]*?)\/>/g, (_m, a: string) => {
    const slug = attrs(a).provider!;
    const t = priceTable(slug);
    if (!t.rows.length) return "No prices are recorded for this provider yet, so its requests show no cost. They still count toward your plan's monthly requests.";
    return `${tableToMarkdown(t)}\n\nUSD per 1M tokens, from ${priceSource(slug)}.`;
  });
  body = body.replace(/<PlanTable\s*\/>/g, () => tableToMarkdown(planTable()));
  body = body.replace(/<LinkCard\b([^>]*?)\/>/g, (_m, a: string) => {
    const at = attrs(a);
    return `- [${at.title}](${at.href})${at.description ? `: ${at.description}` : ""}`;
  });
  body = body.replace(/<TabItem\b([^>]*)>/g, (_m, a: string) => `**${attrs(a).label}**\n`);
  body = body.replace(/<Aside\b([^>]*)>/g, (_m, a: string) => {
    const at = attrs(a);
    return `**${at.title ?? ASIDE_LABEL[at.type ?? "note"] ?? "Note"}:**`;
  });
  body = body.replace(/<\/?(Tabs|TabItem|Aside|Steps|CardGrid)\b[^>]*>/g, "");
  // Inline SVG diagrams are described in the text next to them.
  body = body.replace(/<figure\b[\s\S]*?<\/figure>/g, "");
  // Comments in MDX ({/* ... */}) and HTML (<!-- -->).
  body = body.replace(/\{\/\*[\s\S]*?\*\/\}/g, "").replace(/<!--[\s\S]*?-->/g, "");

  const leftover = body.match(/<[A-Z][A-Za-z]*\b/);
  if (leftover) throw new Error(`${entry.id}: no Markdown equivalent for ${leftover[0]}>`);

  body = body.replace(/\]\((\/docs\/[^)]*)\)/g, `](${ORIGIN}$1)`).replace(/\n{3,}/g, "\n\n").trim();
  const description = entry.data.description ? `${entry.data.description}\n\n` : "";
  return `# ${entry.data.title}\n\n${description}${body}\n`;
}
