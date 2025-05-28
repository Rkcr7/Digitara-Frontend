# UI Configuration Settings

This directory contains configuration files that allow you to easily customize the appearance and behavior of the Receipt Extractor UI.

## `ui-settings.ts`

The main configuration file that controls various aspects of the user interface.

### Items Table Configuration

Controls how the items table is displayed in the extraction results:

```typescript
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
}
```

**Common Customizations:**
- **Show more items before scrolling**: Change `maxVisibleItems` to a higher number (e.g., 10)
- **Disable row numbers**: Set `showRowNumbers` to `false`
- **Compact table**: Set `compactMode` to `true` for smaller spacing
- **Disable hover effects**: Set `enableHoverEffects` to `false`

### Layout Configuration

Controls the panel layout in the results view:

```typescript
layout: {
  // Image panel width percentage (desktop)
  imagePanelWidth: 35,
  
  // Data panel width percentage (desktop) - automatically calculated
  get dataPanelWidth() {
    return 100 - this.imagePanelWidth;
  }
}
```

**Common Customizations:**
- **Larger image panel**: Increase `imagePanelWidth` to 40-50
- **Smaller image panel**: Decrease `imagePanelWidth` to 25-30

### Animation Settings

Controls UI animations and transitions:

```typescript
animations: {
  // Enable smooth transitions
  enableTransitions: true,
  
  // Transition duration in milliseconds
  transitionDuration: 200
}
```

### Confidence Display

Controls how confidence scores are displayed:

```typescript
confidence: {
  // Confidence thresholds for color coding
  highThreshold: 0.8,   // Green
  mediumThreshold: 0.6, // Yellow
  // Below medium threshold = Red
  
  // Show confidence as progress bar
  showProgressBar: true
}
```

## Quick Modifications

### Example 1: Show 10 items before scrolling
```typescript
itemsTable: {
  maxVisibleItems: 10,
  // ... other settings
}
```

### Example 2: Compact table without row numbers
```typescript
itemsTable: {
  maxVisibleItems: 5,
  showRowNumbers: false,
  compactMode: true,
  // ... other settings
}
```

### Example 3: Larger image panel (50/50 split)
```typescript
layout: {
  imagePanelWidth: 50,
  // ... other settings
}
```

### Example 4: Disable all animations
```typescript
animations: {
  enableTransitions: false,
  transitionDuration: 0
}
```

## Helper Functions

The configuration file also exports helper functions:

- `getItemsTableHeight()`: Calculates the table height based on settings
- `getTableRowClasses()`: Returns appropriate CSS classes for table rows

These functions are used internally by the components and automatically respect your configuration changes.

## Notes

- Changes to these settings require a restart of the development server
- The `dataPanelWidth` is automatically calculated based on `imagePanelWidth`
- Row height is approximate and may vary slightly based on content
- On mobile devices, panels stack vertically regardless of width settings 