import React from 'react';

export interface TestImage {
  id: string;
  name: string;
  description: string;
  path: string;
  type: string;
}

interface TestOptionsProps {
  onTestImageSelect: (testImage: TestImage) => void;
  disabled?: boolean;
}

const TEST_IMAGES: TestImage[] = [
  {
    id: 'valid',
    name: 'Valid Receipt',
    description: 'Clean, clear receipt image',
    path: '/test_images/valid_receipt.jpg',
    type: 'image/jpeg'
  },
  {
    id: 'skewed',
    name: 'Skewed Receipt',
    description: 'Blurred or errored receipt',
    path: '/test_images/skewed_receipt.png',
    type: 'image/png'
  },
  {
    id: 'invalid',
    name: 'Non-Receipt',
    description: 'Image that is not a receipt',
    path: '/test_images/invalid_receipt.webp',
    type: 'image/webp'
  }
];

export const TestOptions: React.FC<TestOptionsProps> = ({ onTestImageSelect, disabled = false }) => {
  const handleTestImageClick = (testImage: TestImage) => {
    if (disabled) return;
    onTestImageSelect(testImage);
  };

  return (
    <div className="mt-6 border-t border-gray-200 pt-6">
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-digitara-dark mb-1">
          Try with Example Images
        </h3>
        <p className="text-sm text-digitara-neutral">
          Test the application with sample receipts to see how it works
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {TEST_IMAGES.map((testImage) => (
          <button
            key={testImage.id}
            onClick={() => handleTestImageClick(testImage)}
            disabled={disabled}
            className={`
              group relative bg-white border-2 rounded-lg p-4 text-left transition-all duration-200
              ${disabled 
                ? 'border-gray-200 opacity-50 cursor-not-allowed' 
                : 'border-gray-200 hover:border-digitara-primary hover:shadow-md cursor-pointer'
              }
            `}
          >
            {/* Image Preview */}
            <div className="aspect-[4/3] bg-gray-100 rounded-lg mb-3 overflow-hidden">
              <img
                src={testImage.path}
                alt={testImage.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                loading="lazy"
              />
            </div>

            {/* Content */}
            <div className="space-y-1">
              <h4 className="text-sm font-semibold text-digitara-dark">
                {testImage.name}
              </h4>
              <p className="text-xs text-digitara-neutral">
                {testImage.description}
              </p>
            </div>

            {/* Hover overlay */}
            {!disabled && (
              <div className="absolute inset-0 bg-digitara-primary/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                <span className="bg-digitara-primary text-white px-3 py-1 rounded-full text-xs font-medium">
                  Test This
                </span>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Mobile-friendly note */}
      <div className="mt-4 text-center">
        <p className="text-xs text-digitara-neutral">
          ✨ Click any example to start testing instantly
        </p>
      </div>
    </div>
  );
};

export default TestOptions;