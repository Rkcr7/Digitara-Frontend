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
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Preview Receipt</h3>
          <p className="text-sm text-gray-600 mt-1">Please confirm this is the receipt you want to process</p>
        </div>

        {/* Image Preview */}
        <div className="p-6">
          <div className="mb-4">
            {previewUrl && !imageError ? (
              <div className="relative bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={previewUrl}
                  alt="Receipt preview"
                  className="w-full h-auto max-h-96 object-contain"
                  onError={handleImageError}
                />
              </div>
            ) : (
              <div className="bg-gray-100 rounded-lg p-8 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p className="mt-2 text-sm text-gray-500">Preview not available</p>
              </div>
            )}
          </div>

          {/* File Information */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 font-medium">File name:</span>
              <span className="text-gray-800 truncate ml-2" title={file.name}>
                {file.name}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 font-medium">File size:</span>
              <span className="text-gray-800">{formatFileSize(file.size)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 font-medium">File type:</span>
              <span className="text-gray-800">{file.type || 'Unknown'}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 font-medium">Last modified:</span>
              <span className="text-gray-800">
                {new Date(file.lastModified).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Choose Different File
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Process Receipt
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilePreview; 