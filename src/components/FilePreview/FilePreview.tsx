import React, { useEffect, useState } from 'react';
import { formatFileSize, createImagePreview, revokeImagePreview } from '../../utils/file.utils';

interface FilePreviewProps {
  file: File;
  onCancel: () => void;
  onConfirm: () => void;
}

export const FilePreview: React.FC<FilePreviewProps> = ({ file, onCancel, onConfirm }) => {
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [imageError, setImageError] = useState<boolean>(false);

  useEffect(() => {
    // Create preview URL when file changes
    const url = createImagePreview(file);
    setPreviewUrl(url);

    // Cleanup function to revoke the URL
    return () => {
      revokeImagePreview(url);
    };
  }, [file]);

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-lg shadow-md overflow-hidden">
      {/* Compact Header */}
      <div className="flex-shrink-0 bg-gray-50 px-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-digitara-dark">Preview Document</h3>
        <p className="text-sm text-digitara-neutral">Confirm this is the document you want to process</p>
      </div>

      {/* Main Content Area - Responsive */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        
        {/* Image Preview - Scrollable */}
        <div className="flex-1 p-4 overflow-auto h-64 md:h-auto">
          {previewUrl && !imageError ? (
            <div className="h-full flex items-center justify-center">
              <img
                src={previewUrl}
                alt="Document preview"
                className="max-w-full max-h-full object-contain rounded-lg shadow-sm"
                onError={handleImageError}
              />
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="bg-gray-100 rounded-lg p-8 text-center">
                <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="mt-3 text-sm text-gray-500">Preview not available</p>
              </div>
            </div>
          )}
        </div>

        {/* File Information - Stacks on mobile */}
        <div className="w-full md:w-80 flex-shrink-0 bg-gray-50 border-t md:border-t-0 md:border-l border-gray-200 p-4 flex flex-col">
          <h4 className="text-sm font-semibold text-digitara-dark mb-3">File Details</h4>
          
          <div className="space-y-3 text-sm">
            <div>
              <span className="text-gray-600 font-medium block mb-1">File name:</span>
              <span className="text-gray-800 break-all" title={file.name}>
                {file.name}
              </span>
            </div>
            
            <div>
              <span className="text-gray-600 font-medium block mb-1">File size:</span>
              <span className="text-gray-800">{formatFileSize(file.size)}</span>
            </div>
            
            <div>
              <span className="text-gray-600 font-medium block mb-1">File type:</span>
              <span className="text-gray-800">{file.type || 'Unknown'}</span>
            </div>
            
            <div>
              <span className="text-gray-600 font-medium block mb-1">Last modified:</span>
              <span className="text-gray-800">
                {new Date(file.lastModified).toLocaleDateString()} {new Date(file.lastModified).toLocaleTimeString()}
              </span>
            </div>
          </div>


        </div>
      </div>

      {/* Sticky Action Buttons */}
      <div className="flex-shrink-0 bg-white border-t border-gray-200 px-6 py-4">
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 space-y-2 sm:space-y-0">
          <button
            onClick={onCancel}
            className="px-6 py-2.5 text-sm font-medium text-digitara-neutral bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-digitara-primary transition-colors"
          >
            Choose Different File
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-2.5 text-sm font-medium text-white bg-digitara-primary border border-transparent rounded-lg hover:bg-digitara-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-digitara-primary transition-colors"
          >
            Process Document
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilePreview; 