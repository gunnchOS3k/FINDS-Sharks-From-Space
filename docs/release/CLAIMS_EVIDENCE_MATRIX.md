# Claims vs evidence

Status values: **PASS** (implemented and evidenced), **PARTIAL** (implemented but not fully exercised in this environment), **FAIL** (claim not true), **BLOCKED** (implementation exists, external gate).

| Claim | Implementation | Test | Evidence | Status |
|---|---|---|---|---|
| Uses NASA SST | GIBS WMS `GHRSST_L4_MUR_Sea_Surface_Temperature` decoded via official colormap | Worker fixture + live WMS probe | `shared/nasa.ts`, `docs/data/NASA_DATA_PIPELINE.md` | PASS (adapter + live GIBS fetch from this workstation). Production Worker URL not deployed. |
| Uses NASA chlorophyll-a | GIBS WMS PACE OCI with VIIRS fallback | Same | `shared/nasa.ts` | PASS (same caveats) |
| Google Gemini scores NASA cells only | `mergeGeminiScores` ignores unknown ids; live path never asks Gemini for lat/lon | `tests/unit/pipeline.test.ts` | `shared/gemini.ts` | PASS for code. Live Gemini calls BLOCKED without `GEMINI_API_KEY` |
| Gemini is server-side only | Client calls Worker; no `VITE_` Gemini key | grep of `src/` and Vite env | `src/services/api.ts`, `.env.example` | PASS |
| Cloudflare Worker API | `GET /health`, `GET /version`, `POST /api/hotspots` | `tests/worker/worker.test.ts` | `api/worker/src/index.ts` | PASS locally. Production deploy BLOCKED |
| R2 read-through cache | MISS fetch + persist, HIT return | worker test HIT after MISS | `api/worker/src/index.ts` | PASS (Miniflare/mock R2). Production R2 BLOCKED |
| Deck.gl map | Heatmap + scatter + high-score icons | Playwright + Pixel screenshots | `src/components/MapView.tsx`, `docs/media/pixel6a/` | PASS |
| PWA installable | `vite-plugin-pwa` manifest + workbox | `tests/e2e/pwa.spec.ts` | `vite.config.ts` | PASS (automated offline shell). Store listing not claimed |
| Offline / demo mode | `/demo.json` when API unset, down, or offline | Playwright offline reload; Pixel demo pills | `public/demo.json`, Pixel `02-home-map.png` | PASS |
| Android APK | Capacitor 7, `com.gunnchos.finds` | `assembleDebug` + adb install | `android/`, `docs/release/PIXEL_6A_VALIDATION.md` | PASS (debug APK) |
| Pixel 6a verified | Physical install, launch, generate, gallery, help, background/resume, live NASA via local Worker | adb + WebView CDP | `docs/release/PIXEL_6A_VALIDATION.md`, `docs/media/pixel6a/` | PASS for exercised cases. Public Cloudflare URL on device BLOCKED |
| Gesture controls | Keyboard, tap, Deck.gl map pinch, panel pinch, shake | unit `classifyPinch`; Pixel tap/pinch swipe | `docs/architecture/EDGE_IO.md` | PASS with documented limits |
| NYC Best Use of Gemini API | Award copy in README/Help | Historical project claim | README, Help modal | PASS as stated award (not re-verified with NASA this session) |
| UML documented | 8 PlantUML sources + SVG | `npm run diagrams:check` | `docs/architecture/uml/` | PASS |
| Live public demo URL | Cloudflare Pages `finds-web` | HTTP GET | `https://finds-web.pages.dev` → 404 on 2026-08-17 | BLOCKED |
| Real-time shark / beach safety warning | None | N/A | Disclaimer in README, Help, onboarding, limitations | PASS (honestly **not** claimed as a warning system) |
