import { useState, useEffect } from 'react'
import { apiService } from './services/api.service'
import { HealthCheckResponse, ReceiptResponse } from './types/receipt.types'
import { FileUpload } from './components/FileUpload'
import { FilePreview } from './components/FilePreview'
import { ExtractionProgress } from './components/ExtractionProgress'
import { ExtractionResults } from './components/ExtractionResults'

function App() {
  const [healthStatus, setHealthStatus] = useState<HealthCheckResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingStatus, setProcessingStatus] = useState<'uploading' | 'processing' | 'extracting' | 'finalizing'>('uploading')
  const [processingProgress, setProcessingProgress] = useState<number>(0)
  const [extractionResult, setExtractionResult] = useState<ReceiptResponse | null>(null)

  useEffect(() => {
    // Test API connection on component mount
    const checkApiHealth = async () => {
      try {
        setLoading(true)
        const health = await apiService.checkHealth()
        setHealthStatus(health)
        setError(null)
      } catch (err) {
        const error = err as { message?: string }
        setError(error.message || 'Failed to connect to API')
        setHealthStatus(null)
      } finally {
        setLoading(false)
      }
    }

    checkApiHealth()
  }, [])

  const handleFileSelect = (file: File) => {
    console.log('File selected:', file);
    setSelectedFile(file);
    setExtractionResult(null);
  }

  const handleCancel = () => {
    setSelectedFile(null);
    setIsProcessing(false);
    setProcessingStatus('uploading');
    setProcessingProgress(0);
    setExtractionResult(null);
  }

  const handleNewReceipt = () => {
    handleCancel();
  }

  const handleTryAgain = () => {
    if (selectedFile) {
      handleConfirm();
    }
  }

  const handleConfirm = async () => {
    if (!selectedFile) return;
    
    console.log('Processing receipt:', selectedFile);
    setIsProcessing(true);
    setExtractionResult(null);
    
    // Simulate processing with different stages
    try {
      // Uploading stage
      setProcessingStatus('uploading');
      setProcessingProgress(0);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProcessingProgress(25);
      
      // Processing stage
      setProcessingStatus('processing');
      await new Promise(resolve => setTimeout(resolve, 1500));
      setProcessingProgress(50);
      
      // Extracting stage
      setProcessingStatus('extracting');
      await new Promise(resolve => setTimeout(resolve, 2000));
      setProcessingProgress(75);
      
      // Finalizing stage
      setProcessingStatus('finalizing');
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProcessingProgress(100);
      
      // Complete - show mock results
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock successful result with more items for testing scrollable table
      const mockResult: ReceiptResponse = {
        id: 'mock-123',
        status: 'success',
        extractedData: {
          merchantName: 'SuperMart Grocery Store',
          merchantAddress: '123 Main Street, Anytown, USA 12345',
          merchantPhone: '(555) 123-4567',
          date: new Date().toISOString(),
          items: [
            { name: 'Organic Milk', quantity: 2, unitPrice: 4.99, totalPrice: 9.98 },
            { name: 'Whole Wheat Bread', quantity: 1, unitPrice: 3.49, totalPrice: 3.49 },
            { name: 'Fresh Bananas', quantity: 6, unitPrice: 0.59, totalPrice: 3.54 },
            { name: 'Chicken Breast', quantity: 2.5, unitPrice: 5.99, totalPrice: 14.98 },
            { name: 'Mixed Vegetables', quantity: 1, unitPrice: 2.99, totalPrice: 2.99 },
            { name: 'Greek Yogurt', quantity: 3, unitPrice: 1.99, totalPrice: 5.97 },
            { name: 'Avocados', quantity: 4, unitPrice: 1.25, totalPrice: 5.00 },
            { name: 'Pasta Sauce', quantity: 2, unitPrice: 2.49, totalPrice: 4.98 },
            { name: 'Olive Oil', quantity: 1, unitPrice: 8.99, totalPrice: 8.99 },
            { name: 'Tomatoes', quantity: 3, unitPrice: 1.99, totalPrice: 5.97 }
          ],
          subtotal: 67.89,
          tax: {
            rate: 8.5,
            amount: 5.77,
            type: 'Sales Tax'
          },
          total: 73.66,
          currency: 'USD',
          paymentMethod: 'Credit Card',
          receiptNumber: 'R-2024-001234',
          additionalCharges: [
            { name: 'Bag Fee', amount: 0.10 }
          ]
        },
        metadata: {
          processingTimeMs: 6000,
          aiModel: 'gemini-2.0-flash',
          confidence: 0.92,
          warnings: ['Some text was partially obscured', 'Date format was inferred'],
          extractedAt: new Date().toISOString()
        }
      };
      
      setExtractionResult(mockResult);
      setIsProcessing(false);
    } catch (error) {
      console.error('Error processing receipt:', error);
      
      // Mock error result
      const errorResult: ReceiptResponse = {
        id: 'error-123',
        status: 'failed',
        error: {
          code: 'EXTRACTION_FAILED',
          message: 'Failed to extract receipt data. Please try again.',
          details: {}
        }
      };
      
      setExtractionResult(errorResult);
      setIsProcessing(false);
    }
  }

  return (
    <div className={`${extractionResult ? 'h-screen overflow-hidden' : 'min-h-screen'} bg-gray-50`}>
      {extractionResult ? (
        // Full screen results view
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex-shrink-0 py-4 px-4">
            <h1 className="text-3xl font-bold text-gray-800 text-center">
              Receipt Extractor
            </h1>
            <p className="text-center text-gray-600 mt-1">
              Upload a receipt image to extract information automatically
            </p>
            
            {/* Health Status */}
            <div className="mt-4">
              {loading ? (
                <p className="text-center text-sm text-gray-500">Connecting to backend...</p>
              ) : error ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center max-w-4xl mx-auto">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              ) : healthStatus && healthStatus.status === 'healthy' ? (
                <p className="text-center text-sm text-green-600">✓ Backend connected</p>
              ) : null}
            </div>
          </div>

          {/* Results */}
          <div className="flex-1 px-4 pb-4 overflow-hidden">
            <ExtractionResults
              result={extractionResult}
              file={selectedFile!}
              onNewReceipt={handleNewReceipt}
              onTryAgain={handleTryAgain}
            />
          </div>
        </div>
      ) : (
        // Regular scrollable view for upload/processing
        <div className="py-8">
          <div className="max-w-4xl mx-auto px-4">
            <h1 className="text-4xl font-bold text-gray-800 mb-2 text-center">
              Receipt Extractor
            </h1>
            <p className="text-center text-gray-600 mb-8">
              Upload a receipt image to extract information automatically
            </p>
            
            {/* API Health Check Status */}
            <div className="mb-6">
              {loading ? (
                <p className="text-center text-sm text-gray-500">Connecting to backend...</p>
              ) : error ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              ) : healthStatus && healthStatus.status === 'healthy' ? (
                <p className="text-center text-sm text-green-600">✓ Backend connected</p>
              ) : null}
            </div>

            {/* Main Content */}
            {isProcessing ? (
              <ExtractionProgress
                status={processingStatus}
                progress={processingProgress}
                message={
                  processingStatus === 'uploading' ? 'Securely uploading your receipt...' :
                  processingStatus === 'processing' ? 'Optimizing image for extraction...' :
                  processingStatus === 'extracting' ? 'Using AI to extract receipt details...' :
                  'Almost done! Preparing your results...'
                }
              />
            ) : (
              <div className="bg-white rounded-lg shadow-md p-8">
                {!selectedFile ? (
                  <FileUpload 
                    onFileSelect={handleFileSelect}
                    disabled={loading || !!error}
                  />
                ) : (
                  <FilePreview
                    file={selectedFile}
                    onCancel={handleCancel}
                    onConfirm={handleConfirm}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default App
