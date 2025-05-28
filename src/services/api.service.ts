import axios, { AxiosInstance, AxiosError } from 'axios';
import {
  ReceiptResponse,
  ExtractReceiptRequest,
  ApiError,
  SupportedCurrency,
  HealthCheckResponse,
} from '../types/receipt.types';

// API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
const API_TIMEOUT = 60000; // 60 seconds for receipt processing

// Create axios instance with default configuration
const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

// Request interceptor for logging and auth (if needed in future)
axiosInstance.interceptors.request.use(
  (config) => {
    // Log request in development
    if (import.meta.env.DEV) {
      console.log('API Request:', config.method?.toUpperCase(), config.url);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => {
    // Log response in development
    if (import.meta.env.DEV) {
      console.log('API Response:', response.status, response.data);
    }
    return response;
  },
  (error: AxiosError<ApiError>) => {
    // Handle different error scenarios
    if (error.response) {
      // Server responded with error status
      const responseData = error.response.data as {
        error_code?: string;
        message?: string;
        details?: unknown;
        timestamp?: string;
      } | ApiError;
      
      // Handle backend error response structure
      let apiError: ApiError;
      if (responseData && 'error_code' in responseData) {
        // Backend sends error_code, frontend expects code
        apiError = {
          code: responseData.error_code || 'UNKNOWN_ERROR',
          message: responseData.message || error.message,
          details: responseData.details as Record<string, unknown>,
          timestamp: responseData.timestamp || new Date().toISOString(),
        };
      } else {
        apiError = responseData as ApiError || {
          code: 'UNKNOWN_ERROR',
          message: error.message,
          timestamp: new Date().toISOString(),
        };
      }
      
      // Log error in development
      if (import.meta.env.DEV) {
        console.error('API Error:', apiError);
      }
      
      return Promise.reject(apiError);
    } else if (error.request) {
      // Request was made but no response received
      const networkError: ApiError = {
        code: 'NETWORK_ERROR',
        message: 'Unable to connect to the server. Please check your connection.',
        timestamp: new Date().toISOString(),
      };
      return Promise.reject(networkError);
    } else {
      // Something else happened
      const unknownError: ApiError = {
        code: 'REQUEST_ERROR',
        message: error.message || 'An error occurred while making the request.',
        timestamp: new Date().toISOString(),
      };
      return Promise.reject(unknownError);
    }
  }
);

// API service class
class ApiService {
  /**
   * Extract receipt details from an uploaded image
   * @param file - The receipt image file to process
   * @param options - Optional request parameters
   * @returns Promise with the receipt extraction response
   */
  async extractReceipt(
    file: File,
    options?: ExtractReceiptRequest
  ): Promise<ReceiptResponse> {
    const formData = new FormData();
    formData.append('file', file);

    // Add optional parameters if provided
    if (options?.customId) {
      formData.append('customId', options.customId);
    }
    if (options?.saveImage !== undefined) {
      formData.append('saveImage', String(options.saveImage));
    }
    if (options?.includeMetadata !== undefined) {
      formData.append('includeMetadata', String(options.includeMetadata));
    }
    if (options?.language) {
      formData.append('language', options.language);
    }

    try {
      const response = await axiosInstance.post<ReceiptResponse>(
        '/extract-receipt-details',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (error) {
      // Re-throw the error with proper typing
      throw error as ApiError;
    }
  }

  /**
   * Get list of supported currencies
   * @returns Promise with array of supported currencies
   */
  async getSupportedCurrencies(): Promise<SupportedCurrency[]> {
    try {
      const response = await axiosInstance.get<SupportedCurrency[]>(
        '/extract-receipt-details/currencies',
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error as ApiError;
    }
  }

  /**
   * Check the health status of the receipt extraction service
   * @returns Promise with health check response
   */
  async checkHealth(): Promise<HealthCheckResponse> {
    try {
      const response = await axiosInstance.get<HealthCheckResponse>(
        '/extract-receipt-details/health',
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error as ApiError;
    }
  }

  /**
   * Manually validate receipt data
   * @param receiptData - The receipt data to validate
   * @returns Promise with validation response
   */
  async validateReceipt(receiptData: ReceiptResponse): Promise<{ valid: boolean; errors?: string[] }> {
    try {
      const response = await axiosInstance.post<{ valid: boolean; errors?: string[] }>(
        '/extract-receipt-details/validate',
        receiptData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error as ApiError;
    }
  }

  /**
   * Get the full URL for an image
   * @param imageUrl - The relative image URL from the API
   * @returns The full URL for the image
   */
  getImageUrl(imageUrl: string): string {
    if (imageUrl.startsWith('http')) {
      return imageUrl;
    }
    return `${API_BASE_URL}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
  }
}

// Export singleton instance
export const apiService = new ApiService();

// Export the service class for testing purposes
export default ApiService; 