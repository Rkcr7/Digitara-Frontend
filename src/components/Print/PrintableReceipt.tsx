import React from 'react';
import { ReceiptResponse } from '../../types/receipt.types';

interface PrintableReceiptProps {
  data: NonNullable<ReceiptResponse['extractedData']>;
  metadata?: ReceiptResponse['metadata'];
  formatDate: (dateString: string) => string;
  formatCurrency: (amount: number, currency: string) => string;
}

export const PrintableReceipt: React.FC<PrintableReceiptProps> = ({ 
  data, 
  metadata,
  formatDate, 
  formatCurrency 
}) => {
  return (
    <div className="max-w-4xl mx-auto p-8 bg-white text-black print:p-0 print:max-w-none">
      {/* Header */}
      <div className="text-center mb-8 print:mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 print:text-2xl">Receipt Details</h1>
        <p className="text-gray-600 print:text-gray-800">Extracted Information</p>
        {metadata?.extractedAt && (
          <p className="text-sm text-gray-500 mt-2 print:text-gray-700">
            Processed on {formatDate(metadata.extractedAt)}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 print:gap-6 print:mb-6">
        {/* Merchant Information */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800 border-b-2 border-gray-200 pb-2 print:text-lg">
            Merchant Information
          </h2>
          <div className="space-y-3">
            <div>
              <span className="text-sm font-medium text-gray-600 block">Business Name</span>
              <p className="text-lg font-semibold text-gray-900">{data.merchantName}</p>
            </div>
            {data.merchantAddress && (
              <div>
                <span className="text-sm font-medium text-gray-600 block">Address</span>
                <p className="text-gray-900">{data.merchantAddress}</p>
              </div>
            )}
            {data.merchantPhone && (
              <div>
                <span className="text-sm font-medium text-gray-600 block">Phone</span>
                <p className="text-gray-900">{data.merchantPhone}</p>
              </div>
            )}
          </div>
        </div>

        {/* Transaction Information */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800 border-b-2 border-gray-200 pb-2 print:text-lg">
            Transaction Details
          </h2>
          <div className="space-y-3">
            <div>
              <span className="text-sm font-medium text-gray-600 block">Date & Time</span>
              <p className="text-lg text-gray-900">{formatDate(data.date)}</p>
            </div>
            {data.receiptNumber && (
              <div>
                <span className="text-sm font-medium text-gray-600 block">Receipt Number</span>
                <p className="text-gray-900 font-mono text-lg">{data.receiptNumber}</p>
              </div>
            )}
            {data.paymentMethod && (
              <div>
                <span className="text-sm font-medium text-gray-600 block">Payment Method</span>
                <p className="text-gray-900">{data.paymentMethod}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Items Table - Show All Items */}
      {data.items && data.items.length > 0 && (
        <div className="mb-8 print:mb-6">
          <h2 className="text-xl font-semibold text-gray-800 border-b-2 border-gray-200 pb-2 mb-4 print:text-lg print:mb-3">
            Items Purchased ({data.items.length} items)
          </h2>
          <div className="overflow-hidden">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700 print:py-2">#</th>
                  <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700 print:py-2">Item Description</th>
                  <th className="border border-gray-300 px-4 py-3 text-center text-sm font-semibold text-gray-700 print:py-2">Quantity</th>
                  <th className="border border-gray-300 px-4 py-3 text-right text-sm font-semibold text-gray-700 print:py-2">Unit Price</th>
                  <th className="border border-gray-300 px-4 py-3 text-right text-sm font-semibold text-gray-700 print:py-2">Total Price</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((item, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="border border-gray-300 px-4 py-3 text-sm text-gray-700 font-mono print:py-2">
                      {index + 1}
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-sm text-gray-900 font-medium print:py-2">
                      {item.name}
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-sm text-gray-900 text-center print:py-2">
                      {item.quantity}
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-sm text-gray-900 text-right font-mono print:py-2">
                      {formatCurrency(item.unitPrice, data.currency)}
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-sm font-semibold text-gray-900 text-right font-mono print:py-2">
                      {formatCurrency(item.totalPrice, data.currency)}
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
            <div className="flex justify-between items-center">
              <span className="text-lg text-gray-700">Subtotal:</span>
              <span className="text-lg font-semibold font-mono">{formatCurrency(data.subtotal, data.currency)}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-lg text-gray-700">Tax ({data.tax.rate}%):</span>
              <span className="text-lg font-semibold font-mono">{formatCurrency(data.tax.amount, data.currency)}</span>
            </div>

            {data.additionalCharges && data.additionalCharges.length > 0 && (
              <>
                {data.additionalCharges.map((charge, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-lg text-gray-700">{charge.name}:</span>
                    <span className="text-lg font-semibold font-mono">{formatCurrency(charge.amount, data.currency)}</span>
                  </div>
                ))}
              </>
            )}

            <div className="border-t-2 border-gray-400 pt-3 mt-3">
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-gray-900">Total Amount:</span>
                <span className="text-2xl font-bold text-green-600 font-mono">
                  {formatCurrency(data.total, data.currency)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      {metadata && (
        <div className="mt-8 pt-6 border-t border-gray-200 text-center print:mt-6 print:pt-4">
          <div className="text-sm text-gray-600 space-y-1 print:text-gray-800">
            {metadata.confidence && (
              <p>Extraction confidence: {Math.round(metadata.confidence * 100)}%</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}; 