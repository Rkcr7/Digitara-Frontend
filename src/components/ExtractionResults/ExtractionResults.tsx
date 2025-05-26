import React, { useEffect, useState } from 'react';
import { ReceiptResponse } from '../../types/receipt.types';
import { createImagePreview } from '../../utils/file.utils';
import { UI_SETTINGS } from '../../config/ui-settings';
import { ReceiptImageViewer } from './ReceiptImageViewer';
import { ExtractedDataPanel } from './ExtractedDataPanel';

interface ExtractionResultsProps {
  result: ReceiptResponse;
  file: File;
  onNewReceipt: () => void;
  onTryAgain: () => void;
}

export const ExtractionResults: React.FC<ExtractionResultsProps> = ({ 
  result, 
  file,
  onNewReceipt,
  onTryAgain
}) => {
  const [imageUrl, setImageUrl] = useState<string | undefined>();
  const { layout } = UI_SETTINGS;

  useEffect(() => {
    // Create preview URL from the file
    const url = createImagePreview(file);
    setImageUrl(url);

    // Cleanup
    return () => {
      if (url) {
        URL.revokeObjectURL(url);
      }
    };
  }, [file]);

  // Handle failed extraction
  if (result.status === 'failed') {
    return (
      <div className="w-full max-w-2xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
          <svg className="mx-auto h-12 w-12 text-red-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-semibold text-red-800 mb-2">Extraction Failed</h3>
          <p className="text-red-600 mb-6">{result.error?.message || 'Unable to extract receipt details'}</p>
          <div className="flex justify-center space-x-3">
            <button
              onClick={onTryAgain}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={onNewReceipt}
              className="px-4 py-2 bg-white text-red-600 border border-red-300 rounded-md hover:bg-red-50 transition-colors"
            >
              Upload New Receipt
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Success or partial success - show two-panel layout
  return (
    <div className="w-full h-[calc(100vh-8rem)] overflow-hidden">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden h-full">
        <div className="flex flex-col lg:flex-row h-full">
          {/* Left Panel - Receipt Image */}
          <div 
            className="h-1/2 lg:h-full border-b lg:border-b-0 lg:border-r border-gray-200 overflow-hidden"
            style={{ width: `${layout.imagePanelWidth}%` }}
          >
            <ReceiptImageViewer 
              imageUrl={imageUrl}
              fileName={file.name}
            />
          </div>

          {/* Right Panel - Extracted Data */}
          <div 
            className="h-1/2 lg:h-full overflow-hidden"
            style={{ width: `${layout.dataPanelWidth}%` }}
          >
            <ExtractedDataPanel
              result={result}
              file={file}
              onNewReceipt={onNewReceipt}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExtractionResults; 