import React, { useEffect, useState } from 'react';
import { ReceiptResponse } from '../../types/receipt.types';
import { createImagePreview } from '../../utils/file.utils';
import { apiService } from '../../services/api.service';
import { ReceiptImageViewer } from './ReceiptImageViewer';
import { ExtractedDataPanel } from './ExtractedDataPanel';

interface ExtractionResultsProps {
  result: ReceiptResponse;
  file: File | null;
  onNewReceipt: () => void;
  onTryAgain: () => void;
  sessionImageUrl?: string | null;
}

export const ExtractionResults: React.FC<ExtractionResultsProps> = ({ 
  result, 
  file,
  onNewReceipt,
  onTryAgain,
  sessionImageUrl
}) => {
  const [imageUrl, setImageUrl] = useState<string | undefined>();
  const [imageLoading, setImageLoading] = useState<boolean>(true);

  useEffect(() => {
    let cleanup: (() => void) | undefined;
    
    // Start loading
    setImageLoading(true);
    
    // CORRECT Priority order: local file preview (fastest), then session URL, then backend URL (complete fallback)
    if (file) {
      // 1st Priority: Local file preview for instant loading
      const url = createImagePreview(file);
      setImageUrl(url);
      setImageLoading(false); // Local preview loads instantly
      console.log('Using local file preview for instant loading');
      
      // Setup cleanup for local preview URL
      cleanup = () => {
        if (url) {
          URL.revokeObjectURL(url);
        }
      };
    } else if (sessionImageUrl) {
      // 2nd Priority: Session image URL if no file is available (after page refresh)
      setImageUrl(sessionImageUrl);
      // Keep loading true until image actually loads
      console.log('Using session image URL (no local file available):', sessionImageUrl);
    } else if (result.image_url) {
      // 3rd Priority: Backend image URL as final fallback (if session URL is lost or unavailable)
      const fullUrl = apiService.getImageUrl(result.image_url);
      setImageUrl(fullUrl);
      // Keep loading true until image actually loads
      console.log('Using backend image URL as complete fallback:', fullUrl);
      
      // Test if the backend image URL is accessible
      const img = new Image();
      img.onerror = () => {
        console.warn('Backend image failed to load:', fullUrl);
        setImageUrl(undefined); // No image available
        setImageLoading(false);
      };
      img.src = fullUrl;
    } else {
      // No image available
      setImageLoading(false);
    }

    return cleanup;
  }, [file, result.image_url, sessionImageUrl]);

  // Handle image load completion
  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
  };

  // Handle failed extraction
  if (result.status === 'failed') {
    const isNotReceipt = result.error?.code === 'NOT_A_RECEIPT';
    const isNoItems = result.error?.code === 'NO_ITEMS_FOUND';
    
    return (
      <div className="w-full max-w-2xl mx-auto px-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 sm:p-8 text-center">
          <svg className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-red-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg sm:text-xl font-semibold text-red-800 mb-2">
            {isNotReceipt ? 'Not a Receipt' : 'Extraction Failed'}
          </h3>
          <p className="text-sm sm:text-base text-red-600 mb-2">{result.error?.message || 'Unable to extract receipt details'}</p>
          
          {/* Add helpful tips */}
          {(isNotReceipt || isNoItems) && (
            <div className="mt-4 mb-6 bg-red-100 rounded-md p-3 sm:p-4 text-left max-w-md mx-auto">
              <p className="text-sm font-medium text-red-800 mb-2">Tips for successful extraction:</p>
              <ul className="text-xs sm:text-sm text-red-700 space-y-1">
                <li>• Upload a clear photo of a receipt or invoice</li>
                <li>• Ensure the entire receipt is visible</li>
                <li>• Avoid blurry or dark images</li>
                <li>• Receipt should show items, prices, and total</li>
              </ul>
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-3">
            <button
              onClick={onTryAgain}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm sm:text-base"
            >
              Try Again
            </button>
            <button
              onClick={onNewReceipt}
              className="px-4 py-2 bg-white text-red-600 border border-red-300 rounded-md hover:bg-red-50 transition-colors text-sm sm:text-base"
            >
              Upload New Receipt
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Success or partial success - show responsive layout
  return (
    <div className="w-full h-full overflow-hidden">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden h-full">
        {/* Mobile and Tablet Layout (flex-col) */}
        <div className="flex flex-col xl:hidden h-full">          {/* Mobile Image Panel - Collapsible */}
          <div className="h-48 sm:h-56 md:h-64 border-b border-gray-200 overflow-hidden flex-shrink-0">
            <ReceiptImageViewer 
              imageUrl={imageUrl}
              fileName={file?.name}
              isMobile={true}
              isLoading={imageLoading}
              onImageLoad={handleImageLoad}
              onImageError={handleImageError}
            />
          </div>

          {/* Mobile Data Panel - Expanded */}
          <div className="flex-1 overflow-hidden">
            <ExtractedDataPanel
              result={result}
              file={file}
              imageUrl={imageUrl}
              onNewReceipt={onNewReceipt}
              isMobile={true}
            />
          </div>
        </div>

        {/* Desktop Layout (flex-row) - XL and above */}
        <div className="hidden xl:flex xl:flex-row h-full">          {/* Desktop Image Panel */}
          <div className="w-2/5 border-r border-gray-200 overflow-hidden flex-shrink-0">
            <ReceiptImageViewer 
              imageUrl={imageUrl}
              fileName={file?.name}
              isMobile={false}
              isLoading={imageLoading}
              onImageLoad={handleImageLoad}
              onImageError={handleImageError}
            />
          </div>

          {/* Desktop Data Panel */}
          <div className="w-3/5 overflow-hidden">
            <ExtractedDataPanel
              result={result}
              file={file}
              imageUrl={imageUrl}
              onNewReceipt={onNewReceipt}
              isMobile={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExtractionResults; 