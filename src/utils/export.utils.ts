import { ReceiptResponse } from '../types/receipt.types';

interface ExportReceiptOptions {
  data: ReceiptResponse;
  formatDate: (dateString: string) => string;
  formatCurrency?: (amount: number, currency: string) => string;
  filename?: string;
}

// Create clean data structure for export (including metadata when relevant)
const createCleanReceiptData = (data: ReceiptResponse, formatDate: (dateString: string) => string) => {
  const cleanData = {
    merchant: {
      name: data.vendor_name || 'Unknown',
      receiptNumber: data.receipt_number || null
    },
    transaction: {
      date: data.date ? formatDate(data.date) : 'Unknown',
      paymentMethod: data.payment_method || null
    },
    items: data.receipt_items?.map((item, index) => ({
      itemNumber: index + 1,
      name: item.item_name,
      quantity: item.quantity || 1,
      price: item.item_cost
    })) || [],
    financial: {
      subtotal: data.subtotal,
      tax: {
        rate: data.tax_details?.tax_rate || 'Unknown',
        amount: data.tax || 0,
        type: data.tax_details?.tax_type || 'Tax',
        inclusive: data.tax_details?.tax_inclusive
      },
      total: data.total || 0,
      currency: data.currency || 'USD'
    },
    metadata: {
      status: data.status,
      confidenceScore: data.confidence_score,
      extractedAt: data.extracted_at,
      warnings: data.extraction_metadata?.warnings || []
    }
  };

  return cleanData;
};

// Export as JSON
export const exportAsJSON = ({ data, formatDate, filename }: ExportReceiptOptions) => {
  const cleanData = createCleanReceiptData(data, formatDate);
  
  const jsonContent = JSON.stringify(cleanData, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const defaultFilename = `receipt-${data.receipt_number || 'export'}-${new Date().toISOString().split('T')[0]}.json`;
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename || defaultFilename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Export as Text
export const exportAsText = ({ data, formatDate, formatCurrency, filename }: ExportReceiptOptions) => {
  const cleanData = createCleanReceiptData(data, formatDate);
  
  let textContent = '';
  
  // Header
  textContent += '='.repeat(50) + '\n';
  textContent += 'RECEIPT DETAILS\n';
  textContent += '='.repeat(50) + '\n\n';
  
  // Extraction Status
  if (cleanData.metadata.status !== 'success') {
    textContent += `STATUS: ${cleanData.metadata.status.toUpperCase()}\n`;
    if (cleanData.metadata.confidenceScore) {
      textContent += `CONFIDENCE: ${Math.round(cleanData.metadata.confidenceScore * 100)}%\n`;
    }
    textContent += '\n';
  }
  
  // Warnings if any
  if (cleanData.metadata.warnings.length > 0) {
    textContent += 'WARNINGS:\n';
    textContent += '-'.repeat(25) + '\n';
    cleanData.metadata.warnings.forEach(warning => {
      textContent += `• ${warning}\n`;
    });
    textContent += '\n';
  }
  
  // Merchant Information
  textContent += 'MERCHANT INFORMATION\n';
  textContent += '-'.repeat(25) + '\n';
  textContent += `Business Name: ${cleanData.merchant.name}\n`;
  if (cleanData.merchant.receiptNumber) {
    textContent += `Receipt Number: ${cleanData.merchant.receiptNumber}\n`;
  }
  textContent += '\n';
  
  // Transaction Details
  textContent += 'TRANSACTION DETAILS\n';
  textContent += '-'.repeat(25) + '\n';
  textContent += `Date: ${cleanData.transaction.date}\n`;
  if (cleanData.transaction.paymentMethod) {
    textContent += `Payment Method: ${cleanData.transaction.paymentMethod}\n`;
  }
  textContent += '\n';
  
  // Items
  if (cleanData.items.length > 0) {
    textContent += 'ITEMS PURCHASED\n';
    textContent += '-'.repeat(25) + '\n';
    textContent += `${'#'.padStart(3)} ${'Item'.padEnd(35)} ${'Qty'.padStart(6)} ${'Price'.padStart(12)}\n`;
    textContent += '-'.repeat(60) + '\n';
    
    cleanData.items.forEach((item) => {
      const itemNum = item.itemNumber.toString().padStart(3);
      const itemName = item.name.length > 35 ? item.name.substring(0, 32) + '...' : item.name.padEnd(35);
      const qty = item.quantity.toString().padStart(6);
      const price = formatCurrency ? formatCurrency(item.price, cleanData.financial.currency).padStart(12) : item.price.toFixed(2).padStart(12);
      
      textContent += `${itemNum} ${itemName} ${qty} ${price}\n`;
    });
    textContent += '\n';
  }
  
  // Financial Summary
  textContent += 'FINANCIAL SUMMARY\n';
  textContent += '-'.repeat(25) + '\n';
  if (cleanData.financial.subtotal !== undefined) {
    textContent += `Subtotal: ${formatCurrency ? formatCurrency(cleanData.financial.subtotal, cleanData.financial.currency).padStart(20) : cleanData.financial.subtotal.toFixed(2).padStart(20)}\n`;
  }
  
  const taxLabel = `${cleanData.financial.tax.type} (${cleanData.financial.tax.rate})`;
  textContent += `${taxLabel}: ${formatCurrency ? formatCurrency(cleanData.financial.tax.amount, cleanData.financial.currency).padStart(12) : cleanData.financial.tax.amount.toFixed(2).padStart(12)}\n`;
  
  textContent += '-'.repeat(35) + '\n';
  textContent += `TOTAL: ${formatCurrency ? formatCurrency(cleanData.financial.total, cleanData.financial.currency).padStart(28) : cleanData.financial.total.toFixed(2).padStart(28)}\n`;
  textContent += '='.repeat(50) + '\n';
  
  // Metadata Footer
  textContent += '\nEXTRACTION DETAILS\n';
  textContent += '-'.repeat(25) + '\n';
  textContent += `Status: ${cleanData.metadata.status}\n`;
  if (cleanData.metadata.confidenceScore) {
    textContent += `Confidence Score: ${Math.round(cleanData.metadata.confidenceScore * 100)}%\n`;
  }
  if (cleanData.metadata.extractedAt) {
    textContent += `Extracted At: ${cleanData.metadata.extractedAt}\n`;
  }
  
  // Footer
  textContent += `\nExported on: ${new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })}\n`;
  
  const blob = new Blob([textContent], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  
  const defaultFilename = `receipt-${data.receipt_number || 'export'}-${new Date().toISOString().split('T')[0]}.txt`;
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename || defaultFilename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}; 