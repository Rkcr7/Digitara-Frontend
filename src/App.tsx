import { useState, useEffect, useCallback, useRef } from 'react'
import { apiService } from './services/api.service'
import { HealthCheckResponse, ReceiptResponse, ApiError } from './types/receipt.types'
import { FileUpload } from './components/FileUpload'
import { FilePreview } from './components/FilePreview'
import { ExtractionProgress } from './components/ExtractionProgress'
import { ExtractionResults } from './components/ExtractionResults'
import { AppHeader } from './components/AppHeader'
import { isOnline, addNetworkListener, isSlowConnection } from './utils/network.utils'

// Processing stages with progress percentages
const PROCESSING_STAGES = {
  uploading: { min: 0, max: 30, message: 'Securely uploading your receipt...' },
  processing: { min: 30, max: 60, message: 'Optimizing image for extraction...' },
  extracting: { min: 60, max: 90, message: 'Using AI to extract receipt details...' },
  finalizing: { min: 90, max: 100, message: 'Almost done! Preparing your results...' }
} as const;

type ProcessingStage = keyof typeof PROCESSING_STAGES;

// Session storage keys
const SESSION_KEYS = {
  SELECTED_FILE: 'receipt_extractor_selected_file',
  LAST_RESULT: 'receipt_extractor_last_result'
} as const;

