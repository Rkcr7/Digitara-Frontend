import React, { useState } from 'react';

interface ReceiptImageViewerProps {
  imageUrl?: string;
  fileName?: string;
  onImageError?: () => void;
  onImageLoad?: () => void;
  isLoading?: boolean;
  isMobile?: boolean;
}

export const ReceiptImageViewer: React.FC<ReceiptImageViewerProps> = ({ 
  imageUrl, 
  fileName,
  onImageError,
  onImageLoad,
  isLoading = false,
  isMobile = false
}) => {
  const [imageError, setImageError] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const handleImageError = () => {
    setImageError(true);
    onImageError?.();
  };

  const handleImageLoad = () => {
    onImageLoad?.();
  };

  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
  };

  return (
    <div className="h-full flex flex-col bg-gray-100">
      <div className="bg-white px-3 sm:px-4 py-2 sm:py-3 border-b border-gray-200">
        <h3 className={`font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-2 ${
          isMobile ? 'text-xs' : 'text-sm'
        }`}>
          <svg className={`text-gray-500 ${isMobile ? 'w-3 h-3' : 'w-4 h-4'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Original Receipt
        </h3>
      </div>
        <div className={`flex-1 overflow-y-auto ${isMobile ? 'p-2' : 'p-4'}`}>
        {/* Loading Animation */}
        {isLoading && imageUrl && (
          <div className={`flex items-center justify-center ${isMobile ? 'h-32 sm:h-40' : 'h-48'}`}>
            <div className="bg-white rounded-lg p-6 sm:p-8 lg:p-12 text-center shadow-md">
              {/* Receipt-shaped skeleton loader */}
              <div className={`mx-auto mb-4 bg-gray-200 rounded ${
                isMobile ? 'w-16 h-20 sm:w-20 sm:h-24' : 'w-24 h-32'
              }`}></div>
              
              {/* Bouncing dots */}
              <div className="flex justify-center space-x-1 my-3">
                <div className={`bg-blue-500 rounded-full animate-bounce ${
                  isMobile ? 'w-2 h-2' : 'w-3 h-3'
                }`} style={{ animationDelay: '0ms' }}></div>
                <div className={`bg-blue-500 rounded-full animate-bounce ${
                  isMobile ? 'w-2 h-2' : 'w-3 h-3'
                }`} style={{ animationDelay: '150ms' }}></div>
                <div className={`bg-blue-500 rounded-full animate-bounce ${
                  isMobile ? 'w-2 h-2' : 'w-3 h-3'
                }`} style={{ animationDelay: '300ms' }}></div>
              </div>
              
              <p className={`text-gray-600 font-medium mt-3 ${
                isMobile ? 'text-sm' : 'text-base'
              }`}>Loading image...</p>
            </div>
          </div>
        )}

        {/* Image Display */}
        {imageUrl && !imageError && (
          <div className="relative w-full group">
            <img
              src={imageUrl}
              alt={`Receipt: ${fileName || 'Image'}`}
              className={`w-full h-auto object-contain object-top bg-white rounded-lg shadow-md transition-all duration-300 ${
                isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in hover:shadow-lg'
              } ${isMobile ? 'max-h-[170px] sm:max-h-[200px] md:max-h-[230px]' : ''} ${
                isLoading ? 'opacity-0' : 'opacity-100'
              }`}
              onError={handleImageError}
              onLoad={handleImageLoad}
              onClick={toggleZoom}
              style={{ 
                transition: 'opacity 0.3s ease-in-out',
                display: isLoading ? 'none' : 'block'
              }}
            />
            
            {/* Zoom indicator - Hide on very small mobile screens */}
            <div className={`absolute top-2 right-2 bg-black bg-opacity-60 text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-md text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 ${
              isMobile ? 'hidden sm:flex' : ''
            }`}>
              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isZoomed ? "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10h-2m0 0H9m2 0v2m0-2V8" : "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"} />
              </svg>
              <span className="hidden sm:inline">{isZoomed ? 'Zoom out' : 'Zoom in'}</span>
            </div>
          </div>
        )}

        {/* No Image Available */}
        {(!imageUrl || imageError) && !isLoading && (
          <div className={`flex items-center justify-center ${isMobile ? 'h-32 sm:h-40' : 'h-48'}`}>
            <div className="bg-white rounded-lg p-6 sm:p-8 lg:p-12 text-center">
              <svg className={`mx-auto text-gray-300 mb-3 sm:mb-4 ${
                isMobile ? 'h-8 w-8 sm:h-12 sm:w-12' : 'h-16 w-16'
              }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} 
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className={`text-gray-500 font-medium mb-1 ${
                isMobile ? 'text-sm' : 'text-base'
              }`}>Receipt image unavailable</p>
              <p className={`text-gray-400 ${
                isMobile ? 'text-xs' : 'text-sm'
              }`}>{fileName || 'No image available'}</p>
            </div>
          </div>
        )}
      </div>

      {/* Zoom Modal - Enhanced for mobile */}
      {isZoomed && imageUrl && !imageError && (
        <div 
          className="fixed inset-0 z-50 bg-black bg-opacity-95 flex items-center justify-center p-4 sm:p-8"
          onClick={toggleZoom}
        >
          <img
            src={imageUrl}
            alt={`Receipt: ${fileName || 'Image'}`}
            className="max-w-[95vw] max-h-[90vh] sm:max-w-[90vw] sm:max-h-[90vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={toggleZoom}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 text-white hover:text-gray-300 transition-colors bg-black bg-opacity-50 rounded-full p-1.5 sm:p-2"
          >
            <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};
