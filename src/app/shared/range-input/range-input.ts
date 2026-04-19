import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
  Self,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { NgControl } from '@angular/forms';
import { EMPTY, Subject, debounceTime, distinctUntilChanged, filter, iif, of, switchMap, takeUntil } from 'rxjs';
import { InputControl } from '../input-control';
import { ValueConverter } from '../service/value-converter';
import { RangeInputNumberFormatConverter } from './range-input-number-format-converter';

let index = 0;

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
  @Input() public ariaLabel?: string;
  @Input() public ariaLabelledby?: string;
  @Input() public ariaDescribedby?: string;
  @Input() public dragDebounce? = 200;
  @Input() public dropDebounce? = 700;
  @Input() public id = `range_input-${index++}`;
  @Input() public max: number;
  @Input() public min: number;
  @Input() public name?: string;
  @Input() public prefix?: string;
  @Input() public step: number | 'any' = 1;
  @Input() public suffix?: string;

  // TODO: Decimal places instead of bounded format (per Tim)
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('mgBoundedFormat') public boundedFormat = '0';

  // TODO: Custom view formatters instead of display format (per Graham)
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('mgDisplayFormat') public displayFormat = '0';

  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('mgNumberFormatConverterOptions')
  public numberFormatConverterOptions: any;

  @Input() public set options(value: RangeInputOptions) {
    this._options = {
      ...{
        hideDisplayValue: true,
        showProgressBar: false,
        showTicks: false,
        tickSteps: 21,
        tickValueSteps: 5,
        // Range slider defaults
        enableRangeMode: false,
        // Keyboard navigation defaults
        enableKeyboardNavigation: true,
        largeStepPercentage: 10,
        // Animation defaults
        enableAnimations: true,
        animationDuration: 200,
        animationEasing: 'ease-out',
        // Tooltip defaults
        showTooltip: 'never',
        tooltipPlacement: 'top',
        tooltipDelay: 500,
      },
      ...this._options,
      ...value,
    };
  }

  public get options(): RangeInputOptions {
    return this._options;
  }

  @Output() public rangeDrop = new EventEmitter<number>();
  @Output() public rangeDrag = new EventEmitter<number>();

  // NEW: Range mode outputs (Requirement 1)
  @Output() public minValueChange = new EventEmitter<number>();
  @Output() public maxValueChange = new EventEmitter<number>();
  @Output() public rangeChange = new EventEmitter<{ min: number; max: number }>();

  public displayValue: string;
  public tickData: RangeInputTickData[];

  // NEW: Internal state for range slider mode (public for template access)
  public rangeSliderState?: RangeSliderState;

  @ViewChild('input') private inputElementRef: ElementRef<HTMLInputElement>;
  @ViewChild('inputDisplayValue')
  private inputDisplayValueElementRef: ElementRef<HTMLSpanElement>;

  // NEW: ViewChild references for dual-handle mode (Requirement 1)
  @ViewChild('minInput') private minInputElementRef?: ElementRef<HTMLInputElement>;
  @ViewChild('maxInput') private maxInputElementRef?: ElementRef<HTMLInputElement>;
  @ViewChild('tooltip') private tooltipElementRef?: ElementRef<HTMLDivElement>;

  private _options: RangeInputOptions = {};
  private isChangeEvent = false;
  private isInputEvent = false;

  private readonly componentDestroyed$ = new Subject<boolean>();
  private readonly updateOnDragOrDrop$ = new Subject<number>();

  public constructor(
    @Self() public model: NgControl,
    protected valueConverter: ValueConverter<string, number>,
    private renderer: Renderer2,
  ) {
    super();

    this.model.valueAccessor = this;

    this.model.valueChanges
      .pipe(
        takeUntil(this.componentDestroyed$),
        filter((): boolean => this.isChangeEvent === false && this.isInputEvent === false),
      )
      .subscribe(this.updateProgressDisplay);

    this.registerAfterOnChange(this.updateAfterOnChange);
  }

  private updateAfterOnChange = (value: number): void => {
    this.updateProgressDisplay(value);
    this.updateOnDragOrDrop$.next(value);
  };

  public ngOnInit(): void {
    // Initialize range slider state if dual-handle mode is enabled
    if (this._options.enableRangeMode) {
      this.initializeRangeSliderState();
    }

    if (this._options.showTicks) {
      this.generateTickData();
    }

    // Input observable needs to be defined before change observable or change will fire first in some cases
    this.updateOnDragOrDrop$
      .pipe(
        takeUntil(this.componentDestroyed$),
        debounceTime(this.dragDebounce),
        switchMap((value: number) => iif((): boolean => this.isInputEvent === true, of(value), EMPTY)),
        distinctUntilChanged(),
      )
      .subscribe((value: number): void => {
        console.log('EMIT INPUT', this.dragDebounce);
        this.isInputEvent = false;
        this.rangeDrag.emit(value);
      });

    this.updateOnDragOrDrop$
      .pipe(
        takeUntil(this.componentDestroyed$),
        debounceTime(this.dropDebounce),
        switchMap((value: number) => iif((): boolean => this.isChangeEvent === true, of(value), EMPTY)),
        distinctUntilChanged(),
      )
      .subscribe((value: number): void => {
        console.log('EMIT CHANGE', this.dropDebounce);
        this.isChangeEvent = false;
        this.rangeDrop.emit(value);
      });
  }

  public ngOnDestroy(): void {
    this.componentDestroyed$.next(true);
  }

  public getDisplayValue(value: number): string {
    if (typeof this._options.formatDisplayValue === 'function') {
      return this._options.formatDisplayValue(value);
    }
    return this.valueConverter.toView(value, this.displayFormat);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected onBlurEvent(event: FocusEvent): void {
    this.onTouched();
  }

  protected onChangeEvent(event: Event): void {
    console.log('CHANGE');
    this.isChangeEvent = true;
    this.onChange((event.target as HTMLInputElement).value);
  }

  protected onInputEvent(event: Event): void {
    this.isInputEvent = true;
    console.log('INPUT');
    this.onChange((event.target as HTMLInputElement).value);
  }

  protected onMouseupEvent(event: Event): void {
    const isSafari = /^((?!chrome|chromium).)*safari/i.test(navigator.userAgent);
    if (isSafari) {
      this.onChangeEvent(event);
    }
  }

  protected onMinFocusEvent(): void {
    if (this.rangeSliderState) {
      this.rangeSliderState.focusedHandle = 'min';
    }
  }

  protected onMaxFocusEvent(): void {
    if (this.rangeSliderState) {
      this.rangeSliderState.focusedHandle = 'max';
    }
  }

  protected onMinChangeEvent(event: Event): void {
    console.log('MIN CHANGE');
    if (!this.rangeSliderState) {
      return;
    }
    this.rangeSliderState.isDraggingMin = false;
    const newValue = parseFloat((event.target as HTMLInputElement).value);
    this.updateMinValue(newValue, true);
  }

  protected onMinInputEvent(event: Event): void {
    console.log('MIN INPUT');
    if (!this.rangeSliderState) {
      return;
    }
    this.rangeSliderState.isDraggingMin = true;
    const newValue = parseFloat((event.target as HTMLInputElement).value);
    this.updateMinValue(newValue, false);
  }

  protected onMaxChangeEvent(event: Event): void {
    console.log('MAX CHANGE');
    if (!this.rangeSliderState) {
      return;
    }
    this.rangeSliderState.isDraggingMax = false;
    const newValue = parseFloat((event.target as HTMLInputElement).value);
    this.updateMaxValue(newValue, true);
  }

  protected onMaxInputEvent(event: Event): void {
    console.log('MAX INPUT');
    if (!this.rangeSliderState) {
      return;
    }
    this.rangeSliderState.isDraggingMax = true;
    const newValue = parseFloat((event.target as HTMLInputElement).value);
    this.updateMaxValue(newValue, false);
  }

  protected onTickValueClick(value: string): void {
    if (this.inputElementRef.nativeElement.value === value) {
      return;
    }
    this.isChangeEvent = true;
    this.onChange(value);
  }

  /**
   * Handle keyboard navigation events (Requirements 2.1-2.10)
   * @param event - The keyboard event
   * @param handle - Which handle triggered the event ('single', 'min', or 'max')
   */
  protected handleKeyboardEvent(event: KeyboardEvent, handle: 'single' | 'min' | 'max'): void {
    // Check if keyboard navigation is enabled
    if (!this._options.enableKeyboardNavigation) {
      return;
    }

    // Get current value based on handle type
    let currentValue: number;
    if (handle === 'single') {
      currentValue = this.model.value ?? this.min;
    } else if (handle === 'min') {
      currentValue = this.rangeSliderState?.minValue ?? this.min;
    } else {
      currentValue = this.rangeSliderState?.maxValue ?? this.max;
    }

    // Calculate step size (default to 1 if step is 'any')
    const stepSize = typeof this.step === 'number' ? this.step : 1;

    // Calculate large step size (percentage of range)
    const range = this.max - this.min;
    const largeStepSize = (range * (this._options.largeStepPercentage ?? 10)) / 100;

    let newValue: number | null = null;
    let shouldPreventDefault = false;

    // Handle different key presses
    switch (event.key) {
      case 'ArrowUp':
      case 'ArrowRight':
        // Increase by step (Requirements 2.1, 2.3)
        newValue = Math.min(currentValue + stepSize, this.max);
        shouldPreventDefault = true;
        break;

      case 'ArrowDown':
      case 'ArrowLeft':
        // Decrease by step (Requirements 2.2, 2.4)
        newValue = Math.max(currentValue - stepSize, this.min);
        shouldPreventDefault = true;
        break;

      case 'PageUp':
        // Increase by large step (Requirement 2.5)
        newValue = Math.min(currentValue + largeStepSize, this.max);
        shouldPreventDefault = true;
        break;

      case 'PageDown':
        // Decrease by large step (Requirement 2.6)
        newValue = Math.max(currentValue - largeStepSize, this.min);
        shouldPreventDefault = true;
        break;

      case 'Home':
        // Set to minimum (Requirement 2.7)
        newValue = this.min;
        shouldPreventDefault = true;
        break;

      case 'End':
        // Set to maximum (Requirement 2.8)
        newValue = this.max;
        shouldPreventDefault = true;
        break;
    }

    // Prevent default browser behavior for handled keys (Requirement 2.1-2.10)
    if (shouldPreventDefault) {
      event.preventDefault();
    }

    // Apply the new value if it was calculated
    if (newValue !== null) {
      if (handle === 'single') {
        // Single-handle mode
        const viewValue = this.modelValueToViewValue(newValue);
        if (viewValue !== undefined) {
          this.isChangeEvent = true;
          this.onChange(viewValue);
        }
      } else if (handle === 'min') {
        // Dual-handle mode: update min value (Requirement 2.9)
        this.updateMinValue(newValue, true);
      } else {
        // Dual-handle mode: update max value (Requirement 2.9)
        this.updateMaxValue(newValue, true);
      }
    }
  }

  protected writeValueToView(value: string): void {
    console.log('writeValueToView', value);
    if (this.inputElementRef?.nativeElement != null) {
      this.renderer.setProperty(this.inputElementRef.nativeElement, 'value', value);
    }
  }

  protected override viewValueToModelValue(value: string): number {
    console.log('viewValueToModelValue', value);
    return this.valueConverter.fromView(value, this.numberFormatConverterOptions ?? this.boundedFormat);
  }

  protected override modelValueToViewValue(value: number): string | undefined {
    console.log('modelValueToViewValue', value);
    if (value == null) {
      return undefined;
    }
    return this.valueConverter.toView(value, this.numberFormatConverterOptions ?? this.boundedFormat);
  }

  private updateProgressDisplay(value: number): void {
    const sliderProgress: number = ((value - this.min) / (this.max - this.min)) * 100;

    this.displayValue = this.getDisplayValue(value);
    this.renderer.setStyle(this.inputDisplayValueElementRef.nativeElement, 'left', `${sliderProgress}%`);

    if (this.options.showProgressBar) {
      this.renderer.setStyle(
        this.inputElementRef.nativeElement,
        'background',
        `linear-gradient(to right, #005F9E ${sliderProgress}%, #C2C2CD ${sliderProgress}%)`,
      );
    }
  }

  private generateTickData(): void {
    const tickStep: number = (this.max - this.min) / (this._options.tickSteps - 1);

    this.tickData = Array(this._options.tickSteps)
      .fill(null)
      .map((_, i: number) => {
        const value: number = tickStep * i + this.min;

        return {
          x: ((tickStep * i) / (this.max - this.min)) * 100,
          value: value.toString(),
          displayValue: i % this._options.tickValueSteps === 0 ? this.getFormattedTickValue(value) : null,
        };
      });
  }

  private getFormattedTickValue(value: number): string {
    if (typeof this._options.formatTickValue === 'function') {
      return this._options.formatTickValue(value);
    }
    return this.valueConverter.toView(value, this.displayFormat);
  }

  /**
   * Initialize range slider state for dual-handle mode
   */
  private initializeRangeSliderState(): void {
    this.rangeSliderState = {
      minValue: this._options.minValue ?? this.min,
      maxValue: this._options.maxValue ?? this.max,
      isDraggingMin: false,
      isDraggingMax: false,
      focusedHandle: null,
    };
  }

  /**
   * Update minimum value with constraint validation (Requirements 1.3, 1.4)
   * Ensures min never exceeds max
   */
  private updateMinValue(newValue: number, isChangeEvent: boolean): void {
    if (!this.rangeSliderState) {
      return;
    }

    // Constraint: min must not exceed max (Requirement 1.3)
    const constrainedValue = Math.min(newValue, this.rangeSliderState.maxValue);

    // Update state
    this.rangeSliderState.minValue = constrainedValue;

    // Update the input element to reflect constrained value
    if (this.minInputElementRef?.nativeElement) {
      this.renderer.setProperty(this.minInputElementRef.nativeElement, 'value', constrainedValue.toString());
    }

    // Emit events (handled in subtask 2.4)
    this.emitRangeEvents(isChangeEvent);

    // Update progress bar display (handled in subtask 2.6)
    this.updateRangeProgressDisplay();
  }

  /**
   * Update maximum value with constraint validation (Requirements 1.3, 1.4)
   * Ensures max never goes below min
   */
  private updateMaxValue(newValue: number, isChangeEvent: boolean): void {
    if (!this.rangeSliderState) {
      return;
    }

    // Constraint: max must not go below min (Requirement 1.4)
    const constrainedValue = Math.max(newValue, this.rangeSliderState.minValue);

    // Update state
    this.rangeSliderState.maxValue = constrainedValue;

    // Update the input element to reflect constrained value
    if (this.maxInputElementRef?.nativeElement) {
      this.renderer.setProperty(this.maxInputElementRef.nativeElement, 'value', constrainedValue.toString());
    }

    // Emit events (handled in subtask 2.4)
    this.emitRangeEvents(isChangeEvent);

    // Update progress bar display (handled in subtask 2.6)
    this.updateRangeProgressDisplay();
  }

  /**
   * Emit range change events (Requirement 1.5)
   */
  private emitRangeEvents(isChangeEvent: boolean): void {
    if (!this.rangeSliderState) {
      return;
    }

    const { minValue, maxValue } = this.rangeSliderState;

    // Emit separate events for min and max value changes
    this.minValueChange.emit(minValue);
    this.maxValueChange.emit(maxValue);

    // Emit combined range change event
    this.rangeChange.emit({ min: minValue, max: maxValue });

    // Also emit the existing rangeDrag/rangeDrop events for backward compatibility
    // Use the average of min and max as the single value
    const averageValue = (minValue + maxValue) / 2;

    if (isChangeEvent) {
      this.rangeDrop.emit(averageValue);
    } else {
      this.rangeDrag.emit(averageValue);
    }
  }

  /**
   * Update progress bar for range mode (Requirement 1.7)
   */
  private updateRangeProgressDisplay(): void {
    if (!this.rangeSliderState) {
      return;
    }

    const { minValue, maxValue } = this.rangeSliderState;

    // Calculate progress percentages for min and max handles
    const minProgress = ((minValue - this.min) / (this.max - this.min)) * 100;
    const maxProgress = ((maxValue - this.min) / (this.max - this.min)) * 100;

    // Update display values (show range as "min - max")
    const minDisplayValue = this.getDisplayValue(minValue);
    const maxDisplayValue = this.getDisplayValue(maxValue);
    this.displayValue = `${minDisplayValue} - ${maxDisplayValue}`;

    // Position display value at the midpoint of the range
    const midProgress = (minProgress + maxProgress) / 2;
    if (this.inputDisplayValueElementRef?.nativeElement) {
      this.renderer.setStyle(this.inputDisplayValueElementRef.nativeElement, 'left', `${midProgress}%`);
    }

    // Update progress bar to show selected range (Requirement 1.7)
    if (this.options.showProgressBar) {
      // Apply gradient showing the selected range between min and max handles
      const gradient = `linear-gradient(to right, 
        #C2C2CD 0%, 
        #C2C2CD ${minProgress}%, 
        #005F9E ${minProgress}%, 
        #005F9E ${maxProgress}%, 
        #C2C2CD ${maxProgress}%, 
        #C2C2CD 100%)`;

      // Apply to both input elements
      if (this.minInputElementRef?.nativeElement) {
        this.renderer.setStyle(this.minInputElementRef.nativeElement, 'background', gradient);
      }
      if (this.maxInputElementRef?.nativeElement) {
        this.renderer.setStyle(this.maxInputElementRef.nativeElement, 'background', gradient);
      }
    }
  }
}

