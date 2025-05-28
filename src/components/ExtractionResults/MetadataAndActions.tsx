import React from 'react';
import { ReceiptResponse } from '../../types/receipt.types';
import { formatFileSize } from '../../utils/file.utils';
import { printReceipt } from '../../utils/print.utils';
import { ExportDropdown } from './ExportDropdown';

interface MetadataAndActionsProps {
  result: ReceiptResponse;
  file: File | null;
  imageUrl?: string;
  onNewReceipt: () => void;
  formatDate: (dateString: string) => string;
  formatCurrency: (amount: number, currency: string) => string;
  isMobile?: boolean;
}

export const MetadataAndActions: React.FC<MetadataAndActionsProps> = ({ 
  result, 
  file, 
  imageUrl,
  onNewReceipt,
  formatDate,
  formatCurrency,
  isMobile = false
}) => {
  const handlePrint = () => {
    if (result.status !== 'failed') {
      printReceipt({
        data: result,
        imageUrl: imageUrl,
        formatDate,
        formatCurrency
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Metadata and Warnings Row */}
      <div className={`grid grid-cols-1 gap-4 ${isMobile ? '' : 'lg:grid-cols-2'}`}>
        {/* Extraction Details */}
        {(result.extraction_metadata || result.confidence_score !== undefined) && (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-3 sm:px-4 py-2 border-b border-gray-200">
              <h4 className={`font-semibold text-gray-700 uppercase tracking-wider ${
                isMobile ? 'text-xs' : 'text-sm'
              }`}>
                Extraction Details
              </h4>
            </div>
            <div className="p-3 sm:p-4 space-y-2">
              {result.confidence_score !== undefined && (
                <div className="flex justify-between items-center">
                  <span className={`text-gray-600 ${
                    isMobile ? 'text-xs' : 'text-sm'
                  }`}>Confidence</span>
                  <div className="flex items-center gap-2">
                    <div className={`h-2 bg-gray-200 rounded-full overflow-hidden ${
                      isMobile ? 'w-12' : 'w-16'
                    }`}>
                      <div 
                        className={`h-full transition-all ${
                          result.confidence_score >= 0.8 ? 'bg-green-500' : 
                          result.confidence_score >= 0.6 ? 'bg-yellow-500' : 
                          'bg-red-500'
                        }`}
                        style={{ width: `${result.confidence_score * 100}%` }}
                      />
                    </div>
                    <span className={`font-medium ${
                      isMobile ? 'text-xs' : 'text-sm'
                    } ${
                      result.confidence_score >= 0.8 ? 'text-green-600' : 
                      result.confidence_score >= 0.6 ? 'text-yellow-600' : 
                      'text-red-600'
                    }`}>
                      {Math.round(result.confidence_score * 100)}%
                    </span>
                  </div>
                </div>
              )}
              {result.extraction_metadata?.processing_time && (
                <div className="flex justify-between items-center">
                  <span className={`text-gray-600 ${
                    isMobile ? 'text-xs' : 'text-sm'
                  }`}>Processing Time</span>
                  <span className={`text-gray-900 ${
                    isMobile ? 'text-xs' : 'text-sm'
                  }`}>{result.extraction_metadata.processing_time}ms</span>
                </div>
              )}
              {result.extraction_metadata?.ai_model && (
                <div className="flex justify-between items-center">
                  <span className={`text-gray-600 ${
                    isMobile ? 'text-xs' : 'text-sm'
                  }`}>AI Model</span>
                  <span className={`text-gray-900 font-mono ${
                    isMobile ? 'text-xs' : 'text-xs'
                  }`}>{result.extraction_metadata.ai_model}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Warnings */}
        {result.extraction_metadata?.warnings && result.extraction_metadata.warnings.length > 0 && (
          <div className="bg-yellow-50 rounded-lg border border-yellow-200 overflow-hidden">
            <div className="bg-yellow-100 px-3 sm:px-4 py-2 border-b border-yellow-200">
              <h4 className={`font-semibold text-yellow-800 uppercase tracking-wider ${
                isMobile ? 'text-xs' : 'text-sm'
              }`}>
                Warnings
              </h4>
            </div>
            <div className="p-3 sm:p-4">
              <ul className={`text-yellow-700 space-y-1 ${
                isMobile ? 'text-xs' : 'text-sm'
              }`}>
                {result.extraction_metadata.warnings.map((warning, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-yellow-600 mr-2">•</span>
                    <span>{warning}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Actions Bar */}
      <div className="bg-gray-50 rounded-lg border border-gray-200 px-3 sm:px-4 py-3 flex flex-col gap-3">
        {/* File Info */}
        <div className={`text-gray-600 flex items-center gap-2 ${
          isMobile ? 'text-xs' : 'text-sm'
        }`}>
          <svg className={`text-gray-400 ${isMobile ? 'w-3 h-3' : 'w-4 h-4'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span className="truncate">{file?.name || 'Receipt'}</span>
          {file && <span className="text-gray-400 flex-shrink-0">({formatFileSize(file.size)})</span>}
        </div>
        
        {/* Action Buttons */}
        <div className={`flex gap-2 ${isMobile ? 'flex-col' : 'flex-row justify-end'}`}>
          {/* Export Dropdown */}
          {result.status !== 'failed' && (
            <ExportDropdown
              data={result}
              formatDate={formatDate}
              formatCurrency={formatCurrency}
            />
          )}
          
          {/* Print Button */}
          <button
            onClick={handlePrint}
            className={`px-3 py-1.5 text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex items-center gap-2 justify-center ${
              isMobile ? 'text-sm' : 'text-sm'
            }`}
            disabled={result.status === 'failed'}
          >
            <svg className={`${isMobile ? 'w-4 h-4' : 'w-4 h-4'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print
          </button>
          
          {/* Process Another Receipt Button */}
          <button
            onClick={onNewReceipt}
            className={`px-4 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2 justify-center ${
              isMobile ? 'text-sm' : 'text-sm'
            }`}
          >
            <svg className={`${isMobile ? 'w-4 h-4' : 'w-4 h-4'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Process Another Receipt
          </button>
        </div>
      </div>
    </div>
  );
}; 