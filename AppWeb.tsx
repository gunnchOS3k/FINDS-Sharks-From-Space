import React, { useState, useEffect, useCallback } from 'react';
import type { ViewState, ViewStateChangeParameters } from '@deck.gl/core';
import type { PickingInfo } from '@deck.gl/core';
import type { Hotspot } from './types';
import { generateHotspots } from './services/geminiService';
import { createEdgeIO } from './services/edgeio';
import Map from './components/Map';
import Header from './components/Header';
import InfoPanel from './components/InfoPanel';
import Legend from './components/Legend';
import SplashScreen from './components/SplashScreen';
import SharkGallery from './components/SharkGallery';
import HelpModal from './components/HelpModal';
import LoadingOverlay from './components/LoadingOverlay';

const PRESET_REGIONS = [
  'New York Bight',
  'California Coast',
  'Florida Keys',
  'Great Barrier Reef',
  'Hawaiian Islands',
  'Mediterranean Sea'
];

const INITIAL_VIEW_STATE: ViewState = {
  longitude: -74.0060,
  latitude: 40.7128,
  zoom: 6,
  pitch: 45,
  bearing: 0
};

function App() {
  const [hotspots, setHotspots] = useState<Hotspot[]>([]);
  const [viewState, setViewState] = useState<ViewState>(INITIAL_VIEW_STATE);
  const [region, setRegion] = useState('New York Bight');
  const [numPoints, setNumPoints] = useState(200);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);
  const [showSharkGallery, setShowSharkGallery] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [edgeIOActive, setEdgeIOActive] = useState(false);

  // Initialize Edge IO
  useEffect(() => {
    const edgeIO = createEdgeIO();

    edgeIO.start({
      left: () => {
        // Decrease hotspot count by 50
        setNumPoints(prev => Math.max(50, prev - 50));
      },
      right: () => {
        // Increase hotspot count by 50
        setNumPoints(prev => Math.min(5000, prev + 50));
      },
      up: () => {
        // Cycle to previous region
        setRegion(prev => {
          const currentIndex = PRESET_REGIONS.indexOf(prev);
          const nextIndex = currentIndex <= 0 ? PRESET_REGIONS.length - 1 : currentIndex - 1;
          return PRESET_REGIONS[nextIndex];
        });
      },
      down: () => {
        // Cycle to next region
        setRegion(prev => {
          const currentIndex = PRESET_REGIONS.indexOf(prev);
          const nextIndex = currentIndex >= PRESET_REGIONS.length - 1 ? 0 : currentIndex + 1;
          return PRESET_REGIONS[nextIndex];
        });
      },
      spread: () => {
        // Increase hotspot count by 100
        setNumPoints(prev => Math.min(5000, prev + 100));
      },
      pinch: () => {
        // Decrease hotspot count by 100
        setNumPoints(prev => Math.max(50, prev - 100));
      },
      shake: () => {
        // Toggle shark gallery
        setShowSharkGallery(prev => !prev);
      },
      tap: () => {
        // Toggle shark gallery
        setShowSharkGallery(prev => !prev);
      }
    });

    setEdgeIOActive(edgeIO.isActive());

    return () => {
      edgeIO.stop();
    };
  }, []);

  // Generate hotspots
  const handleGenerate = useCallback(async (regionName: string, points: number) => {
    setIsLoading(true);
    setError(null);
    setSelectedHotspot(null);

    try {
      const data = await generateHotspots(regionName, points);
      if (data && data.hotspots) {
        setHotspots(data.hotspots);
        // Adjust view to region if needed
        if (data.region && data.region !== region) {
          setRegion(data.region);
        }
      } else {
        setError('Failed to generate hotspots. Please try again.');
      }
    } catch (err) {
      console.error('Error generating hotspots:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while generating hotspots.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Handle hotspot click
  const handleHotspotClick = useCallback((info: PickingInfo) => {
    if (info.object && 'lat' in info.object && 'lon' in info.object) {
      setSelectedHotspot(info.object as Hotspot);
    } else {
      setSelectedHotspot(null);
    }
  }, []);

  // Handle view state change
  const handleViewStateChange = useCallback((params: ViewStateChangeParameters) => {
    setViewState(params.viewState);
  }, []);

  // Load initial data
  useEffect(() => {
    handleGenerate(region, numPoints);
  }, []); // Only on mount

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gray-900">
      <SplashScreen isLoading={isLoading && hotspots.length === 0} />
      
      {isLoading && hotspots.length > 0 && (
        <LoadingOverlay numPoints={numPoints} />
      )}

      <Header edgeIOActive={edgeIOActive} />
      
      <Map
        hotspots={hotspots}
        viewState={viewState}
        onViewStateChange={handleViewStateChange}
        onHotspotClick={handleHotspotClick}
      />

      <InfoPanel
        region={region}
        setRegion={setRegion}
        numPoints={numPoints}
        setNumPoints={setNumPoints}
        onGenerate={handleGenerate}
        isLoading={isLoading}
        error={error}
        selectedHotspot={selectedHotspot}
        onClearSelection={() => setSelectedHotspot(null)}
        onShowHelp={() => setShowHelp(true)}
        onDeepDive={(hotspot) => {
          console.log('Deep dive for hotspot:', hotspot);
          // Could open a modal or navigate to detailed view
        }}
        onShowSharkGallery={() => setShowSharkGallery(true)}
      />

      <Legend />

      {showSharkGallery && (
        <SharkGallery
          isVisible={showSharkGallery}
          onClose={() => setShowSharkGallery(false)}
        />
      )}

      {showHelp && (
        <HelpModal onClose={() => setShowHelp(false)} />
      )}
    </div>
  );
}

export default App;

