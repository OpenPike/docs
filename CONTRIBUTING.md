# Contributing

Thanks for helping make the docs better. Fixes for mistakes, unclear explanations and missing steps are all welcome.

## How changes land

This repo is published from OpenPike's main repository. When your pull request is ready, we copy it there (you stay credited as a co-author of the commit), and the next sync publishes it here. Then we close your pull request with a link to the published commit, so it is closed, not merged, even when it is accepted. A change goes live on the site after we port it and deploy.

## Making a change

1. Click **Edit this page** at the bottom of any docs page, or open a file in `src/content/docs/` and edit it. GitHub forks the repo and opens a pull request for you.
2. Change only what the pull request is about. One topic per pull request.
3. Say in the description what was wrong or missing, and link the source if you are correcting a fact.

Pages under **API reference, Endpoints** are generated from [`openapi.yaml`](openapi.yaml) and have no Edit link. Propose changes to them in that file.

## Writing rules

- **Plain language.** Short sentences, everyday words, one idea per paragraph. Say what the reader does and what happens.
- **No em dashes.** Use commas, colons, parentheses or separate sentences.
- **Link rather than repeat.** If another page explains it, link to it (for example `[Budgets](/docs/features/budgets/)`) instead of copying the explanation, so there is one place to fix.
- **Name things for what they are**: virtual key, provider key, workspace, organization.
- **Sources.** A claim about another product (a coding agent's settings, a provider's price or limit) comes from that product's own documentation. Put the link and the date you read it in a comment at the top of the page, as the existing integration pages do.

## Code samples must work

Every sample must work against the real API. The pages show files from [`examples/`](examples), so change the sample there, not in the page. Use the real base URL (`https://api.openpike.dev/v1`), real model names (`provider/model`, see [Model names](https://openpike.dev/docs/features/model-names/)) and a placeholder key such as `$OPENPIKE_API_KEY`. Never paste a real key, and do not include a provider key or virtual key in a description or screenshot.

## Previewing

The Markdown preview on GitHub is enough for text changes. A full preview needs OpenPike's private repo, so we check the rendered page when we port your change. The `check` job in this repo runs on every pull request and catches em dashes and a few other slips.
