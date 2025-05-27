import React from 'react';
import { ReceiptResponse } from '../../types/receipt.types';
import { DataSections } from './DataSections';
import { MetadataAndActions } from './MetadataAndActions';

interface ExtractedDataPanelProps {
  result: ReceiptResponse;
  file: File | null;
  imageUrl?: string;
  onNewReceipt: () => void;
  isMobile?: boolean;
}

export const ExtractedDataPanel: React.FC<ExtractedDataPanelProps> = ({ 
  result, 
  file,
  imageUrl,
  onNewReceipt,
  isMobile = false
}) => {
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(amount);
    } catch {
      return `${currency} ${amount.toFixed(2)}`;
    }
  };

  // Check if we have any extracted data
  const hasData = result.status !== 'failed' && result.vendor_name;
  
  if (!hasData) {
    return (
      <div className="h-full flex items-center justify-center p-4 sm:p-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 sm:p-8 text-center max-w-md">
          <h3 className={`font-semibold text-yellow-800 mb-2 ${
            isMobile ? 'text-base' : 'text-lg'
          }`}>No Data Extracted</h3>
          <p className={`text-yellow-600 ${
            isMobile ? 'text-sm' : 'text-base'
          }`}>Unable to extract any data from the receipt.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 sm:px-6 py-2 sm:py-3 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center justify-between">
          <h3 className={`font-semibold text-gray-800 flex items-center gap-2 ${
            isMobile ? 'text-base' : 'text-lg'
          }`}>
            <svg className={`text-green-600 ${isMobile ? 'w-4 h-4' : 'w-5 h-5'}`} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {isMobile ? 'Data' : 'Extracted Data'}
            {result.status === 'partial' && (
              <span className={`font-normal text-yellow-600 bg-yellow-100 px-2 py-0.5 rounded ml-2 ${
                isMobile ? 'text-xs' : 'text-sm'
              }`}>
                Partial
              </span>
            )}
          </h3>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        <div className={`space-y-4 sm:space-y-6 ${isMobile ? 'pb-4' : ''}`}>
          <DataSections 
            data={result}
            formatDate={formatDate}
            formatCurrency={formatCurrency}
            isMobile={isMobile}
          />
          
          <MetadataAndActions 
            result={result}
            file={file}
            imageUrl={imageUrl}
            onNewReceipt={onNewReceipt}
            formatDate={formatDate}
            formatCurrency={formatCurrency}
            isMobile={isMobile}
          />
        </div>
      </div>
    </div>
  );
}; 