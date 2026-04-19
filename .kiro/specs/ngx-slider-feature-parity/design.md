# Design Document: ngx-slider Feature Parity

## Overview

This design extends the existing `RangeInputComponent` to achieve feature parity with ngx-slider while maintaining the native HTML `<input type="range">` foundation. The design follows Angular Material's proven approach of using native inputs with enhanced functionality through directives and wrapper components.

### Design Goals

1. **Maintain Native Foundation**: Continue using native HTML range inputs for accessibility and mobile compatibility
2. **Extend Existing Architecture**: Build upon the established `ValueAccessor` → `InputControl` → `RangeInputComponent` hierarchy
3. **Follow Angular Material Patterns**: Reference mat-slider's approach for range sliders and advanced features
4. **Handle iOS Gracefully**: Work within iOS Safari's documented limitations
5. **Maintain API Consistency**: Extend `RangeInputOptions` interface with backward compatibility

### Key Design Principles

- **Progressive Enhancement**: New features are opt-in via configuration
- **Type Safety**: Leverage TypeScript generics for view/model value conversion
- **Reactive Patterns**: Use RxJS for event handling and state management
- **Platform Independence**: Use Angular's `Renderer2` for DOM manipulation
- **Accessibility First**: ARIA attributes and keyboard navigation are core requirements

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    RangeInputComponent                       │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              InputControl<string, number>             │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │      ValueAccessor<string, number>              │  │  │
│  │  │  - ControlValueAccessor implementation          │  │  │
│  │  │  - Value transformation hooks                   │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  │  - NgControl integration                              │  │
│  │  - Validation handling                                │  │
│  └───────────────────────────────────────────────────────┘  │
│  - Single/dual handle modes                                 │
│  - Keyboard navigation                                      │
│  - Animations                                               │
│  - Tooltips                                                 │
│  - Enhanced styling                                         │
│  - ARIA attributes                                          │
└─────────────────────────────────────────────────────────────┘
         │                    │                    │
         ▼                    ▼                    ▼
┌──────────────────┐  ┌──────────────┐  ┌──────────────────┐
│ ValueConverter   │  │  Renderer2   │  │  RxJS Operators  │
│ - toView()       │  │  - DOM       │  │  - debounceTime  │
│ - fromView()     │  │  manipulation│  │  - distinctUntil │
└──────────────────┘  └──────────────┘  └──────────────────┘
```

### Component Modes

The component will support two operational modes:

1. **Single Handle Mode** (existing): One native input element
2. **Dual Handle Mode** (new): Two native input elements for range selection

Mode selection is controlled via `RangeInputOptions.enableRangeMode` boolean flag.

### Reference Implementation

Angular Material's `mat-slider` provides a proven pattern:

- Uses native `<input type="range">` elements
- Supports range sliders with two inputs
- Implements keyboard navigation
- Provides comprehensive ARIA support
- Handles iOS Safari limitations

Source: https://github.com/angular/components/tree/main/src/material/slider (MIT License)

## Components and Interfaces

### Extended RangeInputOptions Interface

```typescript
export class RangeInputOptions {
  // Existing options
  public hideDisplayValue? = true;
  public showProgressBar? = false;
  public showTicks? = false;
  public tickSteps? = 21;
  public tickValueSteps? = 5;
  public convertValue?: RangeInputConvertFormat;
  public formatDisplayValue?: RangeInputConvertFormat;
  public formatTickValue?: RangeInputConvertFormat;

  // NEW: Range slider options
  public enableRangeMode? = false;
  public minValue?: number; // For dual-handle mode
  public maxValue?: number; // For dual-handle mode

  // NEW: Keyboard navigation options
  public enableKeyboardNavigation? = true;
  public largeStepPercentage? = 10; // For Page Up/Down (% of range)

  // NEW: Animation options
  public enableAnimations? = true;
  public animationDuration? = 200; // milliseconds
  public animationEasing? = 'ease-out';

  // NEW: Tooltip options
  public showTooltip? = 'onHover'; // 'always' | 'onHover' | 'onDrag' | 'never'
  public tooltipPlacement? = 'top'; // 'top' | 'bottom' | 'left' | 'right'
  public tooltipDelay? = 500; // milliseconds before hiding
  public formatTooltipValue?: RangeInputConvertFormat;
  public tooltipTemplate?: TemplateRef<any>; // Custom template

