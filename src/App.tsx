import { useState, useEffect } from 'react'
import { apiService } from './services/api.service'
import { HealthCheckResponse } from './types/receipt.types'

function App() {
  const [healthStatus, setHealthStatus] = useState<HealthCheckResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

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

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Receipt Extractor
        </h1>
        
        {/* API Health Check Status */}
        <div className="mb-8 p-4 bg-gray-100 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">API Status:</h2>
          {loading ? (
            <p className="text-gray-600">Checking API connection...</p>
          ) : error ? (
            <div className="text-red-600">
              <p className="font-medium">Connection Error:</p>
              <p className="text-sm">{error}</p>
            </div>
          ) : healthStatus ? (
            <div className="text-green-600">
              <p className="font-medium">✓ API Connected</p>
              <p className="text-sm text-gray-600">
                Status: {healthStatus.status} | Version: {healthStatus.version}
              </p>
              <p className="text-sm text-gray-600">
                Supported formats: {healthStatus.supportedFormats?.join(', ')}
              </p>
            </div>
          ) : null}
        </div>

        {/* Placeholder for future components */}
        <div className="text-center text-gray-500">
          <p>Receipt upload component will be added here in the next checkpoint.</p>
        </div>
      </div>
    </div>
  )
}

export default App
