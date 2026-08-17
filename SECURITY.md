# Security Policy

## Supported versions

The `main` branch and tagged releases of FINDS.

## Reporting a vulnerability

Email the maintainers via the GitHub account listed on [github.com/gunnchOS3k](https://github.com/gunnchOS3k). Do not open a public issue for suspected secret leaks.

## What FINDS stores

- Gemini API keys belong only in Worker secrets / `.dev.vars`, never in Vite `VITE_*` variables.
- NASA GIBS is unauthenticated. No Earthdata token is required for the public path; if one is added later it must stay server-side.
- Logs must not include Authorization headers, API keys, or `.dev.vars`.

## Disclosure

Please allow a reasonable window to rotate credentials before public write-ups.