export type RangeInputConvertFormat = (value: number) => string;

export class RangeInputOptions {
  public hideDisplayValue? = true;
  public showProgressBar? = false;
  public showTicks? = false;
  public tickSteps? = 21;
  public tickValueSteps? = 5;
  public convertValue?: RangeInputConvertFormat;
  public formatDisplayValue?: RangeInputConvertFormat;
  public formatTickValue?: RangeInputConvertFormat;

  // Range slider options (Requirement 1)
  /** Enable dual-handle mode for selecting min/max ranges */
  public enableRangeMode? = false;
  /** Minimum value for dual-handle mode */
  public minValue?: number;
  /** Maximum value for dual-handle mode */
  public maxValue?: number;

  // Keyboard navigation options (Requirement 2)
  /** Enable keyboard navigation (arrow keys, page up/down, home/end) */
  public enableKeyboardNavigation? = true;
  /** Large step percentage for Page Up/Down keys (percentage of range, default 10%) */
  public largeStepPercentage? = 10;

  // Animation options (Requirement 3)
  /** Enable CSS transitions for programmatic value changes */
  public enableAnimations? = true;
  /** Animation duration in milliseconds */
  public animationDuration? = 200;
  /** CSS animation easing function */
  public animationEasing? = 'ease-out';

  // Tooltip options (Requirement 4)
  /** Tooltip visibility mode: 'always' | 'onHover' | 'onDrag' | 'never' */
  public showTooltip?: 'always' | 'onHover' | 'onDrag' | 'never' = 'never';
  /** Tooltip placement relative to handle: 'top' | 'bottom' | 'left' | 'right' */
  public tooltipPlacement?: 'top' | 'bottom' | 'left' | 'right' = 'top';
  /** Delay in milliseconds before hiding tooltip after interaction stops */
  public tooltipDelay? = 500;
  /** Custom formatter function for tooltip content */
  public formatTooltipValue?: RangeInputConvertFormat;
  /** Custom template for tooltip content */
  public tooltipTemplate?: TemplateRef<any>;

