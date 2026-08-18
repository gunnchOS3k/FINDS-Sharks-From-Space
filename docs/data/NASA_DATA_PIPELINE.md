# NASA data pipeline

FINDS live mode uses official NASA Global Imagery Browse Services (GIBS), documented at [GIBS access basics](https://nasa-gibs.github.io/gibs-api-docs/access-basics/) and [Earthdata GIBS APIs](https://www.earthdata.nasa.gov/engage/open-data-services-software/earthdata-developer-portal/gibs-api). Visitors do not need Earthdata login. The Worker holds any optional Gemini key.

## Products

| Variable | GIBS layer | Science dataset | Notes |
|---|---|---|---|
| Sea-surface temperature | `GHRSST_L4_MUR_Sea_Surface_Temperature` | `MUR-JPL-L4-GLOB-v4.1` (CMR `C1996881146-POCLOUD`) | Level-4 foundation SST analysis, daily |
| Chlorophyll-a | `OCI_PACE_Chlorophyll_a` (fallback `VIIRS_NOAA20_Chlorophyll_a`) | `PACE_OCI_L2_BGC` | Daily ocean-color visualization; swath gaps possible |

Numeric values are decoded from WMS PNG responses using official GIBS colormaps:

- https://gibs.earthdata.nasa.gov/colormaps/v1.3/GHRSST_Sea_Surface_Temperature.xml (°C)
- https://gibs.earthdata.nasa.gov/colormaps/v1.3/VIIRS_Chlorophyll.xml (mg/m³)

GIBS GetFeatureInfo is not enabled on this endpoint. Earthdata granule/OPeNDAP NetCDF is not required for the public live path.

## Flow

1. Region → documented bbox.
2. WMTS DescribeDomains selects the latest MUR SST date.
3. WMS GetMap PNG for SST and chlorophyll over that bbox.
4. Each pixel center becomes a candidate lat/lon (the observation grid).
5. RGB → physical value via colormap; nodata/land/gaps dropped.
6. Deterministic scoring; Gemini may rank/explain those ids only.
7. R2 cache keyed by region, bbox, date, variables, model, pipeline version. Gemini timeouts/HTTP errors are not stored as HIT; they are retried on the next request.

Gemini never supplies coordinates in live mode.
