# Claims vs evidence

Status values: **PASS** (implemented and evidenced in production), **QUALIFIED** (implemented with explicit scientific/scope limits documented), **PARTIAL** (implemented but not fully exercised in production), **GAP** (not implemented), **HISTORICAL_ONLY** (Space Apps pitch only; superseded), **BLOCKED** (external gate).

Last updated: 2026-08-18 public-release follow-up (`cursor/finds-public-release-pixel6a-followup`). Production Pages origin is `https://finds-web-4j5.pages.dev`.

See also: [SPACE_APPS_SUBMISSION_ALIGNMENT.md](./SPACE_APPS_SUBMISSION_ALIGNMENT.md)

## NASA data & pipeline

| Claim | Implementation | Test | Evidence | Status |
|---|---|---|---|---|
| Uses NASA SST (GIBS MUR L4) | GIBS WMS MUR L4 SST + official colormap | Worker fixture + live probe | `shared/nasa.ts`, live provenance | PASS |
| Uses NASA chlorophyll-a (PACE OCI, VIIRS fallback) | GIBS PACE/VIIRS layers | Same | `shared/nasa.ts` | PASS |
| No direct NASA shark detection | Environmental rasters only | Scientific limitations doc | `docs/data/SCIENTIFIC_LIMITATIONS.md` | PASS |
| Colormap decode (not NetCDF) | PNG WMS + XML colormaps | Unit tests | `shared/colormap.ts` | PASS |
| Observation latency hours–day | GIBS daily layers | Live provenance timestamps | Worker `/api/hotspots` | QUALIFIED |

## Scoring & mathematical framework

| Claim | Implementation | Test | Evidence | Status |
|---|---|---|---|---|
| SST suitability heuristic | `sstSuitability()` | `tests/unit/pipeline.test.ts` | `shared/scoring.ts` | QUALIFIED |
| Chlorophyll productivity proxy | `chlorophyllSuitability()` | Same | `shared/scoring.ts` | QUALIFIED |
| SST gradient / front proxy | `gradientBoost()` | Same | `shared/scoring.ts` | QUALIFIED |
| Combined deterministic score | Weighted sum + cap | Same | `shared/scoring.ts` | QUALIFIED |
| Validated SDM / occupancy model | Not implemented | N/A | Limitations doc | GAP (honestly not claimed in v2.x) |
| 24–72h forecast hotspots | Not implemented | N/A | Space Apps About tab | HISTORICAL_ONLY |
| Bathymetry layer | Not implemented | N/A | — | GAP |
| SWOT eddy tracking | Not implemented | N/A | Challenge background | GAP |
| Quantified trophic links phytoplankton→shark | Not implemented | N/A | — | GAP |

## Gemini & AI

| Claim | Implementation | Test | Evidence | Status |
|---|---|---|---|---|
| Gemini 3.6 Flash scores NASA cells only | `DEFAULT_GEMINI_MODEL=gemini-3.6-flash`; `mergeGeminiScores` drops unknown ids | `tests/unit/pipeline.test.ts` | `shared/gemini.ts`, live `/version`; live n=11 MISS used Gemini; default n=37 HIT currently a cached abort until this follow-up deploys | QUALIFIED |
| Gemini does not observe sharks | Prompt + merge guards | Unit tests | `shared/gemini.ts` | PASS |
| Gemini server-side only | Client → Worker; no `VITE_` Gemini key | grep `src/` | `src/services/api.ts` | PASS |
| Structured JSON output | Schema-constrained response | Worker tests | `shared/gemini.ts` | PASS |

## Conceptual tag model

| Claim | Implementation | Test | Evidence | Status |
|---|---|---|---|---|
| Conceptual tag design (challenge req B) | Markdown + TypeScript types | Typecheck | `docs/challenge/CONCEPTUAL_SHARK_TAG_MODEL.md`, `shared/tagConcept.ts` | QUALIFIED |
| Physical tag deployment | None | N/A | — | GAP (by design) |
| Live tag telemetry in production | None | N/A | — | GAP (by design) |
| Synthetic tag fixtures labeled | `synthetic: true`, `provenance: SYNTHETIC` | Typecheck | `shared/tagConcept.ts` | PASS |
| Tag data fused to NASA scores | Not implemented | N/A | — | GAP (honest) |
| Open tag tracks (Space Apps About) | Not in v2.x | N/A | — | HISTORICAL_ONLY |

