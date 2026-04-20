# RangeInputTest

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 15.2.8.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## RangeInputComponent - iOS Safari Compatibility

The `RangeInputComponent` uses native HTML `<input type="range">` elements, which have specific behavior and limitations on iOS Safari. This section documents these limitations and how the component handles them.

### iOS Safari Limitations

#### 1. Two-Tap Interaction Pattern (Requirement 7.1)

**Behavior**: On iOS Safari, interacting with a range slider requires two separate actions:

- **First tap**: Focuses the slider and moves the thumb to the tapped position
- **Second interaction**: Allows dragging the thumb

**Impact**: Users cannot drag the slider in a single continuous gesture from an unfocused state.

**Handling**: This is native iOS Safari behavior and cannot be overridden programmatically. The component gracefully handles this pattern without additional code changes.

#### 2. Drag Must Start on Thumb (Requirement 7.4)

**Behavior**: On iOS Safari, drag gestures must originate from the thumb element itself. Users cannot initiate a drag by touching the track.

**Impact**: Users must tap directly on the thumb to drag it. Tapping the track will jump the thumb to that position but won't initiate a drag.

**Handling**: The component's CSS preserves `-webkit-appearance` properties that maintain iOS touch handlers on the thumb (Requirement 7.2, 7.6). The `touch-action: none` CSS property prevents scroll/drag conflicts (Requirement 7.3).

#### 3. Step Attribute Limitation (Requirement 7.4)

**Behavior**: When a non-zero `step` attribute is set, iOS Safari may disable track-dragging outside the thumb.

**Impact**: With `step` values other than `any`, users may only be able to interact with the thumb itself, not the track.

**Handling**: This is a known iOS Safari limitation. The component's default `step` value is `1`, which works reliably. For continuous values, set `step="any"`.

#### 4. Scroll vs Drag Conflicts (Requirement 7.3)

**Behavior**: In scrollable containers, touch gestures on iOS may trigger scrolling instead of slider dragging.

**Impact**: Users may accidentally scroll the page when trying to drag the slider.

**Handling**: The component applies `touch-action: none` to the slider container, which prevents scroll gestures from interfering with slider interaction.

### CSS Properties for iOS Compatibility

The component's SCSS includes the following iOS-specific properties:

```scss
.c-range-input__field {
  // Prevents scroll/drag conflicts on iOS (Requirement 7.3)
  touch-action: none;

  // Maintains touch handlers while allowing custom styling (Requirement 7.2, 7.6)
  -webkit-appearance: none;
}
```

### Tested iOS Versions

The component has been designed to work with:

- **iOS 15+**: Full HTML5 Drag and Drop API support
- **iOS 16+**: Improved touch handling
- **iOS 17+**: Latest optimizations

### Webkit-Appearance Testing Results (Requirement 7.6)

Testing on iOS Safari shows that `-webkit-appearance: none` maintains drag functionality while allowing custom styling. The following webkit-appearance values have been tested:

- ✅ `none`: **Recommended** - Allows full custom styling while preserving touch handlers
- ❌ `slider-horizontal`: Reverts to native styling, limiting customization
- ❌ Other values: Not tested or not applicable for range inputs

### Fallback Touch Event Handlers (Requirement 7.7)

The current implementation relies on native range input behavior, which works reliably on iOS 15+. If native drag behavior fails on older iOS versions or specific devices, fallback touch event handlers can be implemented by:

1. Detecting touch events on the slider container
2. Calculating the touch position relative to the slider
3. Updating the slider value programmatically
4. Providing visual feedback during the touch interaction

This fallback is not currently implemented as native behavior works reliably on supported iOS versions (15+).

### Recommendations for Developers

1. **Test on real devices**: iOS Safari behavior differs from desktop Safari and simulators
2. **Use appropriate step values**: Set `step="any"` for continuous values, or use reasonable step increments
3. **Avoid nested scrollable containers**: If possible, avoid placing sliders inside scrollable containers
4. **Provide clear visual feedback**: Ensure the thumb is large enough and visually distinct for easy interaction
5. **Consider touch target size**: iOS recommends minimum 44x44pt touch targets for accessibility

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

## RangeInputComponent Features

The `RangeInputComponent` is a powerful, accessible slider component built on native HTML range inputs. It provides extensive customization options while maintaining excellent mobile compatibility and accessibility.

### Feature Overview

