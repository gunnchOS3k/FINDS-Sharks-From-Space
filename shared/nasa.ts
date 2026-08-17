import { BUNDLED_CHL_COLORMAP, BUNDLED_SST_COLORMAP } from './colormapAssets';
import { buildLookup, lookupValue } from './colormap';
import { decodePng, sampleGrid } from './png';
import type { BBox, ObservationCell } from './types';

export const NASA_PRODUCTS = {
  sst: {
    layer: 'GHRSST_L4_MUR_Sea_Surface_Temperature',
    dataset: 'MUR-JPL-L4-GLOB-v4.1',
    collection: 'C1996881146-POCLOUD',
    title: 'GHRSST Level 4 MUR Global Foundation Sea Surface Temperature Analysis (v4.1)',
    units: 'degC',
    colormap: 'GHRSST_Sea_Surface_Temperature',
  },
  chlorophyll: {
    layer: 'OCI_PACE_Chlorophyll_a',
    fallbackLayer: 'VIIRS_NOAA20_Chlorophyll_a',
    dataset: 'PACE_OCI_L2_BGC',
    collection: 'C3620139680-OB_CLOUD',
    title: 'PACE OCI Level-2 Regional Ocean Biogeochemical Properties (chlorophyll-a visualization via NASA GIBS)',
    units: 'mg m-3',
    colormap: 'VIIRS_Chlorophyll',
  },
} as const;

const WMS = 'https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi';
const DOMAINS =
  'https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/wmts.cgi?SERVICE=WMTS&REQUEST=DescribeDomains&VERSION=1.0.0&LAYER=GHRSST_L4_MUR_Sea_Surface_Temperature&TILEMATRIXSET=2km';

const sstMap = BUNDLED_SST_COLORMAP;
const chlMap = BUNDLED_CHL_COLORMAP;
const sstLookup = buildLookup(sstMap);
const chlLookup = buildLookup(chlMap);

export interface NasaFetchResult {
  cells: ObservationCell[];
  observationDate: string;
  retrievedAt: string;
  layersUsed: string[];
  qualityNotes: string[];
}

function utcDate(offsetDays: number): string {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() + offsetDays);
  return date.toISOString().slice(0, 10);
}

export function parseLatestDomainDate(xml: string, fallback = utcDate(-2)): string {
  const match = xml.match(/<Domain>([^<]+)<\/Domain>/);
  if (!match) return fallback;
  const parts = match[1].split(',');
  const last = parts[parts.length - 1] ?? '';
  const end = last.split('/')[1] ?? last.split('/')[0];
  return /^\d{4}-\d{2}-\d{2}$/.test(end) ? end : fallback;
}

export async function resolveObservationDate(fetchImpl: typeof fetch = fetch): Promise<string> {
  try {
    const response = await fetchImpl(DOMAINS);
    if (!response.ok) return utcDate(-2);
    return parseLatestDomainDate(await response.text());
  } catch {
    return utcDate(-2);
  }
}

function wmsUrl(layer: string, bbox: BBox, time: string, size: number): string {
  const [west, south, east, north] = bbox;
  const params = new URLSearchParams({
    SERVICE: 'WMS',
    VERSION: '1.3.0',
    REQUEST: 'GetMap',
    LAYERS: layer,
    STYLES: '',
    CRS: 'EPSG:4326',
    BBOX: `${south},${west},${north},${east}`,
    WIDTH: String(size),
    HEIGHT: String(size),
    FORMAT: 'image/png',
    TIME: time,
    TRANSPARENT: 'TRUE',
  });
  return `${WMS}?${params.toString()}`;
}

async function fetchLayerPng(
  layer: string,
  bbox: BBox,
  time: string,
  size: number,
  fetchImpl: typeof fetch,
): Promise<Uint8Array> {
  const response = await fetchImpl(wmsUrl(layer, bbox, time, size));
  if (!response.ok) {
    throw new Error(`NASA GIBS WMS failed for ${layer}: HTTP ${response.status}`);
  }
  const type = response.headers.get('content-type') ?? '';
  const bytes = new Uint8Array(await response.arrayBuffer());
  if (!type.includes('png') && (bytes[0] !== 137 || bytes[1] !== 80)) {
    throw new Error(`NASA GIBS WMS returned a non-PNG body for ${layer}`);
  }
  return bytes;
}

export async function fetchNasaObservations(
  bbox: BBox,
  options: { gridSize?: number; fetchImpl?: typeof fetch; observationDate?: string } = {},
): Promise<NasaFetchResult> {
  const fetchImpl = options.fetchImpl ?? fetch;
  const gridSize = options.gridSize ?? 24;
  const retrievedAt = new Date().toISOString();
  const observationDate = options.observationDate ?? (await resolveObservationDate(fetchImpl));
  const qualityNotes: string[] = [];
  const layersUsed: string[] = [NASA_PRODUCTS.sst.layer];

  const sstBytes = await fetchLayerPng(NASA_PRODUCTS.sst.layer, bbox, observationDate, gridSize, fetchImpl);
  let chlBytes: Uint8Array;
  try {
    chlBytes = await fetchLayerPng(NASA_PRODUCTS.chlorophyll.layer, bbox, observationDate, gridSize, fetchImpl);
    layersUsed.push(NASA_PRODUCTS.chlorophyll.layer);
  } catch {
    chlBytes = await fetchLayerPng(
      NASA_PRODUCTS.chlorophyll.fallbackLayer,
      bbox,
      observationDate,
      gridSize,
      fetchImpl,
    );
    layersUsed.push(NASA_PRODUCTS.chlorophyll.fallbackLayer);
    qualityNotes.push('PACE OCI chlorophyll WMS failed; used NOAA-20 VIIRS chlorophyll GIBS layer.');
  }

  const sstImage = await decodePng(sstBytes);
  const chlImage = await decodePng(chlBytes);
  const sstSamples = sampleGrid(sstImage, bbox);
  const chlSamples = sampleGrid(chlImage, bbox);
  const cells: ObservationCell[] = [];

  for (let i = 0; i < sstSamples.length; i += 1) {
    const sst = sstSamples[i];
    const chl = chlSamples[i] ?? sst;
    const sstC = lookupValue(sstLookup, sstMap.entries, sst.r, sst.g, sst.b, sst.a);
    const chlorophyllMgM3 = lookupValue(chlLookup, chlMap.entries, chl.r, chl.g, chl.b, chl.a);
    const notes: string[] = [];
    if (sstC === null) notes.push('SST nodata or land/cloud gap in GIBS visualization.');
    if (chlorophyllMgM3 === null) notes.push('Chlorophyll-a nodata or swath gap in GIBS visualization.');
    if (sstC === null && chlorophyllMgM3 === null) continue;
    cells.push({
      id: `obs-${i}`,
      lat: Math.round(sst.lat * 1e5) / 1e5,
      lon: Math.round(sst.lon * 1e5) / 1e5,
      sstC: sstC === null ? null : Math.round(sstC * 100) / 100,
      chlorophyllMgM3: chlorophyllMgM3 === null ? null : Math.round(chlorophyllMgM3 * 1000) / 1000,
      qualityNotes: notes,
    });
  }

  qualityNotes.push(
    'Values are decoded from NASA GIBS WMS visualizations using official GIBS colormaps, not original NetCDF granules.',
  );
  qualityNotes.push(
    'MUR SST is a Level-4 foundation SST analysis. PACE/VIIRS chlorophyll GIBS layers are daily visualizations of ocean-color retrievals and may contain swath gaps.',
  );

  return { cells, observationDate, retrievedAt, layersUsed, qualityNotes };
}
