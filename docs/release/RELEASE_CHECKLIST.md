# Release checklist

Recorded against `main` at `7ba7dcc` plus follow-up branch `cursor/finds-public-release-pixel6a-followup`. Checkmarks mean the item was executed and evidenced, not that every historical URL still exists.

- [x] `npm run lint`, `typecheck`, unit, integration, `diagrams:check`, `build` (`npm run verify`)
- [x] Playwright e2e (chromium) including axe on primary screens and PWA offline shell
- [x] Worker unit/integration: `/health`, invalid method, invalid region, NASA fixture MISS then HIT
- [x] Live NASA GIBS WMS probe (SST + chlorophyll PNG HTTP 200)
- [x] Production Worker `/health`, `/version`, and live `POST /api/hotspots` at `https://finds-worker.gunnchos-finds.workers.dev`
- [x] Production Pages at `https://finds-web-4j5.pages.dev` (HTTP 200). The unused alias `https://finds-web.pages.dev` is not the live demo.
- [x] No `VITE_*` Gemini/Earthdata secrets; `.env.example` documents Worker-only keys
- [x] PWA icons and shark cards nonzero
- [x] Android debug APK installs on Pixel 6a (`com.gunnchos.finds`) — evidenced 2026-08-17; 2026-08-18 re-check found ADB unauthorized
- [x] Disclaimer visible in app Help, onboarding, README, and scientific limitations
- [x] README claims tracked in `docs/release/CLAIMS_EVIDENCE_MATRIX.md`
- [x] GitHub release `v2.0.1` published (docs/claim alignment only; do not mutate `v2.0.0`)
