import { useState } from 'react'

interface AppHeaderProps {
  isCompact?: boolean
}

export function AppHeader({ isCompact = false }: AppHeaderProps) {
  const [showInfo, setShowInfo] = useState(false)

  return (
    <div className={`text-center ${isCompact ? 'py-3' : 'py-2'}`}>
      <div className="flex items-center justify-center gap-3 mb-2">
        {/* Logo */}
        <img 
          src="/logo.png" 
          alt="Receipt Extractor Logo" 
          className={`${isCompact ? 'h-14 w-14' : 'h-18 w-18'} object-contain`}
        />
        
        {/* Title */}
        <h1 className={`font-bold text-gray-800 ${isCompact ? 'text-2xl' : 'text-4xl'}`}>
          Receipt Extractor
        </h1>
        
        {/* Info Icon */}
        <div className="relative">
          <button
            onMouseEnter={() => setShowInfo(true)}
            onMouseLeave={() => setShowInfo(false)}
            onClick={() => setShowInfo(!showInfo)}
            className="ml-1 p-1 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Information about Receipt Extractor"
          >
            <svg 
              className={`${isCompact ? 'h-5 w-5' : 'h-6 w-6'} text-gray-500 hover:text-gray-700`} 
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
          
          {/* Info Tooltip */}
          {showInfo && (
            <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-50">
              <div className="bg-gray-900 text-white text-sm rounded-lg px-4 py-3 shadow-lg max-w-xs">
                <div className="text-center">
                  <p className="font-medium mb-1">AI-Powered Receipt Processing</p>
                  <p className="text-gray-300 text-xs leading-relaxed">
                    Upload any receipt image and our AI will automatically extract merchant details, 
                    items, prices, taxes, and totals with high accuracy.
                  </p>
                  <div className="mt-2 pt-2 border-t border-gray-700">
                    <p className="text-gray-400 text-xs">
                      Supports JPEG, PNG, WebP • Max 10MB
                    </p>
                  </div>
                </div>
                {/* Arrow */}
                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2">
                  <div className="w-2 h-2 bg-gray-900 rotate-45"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Description */}
      <p className={`text-gray-600 max-w-2xl mx-auto ${isCompact ? 'text-sm' : 'text-base'}`}>
        Transform your receipt images into structured data instantly with AI-powered extraction
      </p>
    </div>
  )
} 