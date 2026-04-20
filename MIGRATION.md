# Migration Guide: ngx-slider Feature Parity

This guide helps you upgrade your existing `RangeInputComponent` usage to take advantage of the new ngx-slider feature parity enhancements.

## Overview

The `RangeInputComponent` has been extended with new features while maintaining **100% backward compatibility**. All existing code will continue to work without changes. New features are opt-in via configuration options.

## What's New

- **Range Slider (Dual-Handle Mode)**: Select min/max ranges with two handles
- **Keyboard Navigation**: Control sliders with arrow keys, Page Up/Down, Home/End
- **Animations**: Smooth CSS transitions for programmatic value changes
- **Custom Tooltips**: Configurable tooltips with multiple display modes
- **Enhanced Styling**: More granular control over appearance via CSS classes and custom properties
- **Improved Accessibility**: Enhanced ARIA support for screen readers

## Breaking Changes

**None!** All changes are backward compatible. Existing configurations will continue to work as before.

## Migration Steps

### Step 1: Review Your Current Usage

No changes are required for existing implementations. The component will work exactly as before with default settings.

```typescript
// Existing code - no changes needed
<mg-range-input
  [min]="0"
  [max]="100"
  [step]="1"
  [(ngModel)]="value"
  [options]="{ showProgressBar: true, showTicks: true }"
></mg-range-input>
```

### Step 2: Opt Into New Features

New features are disabled by default. Enable them by adding configuration options:

#### Enable Range Slider (Dual-Handle Mode)

```typescript
// Before: Single value slider
options = {
  showProgressBar: true,
};

// After: Range slider with min/max handles
options = {
  showProgressBar: true,
  enableRangeMode: true,
  minValue: 20,
  maxValue: 80,
};
```

```html
<!-- Listen to range change events -->
<mg-range-input
  [min]="0"
  [max]="100"
  [options]="options"
  (minValueChange)="onMinChange($event)"
  (maxValueChange)="onMaxChange($event)"
  (rangeChange)="onRangeChange($event)"></mg-range-input>
```

#### Enable Keyboard Navigation

Keyboard navigation is **enabled by default**. To customize or disable:

```typescript
options = {
  enableKeyboardNavigation: true, // Default: true
  largeStepPercentage: 10, // Default: 10% of range for Page Up/Down
};
```

**Keyboard Shortcuts:**

- `Arrow Up/Right`: Increase by one step
- `Arrow Down/Left`: Decrease by one step
- `Page Up`: Increase by large step (10% of range by default)
- `Page Down`: Decrease by large step
- `Home`: Jump to minimum value
- `End`: Jump to maximum value

#### Enable Animations

Animations are **enabled by default**. To customize or disable:

```typescript
options = {
  enableAnimations: true, // Default: true
  animationDuration: 200, // Default: 200ms
  animationEasing: 'ease-out', // Default: 'ease-out'
};
```

Animations apply only to programmatic value changes, not user drag interactions.

#### Enable Tooltips

```typescript
options = {
  showTooltip: 'onHover', // 'always' | 'onHover' | 'onDrag' | 'never'
  tooltipPlacement: 'top', // 'top' | 'bottom' | 'left' | 'right'
  tooltipDelay: 500, // Delay before hiding (ms)
  formatTooltipValue: (value) => `$${value.toFixed(2)}`, // Custom formatter
};
```

#### Customize Styling

```typescript
options = {
  customHandleClass: 'my-handle',
  customTrackClass: 'my-track',
  customProgressClass: 'my-progress',
  handleSize: 20, // pixels
  trackHeight: 4, // pixels
};
```

**CSS Custom Properties:**

```css
.c-range-input {
  --range-input-handle-color: #005f9e;
  --range-input-handle-active-color: #004080;
  --range-input-track-color: #c2c2cd;
  --range-input-progress-color: #005f9e;
  --range-input-tick-color: #c2c2cd;
  --range-input-tick-value-color: #333;
  --range-input-animation-duration: 200ms;
  --range-input-animation-easing: ease-out;
  --range-input-handle-size: 20px;
  --range-input-track-height: 4px;
}
```

#### Improve Accessibility

```typescript
options = {
  ariaValueTextFormatter: (value) => `${value} dollars`,
  minHandleAriaLabel: 'Minimum price', // For dual-handle mode
  maxHandleAriaLabel: 'Maximum price', // For dual-handle mode
};
```

## Complete Example: Before and After

### Before (Existing Code)

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-price-filter',
  template: `
    <mg-range-input
      [min]="0"
      [max]="1000"
      [step]="10"
      [(ngModel)]="price"
      [options]="options"
      (rangeDrop)="onPriceChange($event)"></mg-range-input>
  `,
})
export class PriceFilterComponent {
  price = 500;
  options = {
    showProgressBar: true,
    prefix: '$',
    displayFormat: '0,0',
  };

  onPriceChange(value: number) {
    console.log('Price:', value);
  }
}
```

### After (With New Features)

```typescript
import { Component } from '@angular/core';
import { RangeInputOptions } from './shared/range-input/range-input';

@Component({
  selector: 'app-price-filter',
  template: `
    <mg-range-input
      [min]="0"
      [max]="1000"
      [step]="10"
      [options]="options"
      (rangeChange)="onRangeChange($event)"></mg-range-input>
  `,
})
export class PriceFilterComponent {
  options: RangeInputOptions = {
    // Existing options (still work!)
    showProgressBar: true,
    prefix: '$',
    displayFormat: '0,0',

    // NEW: Enable range slider
    enableRangeMode: true,
    minValue: 200,
    maxValue: 800,

    // NEW: Customize animations
    enableAnimations: true,
    animationDuration: 300,

    // NEW: Add tooltips
    showTooltip: 'onHover',
    tooltipPlacement: 'top',
    formatTooltipValue: (value) => `$${value.toLocaleString()}`,

    // NEW: Improve accessibility
    ariaValueTextFormatter: (value) => `${value} dollars`,
    minHandleAriaLabel: 'Minimum price',
    maxHandleAriaLabel: 'Maximum price',

    // NEW: Custom styling
    customHandleClass: 'price-handle',
    handleSize: 24,
    trackHeight: 6,
  };

