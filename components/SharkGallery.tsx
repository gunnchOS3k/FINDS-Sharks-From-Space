import React, { useState, useEffect } from 'react';

interface SharkImage {
  id: string;
  file: string;
  title: string;
  caption: string;
}

interface SharkGalleryProps {
  isVisible: boolean;
  onClose: () => void;
}

const SharkGallery: React.FC<SharkGalleryProps> = ({ isVisible, onClose }) => {
  const [sharks, setSharks] = useState<SharkImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSharks = async () => {
      try {
        const response = await fetch('/metadata.json');
        const data = await response.json();
        setSharks(data.sharks || []);
      } catch (error) {
        console.error('Failed to load shark metadata:', error);
        setSharks([]);
      } finally {
        setLoading(false);
      }
    };

    if (isVisible) {
      loadSharks();
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">Shark Species Gallery</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl font-bold"
          >
            ×
          </button>
        </div>
        
        <div className="p-4 overflow-y-auto max-h-[calc(90vh-80px)]">
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="text-white">Loading sharks...</div>
            </div>
          ) : sharks.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              No shark images available
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sharks.map((shark) => (
                <div key={shark.id} className="bg-gray-800 rounded-lg overflow-hidden">
                  <div className="aspect-w-4 aspect-h-3">
                    <img
                      src={`/sharks/${shark.file}`}
                      alt={shark.title}
                      className="w-full h-48 object-cover"
                      loading="lazy"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjMzMzIi8+Cjx0ZXh0IHg9IjIwMCIgeT0iMTUwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5JbWFnZSBVbmF2YWlsYWJsZTwvdGV4dD4KPC9zdmc+';
                      }}
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="text-white font-semibold text-lg mb-1">
                      {shark.title}
                    </h3>
                    <p className="text-gray-300 text-sm">
                      {shark.caption}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SharkGallery;