  // NEW: Styling options
  public customHandleClass?: string;
  public customTrackClass?: string;
  public customProgressClass?: string;
  public customTickClass?: string;
  public handleSize?: number; // pixels
  public trackHeight?: number; // pixels

  // NEW: Accessibility options
  public ariaValueTextFormatter?: (value: number) => string;
  public minHandleAriaLabel?: string; // For dual-handle mode
  public maxHandleAriaLabel?: string; // For dual-handle mode
}
```

### New Internal Interfaces

```typescript
interface RangeSliderState {
  minValue: number;
  maxValue: number;
  isDraggingMin: boolean;
  isDraggingMax: boolean;
  focusedHandle: 'min' | 'max' | null;
}

interface TooltipState {
  visible: boolean;
  content: string;
  position: { x: number; y: number };
  handle: 'single' | 'min' | 'max';
}

interface KeyboardNavigationConfig {
  enabled: boolean;
  stepSize: number;
  largeStepSize: number;
  minValue: number;
  maxValue: number;
}
```

### Component Structure Changes

```typescript
@Component({
  selector: 'mg-range-input',
  templateUrl: './range-input.html',
  styleUrls: ['./range-input.scss'],
  providers: [
    { provide: InputControl, useExisting: RangeInputComponent },
    { provide: ValueConverter, useExisting: RangeInputNumberFormatConverter },
  ],
  standalone: false,
})
export class RangeInputComponent extends InputControl<string, number> implements OnInit, OnDestroy {
  // Existing @Input properties remain unchanged

  // NEW: Range mode inputs
  @Input() public minValue?: number;
  @Input() public maxValue?: number;

  // NEW: Range mode outputs
  @Output() public minValueChange = new EventEmitter<number>();
  @Output() public maxValueChange = new EventEmitter<number>();
  @Output() public rangeChange = new EventEmitter<{ min: number; max: number }>();

  // NEW: ViewChild references for dual-handle mode
  @ViewChild('minInput') private minInputElementRef?: ElementRef<HTMLInputElement>;
  @ViewChild('maxInput') private maxInputElementRef?: ElementRef<HTMLInputElement>;
  @ViewChild('tooltip') private tooltipElementRef?: ElementRef<HTMLDivElement>;

  // NEW: Internal state
  private rangeSliderState?: RangeSliderState;
  private tooltipState: TooltipState;
  private keyboardNavConfig: KeyboardNavigationConfig;
  private animationInProgress = false;

  // NEW: RxJS subjects for new features
  private readonly tooltipHide$ = new Subject<void>();
  private readonly keyboardNavigation$ = new Subject<KeyboardEvent>();
  private readonly handleFocus$ = new Subject<'min' | 'max' | 'single'>();
}
```

## Data Models

### Value Flow in Single Handle Mode

```
User Interaction → Native Input Event → onChange(viewValue: string)
                                              ↓
                                    viewValueToModelValue(string)
                                              ↓
                                    ValueConverter.fromView()
                                              ↓
                                    modelValue: number
                                              ↓
                                    Validation & Hooks
                                              ↓
                                    writeValue(modelValue: number)
                                              ↓
                                    modelValueToViewValue(number)
                                              ↓
                                    ValueConverter.toView()
                                              ↓
                                    writeValueToView(viewValue: string)
                                              ↓
                                    Renderer2.setProperty(input, 'value', viewValue)
```

### Value Flow in Dual Handle Mode

```
Min Handle Interaction                    Max Handle Interaction
        ↓                                          ↓
  onChange(minViewValue)                    onChange(maxViewValue)
        ↓                                          ↓
  Convert to number                          Convert to number
        ↓                                          ↓
  Validate: min <= max                       Validate: max >= min
        ↓                                          ↓
  Update rangeSliderState                    Update rangeSliderState
        ↓                                          ↓
  Emit minValueChange                        Emit maxValueChange
        ↓                                          ↓
        └──────────────┬───────────────────────────┘
                       ↓
              Emit rangeChange({ min, max })
                       ↓
              Update progress bar styling
```

### Animation State Machine

```
┌─────────────┐
│   Idle      │
└──────┬──────┘
       │ programmatic value change
       ↓
┌─────────────┐
│  Animating  │ ← CSS transition applied
└──────┬──────┘
       │ transition end
       ↓
┌─────────────┐
│   Idle      │
└─────────────┘

