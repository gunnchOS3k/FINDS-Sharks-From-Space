# Claims vs evidence

Status values: **PASS** (implemented and evidenced in production), **PARTIAL** (implemented but not fully exercised in production), **FAIL**, **BLOCKED** (external gate).

Last updated: production closeout branch `cursor/finds-production-closeout-v2`, HEAD `768fa76`.

| Claim | Implementation | Test | Evidence | Status |
|---|---|---|---|---|
| Uses NASA SST | GIBS WMS MUR L4 SST + official colormap | Worker fixture + live probe | `shared/nasa.ts` | PASS (adapter). Production Worker **BLOCKED** (deploy pending R2 enablement) |
| Uses NASA chlorophyll-a | GIBS PACE/VIIRS fallback | Same | `shared/nasa.ts` | PASS (adapter). Production **BLOCKED** |
| Gemini 3.6 Flash scores NASA cells only | `DEFAULT_GEMINI_MODEL=gemini-3.6-flash`; `mergeGeminiScores` drops unknown ids | `tests/unit/pipeline.test.ts` | `shared/gemini.ts`, [Google model docs](https://ai.google.dev/gemini-api/docs/models/gemini-3.6-flash) | PASS (code + model migration). Live Gemini **BLOCKED** (Worker not deployed) |
| Gemini server-side only | Client → Worker; no `VITE_` Gemini key | grep `src/` | `src/services/api.ts` | PASS |
| Cloudflare Worker API | `/health`, `/version`, `POST /api/hotspots` | `tests/worker/worker.test.ts` | `api/worker/src/index.ts` | PASS locally. Live Worker **BLOCKED** |
| R2 read-through cache | MISS persist, HIT return | worker integration test | `api/worker/src/index.ts` | PASS (mock). Production R2 **BLOCKED** (Cloudflare API 10042 — R2 not enabled) |
| Deck.gl map | Heatmap + scatter | Playwright + Pixel screenshots | `src/components/MapView.tsx` | PASS |
| PWA installable | vite-plugin-pwa | `tests/e2e/pwa.spec.ts` | `vite.config.ts` | PASS (automated). Live Pages **BLOCKED** |
| Offline / demo mode | `/demo.json` fallback | Playwright + Pixel | `public/demo.json` | PASS |
| Android APK | Capacitor 7, `com.gunnchos.finds` v2.0.0 | `assembleDebug` + adb | `android/` | PARTIAL — debug APK from prior session; production build requires `FINDS_WORKER_URL` |
| Pixel 6a verified | Physical device tests | adb | `docs/release/PIXEL_6A_VALIDATION.md` | PARTIAL — prior session used local Worker; production path **BLOCKED** |
| Pinch / spread | Deck.gl + panel pointer pair | unit + physical | `src/services/edgeio.ts` | PARTIAL — physical pinch/spread not conclusively PASS on production |
| Shake | DeviceMotionEvent → gallery | unit + physical | `src/services/edgeio.ts` | BLOCKED — physical shake not yet verified on production |
| NYC Best Use of Gemini API | README / Help | historical | README | PASS (stated award) |
| UML (8 diagrams) | PlantUML + SVG | `npm run diagrams:check` | `docs/architecture/uml/` | PASS |
| CI green | lint, typecheck, unit, integration, build, e2e, android | GitHub Actions `ci.yml` | Actions tab | PASS on branch push |
| Deploy pipeline | hardened `deploy.yml` + R2 diagnostics | workflow_dispatch run 32076275026 | Actions deploy run | BLOCKED — R2 not enabled (10042); S3 diagnostic SSL fail (R2 unprovisioned) |
| Security (no secrets in bundle) | audit scripts + grep | manual + CI | `.gitignore`, `scripts/test-production.mjs` | PASS (`dist/` scan clean) |
| Real-time shark warning | Not claimed | N/A | Disclaimer everywhere | PASS (honestly not claimed) |

## Production closeout gates (2026-08-17)

| Gate | Status | Notes |
|---|---|---|
| OWNER_SECRET_CONFIGURATION_PASS | PASS | All 5 secret names present via `gh secret list` |
| R2_ACCOUNT_MATCH_PASS | PASS | Deploy preflight run 32076275026 |
| R2_S3_AUTH_PASS | FAIL | Deploy run 32076275026 — SSL handshake (R2 endpoint unprovisioned) |
| R2_BINDING_PASS | BLOCKED | `wrangler.toml` binding correct; bucket create blocked by 10042 |
| LIVE_WORKER_PASS | BLOCKED | Worker not deployed |
| LIVE_PAGES_PASS | BLOCKED | Pages not deployed |
| GEMINI_PRODUCTION_PASS | BLOCKED | Worker not deployed |
| GEMINI_3_6_MIGRATION_PASS | PASS | code + wrangler.toml + tests default `gemini-3.6-flash` |
| GEMINI_DATA_INTEGRITY_PASS | PASS | `mergeGeminiScores` drops unknown ids; pipeline tests green |
| NASA_PRODUCTION_PASS | BLOCKED | needs live Worker |
| R2_MISS_HIT_PASS | BLOCKED | R2 not enabled (Cloudflare 10042) |
| PRODUCTION_SMOKE_PASS | BLOCKED | no `FINDS_WORKER_URL` |
| BUILD_PASS | PASS | `npm run verify` green |
| TEST_PASS | PASS | 15 unit/integration + 6 e2e |
| CI_PASS | PASS | branch CI green |
| PWA_PASS | PASS | e2e offline shell; live Pages **BLOCKED** |
| ANDROID_APK_PASS | BLOCKED | production build requires `FINDS_WORKER_URL` |
| PIXEL_6A_PRODUCTION_PASS | BLOCKED | needs production Worker URL |
| PINCH_PASS / SPREAD_PASS / SHAKE_PASS | BLOCKED | needs production APK retest |
| ACCESSIBILITY_PASS | PASS | axe e2e — no serious violations |
| UML_PASS | PASS | 8 diagrams |
| SECURITY_PASS | PASS | no secrets in `dist/` |
| PUBLIC_EXPLANATION_PASS | PASS | README honest about pending deploy |
| RECRUITER_REVIEW_PASS | PASS | Edmund + Yasmine credit preserved |
| CLAIMS_EVIDENCE_PASS | PASS | this matrix updated honestly |
| V2_DRAFT_RELEASE_PASS | BLOCKED | awaiting production deploy |
| RELEASE_READY_PASS | BLOCKED | R2 enablement required |
