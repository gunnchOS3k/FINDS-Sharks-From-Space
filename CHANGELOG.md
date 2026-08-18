# Changelog

## Unreleased

- Allowlist the live Pages origin `https://finds-web-4j5.pages.dev` in Worker CORS defaults (keep the unused `finds-web.pages.dev` alias).
- Record published v2.0.1 notes and refresh the release checklist against live Pages/Worker URLs.
- Do not persist Gemini timeouts in R2; bypass poisoned cache entries; raise Gemini timeout to 45s and cap scored cells at 40 (`pipelineVersion` `2026.08.2`).

## 2.0.1 — 2026-08-18

Documentation and public-metadata alignment: Space Apps claim mapping, conceptual tag model (not deployed), UML live vs conceptual boundaries, GitHub description/homepage. No Worker, scoring, or Android package behavior change from v2.0.0.

## 2.0.0 — 2026-08-17

Public-release hardening: canonical Vite/Capacitor client, NASA GIBS SST + chlorophyll ingest, server-side Gemini, R2 read-through cache, tests, UML, PWA assets, Pixel 6a validation workstream.

## 1.0.0 — 2025

NASA Space Apps NYC hackathon prototype. Gemini-generated plausible points, Deck.gl UI, Worker stub.
