import React, { useState, useCallback } from 'react';
import type { ViewState, PickingInfo } from '@deck.gl/core';
import { FlyToInterpolator } from '@deck.gl/core';

import Header from './components/Header';
import Map from './components/Map';
import InfoPanel from './components/InfoPanel';
import LoadingOverlay from './components/LoadingOverlay';
import HelpModal from './components/HelpModal';
import Legend from './components/Legend';
import SharkGallery from './components/SharkGallery';
import SplashScreen from './components/SplashScreen';

import { generateHotspots } from './services/geminiService';
import { createEdgeIO } from './services/edgeio';
import { DEMO_DATA } from './constants';
import type { Hotspot } from './types';

const INITIAL_VIEW_STATE: ViewState = {
  longitude: -74.0,
  latitude: 40.7,
  zoom: 7,
  pitch: 45,
  bearing: 0,
};

const App: React.FC = () => {
  const [viewState, setViewState] = useState<ViewState>(INITIAL_VIEW_STATE);
  const [hotspots, setHotspots] = useState<Hotspot[]>(DEMO_DATA.hotspots);
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showHelp, setShowHelp] = useState<boolean>(false);
  const [showSharkGallery, setShowSharkGallery] = useState<boolean>(false);
  const [edgeIOActive, setEdgeIOActive] = useState<boolean>(false);
  const [isAppLoading, setIsAppLoading] = useState<boolean>(true);
  
  const [region, setRegion] = useState<string>('New York Bight');
  const [numPoints, setNumPoints] = useState<number>(200);
  
  // Preset regions for cycling
  const presetRegions = [
    'New York Bight',
    'California Coast', 
    'Florida Keys',
    'Great Barrier Reef',
    'Hawaiian Islands',
    'Mediterranean Sea'
  ];

  const handleGenerate = useCallback(async (genRegion: string, genNumPoints: number) => {
    setIsLoading(true);
    setError(null);
    setSelectedHotspot(null);

    try {
      const data = await generateHotspots(genRegion, genNumPoints);
      if (data && data.hotspots.length > 0) {
        setHotspots(data.hotspots);
        
        const firstHotspot = data.hotspots[0];
        setViewState(current => ({
          ...current,
          longitude: firstHotspot.lon,
          latitude: firstHotspot.lat,
          zoom: 7,
          pitch: 45,
          transitionDuration: 2000,
          transitionInterpolator: new FlyToInterpolator(),
        }));
      } else {
         setHotspots([]);
         setError(`No ocean hotspots found for "${genRegion}". The AI may not have found relevant coastal areas. Try a more specific location.`);
      }
    } catch (e: any) {
      setError(e.message || "An unknown error occurred.");
      setHotspots([]); // Clear hotspots on error
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleHotspotClick = useCallback((info: PickingInfo) => {
    if (info.object) {
      const hotspot = info.object as Hotspot;
      setSelectedHotspot(hotspot);
      setViewState(current => ({
        ...current,
        longitude: hotspot.lon,
        latitude: hotspot.lat,
        zoom: Math.max(current.zoom || 0, 12),
        pitch: 45,
        transitionDuration: 1000,
        transitionInterpolator: new FlyToInterpolator({ speed: 1.5 }),
      }));
    } else {
      setSelectedHotspot(null);
    }
  }, []);

  const handleDeepDive = useCallback((hotspot: Hotspot) => {
    setViewState(current => ({
      ...current,
      longitude: hotspot.lon,
      latitude: hotspot.lat,
      zoom: 14,
      pitch: 60,
      bearing: 0,
      transitionDuration: 2500,
      transitionInterpolator: new FlyToInterpolator({ speed: 1.2 }),
    }));
  }, []);

  // Edge IO gesture handlers
  const edgeIO = React.useMemo(() => createEdgeIO(), []);
  
  const handleEdgeGesture = useCallback((gesture: string) => {
    switch (gesture) {
      case 'right':
        setNumPoints(prev => Math.min(2000, prev + 50));
        break;
      case 'left':
        setNumPoints(prev => Math.max(10, prev - 50));
        break;
      case 'up':
        const currentIndex = presetRegions.indexOf(region);
        const nextIndex = (currentIndex + 1) % presetRegions.length;
        setRegion(presetRegions[nextIndex]);
        break;
      case 'down':
        const currentIndexDown = presetRegions.indexOf(region);
        const prevIndex = currentIndexDown === 0 ? presetRegions.length - 1 : currentIndexDown - 1;
        setRegion(presetRegions[prevIndex]);
        break;
      case 'shake':
      case 'tap':
        setShowSharkGallery(prev => !prev);
        break;
      case 'spread':
        setNumPoints(prev => Math.min(2000, prev + 100));
        break;
      case 'pinch':
        setNumPoints(prev => Math.max(10, prev - 100));
        break;
    }
  }, [region, presetRegions]);

  // Initialize Edge IO
  React.useEffect(() => {
    edgeIO.start({
      right: () => handleEdgeGesture('right'),
      left: () => handleEdgeGesture('left'),
      up: () => handleEdgeGesture('up'),
      down: () => handleEdgeGesture('down'),
      shake: () => handleEdgeGesture('shake'),
      tap: () => handleEdgeGesture('tap'),
      spread: () => handleEdgeGesture('spread'),
      pinch: () => handleEdgeGesture('pinch'),
    });
    setEdgeIOActive(true);

    return () => {
      edgeIO.stop();
      setEdgeIOActive(false);
    };
  }, [edgeIO, handleEdgeGesture]);

  // App loading effect
  React.useEffect(() => {
    console.log('🦈 App is loading...');
    const timer = setTimeout(() => {
      console.log('🦈 App loading complete!');
      setIsAppLoading(false);
    }, 3000); // Show splash screen for 3 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-screen h-screen font-sans bg-gray-900 text-white">
      <SplashScreen isLoading={isAppLoading} />
      <Header edgeIOActive={edgeIOActive} />
      <Map 
        hotspots={hotspots}
        viewState={viewState}
        onViewStateChange={({ viewState: newViewState }) => setViewState(newViewState)}
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
        onDeepDive={handleDeepDive}
        onShowSharkGallery={() => setShowSharkGallery(true)}
      />
      <Legend />
      {isLoading && <LoadingOverlay numPoints={numPoints} />}
      {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
      <SharkGallery 
        isVisible={showSharkGallery} 
        onClose={() => setShowSharkGallery(false)} 
      />
    </div>
  );
};

export default App;