- ✅ Single-value and dual-handle (range) sliders
- ✅ Keyboard navigation with customizable shortcuts
- ✅ Smooth CSS animations for programmatic changes
- ✅ Configurable tooltips with multiple display modes
- ✅ Extensive styling options via CSS classes and custom properties
- ✅ Full ARIA support for screen readers
- ✅ iOS Safari compatibility
- ✅ Custom number formatting with prefix/suffix
- ✅ Progress bar visualization
- ✅ Tick marks with customizable steps
- ✅ Debounced drag/drop events

### Basic Usage

```typescript
import { Component } from '@angular/core';
import { RangeInputOptions } from './shared/range-input/range-input';

@Component({
  selector: 'app-example',
  template: `
    <mg-range-input
      [min]="0"
      [max]="100"
      [step]="1"
      [(ngModel)]="value"
      [options]="options"
      (rangeDrop)="onValueChange($event)"></mg-range-input>
  `,
})
export class ExampleComponent {
  value = 50;
  options: RangeInputOptions = {
    showProgressBar: true,
    showTicks: true,
  };

  onValueChange(value: number) {
    console.log('Value:', value);
  }
}
```

### Feature Examples

#### 1. Range Slider (Dual-Handle Mode)

Select a minimum and maximum value with two handles:

```typescript
options: RangeInputOptions = {
  enableRangeMode: true,
  minValue: 20,
  maxValue: 80,
  showProgressBar: true,
};
```

```html
<mg-range-input
  [min]="0"
  [max]="100"
  [options]="options"
  (minValueChange)="onMinChange($event)"
  (maxValueChange)="onMaxChange($event)"
  (rangeChange)="onRangeChange($event)"></mg-range-input>
```

```typescript
onRangeChange(range: { min: number; max: number }) {
  console.log(`Selected range: ${range.min} - ${range.max}`);
}
```

**Key Features:**

- Two independent handles for min/max selection
- Automatic constraint validation (min never exceeds max)
- Separate events for each handle and combined range events
- Visual progress bar shows selected range

#### 2. Keyboard Navigation

Control sliders with keyboard shortcuts (enabled by default):

```typescript
options: RangeInputOptions = {
  enableKeyboardNavigation: true,
  largeStepPercentage: 10, // Page Up/Down moves 10% of range
};
```

**Keyboard Shortcuts:**

- `Arrow Up/Right`: Increase by one step
- `Arrow Down/Left`: Decrease by one step
- `Page Up`: Increase by large step (10% of range)
- `Page Down`: Decrease by large step
- `Home`: Jump to minimum value
- `End`: Jump to maximum value

**Customization:**

```typescript
// Disable keyboard navigation
options = { enableKeyboardNavigation: false };

// Larger steps for Page Up/Down
options = { largeStepPercentage: 20 }; // 20% of range
```

#### 3. Animations

Smooth CSS transitions for programmatic value changes:

```typescript
options: RangeInputOptions = {
  enableAnimations: true,
  animationDuration: 200, // milliseconds
  animationEasing: 'ease-out', // CSS easing function
};
```

```typescript
// Programmatic value change will animate smoothly
this.value = 75;
```

**Notes:**

- Animations apply only to programmatic changes, not user drag
- User drag interactions remain instant for responsive feel
- Animations can be disabled for performance-critical applications

#### 4. Custom Tooltips

Display contextual information on hover or drag:

```typescript
options: RangeInputOptions = {
  showTooltip: 'onHover', // 'always' | 'onHover' | 'onDrag' | 'never'
  tooltipPlacement: 'top', // 'top' | 'bottom' | 'left' | 'right'
  tooltipDelay: 500, // Hide delay in milliseconds
  formatTooltipValue: (value) => `$${value.toFixed(2)}`,
};
```

**Tooltip Modes:**

- `'always'`: Tooltip always visible
- `'onHover'`: Show on mouse hover
- `'onDrag'`: Show only during drag
- `'never'`: No tooltip (default)

**Custom Formatting:**

```typescript
// Currency formatting
formatTooltipValue: (value) => `$${value.toLocaleString()}`;

// Percentage formatting
formatTooltipValue: (value) => `${value}%`;

// Custom units
formatTooltipValue: (value) => `${value} items`;
```

#### 5. Enhanced Styling

Customize appearance with CSS classes and custom properties:

