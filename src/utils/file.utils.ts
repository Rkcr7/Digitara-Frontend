// Accepted file types for receipts
export const ACCEPTED_FILE_TYPES = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/webp': ['.webp'],
};

// Maximum file size in bytes (10MB)
export const MAX_FILE_SIZE = 10 * 1024 * 1024;

// Get file extension
export const getFileExtension = (filename: string): string => {
  const parts = filename.split('.');
  return parts.length > 1 ? `.${parts[parts.length - 1].toLowerCase()}` : '';
};

// Format file size for display
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Validate file type
export const isValidFileType = (file: File): boolean => {
  const acceptedTypes = Object.keys(ACCEPTED_FILE_TYPES);
  return acceptedTypes.includes(file.type);
};

// Validate file size
export const isValidFileSize = (file: File): boolean => {
  return file.size <= MAX_FILE_SIZE;
};

// Get error message for file validation
export const getFileValidationError = (file: File): string | null => {
  if (!isValidFileType(file)) {
    const extension = getFileExtension(file.name);
    return `File type "${extension}" is not supported. Please upload JPEG, PNG, or WebP images.`;
  }
  
  if (!isValidFileSize(file)) {
    return `File size (${formatFileSize(file.size)}) exceeds the maximum allowed size of ${formatFileSize(MAX_FILE_SIZE)}.`;
  }
  
  return null;
};

// Create a preview URL for an image file
export const createImagePreview = (file: File): string => {
  return URL.createObjectURL(file);
};

// Clean up preview URL to prevent memory leaks
export const revokeImagePreview = (url: string): void => {
  URL.revokeObjectURL(url);
}; 