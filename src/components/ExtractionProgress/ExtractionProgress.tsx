import React from 'react';

interface ExtractionProgressProps {
  status: 'uploading' | 'processing' | 'extracting' | 'finalizing';
  progress?: number;
  message?: string;
}

export const ExtractionProgress: React.FC<ExtractionProgressProps> = ({ 
  status, 
  progress, 
  message 
}) => {
  const getStatusMessage = () => {
    switch (status) {
      case 'uploading':
        return 'Uploading receipt...';
      case 'processing':
        return 'Processing image...';
      case 'extracting':
        return 'Extracting receipt details...';
      case 'finalizing':
        return 'Finalizing results...';
      default:
        return 'Processing...';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'uploading':
        return (
          <svg className="animate-bounce w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        );
      case 'processing':
      case 'extracting':
        return (
          <svg className="animate-spin w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        );
      case 'finalizing':
        return (
          <svg className="animate-pulse w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          {getStatusIcon()}
        </div>

        {/* Status Message */}
        <h3 className="text-lg font-semibold text-gray-800 text-center mb-2">
          {getStatusMessage()}
        </h3>

        {/* Custom Message */}
        {message && (
          <p className="text-sm text-gray-600 text-center mb-4">
            {message}
          </p>
        )}

        {/* Progress Bar */}
        {progress !== undefined && (
          <div className="mb-4">
            <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-blue-600 h-full transition-all duration-300 ease-out"
                style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 text-center mt-2">
              {Math.round(progress)}% complete
            </p>
          </div>
        )}

        {/* Processing Steps */}
        <div className="mt-6 space-y-2">
          <ProcessingStep 
            label="Upload Receipt" 
            status={status === 'uploading' ? 'active' : 'completed'} 
          />
          <ProcessingStep 
            label="Process Image" 
            status={
              status === 'uploading' ? 'pending' : 
              status === 'processing' ? 'active' : 
              'completed'
            } 
          />
          <ProcessingStep 
            label="Extract Details" 
            status={
              ['uploading', 'processing'].includes(status) ? 'pending' : 
              status === 'extracting' ? 'active' : 
              'completed'
            } 
          />
          <ProcessingStep 
            label="Finalize Results" 
            status={
              status === 'finalizing' ? 'active' : 
              'pending'
            } 
          />
        </div>

        {/* Cancel Note */}
        <p className="text-xs text-gray-500 text-center mt-6">
          Please wait while we process your receipt...
        </p>
      </div>
    </div>
  );
};

// Processing Step Component
interface ProcessingStepProps {
  label: string;
  status: 'pending' | 'active' | 'completed';
}

const ProcessingStep: React.FC<ProcessingStepProps> = ({ label, status }) => {
  const getIcon = () => {
    switch (status) {
      case 'completed':
        return (
          <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      case 'active':
        return (
          <svg className="w-5 h-5 text-blue-600 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        );
      case 'pending':
      default:
        return (
          <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
        );
    }
  };

  return (
    <div className="flex items-center space-x-3">
      {getIcon()}
      <span className={`text-sm ${
        status === 'completed' ? 'text-gray-700' : 
        status === 'active' ? 'text-blue-600 font-medium' : 
        'text-gray-400'
      }`}>
        {label}
      </span>
    </div>
  );
};

export default ExtractionProgress; 