  onRangeChange(range: { min: number; max: number }) {
    console.log('Price range:', range.min, 'to', range.max);
  }
}
```

## Feature-Specific Migration

### Migrating to Range Slider Mode

If you need to select a range instead of a single value:

1. **Enable range mode** in options:

   ```typescript
   options = {
     enableRangeMode: true,
     minValue: 20, // Initial min value
     maxValue: 80, // Initial max value
   };
   ```

2. **Update event handlers**:

   ```typescript
   // Before: Single value events
   rangeDrag =
     'onDrag($event)'(rangeDrop) =
     'onDrop($event)'(
       // After: Range events (rangeDrag/rangeDrop still work for backward compatibility)
       minValueChange,
     ) =
     'onMinChange($event)'(maxValueChange) =
     'onMaxChange($event)'(rangeChange) =
       'onRangeChange($event)';
   ```

3. **Update component logic**:

   ```typescript
   // Before
   onDrop(value: number) {
     this.selectedValue = value;
   }

   // After
   onRangeChange(range: { min: number; max: number }) {
     this.selectedMin = range.min;
     this.selectedMax = range.max;
   }
   ```

### Adding Keyboard Navigation

Keyboard navigation is enabled by default. To customize:

```typescript
// Disable keyboard navigation
options = {
  enableKeyboardNavigation: false,
};

// Customize large step size
options = {
  enableKeyboardNavigation: true,
  largeStepPercentage: 20, // Page Up/Down moves 20% of range
};
```

### Adding Tooltips

```typescript
// Show tooltip on hover
options = {
  showTooltip: 'onHover',
  tooltipPlacement: 'top',
};

// Show tooltip only during drag
options = {
  showTooltip: 'onDrag',
};

// Always show tooltip
options = {
  showTooltip: 'always',
};

// Custom tooltip formatting
options = {
  showTooltip: 'onHover',
  formatTooltipValue: (value) => {
    return `${value}%`;
  },
};
```

### Customizing Animations

```typescript
// Disable animations
options = {
  enableAnimations: false,
};

// Customize animation timing
options = {
  enableAnimations: true,
  animationDuration: 400,
  animationEasing: 'cubic-bezier(0.4, 0, 0.2, 1)',
};
```

### Enhancing Accessibility

```typescript
// Custom ARIA valuetext
options = {
  ariaValueTextFormatter: (value) => {
    if (value === 0) return 'No items';
    if (value === 1) return 'One item';
    return `${value} items`;
  },
};

// Dual-handle ARIA labels
options = {
  enableRangeMode: true,
  minHandleAriaLabel: 'Minimum temperature',
  maxHandleAriaLabel: 'Maximum temperature',
};
```

## iOS Safari Compatibility

The component handles iOS Safari's native range input limitations automatically:

- **Two-tap interaction**: iOS requires tapping to focus, then dragging (native behavior)
- **Drag from thumb**: Drag gestures must start on the thumb, not the track
- **Touch-action**: Applied automatically to prevent scroll conflicts
- **Webkit-appearance**: Preserved for touch handler compatibility

No code changes are needed for iOS compatibility.

## TypeScript Types

All new interfaces are exported for type safety:

```typescript
import {
  RangeInputOptions,
  RangeSliderState,
  TooltipState,
  RangeInputTickData,
} from './shared/range-input/range-input';

// Use in your component
options: RangeInputOptions = {
  enableRangeMode: true,
  showTooltip: 'onHover',
};
```

## Testing Your Migration

After enabling new features, test:

1. **Functionality**: Verify sliders work as expected
2. **Keyboard Navigation**: Test all keyboard shortcuts
3. **Accessibility**: Test with screen readers (NVDA, JAWS, VoiceOver)
4. **Mobile**: Test on iOS Safari and Android Chrome
5. **Animations**: Verify smooth transitions on programmatic changes
6. **Tooltips**: Test all tooltip modes and placements

## Common Issues

### Issue: Animations feel too slow/fast

**Solution**: Adjust `animationDuration`:

```typescript
options = {
  animationDuration: 150, // Faster (default: 200)
};
```

### Issue: Tooltips hide too quickly

**Solution**: Increase `tooltipDelay`:

```typescript
options = {
  tooltipDelay: 1000, // 1 second (default: 500ms)
};
```

### Issue: Range handles overlap and are hard to click

**Solution**: Increase `handleSize`:

```typescript
options = {
  handleSize: 24, // Larger handles (default: 20px)
};
```

### Issue: Keyboard navigation steps are too small

**Solution**: Adjust `step` or `largeStepPercentage`:

```typescript
[step] = '5'[options] = '{ largeStepPercentage: 20 }'; // Larger step for arrow keys // Larger step for Page Up/Down
```

## Getting Help

If you encounter issues during migration:

1. Check the [README.md](./README.md) for feature examples
2. Review the TypeScript types for available options
3. Check browser console for configuration validation warnings
4. Ensure you're using the latest version of the component

## Rollback

If you need to rollback, simply remove the new configuration options. The component will revert to its previous behavior:

```typescript
// Remove new options to rollback
options = {
  showProgressBar: true,
  showTicks: true,
  // All new options removed
};
```

All existing functionality remains unchanged and fully supported.
