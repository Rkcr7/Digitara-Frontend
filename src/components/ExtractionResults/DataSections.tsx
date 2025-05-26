import React from 'react';
import { ReceiptResponse } from '../../types/receipt.types';
import { UI_SETTINGS, getItemsTableHeight, getTableRowClasses } from '../../config/ui-settings';

interface DataSectionsProps {
  data: ReceiptResponse;
  formatDate: (dateString: string) => string;
  formatCurrency: (amount: number, currency: string) => string;
}

export const DataSections: React.FC<DataSectionsProps> = ({ 
  data, 
  formatDate, 
  formatCurrency 
}) => {
  const { itemsTable } = UI_SETTINGS;
  const shouldEnableScroll = data.receipt_items && data.receipt_items.length > itemsTable.maxVisibleItems;
  const tableHeight = getItemsTableHeight();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Left Column */}
      <div className="space-y-4">
        {/* Merchant Information */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
            <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
              Merchant Information
            </h4>
          </div>
          <div className="p-4 space-y-2">
            <div>
              <span className="text-xs text-gray-500">Name</span>
              <p className="font-medium text-gray-900">{data.vendor_name || 'Unknown'}</p>
            </div>
          </div>
        </div>

        {/* Transaction Details */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
            <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
              Transaction Details
            </h4>
          </div>
          <div className="p-4 space-y-2">
            {data.date && (
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">Date</span>
                <p className="font-medium text-gray-900">{formatDate(data.date)}</p>
              </div>
            )}
            {data.receipt_number && (
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">Receipt #</span>
                <p className="text-sm text-gray-900 font-mono">{data.receipt_number}</p>
              </div>
            )}
            {data.payment_method && (
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">Payment Method</span>
                <p className="text-sm text-gray-900">{data.payment_method}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div className="space-y-4">
        {/* Financial Summary */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
            <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
              Financial Summary
            </h4>
          </div>
          <div className="p-4 space-y-2">
            {data.subtotal !== undefined && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Subtotal</span>
                <span className="text-sm font-medium">
                  {formatCurrency(data.subtotal, data.currency || 'USD')}
                </span>
              </div>
            )}
            {data.tax !== undefined && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  Tax {data.tax_details?.tax_rate ? `(${data.tax_details.tax_rate})` : ''}
                </span>
                <span className="text-sm font-medium">
                  {formatCurrency(data.tax, data.currency || 'USD')}
                </span>
              </div>
            )}
            {data.total !== undefined && (
              <div className="border-t pt-2 mt-2 flex justify-between items-center">
                <span className="text-base font-semibold text-gray-900">
                  Total
                </span>
                <span className="text-lg font-bold text-green-600">
                  {formatCurrency(data.total, data.currency || 'USD')}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Full Width Items Table */}
      {data.receipt_items && data.receipt_items.length > 0 && (
        <div className="col-span-1 lg:col-span-2">
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex justify-between items-center">
              <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                Items
              </h4>
              <span className="text-xs text-gray-500">{data.receipt_items.length} items</span>
            </div>
            <div className="overflow-x-auto">
              <div 
                className={shouldEnableScroll ? 'overflow-y-auto' : ''}
                style={shouldEnableScroll ? { maxHeight: `${tableHeight}px` } : {}}
              >
                <table className="min-w-full">
                  <thead className={`bg-gray-50 text-xs uppercase text-gray-600 ${shouldEnableScroll ? 'sticky top-0 z-10' : ''}`}>
                    <tr>
                      {itemsTable.showRowNumbers && (
                        <th className="px-4 py-3 text-left font-medium">#</th>
                      )}
                      <th className="px-4 py-3 text-left font-medium">Item</th>
                      <th className="px-4 py-3 text-center font-medium">Qty</th>
                      <th className="px-4 py-3 text-right font-medium">Price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {data.receipt_items.map((item, index) => (
                      <tr key={index} className={getTableRowClasses()}>
                        {itemsTable.showRowNumbers && (
                          <td className="px-4 py-3 text-sm text-gray-500 font-mono">
                            {index + 1}
                          </td>
                        )}
                        <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                          {item.item_name}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 text-center">
                          {item.quantity || 1}
                        </td>
                        <td className="px-4 py-3 text-sm font-semibold text-gray-900 text-right font-mono">
                          {formatCurrency(item.item_cost, data.currency || 'USD')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Scroll indicator for large tables */}
              {shouldEnableScroll && (
                <div className="bg-gray-50 px-4 py-2 text-center border-t border-gray-200">
                  <span className="text-xs text-gray-500 flex items-center justify-center">
                    <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                    Scroll to see all items
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 