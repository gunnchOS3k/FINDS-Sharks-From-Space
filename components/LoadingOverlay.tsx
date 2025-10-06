import React, { useState, useEffect } from 'react';
import { LOADING_MESSAGES } from '../constants';

interface LoadingOverlayProps {
  numPoints: number;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ numPoints }) => {
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState(LOADING_MESSAGES[0]);

  useEffect(() => {
    setProgress(0);
    setMessage(LOADING_MESSAGES[0]);

    const estimatedDuration = Math.max(5000, 5000 + (numPoints / 100) * 1500);
    const updateInterval = 200;
    const steps = estimatedDuration / updateInterval;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      const randomIncrement = Math.random() * (100 / steps) * 1.5;
      setProgress(prev => {
        const nextProgress = prev + randomIncrement;

        if (nextProgress >= 100 || currentStep >= steps) {
          clearInterval(interval);
          setMessage(LOADING_MESSAGES[LOADING_MESSAGES.length - 1]);
          return 100;
        }
        
        const messageIndex = Math.floor((nextProgress / 100) * (LOADING_MESSAGES.length -1));
        setMessage(LOADING_MESSAGES[messageIndex]);
        
        return nextProgress;
      });
    }, updateInterval);

    return () => clearInterval(interval);
  }, [numPoints]);

  return (
    <div className="absolute inset-0 bg-gray-900/90 backdrop-blur-sm flex flex-col items-center justify-center z-50 transition-opacity duration-300">
      <div className="w-24 h-24 relative mb-6">
          <div className="w-full h-full border-4 border-cyan-400/20 rounded-full"></div>
          <div 
            className="absolute top-0 left-0 w-full h-full border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"
            style={{ animationDuration: '1s' }}
          ></div>
          <div className="absolute inset-0 flex items-center justify-center text-cyan-200 font-bold text-lg">
            {Math.round(progress)}%
          </div>
      </div>
      
      <p className="mt-4 text-xl text-white font-semibold text-center px-4">{message}</p>
      <div className="w-1/2 max-w-sm mt-4 bg-cyan-900/50 rounded-full h-2.5">
        <div 
          className="bg-cyan-400 h-2.5 rounded-full" 
          style={{ width: `${progress}%`, transition: 'width 0.2s ease-in-out' }}
        ></div>
      </div>
    </div>
  );
};

export default LoadingOverlay;