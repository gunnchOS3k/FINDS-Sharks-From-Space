# FINDS — Sharks From Space

FINDS helps people explore where environmental ocean conditions may correspond with shark-activity hotspots using NASA observations, AI-assisted analysis, and an interactive map.

🏆 **NYC Best Use of Gemini API — NASA Space Apps Challenge 2025**  
NASA Space Apps NYC | NYU collaborators **Edmund Gunn Jr.** and **Yasmine Dweir**

> FINDS is an exploratory research and visualization project. Hotspot scores are not real-time shark warnings and should not be used as a substitute for official marine-safety guidance.

[Try locally (demo, no secrets)](docs/GETTING_STARTED.md) · [How FINDS works](docs/ARCHITECTURE.md) · [Install Android](docs/GETTING_STARTED.md#android) · [Pixel 6a evidence](docs/release/PIXEL_6A_VALIDATION.md) · [Explore the code](#engineer)

The intended Cloudflare Pages URL is `https://finds-web.pages.dev`. It returned **404** on 2026-08-17 from this workstation because local Wrangler is not logged in. Production deploy is an owner gate (GitHub Actions `CLOUDFLARE_API_TOKEN` / `CLOUDFLARE_ACCOUNT_ID` plus Worker secrets). Do not treat that URL as a live demo until `/health` succeeds.

![CI](https://github.com/gunnchOS3k/FINDS-Sharks-From-Space/actions/workflows/ci.yml/badge.svg)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## Explain it like I'm new

- **What is a shark hotspot here?** A scored ocean cell where NASA sea-surface temperature and chlorophyll-a look more like conditions researchers associate with marine productivity and thermal habitat. It is not a confirmed shark and not a beach flag.
- **What does NASA provide?** Public GIBS visualizations of JPL MUR Level-4 SST and PACE/VIIRS chlorophyll-a. FINDS samples those rasters on a geographic grid and records provenance.
- **What does Gemini do?** It ranks and explains the NASA-derived cells. In live mode it does not invent coordinates.
- **What does the map show?** A heatmap and markers for scored cells. Gold markers are the highest exploratory scores, also labeled in text.
- **Is this a real safety warning?** No.

## Recruiter snapshot

FINDS began as a NASA Space Apps 2025 hackathon prototype that won **NYC Best Use of Gemini API**. The original demo asked Gemini for plausible points. This public-release branch adds a NASA observation pipeline, a hardened Cloudflare Worker, R2 read-through cache, tests, UML, PWA packaging, and a Capacitor Android app for Pixel 6a.

**Team:** Edmund Gunn Jr. and Yasmine Dweir. Public commit history on this repository is the verifiable contribution record; this README does not invent a task split.

**Skills demonstrated:** React, TypeScript, Vite, Deck.gl, NASA GIBS, Gemini structured output, Cloudflare Workers/R2, PWA, Capacitor Android, Vitest/Playwright, accessibility, scientific provenance.

**Supported platforms (verified in this release effort):** Web, installable PWA, Capacitor Android APK. Obsolete Expo/React Native and Electron stubs were removed from the canonical path; Git history still contains the hackathon-era files.

Architecture in 60 seconds: the UI posts a region to the Worker; the Worker checks R2; on miss it pulls NASA GIBS SST + chlorophyll, converts pixels through official colormaps, scores cells, optionally asks Gemini to explain those cells, caches the JSON, and returns provenance to Deck.gl.

## Engineer

```bash
git clone https://github.com/gunnchOS3k/FINDS-Sharks-From-Space.git
cd FINDS-Sharks-From-Space
npm ci
npm run dev
```

Demo/offline mode works without secrets. Live NASA + Gemini scoring:

```bash
cp .env.example .env
# set VITE_API_BASE to the Worker URL
cd api/worker && cp ../../.env.example ../../api/worker/.dev.vars
# put GEMINI_API_KEY in api/worker/.dev.vars — never commit it
npm run worker:dev
VITE_API_BASE=http://127.0.0.1:8787 npm run dev
```

Primary local gate: `npm run verify`

| Path | Role |
|---|---|
| `src/` | Canonical Vite + React UI |
| `shared/` | NASA ingest, scoring, validation |
| `api/worker/` | Cloudflare Worker |
| `docs/architecture/uml/` | PlantUML + SVG |
| `android/` | Capacitor wrapper (generated) |

See [Getting started](docs/GETTING_STARTED.md), [Architecture](docs/ARCHITECTURE.md), [NASA pipeline](docs/data/NASA_DATA_PIPELINE.md), [Provenance](docs/data/DATA_PROVENANCE.md), [Limitations](docs/data/SCIENTIFIC_LIMITATIONS.md), [Pixel 6a validation](docs/release/PIXEL_6A_VALIDATION.md), [Claims vs evidence](docs/release/CLAIMS_EVIDENCE_MATRIX.md).

### Pixel 6a (debug APK)

![Map and NASA-derived cells](docs/media/pixel6a/02-home-map.png)

![Selected cell with SST and chlorophyll](docs/media/pixel6a/05-selected-hotspot.png)

Simplified flow:

```mermaid
flowchart LR
  U[Visitor] --> UI[Vite React PWA / Android WebView]
  UI --> W[Cloudflare Worker]
  W --> R2[(R2 cache)]
  W --> NASA[NASA GIBS SST + chlorophyll]
  W --> G[Gemini scoring of NASA cells]
  UI --> MAP[Deck.gl map]
```

[Component diagram](docs/architecture/uml/02-component.svg) · [Generate sequence](docs/architecture/uml/04-sequence.svg) · [ADR-001](docs/architecture/ADR-001-canonical-client.md)