```typescript
options: RangeInputOptions = {
  customHandleClass: 'my-handle',
  customTrackClass: 'my-track',
  customProgressClass: 'my-progress',
  customTickClass: 'my-tick',
  handleSize: 24, // pixels
  trackHeight: 6, // pixels
};
```

**CSS Custom Properties:**

```css
.c-range-input {
  /* Colors */
  --range-input-handle-color: #005f9e;
  --range-input-handle-active-color: #004080;
  --range-input-track-color: #c2c2cd;
  --range-input-progress-color: #005f9e;
  --range-input-tick-color: #c2c2cd;
  --range-input-tick-value-color: #333;

  /* Sizes */
  --range-input-handle-size: 24px;
  --range-input-track-height: 6px;

  /* Animations */
  --range-input-animation-duration: 200ms;
  --range-input-animation-easing: ease-out;
}
```

**Custom CSS Classes:**

```css
/* Custom handle styling */
.my-handle {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: 2px solid white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

/* Custom track styling */
.my-track {
  background: #f0f0f0;
  border-radius: 10px;
}

/* Custom progress bar */
.my-progress {
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
}
```

#### 6. Accessibility

Enhanced ARIA support for screen readers:

```typescript
options: RangeInputOptions = {
  ariaValueTextFormatter: (value) => {
    if (value === 0) return 'No items';
    if (value === 1) return 'One item';
    return `${value} items`;
  },
  minHandleAriaLabel: 'Minimum price',
  maxHandleAriaLabel: 'Maximum price',
};
```

```html
<mg-range-input
  [min]="0"
  [max]="100"
  [options]="options"
  [ariaLabel]="'Price range selector'"
  [ariaDescribedby]="'price-help-text'"></mg-range-input>
<div id="price-help-text">Select your desired price range</div>
```

**Accessibility Features:**

- Full keyboard navigation support
- ARIA attributes automatically updated on value changes
- Custom aria-valuetext formatting for better screen reader experience
- Distinct labels for dual-handle mode
- Tick marks accessible to screen readers

#### 7. Number Formatting

Custom number formatting with prefix/suffix:

```typescript
options: RangeInputOptions = {
  showProgressBar: true,
  formatDisplayValue: (value) => `$${value.toLocaleString()}`,
  formatTickValue: (value) => `$${value}`,
};
```

```html
<mg-range-input
  [min]="0"
  [max]="1000"
  [step]="10"
  [prefix]="'$'"
  [suffix]="' USD'"
  [options]="options"
  [(ngModel)]="price"></mg-range-input>
```

**Formatting Options:**

- `prefix`: Text before the value (e.g., '$', '€')
- `suffix`: Text after the value (e.g., '%', ' kg')
- `formatDisplayValue`: Custom formatter function for display value
- `formatTickValue`: Custom formatter function for tick labels
- `formatTooltipValue`: Custom formatter function for tooltips

#### 8. Progress Bar and Ticks

Visual feedback with progress bars and tick marks:

```typescript
options: RangeInputOptions = {
  showProgressBar: true,
  showTicks: true,
  tickSteps: 11, // Number of tick marks
  tickValueSteps: 2, // Show value every N ticks
};
```

**Progress Bar:**

- Shows filled portion from minimum to current value
- In range mode, shows selected range between handles
- Customizable colors via CSS custom properties

**Tick Marks:**

- Evenly spaced visual indicators
- Optional value labels
- Clickable to jump to specific values
- Customizable appearance via CSS

#### 9. Debounced Events

Control event emission frequency:

```typescript
<mg-range-input
  [min]="0"
  [max]="100"
  [dragDebounce]="200"
  [dropDebounce]="700"
  (rangeDrag)="onDrag($event)"
  (rangeDrop)="onDrop($event)"
></mg-range-input>
```

```typescript
onDrag(value: number) {
  // Called during drag (debounced by 200ms)
  console.log('Dragging:', value);
}

onDrop(value: number) {
  // Called when drag ends (debounced by 700ms)
  console.log('Final value:', value);
  this.saveValue(value);
}
```

**Event Types:**

- `rangeDrag`: Emitted during drag (debounced)
- `rangeDrop`: Emitted when drag ends (debounced)
- `minValueChange`: Emitted when min handle changes (range mode)
- `maxValueChange`: Emitted when max handle changes (range mode)
- `rangeChange`: Emitted when either handle changes (range mode)

### Complete Example

Here's a comprehensive example using multiple features:

