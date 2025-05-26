import { ReceiptResponse } from '../types/receipt.types';

interface ExportReceiptOptions {
  data: NonNullable<ReceiptResponse['extractedData']>;
  formatDate: (dateString: string) => string;
  formatCurrency?: (amount: number, currency: string) => string;
  filename?: string;
}

// Create clean data structure for export (excluding processing metadata)
const createCleanReceiptData = (data: NonNullable<ReceiptResponse['extractedData']>, formatDate: (dateString: string) => string) => {
  return {
    merchant: {
      name: data.merchantName,
      address: data.merchantAddress || null,
      phone: data.merchantPhone || null
    },
    transaction: {
      date: formatDate(data.date),
      receiptNumber: data.receiptNumber || null,
      paymentMethod: data.paymentMethod || null
    },
    items: data.items?.map((item, index) => ({
      itemNumber: index + 1,
      name: item.name,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      totalPrice: item.totalPrice
    })) || [],
    financial: {
      subtotal: data.subtotal,
      tax: {
        rate: data.tax.rate,
        amount: data.tax.amount,
        type: data.tax.type || 'Tax'
      },
      additionalCharges: data.additionalCharges?.map(charge => ({
        name: charge.name,
        amount: charge.amount
      })) || [],
      total: data.total,
      currency: data.currency
    }
  };
};

// Export as JSON
export const exportAsJSON = ({ data, formatDate, filename }: ExportReceiptOptions) => {
  const cleanData = createCleanReceiptData(data, formatDate);
  
  const jsonContent = JSON.stringify(cleanData, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const defaultFilename = `receipt-${data.receiptNumber || 'export'}-${new Date().toISOString().split('T')[0]}.json`;
  
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
  
  // Merchant Information
  textContent += 'MERCHANT INFORMATION\n';
  textContent += '-'.repeat(25) + '\n';
  textContent += `Business Name: ${cleanData.merchant.name}\n`;
  if (cleanData.merchant.address) {
    textContent += `Address: ${cleanData.merchant.address}\n`;
  }
  if (cleanData.merchant.phone) {
    textContent += `Phone: ${cleanData.merchant.phone}\n`;
  }
  textContent += '\n';
  
  // Transaction Details
  textContent += 'TRANSACTION DETAILS\n';
  textContent += '-'.repeat(25) + '\n';
  textContent += `Date: ${cleanData.transaction.date}\n`;
  if (cleanData.transaction.receiptNumber) {
    textContent += `Receipt Number: ${cleanData.transaction.receiptNumber}\n`;
  }
  if (cleanData.transaction.paymentMethod) {
    textContent += `Payment Method: ${cleanData.transaction.paymentMethod}\n`;
  }
  textContent += '\n';
  
  // Items
  if (cleanData.items.length > 0) {
    textContent += 'ITEMS PURCHASED\n';
    textContent += '-'.repeat(25) + '\n';
    textContent += `${'#'.padStart(3)} ${'Item'.padEnd(30)} ${'Qty'.padStart(6)} ${'Unit Price'.padStart(12)} ${'Total'.padStart(12)}\n`;
    textContent += '-'.repeat(65) + '\n';
    
    cleanData.items.forEach((item) => {
      const itemNum = item.itemNumber.toString().padStart(3);
      const itemName = item.name.length > 30 ? item.name.substring(0, 27) + '...' : item.name.padEnd(30);
      const qty = item.quantity.toString().padStart(6);
      const unitPrice = formatCurrency ? formatCurrency(item.unitPrice, cleanData.financial.currency).padStart(12) : item.unitPrice.toString().padStart(12);
      const total = formatCurrency ? formatCurrency(item.totalPrice, cleanData.financial.currency).padStart(12) : item.totalPrice.toString().padStart(12);
      
      textContent += `${itemNum} ${itemName} ${qty} ${unitPrice} ${total}\n`;
    });
    textContent += '\n';
  }
  
  // Financial Summary
  textContent += 'FINANCIAL SUMMARY\n';
  textContent += '-'.repeat(25) + '\n';
  textContent += `Subtotal: ${formatCurrency ? formatCurrency(cleanData.financial.subtotal, cleanData.financial.currency).padStart(20) : cleanData.financial.subtotal.toString().padStart(20)}\n`;
  textContent += `${cleanData.financial.tax.type} (${cleanData.financial.tax.rate}%): ${formatCurrency ? formatCurrency(cleanData.financial.tax.amount, cleanData.financial.currency).padStart(12) : cleanData.financial.tax.amount.toString().padStart(12)}\n`;
  
  // Additional charges
  if (cleanData.financial.additionalCharges.length > 0) {
    cleanData.financial.additionalCharges.forEach(charge => {
      textContent += `${charge.name}: ${formatCurrency ? formatCurrency(charge.amount, cleanData.financial.currency).padStart(20) : charge.amount.toString().padStart(20)}\n`;
    });
  }
  
  textContent += '-'.repeat(35) + '\n';
  textContent += `TOTAL: ${formatCurrency ? formatCurrency(cleanData.financial.total, cleanData.financial.currency).padStart(28) : cleanData.financial.total.toString().padStart(28)}\n`;
  textContent += '='.repeat(50) + '\n';
  
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
  
  const defaultFilename = `receipt-${data.receiptNumber || 'export'}-${new Date().toISOString().split('T')[0]}.txt`;
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename || defaultFilename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}; 