  // Styling options (Requirement 5)
  /** Custom CSS class for slider handle */
  public customHandleClass?: string;
  /** Custom CSS class for slider track */
  public customTrackClass?: string;
  /** Custom CSS class for progress bar */
  public customProgressClass?: string;
  /** Custom CSS class for tick marks */
  public customTickClass?: string;
  /** Handle size in pixels */
  public handleSize?: number;
  /** Track height in pixels */
  public trackHeight?: number;

  // Accessibility options (Requirement 6)
  /** Custom formatter for aria-valuetext attribute */
  public ariaValueTextFormatter?: (value: number) => string;
  /** ARIA label for minimum handle in dual-handle mode */
  public minHandleAriaLabel?: string;
  /** ARIA label for maximum handle in dual-handle mode */
  public maxHandleAriaLabel?: string;
}

export interface RangeInputTickData {
  displayValue: string;
  value: string;
  x: number;
}

/**
 * Internal state for range slider (dual-handle) mode
 */
export interface RangeSliderState {
  /** Current minimum value */
  minValue: number;
  /** Current maximum value */
  maxValue: number;
  /** Whether the minimum handle is currently being dragged */
  isDraggingMin: boolean;
  /** Whether the maximum handle is currently being dragged */
  isDraggingMax: boolean;
  /** Which handle currently has focus */
  focusedHandle: 'min' | 'max' | null;
}

