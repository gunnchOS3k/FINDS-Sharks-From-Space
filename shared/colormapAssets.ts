import sst from './colormaps/GHRSST_Sea_Surface_Temperature.json';
import chl from './colormaps/VIIRS_Chlorophyll.json';
import type { ParsedColormap } from './colormap';

export const BUNDLED_SST_COLORMAP: ParsedColormap = sst;
export const BUNDLED_CHL_COLORMAP: ParsedColormap = chl;
