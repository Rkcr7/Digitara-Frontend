import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { ReceiptResponse } from '../types/receipt.types';
import { PrintableReceipt } from '../components/Print/PrintableReceipt';

interface PrintReceiptOptions {
  data: NonNullable<ReceiptResponse['extractedData']>;
  metadata?: ReceiptResponse['metadata'];
  formatDate: (dateString: string) => string;
  formatCurrency: (amount: number, currency: string) => string;
}

export const printReceipt = ({ data, metadata, formatDate, formatCurrency }: PrintReceiptOptions) => {
  // Create the printable receipt component
  const printableReceiptElement = React.createElement(PrintableReceipt, {
    data,
    metadata,
    formatDate,
    formatCurrency,
  });

  // Render component to HTML string
  const htmlContent = ReactDOMServer.renderToStaticMarkup(printableReceiptElement);

  // Create print window content
  const printContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Receipt Details - Print</title>
      <script src="https://cdn.tailwindcss.com"></script>
      <style>
        @media print {
          body { margin: 0; }
          .print\\:p-0 { padding: 0 !important; }
          .print\\:max-w-none { max-width: none !important; }
          .print\\:mb-6 { margin-bottom: 1.5rem !important; }
          .print\\:mb-3 { margin-bottom: 0.75rem !important; }
          .print\\:text-2xl { font-size: 1.5rem !important; }
          .print\\:text-lg { font-size: 1.125rem !important; }
          .print\\:text-gray-800 { color: #1f2937 !important; }
          .print\\:text-gray-700 { color: #374151 !important; }
          .print\\:py-2 { padding-top: 0.5rem !important; padding-bottom: 0.5rem !important; }
          .print\\:gap-6 { gap: 1.5rem !important; }
          .print\\:pt-4 { padding-top: 1rem !important; }
          .print\\:mt-6 { margin-top: 1.5rem !important; }
          .print\\:bg-white { background-color: white !important; }
          .print\\:border { border-width: 1px !important; }
          .print\\:border-gray-300 { border-color: #d1d5db !important; }
          .print\\:p-4 { padding: 1rem !important; }
        }
        @page { margin: 1in; }
        body { font-family: system-ui, -apple-system, sans-serif; }
      </style>
    </head>
    <body>
      ${htmlContent}
      <script>
        window.onload = function() {
          window.print();
          window.onafterprint = function() {
            window.close();
          };
        };
      </script>
    </body>
    </html>
  `;

  // Open print window
  const printWindow = window.open('', '_blank', 'width=800,height=600');
  if (printWindow) {
    printWindow.document.write(printContent);
    printWindow.document.close();
  } else {
    console.error('Could not open print window. Please check your browser settings.');
  }
}; 