/**
 * iOS Compatibility Notes (Requirement 7)
 *
 * iOS Safari has specific limitations with native range inputs that must be considered:
 *
 * 1. **Two-tap interaction pattern**: iOS requires tapping the track to focus, then dragging.
 *    This is native behavior that cannot be overridden programmatically.
 *
 * 2. **Drag must start on thumb**: Users cannot initiate drag from the track itself on iOS,
 *    only from the thumb element. This is a native iOS Safari limitation.
 *
 * 3. **Scroll vs drag conflict**: Touch gestures in scrollable containers may trigger scrolling
 *    instead of dragging. Use `touch-action: none` on the slider container to prevent this.
 *
 * 4. **-webkit-appearance considerations**: Removing all webkit appearance styling with
 *    `-webkit-appearance: none` can disable touch handlers entirely. Preserve minimal
 *    webkit-appearance properties necessary for iOS touch handling.
 *
 * 5. **Step attribute limitation**: Non-zero step values may disable track-dragging outside
 *    the thumb on iOS Safari.
 *
 * 6. **Minimum iOS version**: iOS 15+ is required for full HTML5 Drag and Drop API support.
 *
 * 7. **Fallback touch handlers**: If native range input drag behavior fails on iOS, fallback
 *    touch event handlers may be required.
 */
