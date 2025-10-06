import React, { useMemo } from 'react';
import DeckGL from '@deck.gl/react';
import { HeatmapLayer } from '@deck.gl/aggregation-layers';
import { TileLayer } from '@deck.gl/geo-layers';
import { BitmapLayer, ScatterplotLayer } from '@deck.gl/layers';
import { ScenegraphLayer } from '@deck.gl/mesh-layers';
import type { ViewState, ViewStateChangeParameters, PickingInfo } from '@deck.gl/core';
import type { Hotspot } from '../types';
import { MAP_TILE_URL, SHARK_MODEL_URL } from '../constants';

interface MapProps {
  hotspots: Hotspot[];
  viewState: ViewState;
  onViewStateChange: (params: ViewStateChangeParameters) => void;
  onHotspotClick: (info: PickingInfo) => void;
}

const Map: React.FC<MapProps> = ({ hotspots, viewState, onViewStateChange, onHotspotClick }) => {

  const highRiskHotspots = useMemo(() => hotspots.filter(h => h.score > 0.85), [hotspots]);

  const layers = [
    new TileLayer({
      id: 'tile-layer',
      data: MAP_TILE_URL,
      minZoom: 0,
      maxZoom: 19,
      tileSize: 256,

      renderSubLayers: props => {
        const {
          bbox: { west, south, east, north }
        } = props.tile;

        return new BitmapLayer(props, {
          data: null,
          image: props.data,
          bounds: [west, south, east, north]
        });
      }
    }),
    new HeatmapLayer({
      id: 'heatmapLayer',
      data: hotspots,
      getPosition: (d: Hotspot) => [d.lon, d.lat],
      getWeight: (d: Hotspot) => d.score,
      radiusPixels: 60,
      intensity: 1,
      threshold: 0.03,
      colorRange: [
        [0, 64, 255, 128],
        [0, 128, 255, 128],
        [0, 192, 255, 128],
        [0, 255, 255, 192],
        [128, 255, 128, 192],
        [255, 255, 0, 255],
      ]
    }),
    new ScatterplotLayer({
        id: 'scatterplot-layer',
        data: hotspots,
        pickable: true,
        radiusScale: 20,
        radiusMinPixels: 5,
        radiusMaxPixels: 100,
        getPosition: (d: Hotspot) => [d.lon, d.lat],
        getFillColor: [0, 0, 0, 0], // Invisible, for picking only
    }),
    new ScenegraphLayer({
      id: 'shark-layer',
      data: highRiskHotspots,
      pickable: true,
      scenegraph: SHARK_MODEL_URL,
      getPosition: (d: Hotspot) => [d.lon, d.lat],
      getOrientation: (d: Hotspot) => [90, Math.random() * 360, 0], // Pitch up to be flat, random heading
      sizeScale: 1500,
      _lighting: 'pbr',
      getColor: [0, 220, 255, 160] // Holographic cyan with transparency
    })
  ];

  return (
    <DeckGL
      viewState={viewState}
      onViewStateChange={onViewStateChange}
      controller={true}
      layers={layers}
      onClick={onHotspotClick}
      style={{ width: '100%', height: '100%', background: '#0c1424' }}
      getTooltip={({ object }) => {
        if (!object || !('lat' in object)) return null;
        return 'Click for details';
      }}
    />
  );
};

export default Map;