import { useState } from 'react'

interface AppHeaderProps {
  isCompact?: boolean
}

export function AppHeader({ isCompact = false }: AppHeaderProps) {
  const [showInfo, setShowInfo] = useState(false)

  return (
    <div className={`text-center ${isCompact ? 'py-3' : 'py-0'}`}>
      {isCompact ? (
        // Compact header for results/error pages
        <div className="flex items-center justify-center gap-3">
          <img
            src="/logo.png"
            alt="Digitara Logo"
            className="h-20 w-auto object-contain"
          />
          <h1 className="font-bold text-digitara-primary text-2xl">
            Digitara
          </h1>
          <div className="relative">
            <button
              onMouseEnter={() => setShowInfo(true)}
              onMouseLeave={() => setShowInfo(false)}
              onClick={() => setShowInfo(!showInfo)}
              className="ml-1 p-1 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Information about Digitara"
            >
              <svg
                className="h-5 w-5 text-digitara-neutral hover:text-digitara-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </button>
            {showInfo && (
              <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-50">
                <div className="bg-digitara-dark text-white text-sm rounded-lg px-4 py-3 shadow-lg max-w-xs">
                  <p className="font-medium">Intelligent Document Processing</p>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        // Full header for main pages
        <div className="flex flex-col items-center justify-center gap-4">
          <img
            src="/logo.png"
            alt="Digitara Logo"
            className="h-40 w-auto object-contain"
          />
          <p className="text-digitara-neutral max-w-2xl mx-auto text-base">
            Intelligent document processing that transforms receipts into structured data with precision
          </p>
        </div>
      )}
    </div>
  )
} 