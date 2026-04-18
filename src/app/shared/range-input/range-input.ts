import { NgControl } from '@angular/forms';
import { InputControl } from '../input-control';
import { ValueConverter } from '../service/value-converter';
import { RangeInputNumberFormatConverter } from './range-input-number-format-converter';
import {
  debounceTime,
  distinctUntilChanged,
  EMPTY,
  filter,
  iif,
  of,
  Subject,
  switchMap,
  takeUntil,
} from 'rxjs';
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
  ViewChild,
} from '@angular/core';

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
export class RangeInputComponent
  extends InputControl<string, number>
  implements OnInit, OnDestroy
{
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

  public displayValue: string;
  public tickData: RangeInputTickData[];

  @ViewChild('input') private inputElementRef: ElementRef<HTMLInputElement>;
  @ViewChild('inputDisplayValue')
  private inputDisplayValueElementRef: ElementRef<HTMLSpanElement>;

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
        filter(
          (): boolean =>
            this.isChangeEvent === false && this.isInputEvent === false,
        ),
      )
      .subscribe(this.updateProgressDisplay);

    this.registerAfterOnChange(this.updateAfterOnChange);
  }

  private updateAfterOnChange = (value: number): void => {
    this.updateProgressDisplay(value);
    this.updateOnDragOrDrop$.next(value);
  };

  public ngOnInit(): void {
    if (this._options.showTicks) {
      this.generateTickData();
    }

    // Input observable needs to be defined before change observable or change will fire first in some cases
    this.updateOnDragOrDrop$
      .pipe(
        takeUntil(this.componentDestroyed$),
        debounceTime(this.dragDebounce),
        switchMap((value: number) =>
          iif((): boolean => this.isInputEvent === true, of(value), EMPTY),
        ),
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
        switchMap((value: number) =>
          iif((): boolean => this.isChangeEvent === true, of(value), EMPTY),
        ),
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
    const isSafari = /^((?!chrome|chromium).)*safari/i.test(
      navigator.userAgent,
    );
    if (isSafari) {
      this.onChangeEvent(event);
    }
  }

  protected onTickValueClick(value: string): void {
    if (this.inputElementRef.nativeElement.value === value) {
      return;
    }
    this.isChangeEvent = true;
    this.onChange(value);
  }

  protected writeValueToView(value: string): void {
    console.log('writeValueToView', value);
    if (this.inputElementRef?.nativeElement != null) {
      this.renderer.setProperty(
        this.inputElementRef.nativeElement,
        'value',
        value,
      );
    }
  }

  protected override viewValueToModelValue(value: string): number {
    console.log('viewValueToModelValue', value);
    return this.valueConverter.fromView(
      value,
      this.numberFormatConverterOptions ?? this.boundedFormat,
    );
  }

  protected override modelValueToViewValue(value: number): string | undefined {
    console.log('modelValueToViewValue', value);
    if (value == null) {
      return undefined;
    }
    return this.valueConverter.toView(
      value,
      this.numberFormatConverterOptions ?? this.boundedFormat,
    );
  }

  private updateProgressDisplay(value: number): void {
    const sliderProgress: number =
      ((value - this.min) / (this.max - this.min)) * 100;

    this.displayValue = this.getDisplayValue(value);
    this.renderer.setStyle(
      this.inputDisplayValueElementRef.nativeElement,
      'left',
      `${sliderProgress}%`,
    );

    if (this.options.showProgressBar) {
      this.renderer.setStyle(
        this.inputElementRef.nativeElement,
        'background',
        `linear-gradient(to right, #005F9E ${sliderProgress}%, #C2C2CD ${sliderProgress}%)`,
      );
    }
  }

  private generateTickData(): void {
    const tickStep: number =
      (this.max - this.min) / (this._options.tickSteps - 1);

    this.tickData = Array(this._options.tickSteps)
      .fill(null)
      .map((_, i: number) => {
        const value: number = tickStep * i + this.min;

        return {
          x: ((tickStep * i) / (this.max - this.min)) * 100,
          value: value.toString(),
          displayValue:
            i % this._options.tickValueSteps === 0
              ? this.getFormattedTickValue(value)
              : null,
        };
      });
  }

  private getFormattedTickValue(value: number): string {
    if (typeof this._options.formatTickValue === 'function') {
      return this._options.formatTickValue(value);
    }
    return this.valueConverter.toView(value, this.displayFormat);
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
}

export interface RangeInputTickData {
  displayValue: string;
  value: string;
  x: number;
}
