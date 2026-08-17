# Edge IO capability matrix

FINDS maps a small set of inputs to region/count/gallery actions. Map pan/zoom is owned by Deck.gl, not by custom device-motion code.

| Gesture | Desktop | Android WebView | Web / PWA |
|---|---|---|---|
| Arrow keys | Change region (up/down) or candidate count (left/right) | Same if a keyboard is attached | Same |
| `+` / `-` | Change candidate count | Same if a keyboard is attached | Same |
| Tap | Buttons and hotspot picking | Same | Same |
| Two-finger pinch/spread on the **map** | Deck.gl zoom | Deck.gl zoom | Deck.gl zoom |
| Two-finger pinch/spread on the **control panel** | Pointer-pair distance changes candidate count | Same | Same |
| Shake | Not applicable | `DeviceMotionEvent` toggles the shark gallery | Same where the browser exposes motion |

Camera and GPS are **not** used. The Android package requests `INTERNET` only.

Keyboard `+/-` is an additional candidate-count control. It is not a substitute claim for pinch-on-map.
