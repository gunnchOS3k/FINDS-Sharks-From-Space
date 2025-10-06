import React from 'react';
import Controls from './Controls';
import HotspotInfo from './HotspotInfo';
import ErrorMessage from './ErrorMessage';
import type { Hotspot } from '../types';

interface InfoPanelProps {
  region: string;
  setRegion: (region: string) => void;
  numPoints: number;
  setNumPoints: (num: number) => void;
  onGenerate: (region: string, numPoints: number) => void;
  isLoading: boolean;
  error: string | null;
  selectedHotspot: Hotspot | null;
  onClearSelection: () => void;
  onShowHelp: () => void;
  onDeepDive: (hotspot: Hotspot) => void;
  onShowSharkGallery: () => void;
}

const InfoPanel: React.FC<InfoPanelProps> = ({
  region,
  setRegion,
  numPoints,
  setNumPoints,
  onGenerate,
  isLoading,
  error,
  selectedHotspot,
  onClearSelection,
  onShowHelp,
  onDeepDive,
  onShowSharkGallery,
}) => {
  return (
    <div className="absolute top-0 left-0 h-full w-full max-w-sm p-4 z-10 pointer-events-none">
      <div className="pointer-events-auto flex flex-col space-y-4">
        <Controls
          region={region}
          setRegion={setRegion}
          numPoints={numPoints}
          setNumPoints={setNumPoints}
          onGenerate={onGenerate}
          isLoading={isLoading}
          onShowHelp={onShowHelp}
          onShowSharkGallery={onShowSharkGallery}
        />
        {error && <ErrorMessage message={error} />}
        {selectedHotspot && (
          <HotspotInfo
            hotspot={selectedHotspot}
            onClear={onClearSelection}
            onDeepDive={onDeepDive}
          />
        )}
      </div>
    </div>
  );
};

export default InfoPanel;