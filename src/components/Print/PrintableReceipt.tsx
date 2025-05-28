import React from 'react';
import { ReceiptResponse } from '../../types/receipt.types';

interface PrintableReceiptProps {
  data: ReceiptResponse;
  imageUrl?: string;
  formatDate: (dateString: string) => string;
  formatCurrency: (amount: number, currency: string) => string;
}

export const PrintableReceipt: React.FC<PrintableReceiptProps> = ({ 
  data, 
  imageUrl,
  formatDate, 
  formatCurrency 
}) => {
  // Determine if we should show the original receipt
  const shouldShowOriginal = data.status === 'partial' || 
    (data.confidence_score !== undefined && data.confidence_score < 0.85);

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white text-black print:p-0 print:max-w-none">
      {/* Header */}
      <div className="text-center mb-8 print:mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 print:text-2xl">Receipt Details</h1>
        <p className="text-gray-600 print:text-gray-800">Extracted Information</p>
        {data.extracted_at && (
          <p className="text-sm text-gray-500 mt-2 print:text-gray-700">
            Processed on {formatDate(data.extracted_at)}
          </p>
        )}
      </div>

      {/* Confidence and Status Alert */}
      {(data.status === 'partial' || (data.confidence_score && data.confidence_score < 0.9)) && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg print:border-2">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-yellow-600 mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <h3 className="text-sm font-medium text-yellow-800">
                {data.status === 'partial' ? 'Partial Extraction' : 'Low Confidence Extraction'}
              </h3>
              <p className="mt-1 text-sm text-yellow-700">
                Please review the extracted data carefully and cross-verify with the original receipt below.
              </p>
              {data.confidence_score && (
                <p className="mt-1 text-xs text-yellow-600">
                  Confidence Score: {Math.round(data.confidence_score * 100)}%
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Warnings Section */}
      {data.extraction_metadata?.warnings && data.extraction_metadata.warnings.length > 0 && (
        <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
          <h3 className="text-sm font-semibold text-orange-800 mb-2">Extraction Warnings:</h3>
          <ul className="list-disc list-inside text-sm text-orange-700 space-y-1">
            {data.extraction_metadata.warnings.map((warning, index) => (
              <li key={index}>{warning}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 print:gap-6 print:mb-6">
        {/* Merchant Information */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800 border-b-2 border-gray-200 pb-2 print:text-lg">
            Merchant Information
          </h2>
          <div className="space-y-3">
            <div>
              <span className="text-sm font-medium text-gray-600 block">Business Name</span>
              <p className="text-lg font-semibold text-gray-900">{data.vendor_name || 'Unknown'}</p>
            </div>
          </div>
        </div>

        {/* Transaction Information */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800 border-b-2 border-gray-200 pb-2 print:text-lg">
            Transaction Details
          </h2>
          <div className="space-y-3">
            {data.date && (
              <div>
                <span className="text-sm font-medium text-gray-600 block">Date</span>
                <p className="text-lg text-gray-900">{formatDate(data.date)}</p>
              </div>
            )}
            {data.receipt_number && (
              <div>
                <span className="text-sm font-medium text-gray-600 block">Receipt Number</span>
                <p className="text-gray-900 font-mono text-lg">{data.receipt_number}</p>
              </div>
            )}
            {data.payment_method && (
              <div>
                <span className="text-sm font-medium text-gray-600 block">Payment Method</span>
                <p className="text-gray-900">{data.payment_method}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Items Table - Show All Items */}
      {data.receipt_items && data.receipt_items.length > 0 && (
        <div className="mb-8 print:mb-6">
          <h2 className="text-xl font-semibold text-gray-800 border-b-2 border-gray-200 pb-2 mb-4 print:text-lg print:mb-3">
            Items Purchased ({data.receipt_items.length} items)
          </h2>
          <div className="overflow-hidden">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700 print:py-2">#</th>
                  <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700 print:py-2">Item Description</th>
                  <th className="border border-gray-300 px-4 py-3 text-center text-sm font-semibold text-gray-700 print:py-2">Quantity</th>
                  <th className="border border-gray-300 px-4 py-3 text-right text-sm font-semibold text-gray-700 print:py-2">Price</th>
                </tr>
              </thead>
              <tbody>
                {data.receipt_items.map((item, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="border border-gray-300 px-4 py-3 text-sm text-gray-700 font-mono print:py-2">
                      {index + 1}
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-sm text-gray-900 font-medium print:py-2">
                      {item.item_name}
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-sm text-gray-900 text-center print:py-2">
                      {item.quantity || 1}
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-sm font-semibold text-gray-900 text-right font-mono print:py-2">
                      {formatCurrency(item.item_cost, data.currency || 'USD')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Financial Summary */}
      <div className="border-t-2 border-gray-300 pt-6 print:pt-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 print:text-lg print:mb-3">
          Financial Summary
        </h2>
        <div className="bg-gray-50 p-6 rounded-lg print:bg-white print:border print:border-gray-300 print:p-4">
          <div className="space-y-3">
            {data.subtotal !== undefined && (
              <div className="flex justify-between items-center">
                <span className="text-lg text-gray-700">Subtotal:</span>
                <span className="text-lg font-semibold font-mono">
                  {formatCurrency(data.subtotal, data.currency || 'USD')}
                </span>
              </div>
            )}
            
            {data.tax !== undefined && (
              <div className="flex justify-between items-center">
                <span className="text-lg text-gray-700">
                  Tax {data.tax_details?.tax_rate ? `(${data.tax_details.tax_rate})` : ''}:
                </span>
                <span className="text-lg font-semibold font-mono">
                  {formatCurrency(data.tax, data.currency || 'USD')}
                </span>
              </div>
            )}

            {data.total !== undefined && (
              <div className="border-t-2 border-gray-400 pt-3 mt-3">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-gray-900">
                    Total Amount:
                  </span>
                  <span className="text-2xl font-bold text-green-600 font-mono">
                    {formatCurrency(data.total, data.currency || 'USD')}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer with confidence score */}
      <div className="mt-8 pt-6 border-t border-gray-200 text-center print:mt-6 print:pt-4">
        <div className="text-sm text-gray-600 space-y-1 print:text-gray-800">
          {data.confidence_score !== undefined && (
            <p>Extraction confidence: {Math.round(data.confidence_score * 100)}%</p>
          )}
        </div>
      </div>

      {/* Original Receipt Image - Only show when confidence is low or status is partial */}
      {shouldShowOriginal && imageUrl && (
        <div className="page-break-before mt-8 print:mt-0">
          <div className="border-2 border-gray-300 rounded-lg p-6 bg-gray-50">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
              Original Receipt for Verification
            </h2>
            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded">
              <p className="text-sm text-blue-800 text-center">
                <strong>Important:</strong> Due to {data.status === 'partial' ? 'partial extraction' : 'lower confidence'}, 
                please verify the extracted data against the original receipt below.
              </p>
            </div>
            <div className="flex justify-center">
              <img 
                src={imageUrl} 
                alt="Original Receipt" 
                className="max-w-full h-auto border border-gray-300 shadow-lg"
                style={{ maxHeight: '800px' }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 