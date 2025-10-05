# FINDS — Sharks From Space 🦈🌍
**Fin Identification & Navigation from Satellite**  
NASA Space Apps NYC | NYU (Edmund Gunn Jr, Yasmine Dweir)

FINDS identifies likely shark-activity hotspots by combining open NASA satellite data with AI-assisted feature scoring, stores results in Cloudflare **R2** (zero-egress), and renders interactive 3D visualizations in **OpenSpace**. A live **Edge IO** gesture toggles viz modes during demo.

## Architecture
```mermaid
flowchart LR
  A[NASA Open Data\n(MODIS/VIIRS, SST, Chl-a)] --> B[Ingest Script]
  B --> R2[(Cloudflare R2 bucket)]
  R2 --> C[Google AI Studio\n(Gemini; code-gen + scoring)]
  C --> R2
  R2 --> W[Cloudflare Worker\n(serve JSON/tiles)]
  W --> O[OpenSpace overlay\n(heatmap/markers)]
  E[Edge IO gesture] --> O
