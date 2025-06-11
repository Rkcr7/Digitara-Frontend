import React, { useCallback } from 'react';
import { useDropzone, FileRejection } from 'react-dropzone';
import { 
  ACCEPTED_FILE_TYPES, 
  MAX_FILE_SIZE, 
  getFileValidationError,
  formatFileSize 
} from '../../utils/file.utils';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, disabled = false }) => {
  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
    // Handle accepted files
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      const error = getFileValidationError(file);
      
      if (error) {
        alert(error);
        return;
      }
      
      onFileSelect(file);
    }
    
    // Handle rejected files
    if (rejectedFiles.length > 0) {
      const file = rejectedFiles[0].file;
      const error = getFileValidationError(file);
      alert(error || 'File was rejected. Please try another file.');
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_FILE_TYPES,
    maxSize: MAX_FILE_SIZE,
    maxFiles: 1,
    disabled,
  });

  return (
    <div
      {...getRootProps()}
      className={`
        relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 cursor-pointer
        ${isDragActive
          ? 'border-digitara-primary bg-digitara-primary/10'
          : 'border-digitara-neutral/40 hover:border-digitara-primary/60 bg-white hover:bg-digitara-light/50'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      <input {...getInputProps()} />
      
      {/* Upload Icon */}
      <div className="mb-4 flex justify-center">
        <svg
          className={`w-12 h-12 ${isDragActive ? 'text-digitara-primary' : 'text-digitara-neutral'}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
          />
        </svg>
      </div>

      {/* Instructions */}
      <div className="space-y-2">
        <p className="text-lg font-medium text-digitara-dark">
          {isDragActive ? 'Drop your document here' : 'Drag & drop your document here'}
        </p>
        <p className="text-sm text-digitara-neutral">
          or <span className="text-digitara-primary underline font-medium">click to browse</span>
        </p>
      </div>

      {/* File Requirements */}
      <div className="mt-4 text-xs text-digitara-neutral space-y-1">
        <p>Supported formats: JPEG, PNG, WebP • Encrypted processing</p>
        <p>Maximum file size: {formatFileSize(MAX_FILE_SIZE)} • Enterprise security</p>
      </div>
    </div>
  );
};

export default FileUpload; 