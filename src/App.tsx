import { useState, useEffect } from 'react'
import { apiService } from './services/api.service'
import { HealthCheckResponse } from './types/receipt.types'
import { FileUpload } from './components/FileUpload'
import { FilePreview } from './components/FilePreview'
import { ExtractionProgress } from './components/ExtractionProgress'

function App() {
  const [healthStatus, setHealthStatus] = useState<HealthCheckResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingStatus, setProcessingStatus] = useState<'uploading' | 'processing' | 'extracting' | 'finalizing'>('uploading')
  const [processingProgress, setProcessingProgress] = useState<number>(0)

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
  }

  const handleCancel = () => {
    setSelectedFile(null);
    setIsProcessing(false);
    setProcessingStatus('uploading');
    setProcessingProgress(0);
  }

  const handleConfirm = async () => {
    if (!selectedFile) return;
    
    console.log('Processing receipt:', selectedFile);
    setIsProcessing(true);
    
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
      
      // Complete
      await new Promise(resolve => setTimeout(resolve, 500));
      alert('Receipt processing will be fully implemented in the next checkpoint');
      handleCancel();
    } catch (error) {
      console.error('Error processing receipt:', error);
      alert('Error processing receipt');
      handleCancel();
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-800 mb-2 text-center">
          Receipt Extractor
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Upload a receipt image to extract information automatically
        </p>
        
        {/* API Health Check Status - Minimized */}
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
  )
}

export default App