function App() {
  // Health check state
  const [healthStatus, setHealthStatus] = useState<HealthCheckResponse | null>(null)
  const [healthError, setHealthError] = useState<string | null>(null)
  const [healthLoading, setHealthLoading] = useState(true)
  
  // Network state
  const [isNetworkOnline, setIsNetworkOnline] = useState(isOnline())
  const [isSlowNetwork, setIsSlowNetwork] = useState(isSlowConnection())
  
  // File selection state
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  
  // Processing state
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingStatus, setProcessingStatus] = useState<ProcessingStage>('uploading')
  const [processingProgress, setProcessingProgress] = useState<number>(0)
  const [processingError, setProcessingError] = useState<string | null>(null)
  
  // Results state
  const [extractionResult, setExtractionResult] = useState<ReceiptResponse | null>(null)
  
  // Abort controller for canceling requests
  const abortControllerRef = useRef<AbortController | null>(null)
  
  // Retry tracking
  const [retryCount, setRetryCount] = useState(0)
  const MAX_RETRIES = 2;

  // Network monitoring
  useEffect(() => {
    const cleanup = addNetworkListener(
      () => {
        console.log('Network connection restored')
        setIsNetworkOnline(true)
        setHealthError(null)
      },
      () => {
        console.log('Network connection lost')
        setIsNetworkOnline(false)
        setHealthError('No internet connection')
      }
    )
    
    // Check for slow connection periodically
    const slowCheckInterval = setInterval(() => {
      setIsSlowNetwork(isSlowConnection())
    }, 5000)
    
    return () => {
      cleanup()
      clearInterval(slowCheckInterval)
    }
  }, [])

  // Load saved session data on mount
  useEffect(() => {
    try {
      // Load last result if available
      const savedResult = sessionStorage.getItem(SESSION_KEYS.LAST_RESULT)
      if (savedResult) {
        const result = JSON.parse(savedResult) as ReceiptResponse
        setExtractionResult(result)
        console.log('Restored previous extraction result')
      }
    } catch (error) {
      console.error('Failed to restore session:', error)
    }
  }, [])

  // Save extraction results to session
  useEffect(() => {
    if (extractionResult) {
      try {
        // Save ALL extraction results, not just successful ones
        sessionStorage.setItem(SESSION_KEYS.LAST_RESULT, JSON.stringify(extractionResult))
        console.log(`Saved ${extractionResult.status} extraction result to session`)
      } catch (error) {
        console.error('Failed to save result to session:', error)
      }
    }
  }, [extractionResult])

  // Check API health on mount
  useEffect(() => {
    const checkApiHealth = async () => {
      // Skip if offline
      if (!isNetworkOnline) {
        setHealthError('No internet connection')
        setHealthLoading(false)
        return
      }
      
      try {
        setHealthLoading(true)
        setHealthError(null)
        const health = await apiService.checkHealth()
        setHealthStatus(health)
      } catch (err) {
        const error = err as ApiError
        setHealthError(error.message || 'Failed to connect to backend API')
        setHealthStatus(null)
      } finally {
        setHealthLoading(false)
      }
    }

    checkApiHealth()
    
    // Re-check health every 30 seconds if online
    const interval = setInterval(() => {
      if (isNetworkOnline) {
        checkApiHealth()
      }
    }, 30000)
    
    return () => clearInterval(interval)
  }, [isNetworkOnline])

  // Update progress smoothly
  const updateProgress = useCallback((stage: ProcessingStage, percentage: number) => {
    const stageConfig = PROCESSING_STAGES[stage]
    const progress = stageConfig.min + (percentage / 100) * (stageConfig.max - stageConfig.min)
    setProcessingProgress(Math.min(Math.round(progress), stageConfig.max))
  }, [])

  // Handle file selection
  const handleFileSelect = useCallback((file: File) => {
    console.log('File selected:', file.name, 'Size:', file.size)
    setSelectedFile(file)
    setExtractionResult(null)
    setProcessingError(null)
    setRetryCount(0)
    
    // Clear saved result when new file is selected
    sessionStorage.removeItem(SESSION_KEYS.LAST_RESULT)
  }, [])

  // Cancel/Reset everything
  const handleCancel = useCallback(() => {
    // Abort any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
    
    // Reset all state
    setSelectedFile(null)
    setIsProcessing(false)
    setProcessingStatus('uploading')
    setProcessingProgress(0)
    setExtractionResult(null)
    setProcessingError(null)
    setRetryCount(0)
    
    // Clear session storage
    sessionStorage.removeItem(SESSION_KEYS.LAST_RESULT)
  }, [])

  // Process receipt with actual API call
  const processReceipt = async (file: File, isRetry: boolean = false) => {
    // Create new abort controller
    abortControllerRef.current = new AbortController()
    
    // Track upload interval at function scope
    let uploadInterval: number | null = null
    
    try {
      setIsProcessing(true)
      setProcessingError(null)
      setExtractionResult(null)
      
      // Log retry attempt
      if (isRetry) {
        console.log(`Retry attempt ${retryCount + 1}/${MAX_RETRIES}`)
      }
      
      // Stage 1: Uploading
      setProcessingStatus('uploading')
      updateProgress('uploading', 0)
      
      // Simulate gradual upload progress
      uploadInterval = setInterval(() => {
        updateProgress('uploading', Math.random() * 100)
      }, 200)
      
      // Stage 2: Processing
      setTimeout(() => {
        if (uploadInterval) clearInterval(uploadInterval)
        setProcessingStatus('processing')
        updateProgress('processing', 50)
      }, 1000)
      
      // Stage 3: Extracting (actual API call)
      setTimeout(() => {
        setProcessingStatus('extracting')
        updateProgress('extracting', 0)
      }, 2000)
      
      // Make API call with proper options
      const result = await apiService.extractReceipt(file, {
        includeMetadata: true,
        saveImage: true
      })
      
      // Clear any intervals
      if (uploadInterval) clearInterval(uploadInterval)
      
      // Stage 4: Finalizing
      setProcessingStatus('finalizing')
      updateProgress('finalizing', 100)
      
      // Small delay for UI feedback
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Success!
      console.log('Extraction successful:', result)
      setExtractionResult(result)
      setIsProcessing(false)
      setRetryCount(0)
      
    } catch (error) {
      if (uploadInterval) clearInterval(uploadInterval)
      console.error('Error processing receipt:', error)
      
      // Handle different error types
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          console.log('Request was cancelled')
          return
        }
      }
      
      // Handle API errors
      const apiError = error as ApiError
      let errorMessage = apiError.message || 'Failed to process receipt'
      
      // Enhance error messages based on error code or axios error status
      if (apiError.code === 'NOT_A_RECEIPT') {
        errorMessage = apiError.message || 'This does not appear to be a receipt or invoice. Please upload an image of a receipt.'
      } else if (apiError.code === 'NO_ITEMS_FOUND') {
        errorMessage = 'Could not identify any items on the receipt. Please ensure the image is clear and shows the complete receipt.'
      } else if (apiError.code === 'NETWORK_ERROR') {
        errorMessage = 'Network error. Please check your internet connection and try again.'
      } else if (apiError.code === 'VALIDATION_ERROR') {
        errorMessage = 'Invalid file. Please ensure you upload a valid receipt image (JPEG, PNG, or WebP).'
      } else if (apiError.code === 'AI_SERVICE_UNAVAILABLE') {
        errorMessage = 'AI service is temporarily unavailable. Please try again in a few moments.'
      } else if (apiError.code === 'FILE_TOO_LARGE') {
        errorMessage = 'File is too large. Please upload an image smaller than 10MB.'
      } else if (apiError.code === 'EXTRACTION_FAILED') {
        errorMessage = 'Failed to extract receipt data. The image may be unclear or not a valid receipt.'
      } else if (apiError.code === 'REQUEST_ERROR') {
        errorMessage = 'Failed to process request. Please check your connection and try again.'
      }
      
      // Check if we have axios error response with status
      const axiosError = error as unknown as { response?: { status?: number } }
      if (axiosError.response?.status) {
        const status = axiosError.response.status
        if (status === 413) {
          errorMessage = 'File size exceeds server limit. Please reduce the image size and try again.'
        } else if (status === 429) {
          errorMessage = 'Too many requests. Please wait a moment before trying again.'
        } else if (status >= 500) {
          errorMessage = 'Server error. Our team has been notified. Please try again later.'
        }
      }
      
      setProcessingError(errorMessage)
      
      // Create error result for display
      const errorResult: ReceiptResponse = {
        extraction_id: `error-${Date.now()}`,
        status: 'failed',
        error: {
          code: apiError.code || 'EXTRACTION_FAILED',
          message: errorMessage,
          details: apiError.details || {}
        }
      }
      
      setExtractionResult(errorResult)
      setIsProcessing(false)
    }
  }

  // Handle confirm with retry logic
  const handleConfirm = useCallback(async () => {
    if (!selectedFile) return
    
    console.log('Starting receipt processing...')
    await processReceipt(selectedFile, false)
  }, [selectedFile, updateProgress])

  // Handle retry
  const handleTryAgain = useCallback(async () => {
    if (!selectedFile) return
    
    const newRetryCount = retryCount + 1
    setRetryCount(newRetryCount)
    
    if (newRetryCount > MAX_RETRIES) {
      setProcessingError('Maximum retry attempts reached. Please try uploading a different image.')
      return
    }
    
    console.log(`Retrying receipt processing (attempt ${newRetryCount}/${MAX_RETRIES})...`)
    await processReceipt(selectedFile, true)
  }, [selectedFile, retryCount])

  // Handle new receipt
  const handleNewReceipt = useCallback(() => {
    handleCancel()
  }, [handleCancel])

  // Check if API is available
  const isApiAvailable = !healthLoading && !healthError && healthStatus?.status === 'healthy' && isNetworkOnline
  
  return (
    <div className={`${extractionResult ? 'h-screen overflow-hidden' : 'min-h-screen'} bg-gray-50`}>
      {extractionResult ? (
        // Full screen results view
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex-shrink-0 px-4">
            <AppHeader isCompact={true} />
          </div>

          {/* Results */}
          <div className="flex-1 px-4 pb-4 overflow-hidden">
            <ExtractionResults
              result={extractionResult}
              file={selectedFile}
              onNewReceipt={handleNewReceipt}
              onTryAgain={handleTryAgain}
            />
          </div>
        </div>
      ) : (
        // Regular scrollable view for upload/processing
        <div className="py-2">
          <div className="max-w-4xl mx-auto px-4">
            <AppHeader />
            
            {/* Connection Status - Only show critical errors */}
            <div className="mb-6">
              {!isNetworkOnline && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                  <p className="text-sm text-red-600 font-medium">
                    <span className="inline-block mr-2">🔌</span>
                    No internet connection
                  </p>
                  <p className="text-xs text-red-500 mt-1">
                    Please check your internet connection and try again
                  </p>
                </div>
              )}
              
              {/* Slow Network Warning */}
              {isNetworkOnline && isSlowNetwork && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-center">
                  <p className="text-sm text-yellow-700">
                    <span className="inline-block mr-2">⚠️</span>
                    Slow network detected - processing may take longer than usual
                  </p>
                </div>
              )}
            </div>

            {/* Main Content */}
            {isProcessing ? (
              <div>
                <ExtractionProgress
                  status={processingStatus}
                  progress={processingProgress}
                  message={PROCESSING_STAGES[processingStatus].message}
                />
                
                {/* Slow network warning during processing */}
                {isSlowNetwork && (
                  <div className="mt-4 max-w-md mx-auto">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-center">
                      <p className="text-xs text-yellow-700">
                        Processing on slow connection - please be patient
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                {!selectedFile ? (
                  <div className="bg-white rounded-lg shadow-md p-8">
                    <FileUpload 
                      onFileSelect={handleFileSelect}
                      disabled={!isApiAvailable}
                    />
                  </div>
                ) : (
                  <div className="h-[calc(100vh-280px)] min-h-[500px]">
                    <FilePreview
                      file={selectedFile}
                      onCancel={handleCancel}
                      onConfirm={handleConfirm}
                    />
                  </div>
                )}
                
                {/* Show processing error if any */}
                {processingError && !extractionResult && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{processingError}</p>
                    {retryCount < MAX_RETRIES && (
                      <button
                        onClick={handleTryAgain}
                        className="mt-2 text-sm text-red-700 underline hover:text-red-800"
                      >
                        Try again ({MAX_RETRIES - retryCount} attempts remaining)
                      </button>
                    )}
                  </div>
                )}
                
                {/* Offline prompt */}
                {!isNetworkOnline && selectedFile && (
                  <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg text-center">
                    <p className="text-sm text-gray-600">
                      <span className="inline-block mr-2">📵</span>
                      You're currently offline. Connect to the internet to process your receipt.
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default App
