# FINDS — Sharks From Space 🦈🌍

**Fin Identification & Navigation from Satellite**  
**NASA Space Apps NYC | NYU (Edmund Gunn Jr, Yasmine Dweir)**

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
![Status](https://img.shields.io/badge/status-hackathon--prototype-blue)
![Built with](https://img.shields.io/badge/AI-Gemini%20%7C%20R2%20%7C%20OpenSpace%20%7C%20Edge%20IO-6f42c1)

FINDS identifies likely shark-activity hotspots by combining open NASA satellite data with AI-assisted feature scoring, stores results in **Cloudflare R2** (zero-egress), and renders interactive 3D visualizations in **OpenSpace**. A live **Edge IO** gesture toggles viz modes during the demo.

---

## Architecture

> GitHub’s Mermaid requires HTML `<br/>` for line breaks and quoted labels. (Docs: “Creating diagrams”.) 

```mermaid
flowchart LR
  A["NASA Open Data<br/>(MODIS/VIIRS, SST, Chl-a)"] --> B["Ingest & ETL"]
  B --> R2[(Cloudflare R2<br/>object store)]
  R2 --> AI["Google AI Studio (Gemini)<br/>code-gen & hotspot scoring"]
  AI --> R2
  R2 --> W["Cloudflare Worker<br/>serve JSON/tiles"]
  W --> O["OpenSpace overlay<br/>heatmap + markers"]
  E["Edge IO gesture"] -.toggle.-> O
