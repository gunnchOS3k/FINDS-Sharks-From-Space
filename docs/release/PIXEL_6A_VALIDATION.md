# Pixel 6a validation

Device serial numbers are intentionally omitted.

| Field | Value |
|---|---|
| Device | Google Pixel 6a (`bluejay`) |
| Android | 17 |
| Package | `com.gunnchos.finds` |
| Display name | FINDS — Sharks From Space |
| App version | `2.0.0` (versionCode 2) |
| Closeout branch | `cursor/finds-production-closeout-v2` |
| Accepted main SHA | `8f1e4de3a385aff662b3448e22eec1caf0ec559e` |
| Production Worker URL | **Pending deploy** (`FINDS_WORKER_URL` not set) |
| Validation time | 2026-08-17 (America/Chicago) |

## Status (production closeout)

Prior validation on `cursor/finds-public-release-pixel6a` exercised live NASA via a **local Wrangler Worker** on the workstation LAN. That path is **not** sufficient for production closeout.

Production Pixel acceptance requires:

1. Cloudflare R2 enabled and Worker deployed
2. `GEMINI_API_KEY` configured on `finds-worker`
3. `FINDS_WORKER_URL=… npm run android:build` (rejects localhost)
4. Fresh install on Pixel with no `adb reverse` and no local FINDS servers
5. Physical pinch, spread, and shake verification

## Prior exercised cases (local Worker — not production PASS)

| Case | Result | Notes |
|---|---|---|
| Install / launch | PASS | debug APK |
| Onboarding / Help | PASS | |
| Generate NY Bight | PASS | local Worker, NASA provenance |
| Map / hotspot select | PASS | screenshots in `docs/media/pixel6a/` |
| Offline demo | PASS | |
| Background / force-stop | PASS | |
| logcat FATAL | PASS | no crash observed |
| Pinch / spread | PARTIAL | not conclusively verified physically |
| Shake | NOT RUN | |
| Production Worker on device | BLOCKED | deploy pending |

## Screenshots

See [docs/media/pixel6a/](../media/pixel6a/) — captured during local-Worker session; production re-capture pending after deploy.

## Physical tests still required

- **Pinch / spread:** `PIXEL PHYSICAL TEST: Please pinch inward and then spread outward on the FINDS map now.`
- **Shake:** `PIXEL PHYSICAL TEST: Please physically shake the connected Pixel 6a now.`

Record `PINCH_PASS`, `SPREAD_PASS`, `SHAKE_PASS` only after observed device behavior against the **production** APK.
