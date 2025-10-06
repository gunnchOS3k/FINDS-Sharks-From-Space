import React from 'react';

interface ActionsModalProps {
  onClose: () => void;
}

const ActionsModal: React.FC<ActionsModalProps> = ({ onClose }) => {
  return (
    <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
    >
        <div 
            className="bg-gray-800 border border-cyan-500/30 rounded-lg shadow-2xl w-full max-w-md p-6"
            onClick={e => e.stopPropagation()}
        >
            <div className="flex justify-between items-center border-b border-gray-600 pb-3 mb-4">
                <h2 className="text-2xl font-bold text-cyan-300">Actions</h2>
                <button 
                    onClick={onClose} 
                    className="text-gray-400 hover:text-white transition-colors"
                    aria-label="Close modal"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            <div className="space-y-4 text-gray-300">
                <p>This is a placeholder for future actions, such as exporting data or sharing the map.</p>
                <button onClick={onClose} className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 px-4 rounded-md transition-colors">
                    Close
                </button>
            </div>
        </div>
    </div>
  );
};

export default ActionsModal;