Note: User drag bypasses animation state
```

### Tooltip State Machine

```
┌─────────────┐
│   Hidden    │
└──────┬──────┘
       │ hover/focus (if showTooltip includes this trigger)
       ↓
┌─────────────┐
│   Visible   │
└──────┬──────┘
       │ blur/mouseleave + delay
       ↓
┌─────────────┐
│   Hidden    │
└─────────────┘

Special case: showTooltip = 'always' → always Visible
```

## Correctness Properties

_A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees._

### Property 1: Minimum handle constraint in range mode

_For any_ dual-handle slider with min and max values, when the minimum handle is dragged, the resulting minimum value SHALL never exceed the maximum value.

**Validates: Requirements 1.3**

### Property 2: Maximum handle constraint in range mode

_For any_ dual-handle slider with min and max values, when the maximum handle is dragged, the resulting maximum value SHALL never be less than the minimum value.

**Validates: Requirements 1.4**

### Property 3: Range event emission

_For any_ value change in dual-handle mode, the component SHALL emit separate events for minimum and maximum value changes, and each event SHALL contain the correct handle's value.

**Validates: Requirements 1.5**

### Property 4: Arrow key navigation

_For any_ slider with focus and any valid current value, pressing arrow keys (up/down/left/right) SHALL change the value by exactly one step in the appropriate direction, respecting min/max boundaries.

**Validates: Requirements 2.1, 2.2, 2.3, 2.4, 2.10**

### Property 5: Page Up/Down navigation

_For any_ slider with focus and any valid current value, pressing Page Up or Page Down SHALL change the value by exactly the configured large step percentage (default 10% of range), respecting min/max boundaries.

**Validates: Requirements 2.5, 2.6**

### Property 6: Home key navigation

_For any_ slider with focus and any current value, pressing the Home key SHALL set the value to the configured minimum value.

**Validates: Requirements 2.7**

### Property 7: End key navigation

_For any_ slider with focus and any current value, pressing the End key SHALL set the value to the configured maximum value.

**Validates: Requirements 2.8**

### Property 8: Keyboard navigation isolation in dual-handle mode

_For any_ dual-handle slider, when one handle has focus, keyboard navigation SHALL affect only the focused handle and SHALL NOT modify the other handle's value.

**Validates: Requirements 2.9**

### Property 9: Animation bypass during user drag

_For any_ slider being dragged by the user, CSS transition properties SHALL NOT be applied to the handle, progress bar, or display value elements.

**Validates: Requirements 3.6**

### Property 10: Tooltip visibility on hover

_For any_ slider with tooltip enabled and showTooltip set to 'onHover' or 'always', when the user hovers over a handle, the tooltip SHALL become visible.

**Validates: Requirements 4.2**

### Property 11: Tooltip persistence during drag

_For any_ slider with tooltip enabled, when the user drags a handle, the tooltip SHALL remain visible throughout the entire drag operation.

**Validates: Requirements 4.3**

### Property 12: Tooltip hide delay

_For any_ slider with tooltip enabled, when the user stops interacting with the slider, the tooltip SHALL hide after exactly the configured delay period.

**Validates: Requirements 4.4**

### Property 13: Custom tooltip formatting

_For any_ slider with a custom tooltip formatter function, the tooltip content SHALL display the result of applying the formatter to the current value.

**Validates: Requirements 4.8**

### Property 14: ARIA attribute updates

_For any_ slider value change, the component SHALL update aria-valuenow to match the current value and SHALL update aria-valuetext to match the formatted display value.

**Validates: Requirements 6.1, 6.2**

### Property 15: Custom ARIA valuetext formatting

_For any_ slider with a custom aria-valuetext formatter, the aria-valuetext attribute SHALL contain the result of applying the formatter to the current value.

**Validates: Requirements 6.4**

### Property 16: Tick accessibility

_For any_ slider with ticks enabled, each tick value element SHALL have appropriate ARIA attributes to ensure screen reader accessibility.

**Validates: Requirements 6.7**

## Error Handling

### Validation Errors

1. **Invalid Range Configuration**
   - **Condition**: `enableRangeMode = true` but `minValue > maxValue`
   - **Handling**: Log console warning, swap values automatically, emit warning event
   - **Recovery**: Component continues with corrected values

2. **Invalid Step Configuration**
   - **Condition**: `step` value is larger than `(max - min)`
   - **Handling**: Log console warning, adjust step to `(max - min) / 10`
   - **Recovery**: Component continues with adjusted step

3. **Invalid Animation Duration**
   - **Condition**: `animationDuration < 0` or `animationDuration > 5000`
   - **Handling**: Log console warning, clamp to valid range [0, 5000]
   - **Recovery**: Component continues with clamped value

4. **Invalid Tooltip Placement**
   - **Condition**: `tooltipPlacement` is not one of the valid values
   - **Handling**: Log console warning, default to 'top'
   - **Recovery**: Component continues with default placement

### Runtime Errors

1. **Missing ViewChild References**
   - **Condition**: Input element refs are undefined in `ngAfterViewInit`
   - **Handling**: Log error, disable affected features
   - **Recovery**: Component renders but advanced features are disabled

2. **ValueConverter Errors**
   - **Condition**: `fromView()` or `toView()` throws exception
   - **Handling**: Catch exception, log error, use raw value
   - **Recovery**: Component continues with unformatted values

3. **Keyboard Event Handling Errors**
   - **Condition**: Keyboard event handler throws exception
   - **Handling**: Catch exception, log error, prevent default
   - **Recovery**: Component continues, that specific key press is ignored

### iOS-Specific Handling

1. **Touch Event Conflicts**
   - **Condition**: Touch events conflict with scroll gestures
   - **Handling**: Apply `touch-action: none` to slider container
   - **Recovery**: Prevents scroll during slider interaction

2. **Webkit Appearance Issues**
   - **Condition**: Custom styling breaks touch handlers
   - **Handling**: Preserve minimal `-webkit-appearance` properties
   - **Recovery**: Maintain touch functionality with reduced styling

3. **Two-Tap Interaction**
   - **Condition**: iOS requires two taps to interact
   - **Handling**: Document behavior, no programmatic workaround
   - **Recovery**: Users adapt to native iOS behavior

## Testing Strategy

### Unit Testing Approach

Unit tests will focus on:

- **Configuration validation**: Verify invalid configurations are handled gracefully
- **Mode switching**: Test single ↔ dual handle mode transitions
- **Event emission**: Verify correct events are emitted with correct payloads
- **CSS class application**: Verify custom classes are applied to correct elements
- **ARIA attribute presence**: Verify ARIA attributes exist and have correct structure
- **Animation CSS application**: Verify transition properties are added/removed correctly
- **Tooltip rendering**: Verify tooltip elements are created and positioned
- **Edge cases**: Handle overlap, boundary values, disabled states

### Property-Based Testing Approach

Property-based tests will use **fast-check** (JavaScript PBT library) with minimum 100 iterations per test.

Each property test will:

1. Generate random valid inputs (values, ranges, configurations)
2. Execute the behavior under test
3. Assert the property holds
4. Reference the design document property in a comment tag

**Tag Format**: `// Feature: ngx-slider-feature-parity, Property {number}: {property_text}`

