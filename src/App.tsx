import { useState, useEffect } from 'react'
import { apiService } from './services/api.service'
import { HealthCheckResponse } from './types/receipt.types'
import { FileUpload } from './components/FileUpload'

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
            <div className="text-center">
              <p className="text-lg font-medium text-gray-700 mb-2">
                File selected: {selectedFile.name}
              </p>
              <button
                onClick={() => setSelectedFile(null)}
                className="text-blue-600 hover:text-blue-700 underline text-sm"
              >
                Choose a different file
              </button>
              <p className="mt-4 text-gray-500 text-sm">
                File preview component will be added in the next checkpoint
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
