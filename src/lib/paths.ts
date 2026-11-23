/** The Markdown copy of a docs page: /docs/index.md for the overview, /docs/<id>.md otherwise. */
export function markdownPath(id: string): string {
  return `/docs/${id === "" || id === "index" ? "index" : id}.md`;
}

/** The page URL of a docs entry id. */
export function pagePath(id: string): string {
  return id === "" || id === "index" ? "/docs/" : `/docs/${id}/`;
}