## Infrastructure & client

| Claim | Implementation | Test | Evidence | Status |
|---|---|---|---|---|
| Cloudflare Worker API | `/health`, `/version`, `POST /api/hotspots` | `tests/worker/worker.test.ts` + production smoke | `api/worker/src/index.ts` | PASS |
| R2 read-through cache | MISS persist, HIT return | worker integration + live curl | `api/worker/src/index.ts` | PASS |
| Deck.gl map | Heatmap + scatter | Playwright + Pixel | `src/components/MapView.tsx` | PASS |
| PWA installable | vite-plugin-pwa | `tests/e2e/pwa.spec.ts` | `vite.config.ts` | PASS |
| Offline / demo mode | `/demo.json` fallback | Playwright + Pixel | `public/demo.json` | PARTIAL |
| Android APK | Capacitor 7, `com.gunnchos.finds` v2.0.0 | `assembleDebug` + adb | `android/` | PASS |
| Edge IO gestures | Pinch/spread/shake | CDP Pixel 6a | `src/services/edgeio.ts`, `docs/release/PIXEL_6A_VALIDATION.md` | PASS |

## Language, safety & awards

| Claim | Implementation | Test | Evidence | Status |
|---|---|---|---|---|
| Not marine-safety / lifeguard product | Disclaimer everywhere | schema test | `shared/types.ts`, Help UI | PASS |
| Not real-time shark warnings | Disclaimer + limitations | schema test | README, Help | PASS |
| “Real-time” = UI only (not satellite/sharks) | Presentations + docs aligned | Manual review | `presentations/README.md` | QUALIFIED |
| Habitat-hotspot exploration (not detection) | README, Help, gh description | grep review | README, `src/App.tsx` | QUALIFIED |
| NYC Best Use of Gemini API 2025 | README, Help, CITATION | Event record | README | PASS |
| NASA Global Winner | Not evidenced | N/A | — | GAP (do not claim) |
| SharkSafe Index / encounter-risk | Not in v2.x | N/A | Space Apps About | HISTORICAL_ONLY |
| OpenSpace 3D export | Not in v2.0.0 UI | N/A | Space Apps Project | HISTORICAL_ONLY |

## Documentation & diagrams

| Claim | Implementation | Test | Evidence | Status |
|---|---|---|---|---|
| UML (9 diagrams, live vs conceptual) | PlantUML + SVG | `npm run diagrams:check` | `docs/architecture/uml/` | PASS |
| Space Apps claim alignment doc | This pass | Manual | `SPACE_APPS_SUBMISSION_ALIGNMENT.md` | PASS |
| Oct 2025 hackathon vs v2.x timeline | CHANGELOG + README | Manual | CHANGELOG | PASS |

## Pixel 6a validation

| Claim | Implementation | Test | Evidence | Status |
|---|---|---|---|---|
| Pixel 6a production APK | Physical device | adb + CDP (2026-08-17); 2026-08-18 ADB unauthorized | `docs/release/PIXEL_6A_VALIDATION.md` | PASS (prior evidence; package unchanged) |
| Pinch / spread (panel density) | Pointer pair simulation | CDP | `scripts/pixel-acceptance.mjs` | PASS |
| Shake → gallery | DeviceMotionEvent | CDP | Same | PASS |
| Automated CDP ≠ human UX sign-off | Documented | PIXEL_6A_VALIDATION.md | docs | QUALIFIED |

## Production URLs (live gates)

| Gate | Status | Notes |
|---|---|---|
| LIVE_WORKER_PASS | PASS | `https://finds-worker.gunnchos-finds.workers.dev` |
| LIVE_PAGES_PASS | PASS | `https://finds-web-4j5.pages.dev` |
| GEMINI_PRODUCTION_PASS | QUALIFIED | Live MISS returns `gemini-3.6-flash`; default cached n=37 currently stores a Gemini abort until pipeline `2026.08.2` deploys |
| NASA_PRODUCTION_PASS | PASS | Live `sourceAgency: NASA` |
| BUILD_PASS | PASS | `npm run verify` |
| PUBLIC_EXPLANATION_PASS | QUALIFIED | Alignment pass updates |

## Release

| Item | Status | Notes |
|---|---|---|
| v2.0.0 published | PASS | Do not mutate tag |
| v2.0.1 suggested | Draft | Docs/claim alignment only — see `V2.0.1_RELEASE_DRAFT.md` |
