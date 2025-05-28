import React, { useState, useRef, useEffect } from 'react';
import { ReceiptResponse } from '../../types/receipt.types';
import { exportAsJSON, exportAsText } from '../../utils/export.utils';

interface ExportDropdownProps {
  data: ReceiptResponse;
  formatDate: (dateString: string) => string;
  formatCurrency: (amount: number, currency: string) => string;
}

export const ExportDropdown: React.FC<ExportDropdownProps> = ({ 
  data, 
  formatDate, 
  formatCurrency 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleExportJSON = () => {
    exportAsJSON({ data, formatDate });
    setIsOpen(false);
  };

  const handleExportText = () => {
    exportAsText({ data, formatDate, formatCurrency });
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Export Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-3 py-1.5 text-sm text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex items-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Export
        <svg 
          className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute bottom-full right-0 mb-1 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-50">
          <div className="py-1">
            <button
              onClick={handleExportJSON}
              className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
            >
              <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              JSON
            </button>
            <button
              onClick={handleExportText}
              className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
            >
              <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Text
            </button>
          </div>
        </div>
      )}
    </div>
  );
}; 