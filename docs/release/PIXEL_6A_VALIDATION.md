# Pixel 6a validation

Device serial numbers are intentionally omitted.

| Field | Value |
|---|---|
| Device | Google Pixel 6a (`bluejay`) |
| Android | 17 |
| Package | `com.gunnchos.finds` |
| Display name | FINDS — Sharks From Space |
| App version | `2.0.0` (versionCode 2) |
| Accepted branch | `main` |
| Accepted SHA | `2e25bb3` (production closeout after R2 enablement) |
| Production Worker URL | `https://finds-worker.gunnchos-finds.workers.dev` |
| Production Pages URL | `https://finds-web-4j5.pages.dev` |
| Validation time | 2026-08-17 (America/Chicago) |

## Production closeout status

| Case | Result | Notes |
|---|---|---|
| Install / launch | PASS | Production APK built with `FINDS_WORKER_URL`; streamed install via adb |
| adb reverse cleared | PASS | No reverse tunnels before launch |
| Local servers stopped | PASS | Wrangler dev on 8787 stopped before install |
| logcat FATAL | PASS | No `FATAL EXCEPTION` for `com.gunnchos.finds` after launch |
| Production Worker on device | PASS | APK bundle embeds production Worker host (not localhost) |
| Generate NY Bight (production) | PASS | Worker `/api/hotspots` returns NASA provenance + `gemini-3.6-flash` |
| R2 cache (production) | PASS | Verified MISS→HIT on live Worker |
| Offline demo | PARTIAL | Prior session PASS; production re-run pending explicit offline toggle |
| Background / force-stop / reopen | PARTIAL | Launch/resume observed; full cycle not re-screenshot |
| Pinch / spread | BLOCKED | Physical gesture not observed in this closeout run |
| Shake | BLOCKED | Physical shake not observed in this closeout run |

## Physical tests still required

Record `PINCH_PASS`, `SPREAD_PASS`, and `SHAKE_PASS` only after observed device behavior against the **production** APK.

## Screenshots

Prior local-Worker captures remain in [docs/media/pixel6a/](../media/pixel6a/). Production re-capture recommended after physical gesture verification.

## Evidence commands (no serial logged)

```bash
FINDS_WORKER_URL=https://finds-worker.gunnchos-finds.workers.dev npm run android:build
npm run android:install
node scripts/pixel-acceptance.mjs
```
