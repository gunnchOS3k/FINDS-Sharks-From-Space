import React from 'react';
import type { Hotspot } from '../types';

interface HotspotInfoProps {
  hotspot: Hotspot;
  onClear: () => void;
  onDeepDive: (hotspot: Hotspot) => void;
}

const HotspotInfo: React.FC<HotspotInfoProps> = ({ hotspot, onClear, onDeepDive }) => {
  const scoreColor = hotspot.score > 0.85 ? 'text-red-400' : hotspot.score > 0.6 ? 'text-yellow-400' : 'text-green-400';

  return (
    <div className="p-4 bg-gray-900/70 backdrop-blur-sm rounded-lg shadow-2xl border border-cyan-500/20 shadow-cyan-500/10">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-bold text-cyan-300">Hotspot Details</h3>
        <button onClick={onClear} className="text-gray-400 hover:text-white transition-colors" aria-label="Close details">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="font-semibold text-gray-400">Coordinates:</span>
          <span className="font-mono text-white">{hotspot.lat.toFixed(5)}, {hotspot.lon.toFixed(5)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-semibold text-gray-400">Activity Score:</span>
          <span className={`font-bold text-lg ${scoreColor}`}>{hotspot.score.toFixed(3)}</span>
        </div>
      </div>
      <button 
        onClick={() => onDeepDive(hotspot)}
        className="mt-4 w-full bg-cyan-700/50 hover:bg-cyan-600/70 border border-cyan-500/30 text-cyan-200 font-bold py-2 px-4 rounded-md transition-all duration-300 flex items-center justify-center space-x-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
        </svg>
        <span>Deep Dive</span>
      </button>
    </div>
  );
};

export default HotspotInfo;