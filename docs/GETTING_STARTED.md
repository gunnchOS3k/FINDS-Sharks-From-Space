# Getting started

## Demo (no secrets)

```bash
npm ci
npm run dev
```

Open http://localhost:3000. Generate uses `/demo.json` if `VITE_API_BASE` is unset or the Worker is down.

## Live Worker

1. Copy `.env.example` to `api/worker/.dev.vars`.
2. Set `GEMINI_API_KEY` (server-side only). Optional: `GEMINI_MODEL=gemini-3.6-flash` (production default).
3. `npm run worker:dev`
4. `VITE_API_BASE=http://127.0.0.1:8787 npm run dev`

Earthdata login is not required for the public NASA GIBS path.

## Tests and release gate

```bash
npm run verify
```

Playwright: `npx playwright install chromium` then `npm run test:e2e`.

## Android

Requires **JDK 21+** (Capacitor 7) and `ANDROID_HOME`. This release was built with OpenJDK 21 or 25; JDK 17 fails with `invalid source release: 21`.

```bash
npm run build
npx cap add android   # first time only
npm run android:sync
npm run android:build
npm run android:install
npm run android:launch
```

Package: `com.gunnchos.finds`. Display name: FINDS — Sharks From Space.
