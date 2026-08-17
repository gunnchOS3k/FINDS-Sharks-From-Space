# NASA Space Apps submission — claim alignment

Branch pass: `cursor/space-apps-claim-alignment` · Official pages fetched via Playwright (Aug 2026).

Sources:

- [Sharks from Space challenge](https://www.spaceappschallenge.org/2025/challenges/sharks-from-space/?tab=details)
- [Space Apps NYC 2025 local event](https://www.spaceappschallenge.org/2025/local-events/new-york-city/)
- [FINDS team — About](https://www.spaceappschallenge.org/2025/find-a-team/finds-by-gunnchos3kmlv/?tab=details)
- [FINDS team — Project](https://www.spaceappschallenge.org/2025/find-a-team/finds-by-gunnchos3kmlv/?tab=project)

Status values: **PASS** (implemented and evidenced), **QUALIFIED** (implemented with explicit limits stated in repo/production UI), **GAP** (not implemented), **HISTORICAL_ONLY** (hackathon pitch only; superseded by v2.x honest framing).

## Extracted official claims → alignment

| Original claim | Current implementation | Evidence | Status | Required correction |
|---|---|---|---|---|
| Challenge: create a **mathematical framework** for identifying sharks and predicting foraging habitats using NASA satellite data | Heuristic scoring: SST suitability + chlorophyll productivity proxy + local SST gradient; Gemini ranks/explains existing NASA cells only | `shared/scoring.ts`, `shared/gemini.ts`, `docs/data/NASA_DATA_PIPELINE.md` | **QUALIFIED** | Document as exploratory habitat-hotspot scoring, not validated shark identification or SDM |
| Challenge: **conceptual tag model** (location + diet + real-time transmit for predictive models) | Typed conceptual model + markdown; no hardware, no live ingest | `docs/challenge/CONCEPTUAL_SHARK_TAG_MODEL.md`, `shared/tagConcept.ts` | **QUALIFIED** | Keep labeled conceptual/SYNTHETIC; never wire to production scores |
| Challenge: identify **foraging hotspots** and ecological links (phytoplankton → predator) | Environmental hotspot scores from SST + chlorophyll; no trophic model or SWOT eddies | `shared/scoring.ts`, `docs/data/SCIENTIFIC_LIMITATIONS.md` | **QUALIFIED** | No claim of quantified trophic links or SWOT/PACE eddy tracking |
| Challenge: **identifying sharks** (literal) | No shark detection from satellites; scores are habitat/productivity proxies | Disclaimer, Help UI, README | **QUALIFIED** | Replace “identify sharks” language in GitHub/presentations with habitat-hotspot exploration |
| Team About: **“near–real-time shark habitat & encounter-risk map”** | Live NASA GIBS with hours–day latency; exploratory scores; not encounter-risk | Production provenance timestamps, `SCIENTIFIC_LIMITATIONS.md` | **HISTORICAL_ONLY** | Qualify in matrix; GitHub/README must not repeat encounter-risk |
| Team About: **SharkSafe Index**, **24–72h hotspots**, **open tag tracks** | No SharkSafe Index name in app; no tag tracks in production; no 24–72h forecast model | Codebase grep, Worker API | **HISTORICAL_ONLY** | Do not resurrect without implementation |
| Team About: **bathymetry**, **fronts/gradients** (full stack) | SST gradient boost only; no bathymetry layer | `shared/scoring.ts` | **GAP** / **QUALIFIED** | Only claim SST gradient proxy where implemented |
| Team Project: **maps likely shark-activity hotspots** using NASA SST + ocean color + structured AI JSON | Implemented: GIBS MUR SST + PACE/VIIRS chlorophyll, Gemini 3.6 Flash, strict cell ids | Live Worker, `npm run test:production` | **QUALIFIED** | “Likely” = exploratory; not confirmed sharks |
| Team Project: **lifeguards morning situational awareness** | Educational/exploratory framing; disclaimer against marine-safety use | README, Help, disclaimer constant | **QUALIFIED** | Not operational lifeguard tooling |
| Team Project: **PWA**, **edge cache**, **serverless**, **offline demo** | Cloudflare Worker + R2 + PWA + `/demo.json` | `api/worker/`, Playwright PWA tests | **PASS** | — |
| Team Project: **Edge IO gestures** for demos | Pinch/spread/shake on Android/PWA | `src/services/edgeio.ts`, Pixel CDP validation | **PASS** | “Real-time” = UI interaction only |
| Team Project: **Gemini structured JSON**, server-side keys | `gemini-3.6-flash`, mergeGeminiScores guard | `shared/gemini.ts`, `/version` | **PASS** | — |
| Team Project: **NASA GHRSST MUR SST + MODIS/VIIRS chlorophyll** | GIBS MUR L4 SST + PACE OCI with VIIRS fallback | `shared/nasa.ts`, live provenance | **PASS** | Prefer GIBS/PACE naming in docs (aligned) |
| Team Project: **OpenSpace 3D export** | Not in v2.0.0 production UI | — | **HISTORICAL_ONLY** | Optional future; do not claim in README |
| Team Project: **no AI images in submission** | Repo uses original shark SVG illustrations | `public/sharks/` | **PASS** | — |
| Award: **NYC Best Use of Gemini API** | Stated consistently in README, Help, CITATION | README, event records | **PASS** | Never “NASA Global Winner” without evidence |
| **Oct 2025 hackathon prototype** vs **post-hackathon v2.x** | v1 Gemini-invented points; v2 NASA pipeline + tests + Pixel | CHANGELOG, git history | **QUALIFIED** | Timeline documented in README/CHANGELOG |

## Challenge requirements (A–D)

| Req | Topic | Verdict | Notes |
|---|---|---|---|
| **A** | Mathematical framework | **QUALIFIED** | Deterministic heuristic + optional Gemini ranking on NASA cells; not occupancy/SDM validation |
| **B** | Conceptual tag model | **QUALIFIED** | Documented + typed; not deployed; SYNTHETIC fixtures only |
| **C** | Shark identification concept | **QUALIFIED** | Reframed as environmental habitat-hotspot exploration; no satellite shark ID |
| **D** | Habitat / foraging hotspot prediction | **QUALIFIED** | Exploratory scores from SST/chlorophyll; no validated foraging forecast |

## Mathematical framework (production)

Documented in `shared/scoring.ts` and `docs/data/SCIENTIFIC_LIMITATIONS.md`:

1. **SST suitability** — piecewise thermal envelope (exploratory, not species-specific).
2. **Chlorophyll productivity proxy** — log-scaled chlorophyll-a suitability.
3. **SST gradient boost** — local neighbor SST difference (front proxy, not SWOT eddy product).
4. **Combined score** — `0.55·SST + 0.35·chl + gradient`, capped 0.01–0.99.
5. **Gemini** — ranks and explains **existing cell ids** only; does not observe sharks.

Not claimed: validated species distribution model, 24–72h forecast, bathymetry, tag fusion.

## Timeline: hackathon vs v2.x

| Phase | Date | Character |
|---|---|---|
| NASA Space Apps NYC hackathon prototype | Oct 4–6, 2025 (NYC local event; global challenge Oct 4–5) | Pitch + demo; Gemini-generated plausible points; Worker stub |
| Post-hackathon engineering | 2025–Aug 2026 | NASA GIBS ingest, R2 cache, Gemini 3.6 Flash, tests, Android/Pixel |
| **v2.0.0 published** | 2026-08-17 | Production Pages + Worker; tag model conceptual-only |

## Recommended public wording

- ✅ “AI-assisted shark **habitat-hotspot exploration**”
- ✅ “Environmental hotspot scoring from NASA SST and chlorophyll-a”
- ✅ “NYC Best Use of Gemini API — NASA Space Apps Challenge 2025”
- ❌ “Shark detection,” “real-time shark tracking,” “encounter-risk,” “SharkSafe Index” (unless implemented)
- ❌ “NASA Global Winner” (no evidence)

## Cross-reference

Full evidence rows: [CLAIMS_EVIDENCE_MATRIX.md](./CLAIMS_EVIDENCE_MATRIX.md)

Conceptual tag: [../challenge/CONCEPTUAL_SHARK_TAG_MODEL.md](../challenge/CONCEPTUAL_SHARK_TAG_MODEL.md)
