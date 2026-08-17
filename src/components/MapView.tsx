import { useMemo } from 'react';
import DeckGL from '@deck.gl/react';
import { HeatmapLayer } from '@deck.gl/aggregation-layers';
import { TileLayer } from '@deck.gl/geo-layers';
import { BitmapLayer, ScatterplotLayer, IconLayer } from '@deck.gl/layers';
import type { MapViewState, PickingInfo } from '@deck.gl/core';
import type { Hotspot } from '../../shared/types';

const TILE_URL = 'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png';

interface MapProps {
  hotspots: Hotspot[];
  viewState: MapViewState;
  onViewStateChange: (viewState: MapViewState) => void;
  onSelect: (hotspot: Hotspot | null) => void;
}

function scoreColor(score: number): [number, number, number, number] {
  if (score >= 0.75) return [243, 193, 74, 230];
  if (score >= 0.55) return [62, 224, 210, 220];
  if (score >= 0.35) return [90, 160, 255, 210];
  return [80, 110, 160, 180];
}

export default function MapView({ hotspots, viewState, onViewStateChange, onSelect }: MapProps) {
  const high = useMemo(() => hotspots.filter((h) => h.score >= 0.75), [hotspots]);
  const layers = [
    new TileLayer({
      id: 'basemap',
      data: TILE_URL,
      minZoom: 0,
      maxZoom: 19,
      tileSize: 256,
      renderSubLayers: (props) => {
        const { west, south, east, north } = props.tile.bbox as {
          west: number;
          south: number;
          east: number;
          north: number;
        };
        return new BitmapLayer(props, {
          data: undefined,
          image: props.data,
          bounds: [west, south, east, north],
        });
      },
    }),
    new HeatmapLayer({
      id: 'heat',
      data: hotspots,
      getPosition: (d: Hotspot) => [d.lon, d.lat],
      getWeight: (d: Hotspot) => d.score,
      radiusPixels: 50,
      intensity: 1,
      threshold: 0.03,
    }),
    new ScatterplotLayer({
      id: 'points',
      data: hotspots,
      pickable: true,
      radiusMinPixels: 6,
      radiusMaxPixels: 18,
      getPosition: (d: Hotspot) => [d.lon, d.lat],
      getFillColor: (d: Hotspot) => scoreColor(d.score),
      getRadius: 1200,
    }),
    new IconLayer({
      id: 'high-markers',
      data: high,
      pickable: true,
      getPosition: (d: Hotspot) => [d.lon, d.lat],
      getIcon: () => ({
        url: '/icons/shark-marker.svg',
        width: 128,
        height: 128,
        anchorY: 128,
      }),
      getSize: 36,
      sizeUnits: 'pixels',
    }),
  ];

  return (
    <div className="map-root" role="application" aria-label="FINDS ocean map">
      <DeckGL
        viewState={viewState}
        onViewStateChange={(params) => onViewStateChange(params.viewState as MapViewState)}
        controller
        layers={layers}
        onClick={(info: PickingInfo) => {
          if (info.object && 'lat' in info.object) onSelect(info.object as Hotspot);
          else onSelect(null);
        }}
        getTooltip={(info) => {
          if (!info.object || !('score' in info.object)) return null;
          const hotspot = info.object as Hotspot;
          return `${hotspot.label} score ${hotspot.score.toFixed(2)}`;
        }}
      />
    </div>
  );
}
