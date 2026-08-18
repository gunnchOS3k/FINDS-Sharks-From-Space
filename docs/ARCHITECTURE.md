# Architecture

Canonical client: Vite + React + TypeScript, packaged as web/PWA and Capacitor Android.

```
Visitor → UI (Deck.gl) → POST /api/hotspots → Worker
  → R2 lookup
  → NASA GIBS SST + chlorophyll
  → colormap decode + grid
  → Gemini score/explain (optional)
  → R2 persist → JSON + provenance → map
```

Worker routes: `GET /health`, `GET /version`, `POST /api/hotspots` (aliases `/generate`, `/api/generate`).

CORS allowlists localhost, Capacitor origins, and the live Pages origin `https://finds-web-4j5.pages.dev` (the unused `https://finds-web.pages.dev` alias is kept). Production does not send `*`.

See UML in `docs/architecture/uml/`, [Edge IO](architecture/EDGE_IO.md), and [ADR-001](architecture/ADR-001-canonical-client.md).
