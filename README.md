# OpenPike docs

[![Check](https://github.com/OpenPike/docs/actions/workflows/check.yml/badge.svg)](https://github.com/OpenPike/docs/actions/workflows/check.yml)

The source of the [OpenPike documentation](https://openpike.dev/docs/). OpenPike is a bring-your-own-key gateway for LLM APIs, with budgets, loop detection, fallbacks and spend reporting. The docs are open source (content under CC BY 4.0), so you can fix a mistake or improve an explanation.

## How this repo works

The docs site is built from OpenPike's private main repository, and this repo is published from it on every change, so what you read here is what is live. Nothing is built from this repo. A change proposed here is reviewed and ported into the main repository by hand (you stay credited as a co-author of the commit). After the next sync it shows up here, and it goes live on the site with the next deploy. Your pull request is then closed with a link to the published commit, so it is closed, not merged, even when it is accepted.

## Propose a change

Every docs page has an **Edit this page** link that opens the right file here. Edit it on GitHub, which creates a fork and a pull request for you. See [CONTRIBUTING.md](CONTRIBUTING.md) for the writing rules.

## What is in this repo

| Path | What it holds |
| --- | --- |
| [`src/content/docs/`](src/content/docs) | The pages, as MDX. This is what you edit. |
| [`examples/`](examples) | The code samples the pages show (curl, Python, TypeScript). |
| [`openapi.yaml`](openapi.yaml) | The API spec the API reference pages are generated from. Those pages have no Edit link; change the spec instead. |
| [`src/components/`](src/components), [`src/lib/`](src/lib), [`src/assets/`](src/assets) | The Astro components and helpers the pages import (price tables, provider tables, the request flow figure). **For reading only**: they depend on OpenPike packages that are not published here, so this repo does not build on its own. Use them to see what a page renders. Changes to them are better discussed in an issue. |

The tables on the Providers pages come from the [models repo](https://github.com/OpenPike/models).

## License

The written docs (the prose on the pages, this README and CONTRIBUTING) are licensed under [CC BY 4.0](LICENSE).

The code is licensed under the [MIT License](LICENSE-CODE). That covers the samples in [`examples/`](examples), the components and helpers in [`src/components/`](src/components) and [`src/lib/`](src/lib), and every code block in the pages.
