import React from 'react';

const Legend: React.FC = () => {
    return (
        <div className="absolute bottom-4 left-4 p-3 bg-gray-900/70 backdrop-blur-sm rounded-lg shadow-lg border border-cyan-500/20 z-10">
            <h4 className="text-sm font-bold text-white mb-2">Activity Score</h4>
            <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-300">Low</span>
                <div className="w-24 h-3 rounded-full bg-gradient-to-r from-blue-500 via-cyan-400 to-yellow-300"></div>
                <span className="text-xs text-gray-300">High</span>
            </div>
        </div>
    );
};

export default Legend;
