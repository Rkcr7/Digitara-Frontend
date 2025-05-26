import React, { useState } from 'react';

interface ReceiptImageViewerProps {
  imageUrl?: string;
  fileName?: string;
  onImageError?: () => void;
}

export const ReceiptImageViewer: React.FC<ReceiptImageViewerProps> = ({ 
  imageUrl, 
  fileName,
  onImageError 
}) => {
  const [imageError, setImageError] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  const handleImageError = () => {
    setImageError(true);
    onImageError?.();
  };

  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
  };

  return (
    <div className="h-full flex flex-col bg-gray-100">
      <div className="bg-white px-4 py-3 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-2">
          <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Original Receipt
        </h3>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto">
        {imageUrl && !imageError ? (
          <div className="relative w-full group">
            <img
              src={imageUrl}
              alt={`Receipt: ${fileName || 'Image'}`}
              className={`w-full h-auto object-contain object-top bg-white rounded-lg shadow-md transition-all duration-200 ${
                isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in hover:shadow-lg'
              }`}
              onError={handleImageError}
              onClick={toggleZoom}
            />
            
            {/* Zoom indicator */}
            <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white px-3 py-1.5 rounded-md text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isZoomed ? "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10h-2m0 0H9m2 0v2m0-2V8" : "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"} />
              </svg>
              {isZoomed ? 'Zoom out' : 'Zoom in'}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-48">
            <div className="bg-white rounded-lg p-12 text-center">
              <svg className="mx-auto h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} 
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-base text-gray-500 font-medium mb-1">Receipt image unavailable</p>
              <p className="text-sm text-gray-400">{fileName || 'No image available'}</p>
            </div>
          </div>
        )}
      </div>

      {/* Zoom Modal */}
      {isZoomed && imageUrl && !imageError && (
        <div 
          className="fixed inset-0 z-50 bg-black bg-opacity-95 flex items-center justify-center p-8"
          onClick={toggleZoom}
        >
          <img
            src={imageUrl}
            alt={`Receipt: ${fileName || 'Image'}`}
            className="max-w-[90vw] max-h-[90vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={toggleZoom}
            className="absolute top-6 right-6 text-white hover:text-gray-300 transition-colors bg-black bg-opacity-50 rounded-full p-2"
          >
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}; 