```typescript
import { Component } from '@angular/core';
import { RangeInputOptions } from './shared/range-input/range-input';

@Component({
  selector: 'app-price-filter',
  template: `
    <div class="price-filter">
      <label id="price-label">Price Range</label>
      <mg-range-input
        [min]="0"
        [max]="1000"
        [step]="10"
        [options]="options"
        [ariaLabelledby]="'price-label'"
        (rangeChange)="onPriceChange($event)"></mg-range-input>
      <div class="price-display">${{ selectedMin }} - ${{ selectedMax }}</div>
    </div>
  `,
  styles: [
    `
      .price-filter {
        padding: 20px;
        max-width: 400px;
      }
      .price-display {
        margin-top: 10px;
        font-size: 18px;
        font-weight: bold;
        text-align: center;
      }
    `,
  ],
})
export class PriceFilterComponent {
  selectedMin = 200;
  selectedMax = 800;

  options: RangeInputOptions = {
    // Range slider
    enableRangeMode: true,
    minValue: this.selectedMin,
    maxValue: this.selectedMax,

    // Visual feedback
    showProgressBar: true,
    showTicks: true,
    tickSteps: 11,
    tickValueSteps: 2,

    // Keyboard navigation
    enableKeyboardNavigation: true,
    largeStepPercentage: 10,

    // Animations
    enableAnimations: true,
    animationDuration: 250,
    animationEasing: 'ease-out',

    // Tooltips
    showTooltip: 'onHover',
    tooltipPlacement: 'top',
    formatTooltipValue: (value) => `$${value.toLocaleString()}`,

    // Styling
    handleSize: 24,
    trackHeight: 6,
    customHandleClass: 'price-handle',
    customProgressClass: 'price-progress',

    // Accessibility
    ariaValueTextFormatter: (value) => `${value} dollars`,
    minHandleAriaLabel: 'Minimum price',
    maxHandleAriaLabel: 'Maximum price',

    // Formatting
    formatDisplayValue: (value) => `$${value.toLocaleString()}`,
    formatTickValue: (value) => `$${value}`,
  };

  onPriceChange(range: { min: number; max: number }) {
    this.selectedMin = range.min;
    this.selectedMax = range.max;
    console.log('Price range updated:', range);
  }
}
```

### Configuration Reference

See the `RangeInputOptions` interface for all available configuration options:

```typescript
export class RangeInputOptions {
  // Display options
  hideDisplayValue?: boolean;
  showProgressBar?: boolean;
  showTicks?: boolean;
  tickSteps?: number;
  tickValueSteps?: number;

  // Range slider
  enableRangeMode?: boolean;
  minValue?: number;
  maxValue?: number;

  // Keyboard navigation
  enableKeyboardNavigation?: boolean;
  largeStepPercentage?: number;

  // Animations
  enableAnimations?: boolean;
  animationDuration?: number;
  animationEasing?: string;

  // Tooltips
  showTooltip?: 'always' | 'onHover' | 'onDrag' | 'never';
  tooltipPlacement?: 'top' | 'bottom' | 'left' | 'right';
  tooltipDelay?: number;
  formatTooltipValue?: (value: number) => string;
  tooltipTemplate?: TemplateRef<any>;

  // Styling
  customHandleClass?: string;
  customTrackClass?: string;
  customProgressClass?: string;
  customTickClass?: string;
  handleSize?: number;
  trackHeight?: number;

  // Accessibility
  ariaValueTextFormatter?: (value: number) => string;
  minHandleAriaLabel?: string;
  maxHandleAriaLabel?: string;

  // Formatting
  formatDisplayValue?: (value: number) => string;
  formatTickValue?: (value: number) => string;
}
```

### Migration Guide

For detailed migration instructions from older versions, see [MIGRATION.md](./MIGRATION.md).

### Browser Support

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support (iOS 15+)
- iOS Safari: Full support with documented limitations (see iOS section above)

### Performance Considerations

- Animations can be disabled for performance-critical applications
- Debounce values can be adjusted to reduce event frequency
- Tick marks can be limited to reduce DOM elements
- Tooltips can be set to 'never' to reduce overhead

### Known Limitations

- Vertical orientation not supported
- RTL layout not supported (future enhancement)
- Logarithmic scale not supported
- Draggable range bar not supported (only handles are draggable)
- iOS 14 and earlier not supported (iOS 15+ required)
