/**
 * Runnable examples live as real files in apps/docs/examples/<name>.<sh|py|ts>. Pages show them with
 * <Example name="..." /> and scripts/docs-examples.mjs runs the same files against a local gateway,
 * so what a reader copies is what was tested.
 */
const files = import.meta.glob("../../examples/**/*.{sh,py,ts}", { query: "?raw", import: "default", eager: true }) as Record<string, string>;

export interface ExampleFile {
  label: "curl" | "Python" | "TypeScript";
  lang: "bash" | "python" | "ts";
  file: string;
  code: string;
}

const KINDS = [
  { ext: "sh", label: "curl", lang: "bash" },
  { ext: "py", label: "Python", lang: "python" },
  { ext: "ts", label: "TypeScript", lang: "ts" },
] as const;

/** The variants of one example, in curl, Python, TypeScript order. Fails the build if none exist. */
export function exampleFiles(name: string, only?: string[]): ExampleFile[] {
  const out: ExampleFile[] = [];
  for (const k of KINDS) {
    if (only && !only.includes(k.ext)) continue;
    const code = files[`../../examples/${name}.${k.ext}`];
    if (code !== undefined) out.push({ label: k.label, lang: k.lang, file: `${name.split("/").pop()}.${k.ext}`, code: code.replace(/\s+$/, "") });
  }
  if (out.length === 0) throw new Error(`No example files for "${name}" in apps/docs/examples`);
  return out;
}
