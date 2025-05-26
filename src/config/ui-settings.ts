// UI Configuration Settings
// Modify these values to customize the appearance and behavior of the UI

export const UI_SETTINGS = {
  // Items Table Configuration
  itemsTable: {
    // Number of items to show before enabling scroll
    maxVisibleItems: 5,
    
    // Height per row in pixels (approximate)
    rowHeight: 48,
    
    // Show row numbers in the table
    showRowNumbers: true,
    
    // Enable hover effects on table rows
    enableHoverEffects: true,
    
    // Compact mode (smaller padding and text)
    compactMode: false
  },
  
  // Layout Configuration
  layout: {
    // Image panel width percentage (desktop)
    imagePanelWidth: 35,
    
    // Data panel width percentage (desktop) - automatically calculated
    get dataPanelWidth() {
      return 100 - this.imagePanelWidth;
    }
  },
  
  // Animation Settings
  animations: {
    // Enable smooth transitions
    enableTransitions: true,
    
    // Transition duration in milliseconds
    transitionDuration: 200
  },
  
  // Confidence Display
  confidence: {
    // Confidence thresholds for color coding
    highThreshold: 0.8,   // Green
    mediumThreshold: 0.6, // Yellow
    // Below medium threshold = Red
    
    // Show confidence as progress bar
    showProgressBar: true
  }
} as const;

// Helper function to calculate items table height
export const getItemsTableHeight = () => {
  const { maxVisibleItems, rowHeight } = UI_SETTINGS.itemsTable;
  const headerHeight = 44; // Approximate header height
  return (maxVisibleItems * rowHeight) + headerHeight;
};

// Helper function to get table row classes
export const getTableRowClasses = (isCompact: boolean = UI_SETTINGS.itemsTable.compactMode) => {
  const baseClasses = "transition-colors";
  const hoverClasses = UI_SETTINGS.itemsTable.enableHoverEffects ? "hover:bg-gray-50" : "";
  const paddingClasses = isCompact ? "px-2 py-1" : "px-4 py-2";
  
  return `${baseClasses} ${hoverClasses} ${paddingClasses}`.trim();
}; 