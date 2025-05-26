import { useState, useEffect } from 'react'
import { apiService } from './services/api.service'
import { HealthCheckResponse } from './types/receipt.types'
import { FileUpload } from './components/FileUpload'
import { FilePreview } from './components/FilePreview'

function App() {
  const [healthStatus, setHealthStatus] = useState<HealthCheckResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

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
  }

  const handleConfirm = () => {
    console.log('Processing receipt:', selectedFile);
    // TODO: Process the receipt in the next checkpoint
    alert('Receipt processing will be implemented in the next checkpoint');
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
      </div>
    </div>
  )
}

export default App
