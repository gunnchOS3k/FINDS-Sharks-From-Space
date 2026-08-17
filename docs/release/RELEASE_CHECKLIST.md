# Release checklist

Recorded against branch `cursor/finds-public-release-pixel6a`. Checkmarks mean the item was executed in this effort, not that every public URL is live.

- [x] `npm run lint`, `typecheck`, unit, integration, `diagrams:check`, `build` (`npm run verify`)
- [x] Playwright e2e (chromium) including axe on primary screens and PWA offline shell
- [x] Worker unit/integration: `/health`, invalid method, invalid region, NASA fixture MISS then HIT
- [x] Live NASA GIBS WMS probe from this workstation (SST + chlorophyll PNG HTTP 200)
- [ ] Production Worker `/health` and live `/api/hotspots` — blocked: local Wrangler not authenticated; Pages URL 404
- [x] No `VITE_*` Gemini/Earthdata secrets; `.env.example` documents Worker-only keys
- [x] PWA icons and shark cards nonzero
- [x] Android debug APK installs on Pixel 6a (`com.gunnchos.finds`)
- [x] Disclaimer visible in app Help, onboarding, README, and scientific limitations
- [x] README claims tracked in `docs/release/CLAIMS_EVIDENCE_MATRIX.md`
