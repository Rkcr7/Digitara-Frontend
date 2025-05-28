// Receipt item interface
export interface ReceiptItem {
  item_name: string;
  item_cost: number;
  quantity?: number;
  original_name?: string;
}

// Tax details interface
export interface TaxDetails {
  tax_rate?: string;
  tax_type?: string;
  tax_inclusive?: boolean;
  additional_taxes?: Array<{
    name: string;
    amount: number;
  }>;
}

// Extraction metadata interface
export interface ExtractionMetadata {
  processing_time: number;
  ai_model: string;
  warnings?: string[];
}

// Main receipt response interface - matches backend exactly
export interface ReceiptResponse {
  // Core fields
  status: 'success' | 'partial' | 'failed';
  extraction_id: string;
  
  // Success/Partial fields
  date?: string;
  currency?: string;
  vendor_name?: string;
  receipt_items?: ReceiptItem[];
  subtotal?: number;
  tax?: number;
  tax_details?: TaxDetails;
  total?: number;
  payment_method?: string;
  receipt_number?: string;
  confidence_score?: number;
  image_url?: string;
  extraction_metadata?: ExtractionMetadata;
  extracted_at?: string;
  
  // Error fields
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