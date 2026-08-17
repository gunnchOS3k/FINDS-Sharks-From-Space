export interface ColorEntry {
  r: number;
  g: number;
  b: number;
  value: number | null;
  nodata: boolean;
}

export interface ParsedColormap {
  title: string;
  units: string;
  entries: ColorEntry[];
}

function midpoint(spec: string | undefined): number | null {
  if (!spec) return null;
  const match = spec.match(/(-INF|INF|-?\d+(?:\.\d+)?)\s*,\s*(-INF|INF|-?\d+(?:\.\d+)?)/);
  if (!match) return null;
  const lo = match[1] === '-INF' ? Number.NEGATIVE_INFINITY : Number(match[1]);
  const hi = match[2] === 'INF' ? Number.POSITIVE_INFINITY : Number(match[2]);
  if (!Number.isFinite(lo) && Number.isFinite(hi)) return hi;
  if (Number.isFinite(lo) && !Number.isFinite(hi)) return lo;
  if (!Number.isFinite(lo) && !Number.isFinite(hi)) return null;
  return (lo + hi) / 2;
}

export function parseColormapXml(xml: string): ParsedColormap {
  const mapMatch = xml.match(/<ColorMap title="(?!No Data)([^"]*)"[^>]*units="([^"]+)"[^>]*>([\s\S]*?)<\/ColorMap>/);
  if (!mapMatch) {
    throw new Error('Colormap XML missing a titled ColorMap with units.');
  }
  const entries: ColorEntry[] = [];
  const entryRe = /<ColorMapEntry\b([^>]*)\/>/g;
  let found: RegExpExecArray | null;
  while ((found = entryRe.exec(xml))) {
    const attrs = found[1];
    const rgb = attrs.match(/rgb="(\d+),(\d+),(\d+)"/);
    if (!rgb) continue;
    const nodata = /nodata="true"/.test(attrs) || /transparent="true"/.test(attrs);
    const valueAttr = attrs.match(/value="([^"]*)"/);
    entries.push({
      r: Number(rgb[1]),
      g: Number(rgb[2]),
      b: Number(rgb[3]),
      value: nodata ? null : midpoint(valueAttr?.[1]),
      nodata,
    });
  }
  if (!entries.length) {
    throw new Error('Colormap contained no ColorMapEntry records.');
  }
  return { title: mapMatch[1], units: mapMatch[2], entries };
}

function rgbKey(r: number, g: number, b: number): number {
  return (r << 16) | (g << 8) | b;
}

export function buildLookup(map: ParsedColormap): Map<number, ColorEntry> {
  const lookup = new Map<number, ColorEntry>();
  for (const entry of map.entries) {
    lookup.set(rgbKey(entry.r, entry.g, entry.b), entry);
  }
  return lookup;
}

export function lookupValue(
  lookup: Map<number, ColorEntry>,
  entries: ColorEntry[],
  r: number,
  g: number,
  b: number,
  a: number,
): number | null {
  if (a < 16 || (r === 0 && g === 0 && b === 0)) return null;
  const exact = lookup.get(rgbKey(r, g, b));
  if (exact) return exact.nodata ? null : exact.value;
  let best: ColorEntry | null = null;
  let bestDist = Infinity;
  for (const entry of entries) {
    if (entry.nodata) continue;
    const dist = (entry.r - r) ** 2 + (entry.g - g) ** 2 + (entry.b - b) ** 2;
    if (dist < bestDist) {
      bestDist = dist;
      best = entry;
    }
  }
  if (!best || bestDist > 1800) return null;
  return best.value;
}
