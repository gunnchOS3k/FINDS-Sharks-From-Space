import React from 'react';

interface HelpModalProps {
  onClose: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ onClose }) => {
  return (
    <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
    >
        <div 
            className="bg-gray-800 border border-cyan-500/30 rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6"
            onClick={e => e.stopPropagation()}
        >
            <div className="flex justify-between items-center border-b border-gray-600 pb-3 mb-4">
                <h2 className="text-2xl font-bold text-cyan-300">About FINDS</h2>
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

            <div className="space-y-6 text-gray-300">
                <div>
                    <h3 className="font-semibold text-lg text-white mb-2">What is FINDS?</h3>
                    <p>The <strong>Forecasted Incidents of Nautical Danger System (FINDS)</strong> is a NASA hackathon project that uses Google's Gemini AI to predict and visualize potential shark activity hotspots in oceans across the globe. It's a demonstration of how generative AI can be used to analyze vast, unseen datasets to generate valuable insights for research, conservation, and safety.</p>
                </div>

                <div>
                    <h3 className="font-semibold text-lg text-white mb-2">How to Interpret the Map</h3>
                    <ul className="list-disc list-inside space-y-2">
                        <li><strong>Heatmap Colors</strong>: The colors on the map represent the density and score of predicted hotspots. Areas that are brighter yellow or red indicate a higher concentration of high-score predictions, suggesting a greater likelihood of activity.</li>
                        <li><strong>Activity Score</strong>: Each hotspot has a score from 0 to 1. A higher score means the AI has identified stronger indicators for potential shark presence based on its training data.</li>
                        <li><strong>Shark Icons</strong>: The most critical hotspots (score &gt; 0.85) are marked with a shark icon for immediate visual identification.</li>
                    </ul>
                </div>

                <div>
                    <h3 className="font-semibold text-lg text-white mb-2">Why do I see hotspots on land?</h3>
                    <p>You've found a fascinating example of an AI "hallucination"! When FINDS is asked to generate hotspots for a landlocked region (like Paris), the AI may misinterpret the request and place points on land because it's forced to find an "ocean" where none exists. This is a known limitation of current generative models and a great reminder that human oversight and context are still key! We are continuously refining our AI prompts to improve geographic accuracy.</p>
                </div>
                 <div>
                    <button onClick={onClose} className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 px-4 rounded-md transition-colors">
                        Got it!
                    </button>
                </div>
            </div>
        </div>
    </div>
  );
};

export default HelpModal;
