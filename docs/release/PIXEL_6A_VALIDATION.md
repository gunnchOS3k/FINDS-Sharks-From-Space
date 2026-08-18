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
| Accepted SHA | `c278584` (production closeout after R2 enablement) |
| Production Worker URL | `https://finds-worker.gunnchos-finds.workers.dev` |
| Production Pages URL | `https://finds-web-4j5.pages.dev` |
| Validation time | 2026-08-17 (America/Chicago) |

## 2026-08-18 follow-up (this effort)

ADB listed a connected device in `unauthorized` state. `adb shell getprop ro.product.model` did not run. No reinstall or smoke of `com.gunnchos.finds` was performed in this follow-up.

Prior Pixel 6a evidence on `main` remains the hardware record: package `com.gunnchos.finds`, `versionName` `2.0.0`, `versionCode` 2. Git history after accepted SHA `c278584` does not change the Android applicationId, version, or production Worker URL. Screenshots in [docs/media/pixel6a/](../media/pixel6a/) are still present.

To re-exercise: tap **Allow** on the Pixel USB debugging prompt, then `npm run android:install`.

## Production closeout status

| Case | Result | Notes |
|---|---|---|
| Install / launch | PASS | Production APK built with `FINDS_WORKER_URL`; v2.0.0 installed on Pixel 6a |
| adb reverse cleared | PASS | No reverse tunnels before launch |
| Local servers stopped | PASS | No local Worker/Pages dev servers during acceptance |
| logcat FATAL | PASS | No `FATAL EXCEPTION` for `com.gunnchos.finds` after launch |
| Production Worker on device | PASS | APK bundle embeds production Worker host (not localhost) |
| Generate NY Bight (production) | PASS | Live map + provenance; Worker `/api/hotspots` returns NASA + `gemini-3.6-flash` |
| R2 cache (production) | PASS | Live Worker returns `x-cache: HIT` on repeat request |
| Offline demo | PARTIAL | Prior session PASS; production offline toggle not re-screenshot this run |
| Background / force-stop / reopen | PARTIAL | Launch/resume observed; full cycle not re-screenshot |
| Pinch | PASS | WebView CDP `PointerEvent` pair on `.panel`: candidate cells 100 → 80 (−20) |
| Spread | PASS | WebView CDP `PointerEvent` pair on `.panel`: candidate cells 80 → 100 (+20) |
| Shake | PASS | WebView CDP `DeviceMotionEvent` (‖a‖ > 22): shark gallery modal opened |

## Gesture verification method

Physical two-finger adb multi-touch and `cmd sensor` shake simulation were **not** available on this device (`InputDispatcher` rejected concurrent injected pointers; `cmd sensor` service missing).

Gesture handlers were verified **programmatically on the physical Pixel 6a** running the production APK:

1. Forward `@webview_devtools_remote_<pid>` via adb.
2. Inject panel-targeted `PointerEvent` pairs (pinch/spread) and `DeviceMotionEvent` (shake).
3. Observe UI state: candidate count delta ±20; `#gallery-title` modal visible after shake.

Screenshots: [docs/media/pixel6a/](../media/pixel6a/) (`09`–`16` production captures).

Optional human confirmation: two-finger pinch/spread on the control panel and a physical shake still recommended for demo video, but handler wiring is evidenced above.

## Evidence commands (no serial logged)

```bash
FINDS_WORKER_URL=https://finds-worker.gunnchos-finds.workers.dev npm run android:build
npm run android:install
node scripts/pixel-acceptance.mjs
FINDS_WORKER_URL=https://finds-worker.gunnchos-finds.workers.dev FINDS_PAGES_URL=https://finds-web-4j5.pages.dev npm run test:production
```
