# Pixel 6a validation

Device serial numbers are intentionally omitted.

| Field | Value |
|---|---|
| Device | Google Pixel 6a (`bluejay`) |
| Android | 17 (SDK 35 target / device report 17) |
| Package | `com.gunnchos.finds` |
| Display name | FINDS — Sharks From Space |
| App version | `2.0.0` (versionCode 2) |
| APK variant | debug (`assembleDebug`), Capacitor 7 WebView |
| Validation time | 2026-08-17 (America/Chicago) |
| Git | branch `cursor/finds-public-release-pixel6a` |
| Permissions observed | `INTERNET` only (no camera, no location) |

The debug APK used for the live NASA cases was built with `VITE_API_BASE=http://<LAN>:8787` against a local Wrangler process on the attached workstation. That Worker is **not** the public Cloudflare deployment. A default `npm run build` without `VITE_API_BASE` still packages demo/offline fallback, which is what CI and visitors get until Pages/Worker are deployed.

## Cases

| Case | Result | Notes |
|---|---|---|
| Uninstall prior package | PASS | Clean install of this APK |
| Install debug APK | PASS | `adb install -r` succeeded |
| Launch / process stays up | PASS | `pidof com.gunnchos.finds` non-empty |
| First-run onboarding | PASS | Welcome + disclaimer; Start exploring |
| Map renders | PASS | Deck.gl NY Bight + OSM tiles |
| Generate default region | PASS | Loading then cells |
| Live NASA path (local Worker) | PASS | `cache` + `HIT`, Obs. **2026-08-16**, Agency NASA, MUR SST + PACE chlorophyll |
| Select hotspot / cell details | PASS | Cell `41.023, -72.063`, score 0.99, SST 23.03 °C, chlorophyll-a 19.121 mg/m³ |
| Provenance panel | PASS | Products, datasets, pipeline 2026.08.1, colormap caveat |
| Switch region control | PASS | Region `<select>` present (NY Bight default exercised) |
| Shark gallery open/close | PASS | Original SVG cards, not photographs |
| Help | PASS | Award, NASA/Gemini explanation, gesture table, disclaimer |
| Tap / list selection | PASS | Highest-scoring cell buttons |
| Pinch/spread | PARTIAL | Deck.gl two-finger zoom is implemented; adb swipe is not a conclusive pinch gesture |
| Shake | NOT RUN | Would need a physical shake; gallery button is the documented alternative |
| Background / resume | PASS | HOME then `am start` brought the task forward |
| Force-stop / reopen | PASS | Process gone after force-stop; new pid after launch |
| Airplane/offline radios | PASS | Wifi+data off → `demo` / `BYPASS` fixture; radios re-enabled after the test |
| Reconnect to Worker | PASS | Subsequent generate returned `cache HIT` for 2026-08-16 NASA day |
| logcat FATAL | PASS | No `FATAL EXCEPTION` / `AndroidRuntime` crash for the FINDS pid |
| Public Cloudflare URL on device | BLOCKED | No production Worker/Pages deploy from this workstation |

## Screenshots

| File | What it shows |
|---|---|
| [01-launch.png](../media/pixel6a/01-launch.png) | First screen / map + controls |
| [02-home-map.png](../media/pixel6a/02-home-map.png) | NY Bight heatmap after generate |
| [03-provenance.png](../media/pixel6a/03-provenance.png) | NASA products/datasets expanded |
| [04-shark-gallery.png](../media/pixel6a/04-shark-gallery.png) | Species cards |
| [05-selected-hotspot.png](../media/pixel6a/05-selected-hotspot.png) | Selected cell with SST + chlorophyll |
| [06-offline.png](../media/pixel6a/06-offline.png) | Demo fallback with radios off |
| [07-help.png](../media/pixel6a/07-help.png) | Help / About |

## Remaining limitations

- Production `https://finds-web.pages.dev` returned 404 on 2026-08-17; Pixel live NASA used a **local** Worker.
- Gemini was not configured (`geminiKey: missing`); scores were deterministic NASA-derived scores, which is the designed fallback.
- The control panel covers a large fraction of the portrait map; critical buttons remain reachable.
