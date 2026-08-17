# ADR-001 Canonical client

Status: Accepted  
Date: 2026-08-17

## Context

The hackathon repository mixed a Vite web app, an Expo/React Native stub, Electron desktop files, and EAS placeholders. Android was not a tested Capacitor package. Camera and location permissions were requested by the RN stub even though the product does not use camera or GPS.

## Decision

The canonical UI is **Vite + React 18 + TypeScript**. Android is **Capacitor Android** wrapping the production web build (`com.gunnchos.finds`). PWA uses VitePWA only.

Expo, React Native, Metro, Babel (RN), EAS, and Electron are removed from the supported path. History remains in Git.

## Consequences

One tested UI runs on web, PWA, and Pixel 6a. Recruiter docs no longer claim App Store / Play Store / Windows shipping that this repository does not perform.
