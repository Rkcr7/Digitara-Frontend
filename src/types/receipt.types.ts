// Receipt item interface
export interface ReceiptItem {
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  description?: string;
  category?: string;
}

// Tax details interface
export interface TaxDetails {
  rate: number;
  amount: number;
  type?: string;
}

// Extraction metadata interface
export interface ExtractionMetadata {
  processingTimeMs: number;
  aiModel: string;
  confidence: number;
  warnings: string[];
  extractedAt: string;
}

// Main receipt response interface
export interface ReceiptResponse {
  id: string;
  status: 'success' | 'partial' | 'failed';
  extractedData?: {
    merchantName: string;
    merchantAddress?: string;
    merchantPhone?: string;
    date: string;
    items: ReceiptItem[];
    subtotal: number;
    tax: TaxDetails;
    total: number;
    currency: string;
    paymentMethod?: string;
    receiptNumber?: string;
    additionalCharges?: {
      name: string;
      amount: number;
    }[];
  };
  imageUrl?: string;
  metadata?: ExtractionMetadata;
  error?: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}

// Extract receipt request interface
export interface ExtractReceiptRequest {
  customId?: string;
  saveImage?: boolean;
  includeMetadata?: boolean;
  language?: string;
}

// API error interface
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  timestamp: string;
}

// Supported currency interface
export interface SupportedCurrency {
  code: string;
  name: string;
  symbol: string;
}

// Health check response interface
export interface HealthCheckResponse {
  status: 'healthy' | 'unhealthy';
  version: string;
  capabilities: string[];
  supportedFormats: string[];
  timestamp: string;
} 