**Example Property Test Structure**:

```typescript
// Feature: ngx-slider-feature-parity, Property 1: Minimum handle constraint in range mode
it('should never allow min handle to exceed max handle', () => {
  fc.assert(
    fc.property(
      fc.integer({ min: 0, max: 100 }), // min value
      fc.integer({ min: 0, max: 100 }), // max value
      fc.integer({ min: 0, max: 100 }), // attempted new min value
      (min, max, newMin) => {
        fc.pre(min <= max); // precondition
        const component = createComponent({ enableRangeMode: true, minValue: min, maxValue: max });
        component.setMinValue(newMin);
        expect(component.minValue).toBeLessThanOrEqual(component.maxValue);
      },
    ),
    { numRuns: 100 },
  );
});
```

### Integration Testing

Integration tests will verify:

- **Angular Forms integration**: Test with `FormControl`, `FormGroup`, validators
- **Template projection**: Test custom tooltip templates
- **Change detection**: Verify OnPush strategy compatibility
- **Lifecycle hooks**: Test initialization and cleanup
- **iOS Safari behavior**: Manual testing on physical devices (iOS 15+)

### Accessibility Testing

- **Automated**: Use `axe-core` to verify ARIA compliance
- **Manual**: Test with screen readers (NVDA, JAWS, VoiceOver)
- **Keyboard-only**: Verify all functionality is keyboard accessible

### Visual Regression Testing

- **Snapshot tests**: Capture component rendering in various states
- **CSS verification**: Verify custom styling options are applied correctly
- **Animation verification**: Verify transitions are smooth (manual review)

