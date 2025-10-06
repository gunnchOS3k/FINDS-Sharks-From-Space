import React, { useMemo } from 'react';

interface ControlsProps {
  region: string;
  setRegion: (region: string) => void;
  numPoints: number;
  setNumPoints: (num: number) => void;
  onGenerate: (region: string, numPoints: number) => void;
  isLoading: boolean;
  onShowHelp: () => void;
  onShowSharkGallery: () => void;
}

const Controls: React.FC<ControlsProps> = ({
  region,
  setRegion,
  numPoints,
  setNumPoints,
  onGenerate,
  isLoading,
  onShowHelp,
  onShowSharkGallery,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(region, numPoints);
  };
  
  const estimatedTime = useMemo(() => {
    return Math.max(5, Math.round(5 + (numPoints / 100) * 1.5));
  }, [numPoints]);

  return (
    <div className="mt-20 p-4 bg-gray-900/70 backdrop-blur-sm rounded-lg shadow-2xl border border-cyan-500/20 shadow-cyan-500/10">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="region" className="flex justify-between items-center text-sm font-medium text-cyan-200 mb-1">
            <span>Ocean Region</span>
            <button type="button" onClick={onShowHelp} className="w-5 h-5 bg-gray-700 hover:bg-gray-600 rounded-full text-white font-bold text-xs flex items-center justify-center transition-colors">?</button>
          </label>
          <input
            id="region"
            type="text"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="w-full bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-cyan-500 focus:border-cyan-500 transition-shadow"
            placeholder="e.g., California Coast"
            disabled={isLoading}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="numPoints" className="block text-sm font-medium text-cyan-200 mb-1">
            Number of Hotspots
          </label>
          <input
            id="numPoints"
            type="number"
            value={numPoints}
            onChange={(e) => setNumPoints(Math.max(1, parseInt(e.target.value, 10) || 1))}
            min="1"
            max="5000"
            className="w-full bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-cyan-500 focus:border-cyan-500 transition-shadow"
            disabled={isLoading}
          />
        </div>
         <div className="text-xs text-gray-400 text-center mb-4">
            Estimated generation time: ~{estimatedTime} seconds
        </div>
        <button
          type="submit"
          disabled={isLoading || !region}
          className="w-full bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-500 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-md transition-all duration-300 transform hover:scale-105"
        >
          {isLoading ? 'Generating...' : 'Generate Hotspots'}
        </button>
      </form>
      
      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={onShowSharkGallery}
          className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
        >
          🦈 Shark Gallery
        </button>
      </div>
    </div>
  );
};

export default Controls;