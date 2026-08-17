# Claims vs evidence

Status values: **PASS** (implemented and evidenced in production), **PARTIAL** (implemented but not fully exercised in production), **FAIL**, **BLOCKED** (external gate).

Last updated: production closeout on `main`, HEAD `2e25bb3` (deploy run 32079503395 green).

| Claim | Implementation | Test | Evidence | Status |
|---|---|---|---|---|
| Uses NASA SST | GIBS WMS MUR L4 SST + official colormap | Worker fixture + live probe | `shared/nasa.ts` | PASS (adapter + production Worker) |
| Uses NASA chlorophyll-a | GIBS PACE/VIIRS fallback | Same | `shared/nasa.ts` | PASS (production) |
| Gemini 3.6 Flash scores NASA cells only | `DEFAULT_GEMINI_MODEL=gemini-3.6-flash`; `mergeGeminiScores` drops unknown ids | `tests/unit/pipeline.test.ts` | `shared/gemini.ts`, live `/version` | PASS |
| Gemini server-side only | Client → Worker; no `VITE_` Gemini key | grep `src/` | `src/services/api.ts` | PASS |
| Cloudflare Worker API | `/health`, `/version`, `POST /api/hotspots` | `tests/worker/worker.test.ts` + production smoke | `api/worker/src/index.ts` | PASS (live) |
| R2 read-through cache | MISS persist, HIT return | worker integration + live curl | `api/worker/src/index.ts` | PASS (production MISS/HIT) |
| Deck.gl map | Heatmap + scatter | Playwright + Pixel | `src/components/MapView.tsx` | PASS |
| PWA installable | vite-plugin-pwa | `tests/e2e/pwa.spec.ts` + live manifest | `vite.config.ts` | PASS |
| Offline / demo mode | `/demo.json` fallback | Playwright + Pixel | `public/demo.json` | PARTIAL (automated PASS; production Pixel offline not re-run) |
| Android APK | Capacitor 7, `com.gunnchos.finds` v2.0.0 | `assembleDebug` + adb | `android/` | PASS (production Worker build) |
| Pixel 6a verified | Physical device tests | adb + `scripts/pixel-acceptance.mjs` | `docs/release/PIXEL_6A_VALIDATION.md` | PARTIAL (install/launch/production API PASS; pinch/spread/shake BLOCKED) |
| Pinch / spread | Deck.gl + panel pointer pair | unit + physical | `src/services/edgeio.ts` | BLOCKED (physical not observed) |
| Shake | DeviceMotionEvent → gallery | unit + physical | `src/services/edgeio.ts` | BLOCKED (physical not observed) |
| NYC Best Use of Gemini API | README / Help | historical | README | PASS (stated award) |
| UML (8 diagrams) | PlantUML + SVG | `npm run diagrams:check` | `docs/architecture/uml/` | PASS |
| CI green | lint, typecheck, unit, integration, build, e2e, android | GitHub Actions `ci.yml` | Actions tab | PASS |
| Deploy pipeline | hardened `deploy.yml` + R2 diagnostics | deploy run 32079503395 | Actions deploy run | PASS |
| Security (no secrets in bundle) | audit scripts + grep | manual + CI | `.gitignore`, `scripts/test-production.mjs` | PASS |
| Real-time shark warning | Not claimed | N/A | Disclaimer everywhere | PASS (honestly not claimed) |

## Production closeout gates (2026-08-17)

| Gate | Status | Notes |
|---|---|---|
| OWNER_SECRET_CONFIGURATION_PASS | PASS | All 5 secret names present via `gh secret list` |
| R2_ENTITLEMENT_PASS | PASS | R2 diagnostic run 32078437322 |
| R2_ACCOUNT_MATCH_PASS | PASS | Deploy preflight + R2 diagnostic |
| R2_S3_AUTH_PASS | PASS | R2 diagnostic + deploy run 32079349660 |
| R2_BUCKET_PASS | PASS | `finds-results-prod` created/listed |
| R2_BINDING_PASS | PASS | `FIND_BUCKET` → `finds-results-prod` in wrangler.toml; `/health` r2 ok |
| R2_MISS_HIT_PASS | PASS | Live Worker MISS then HIT |
| GEMINI_SECRET_PASS | PASS | `wrangler secret put GEMINI_API_KEY` in deploy |
| GEMINI_3_6_MIGRATION_PASS | PASS | `/version` → `gemini-3.6-flash` |
| GEMINI_PRODUCTION_PASS | PASS | Live hotspots with Gemini provenance, no fallback notes |
| GEMINI_DATA_INTEGRITY_PASS | PASS | `mergeGeminiScores` + pipeline tests |
| NASA_PRODUCTION_PASS | PASS | Live `sourceAgency: NASA` + products in provenance |
| LIVE_WORKER_PASS | PASS | `https://finds-worker.gunnchos-finds.workers.dev` |
| LIVE_PAGES_PASS | PASS | `https://finds-web-4j5.pages.dev` (200 shell) |
| PRODUCTION_SMOKE_PASS | PASS | `npm run test:production` local + deploy smoke |
| PWA_PASS | PASS | manifest + icons on live Pages |
| BUILD_PASS | PASS | `npm run verify` green |
| TEST_PASS | PASS | 9 unit + 6 integration/worker + 6 e2e |
| CI_PASS | PASS | CI on main |
| ACCESSIBILITY_PASS | PASS | axe e2e — no serious violations |
| UML_PASS | PASS | 8 diagrams |
| SECURITY_PASS | PASS | no secrets in `dist/` or APK paths scanned |
| ANDROID_APK_PASS | PASS | Production Worker URL embedded |
| PIXEL_6A_PRODUCTION_PASS | PARTIAL | Install/launch/logcat PASS; gestures BLOCKED |
| PINCH_PASS / SPREAD_PASS / SHAKE_PASS | BLOCKED | Requires physical device observation |
| PUBLIC_EXPLANATION_PASS | PASS | README updated with live URLs |
| RECRUITER_REVIEW_PASS | PASS | Edmund Gunn Jr. + Yasmine Dweir credit preserved |
| CLAIMS_EVIDENCE_PASS | PASS | this matrix updated honestly |
| ACTIONS_CLEANUP_PASS | PASS | Retained ci, deploy, codeql, r2-diagnostic; discord-bot trimmed |
| V2_DRAFT_RELEASE_PASS | BLOCKED | Awaiting physical Pixel pinch/spread/shake |
| RELEASE_READY_PASS | BLOCKED | Physical pinch/spread/shake not observed |
