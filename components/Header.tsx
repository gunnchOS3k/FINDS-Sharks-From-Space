
import React from 'react';

interface HeaderProps {
  edgeIOActive?: boolean;
}

const Header: React.FC<HeaderProps> = ({ edgeIOActive = false }) => {
  return (
    <header className="absolute top-0 left-0 w-full p-4 z-20 pointer-events-none">
      <div className="max-w-sm">
          <h1 className="text-3xl font-bold text-white drop-shadow-lg">FINDS</h1>
          <p className="text-cyan-300 drop-shadow-md">Forecasted Incidents of Nautical Danger System</p>
          {edgeIOActive && (
            <div className="mt-2 flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-400 font-medium">Edge IO: ON</span>
            </div>
          )}
      </div>
    </header>
  );
};

export default Header;
