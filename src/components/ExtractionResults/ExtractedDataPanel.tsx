import React from 'react';
import { ReceiptResponse } from '../../types/receipt.types';
import { DataSections } from './DataSections';
import { MetadataAndActions } from './MetadataAndActions';

interface ExtractedDataPanelProps {
  result: ReceiptResponse;
  file: File;
  onNewReceipt: () => void;
}

export const ExtractedDataPanel: React.FC<ExtractedDataPanelProps> = ({ 
  result, 
  file,
  onNewReceipt 
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

  const data = result.extractedData;
  if (!data) {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">No Data Extracted</h3>
          <p className="text-yellow-600">Unable to extract any data from the receipt.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white px-6 py-3 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Extracted Data
            {result.status === 'partial' && (
              <span className="text-sm font-normal text-yellow-600 bg-yellow-100 px-2 py-0.5 rounded ml-2">
                Partial
              </span>
            )}
          </h3>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-6">
          <DataSections 
            data={data}
            formatDate={formatDate}
            formatCurrency={formatCurrency}
          />
          
          <MetadataAndActions 
            result={result}
            file={file}
            onNewReceipt={onNewReceipt}
            formatDate={formatDate}
            formatCurrency={formatCurrency}
          />
        </div>
      </div>
    </div>
  );
}; 