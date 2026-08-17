import { fetchNasaObservations } from './shared/nasa.ts';

const bbox = [-74.5, 39.5, -71.5, 41.2];
const result = await fetchNasaObservations(bbox, { gridSize: 16 });
const usable = result.cells.filter((c) => c.sstC !== null);
console.log(JSON.stringify({
  date: result.observationDate,
  layers: result.layersUsed,
  cells: result.cells.length,
  withSst: usable.length,
  sample: result.cells.slice(0, 3).map((c) => ({ lat: c.lat, lon: c.lon, sstC: c.sstC, chl: c.chlorophyllMgM3 })),
}));
if (!usable.length) {
  process.exit(2);
}
