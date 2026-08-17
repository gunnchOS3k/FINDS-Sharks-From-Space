import type { BBox, RegionDefinition } from './types';

export type { BBox };

export const REGIONS: RegionDefinition[] = [
  {
    id: 'new-york-bight',
    name: 'New York Bight',
    description:
      'Coastal Atlantic from New Jersey through Long Island, including the continental shelf east of New York Harbor.',
    bbox: [-74.5, 39.5, -71.5, 41.2],
    view: { longitude: -73.2, latitude: 40.3, zoom: 7, pitch: 40, bearing: 0 },
  },
  {
    id: 'california-coast',
    name: 'California Coast',
    description: 'Eastern Pacific from Point Conception through the Southern and Central California Bight.',
    bbox: [-125.0, 32.5, -117.0, 38.5],
    view: { longitude: -121.5, latitude: 35.5, zoom: 6, pitch: 40, bearing: 0 },
  },
  {
    id: 'florida-keys',
    name: 'Florida Keys',
    description: 'Shallow subtropical waters of the Florida Reef Tract and Straits of Florida.',
    bbox: [-83.5, 23.8, -79.8, 26.0],
    view: { longitude: -81.6, latitude: 24.7, zoom: 7, pitch: 40, bearing: 0 },
  },
  {
    id: 'great-barrier-reef',
    name: 'Great Barrier Reef',
    description: 'Northeastern Australian shelf-edge reef system in the Coral Sea.',
    bbox: [142.0, -24.5, 153.0, -10.0],
    view: { longitude: 147.5, latitude: -17.5, zoom: 5, pitch: 35, bearing: 0 },
  },
  {
    id: 'hawaiian-islands',
    name: 'Hawaiian Islands',
    description: 'Central North Pacific waters surrounding the main Hawaiian Islands.',
    bbox: [-160.5, 18.5, -154.5, 22.5],
    view: { longitude: -157.5, latitude: 20.5, zoom: 6, pitch: 40, bearing: 0 },
  },
  {
    id: 'mediterranean-sea',
    name: 'Mediterranean Sea',
    description: 'Semi-enclosed sea between southern Europe, North Africa, and the Levant.',
    bbox: [0.0, 30.0, 36.0, 46.0],
    view: { longitude: 18.0, latitude: 38.0, zoom: 5, pitch: 30, bearing: 0 },
  },
];

export function normalizeRegionName(input: string): string {
  return input.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export function findRegion(input: string): RegionDefinition | null {
  const needle = normalizeRegionName(input);
  return (
    REGIONS.find((region) => region.id === needle || normalizeRegionName(region.name) === needle) ??
    null
  );
}

export function isValidBBox(bbox: unknown): bbox is BBox {
  if (!Array.isArray(bbox) || bbox.length !== 4) return false;
  const [west, south, east, north] = bbox;
  if (![west, south, east, north].every((n) => typeof n === 'number' && Number.isFinite(n))) {
    return false;
  }
  if (west < -180 || east > 180 || south < -90 || north > 90) return false;
  if (west >= east || south >= north) return false;
  const width = east - west;
  const height = north - south;
  if (width > 40 || height > 30) return false;
  return true;
}

export function regionToBBox(regionName: string, override?: BBox): BBox {
  if (override && isValidBBox(override)) return override;
  const region = findRegion(regionName);
  if (!region) {
    throw new Error(`Unsupported region: ${regionName}`);
  }
  return region.bbox;
}
