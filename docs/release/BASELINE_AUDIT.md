# FINDS baseline audit

Recorded before the public-release implementation on branch `cursor/finds-public-release-pixel6a`.

## Clone / git

| Item | Value |
|---|---|
| Workspace | `/Users/gunnchos/dev/FINDS-Sharks-From-Space` |
| Clone origin | `https://github.com/gunnchOS3k/FINDS-Sharks-From-Space` |
| Branch at clone | `main` |
| Commit SHA at clone | `f55749d288d344f8ac939f5e511d30eea1bc762c` |
| Commit subject | Fix critical TODOs: Wire Edge IO, fix dependencies, update README |
| Working branch | `cursor/finds-public-release-pixel6a` |

## Toolchain

| Tool | Version / path |
|---|---|
| Node | v24.9.0 |
| npm | 11.6.0 |
| Java (default) | OpenJDK 25.0.1 |
| Java (Android builds) | Amazon Corretto 17.0.17 |
| Android SDK | `~/Library/Android/sdk` (platforms 33–36, build-tools 30–36) |
| adb | 1.0.41 / 37.0.1-15733141 |
| Wrangler (npx) | 4.123.0, **not authenticated locally** |
| GitHub CLI | authenticated as `gunnchOS3k` |

## Pixel 6a (no serial recorded)

At first `adb devices` poll the device was `unauthorized`. After USB debugging was allowed:

| Item | Value |
|---|---|
| Model | Pixel 6a (`bluejay`) |
| Manufacturer | Google |
| Android | 17 (SDK 37) |
| FINDS package present | no (`com.gunnchos.finds` not installed) |

## What the repository actually contained

Canonical web app was a Vite + React 18 + TypeScript + Deck.gl prototype. Android was **not** Capacitor. `App.tsx` was an Expo/React Native stub that requested camera and location permissions the web app does not use. Electron, EAS, Metro, and Babel configs were present but unused by the documented web path.

### Failures / gaps found in the existing tree

1. **No `npm run lint`, `typecheck`, `test`, `verify`, or Android scripts.**
2. **Client-side Gemini secret path** in `services/geminiService.ts` (`process.env.API_KEY` + `@google/genai` in the browser bundle).
3. **Worker invented coordinates** via Gemini (`api/worker/src/worker.mjs`). No NASA observation ingest. Model hardcoded as `gemini-1.5-flash`.
4. **CORS fallback `Access-Control-Allow-Origin: *`** when origin was not allowlisted.
5. **R2 write-only**, not a read-through cache keyed by request.
6. **Zero-byte public assets:** all six `public/sharks/*.jpg` and both `public/icons/icon-*.png`.
7. **`index.html` mixed Vite with React 19 CDN import maps and `cdn.tailwindcss.com`.** Duplicate service worker: Vite PWA plugin plus manual `/sw.js` registration.
8. **Demo hotspots sit on land** (Manhattan coordinates in `public/demo.json`).
9. **Help copy claimed “unseen datasets” and a beach-safety-adjacent name** (“Forecasted Incidents of Nautical Danger System”) that the code does not support.
10. **Edge IO advertised pinch/spread as device gestures** but implemented them as keyboard `+/-` only. Fist/open were typed but unused. Remote EdgeGesture import was a non-functional stub.
11. **CI `continue-on-error: true`** on Cloudflare deploy steps. Placeholder worker URL `finds-worker.workers.dev`.
12. **README status badge said production-ready** and claimed NASA satellite analysis the Worker did not perform.
13. **No tests, no UML package, no Capacitor Android project, no PWA icons that exist.**
14. **Local Wrangler is not logged in.** Live Cloudflare deploy is blocked unless GitHub Actions secrets exist.

### Search hits (pre-change)

| Pattern | Notable locations |
|---|---|
| TODO / FIXME | not a primary issue; larger problem was stale “production-ready” claims |
| placeholder | `constants.ts` shark model URL; README `your-project` / `your_api_key_here` |
| mock / fake / demo | `geminiService.ts` mock fallback; `public/demo.json` |
| production-ready | README badge |
| CDN React 19 | `index.html` import map |
| camera / location | Expo `App.tsx` only |

## NASA research notes (implementation input)

Official NASA GIBS (no visitor Earthdata login):

- WMS GetMap: `https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi` — confirmed HTTP 200 PNG for `GHRSST_L4_MUR_Sea_Surface_Temperature` and `OCI_PACE_Chlorophyll_a`.
- Product metadata: MUR SST collection `C1996881146-POCLOUD` / `MUR-JPL-L4-GLOB-v4.1`; PACE OCI chlorophyll `PACE_OCI_L2_BGC`.
- Official colormaps: `https://gibs.earthdata.nasa.gov/colormaps/v1.3/GHRSST_Sea_Surface_Temperature.xml` (units °C) and `VIIRS_Chlorophyll.xml` (units mg/m³).
- GIBS GetFeatureInfo is **not** enabled on this endpoint.
- WMTS DescribeDomains for MUR SST included data through `2026-08-16` at audit time.

Gemini: official models page lists `gemini-2.5-flash` and `gemini-3.5-flash` as stable. Default will be env `GEMINI_MODEL` with verified fallback `gemini-2.5-flash`.

## Decision

Proceed immediately to a Capacitor + Vite/React canonical client, NASA GIBS observation ingest, server-side Gemini, hardened Worker, tests, docs, and Pixel 6a install. Do not treat the pre-change README as evidence of live NASA analysis.
