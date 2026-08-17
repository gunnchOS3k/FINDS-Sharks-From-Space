# Data provenance

Every hotspot response includes `provenance`:

| Field | Meaning |
|---|---|
| mode | `live` \| `cache` \| `demo` \| `offline` |
| sourceAgency | Always `NASA` for this pipeline |
| sourceProduct | GIBS layer identifiers actually fetched |
| sourceDataset | CMR/dataset short names |
| observationStart/End | Data day represented by GIBS TIME |
| retrievedAt | Worker fetch time |
| variables | SST °C and chlorophyll-a mg/m³ |
| qualityNotes | Gaps, fallbacks, colormap decoding, Gemini status |
| model | Gemini model if used, else null |
| pipelineVersion | `2026.08.1` |
| cache | key, HIT/MISS/BYPASS, TTL |

Demo/offline fixtures use a deterministic New York Bight ocean grid and say so in `qualityNotes`. They are not live GIBS pulls and not Gemini-invented downtown coordinates.