### Test Coverage Goals

- **Line coverage**: > 90%
- **Branch coverage**: > 85%
- **Property test iterations**: 100 per property
- **Accessibility score**: 100 (axe-core)

## Implementation Notes

### Phase 1: Range Slider Support (Requirement 1)

1. Add `enableRangeMode` flag to `RangeInputOptions`
2. Create `RangeSliderState` interface and state management
3. Update template to conditionally render two input elements
4. Implement min/max constraint logic in `onChange` handlers
5. Add new `@Output` events for range changes
6. Update progress bar styling to show selected range
7. Handle handle overlap with z-index and pointer-events

### Phase 2: Keyboard Navigation (Requirement 2)

1. Add keyboard event listeners to input elements
2. Implement `handleKeyboardEvent()` method with switch statement for keys
3. Calculate large step size based on range percentage
4. Respect configured step value for arrow keys
5. Handle focus management in dual-handle mode
6. Prevent default browser behavior for handled keys

### Phase 3: Animations (Requirement 3)

1. Add CSS transition properties to SCSS
2. Create `animationInProgress` flag to track state
3. Add/remove transition classes based on interaction type
4. Implement `disableAnimations()` and `enableAnimations()` methods
5. Use `Renderer2` to toggle transition styles
6. Ensure animations don't interfere with drag performance

### Phase 4: Tooltips (Requirement 4)

1. Create tooltip component/directive
2. Add tooltip template to component HTML
3. Implement tooltip positioning logic based on handle position
4. Add hover/focus event listeners
5. Implement hide delay with RxJS `debounceTime`
6. Support custom tooltip templates via `ng-content` or `TemplateRef`
7. Handle dual-handle mode with separate tooltips

### Phase 5: Enhanced Styling (Requirement 5)

1. Add CSS custom properties for colors and sizes
2. Implement dynamic class binding for custom classes
3. Add `@Input` properties for size configurations
4. Update SCSS to use CSS variables
5. Maintain backward compatibility with existing styles
6. Document CSS custom properties in component docs

### Phase 6: Accessibility (Requirement 6)

1. Add ARIA attribute bindings to template
2. Implement `updateAriaAttributes()` method
3. Call on every value change
4. Support custom aria-valuetext formatter
5. Add distinct labels for dual-handle mode
6. Ensure tick marks have appropriate roles
7. Test with screen readers

### Phase 7: iOS Compatibility (Requirement 7)

1. Add `touch-action: none` to slider container
2. Test webkit-appearance values on iOS devices
3. Document iOS limitations in README
4. Add fallback touch event handlers if needed
5. Test on iOS 15, 16, 17
6. Document two-tap behavior

### Phase 8: API Consistency (Requirement 8)

1. Review all new options for naming consistency
2. Add JSDoc comments to all new properties
3. Create migration guide for existing users
4. Add validation for option combinations
5. Implement console warnings for deprecated patterns
6. Update TypeScript types and interfaces

### Development Guidelines

- **Backward Compatibility**: All existing functionality must continue to work
- **Opt-In Features**: New features are disabled by default
- **Performance**: Avoid unnecessary change detection cycles
- **Bundle Size**: Minimize impact on bundle size (tree-shakeable where possible)
- **Documentation**: Update README with examples for each new feature
- **Testing**: Write tests before implementation (TDD approach)

### Angular Material Reference Points

When implementing, reference Angular Material's mat-slider for:

- Dual input element structure for range sliders
- Keyboard event handling patterns
- ARIA attribute management
- CSS transition timing and easing
- Touch event handling on mobile

Source code: https://github.com/angular/components/blob/main/src/material/slider/

### Known Limitations

1. **iOS Two-Tap**: Cannot be programmatically avoided (native behavior)
2. **Vertical Orientation**: Not supported in this implementation
3. **RTL Layout**: Not supported initially (future enhancement)
4. **Draggable Range Bar**: Not supported (only handles are draggable)
5. **Dynamic Min/Max**: Min/max changes after init may cause issues
6. **Animation Performance**: Complex animations may impact performance on low-end devices

### Future Enhancements (Out of Scope)

- Vertical slider orientation
- RTL layout support
- Logarithmic scale
- Custom scale functions
- Draggable range bar
- Push range behavior
- Dynamic min/max updates
- Multi-thumb sliders (3+ handles)
