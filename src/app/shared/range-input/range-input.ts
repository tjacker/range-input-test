import { NgControl } from '@angular/forms';
import { InputControl } from '../input-control';
import { NumberFormatValueConverter } from '../service/number-converter';
import { ValueConverter } from '../service/value-converter';
import {
  debounceTime,
  distinctUntilChanged,
  EMPTY,
  iif,
  of,
  Subject,
  switchMap,
  takeUntil,
} from 'rxjs';
import {
  AfterViewInit,
  ChangeDetectorRef,
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
  selector: 'app-range-input',
  templateUrl: './range-input.html',
  styleUrls: ['./range-input.scss'],
  providers: [
    { provide: InputControl, useExisting: RangeInputComponent },
    { provide: ValueConverter, useClass: NumberFormatValueConverter },
  ],
})
export class RangeInputComponent
  extends InputControl<string, number>
  implements OnInit, AfterViewInit, OnDestroy
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
  @Input() public options: RangeInputOptions;
  @Input() public prefix?: string;
  @Input() public step: number | 'any' = 1;
  @Input() public suffix?: string;

  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('mgDisplayFormat') public displayFormat = '0';

  @Output() public rangeDrop = new EventEmitter<number>();
  @Output() public rangeDrag = new EventEmitter<number>();

  public tickData: TickData[];

  @ViewChild('rangeInputField')
  private rangeInputField: ElementRef<HTMLInputElement>;
  @ViewChild('rangeInputDisplay')
  private rangeInputDisplay: ElementRef<HTMLSpanElement>;

  private rangeInputUpdate$ = new Subject<number>();
  private componentDestroyed$ = new Subject<boolean>();
  private isChangeEvent = false;
  private isInputEvent = false;

  public constructor(
    @Self() public model: NgControl,
    protected valueConverter: ValueConverter,
    private renderer: Renderer2,
    private cdr: ChangeDetectorRef
  ) {
    super();

    this.model.valueAccessor = this;
    this.registerAfterOnChange((value: number): void =>
      this.rangeInputUpdate$.next(value)
    );
  }

  public get formattedDisplayValue(): string {
    if (typeof this.options.formatDisplayValue === 'function') {
      return this.options.formatDisplayValue(+this.value);
    }

    return this.valueConverter.toView(this.value, this.displayFormat);
  }

  public ngOnInit(): void {
    this.options = {
      ...new RangeInputOptions(),
      ...this.options,
    };

    if (this.options.showTicks) {
      this.generateTickData();
    }

    this.rangeInputUpdate$
      .pipe(
        takeUntil(this.componentDestroyed$),
        debounceTime(this.dropDebounce),
        switchMap((rangeInputValue: number) =>
          iif(() => this.isChangeEvent, of(rangeInputValue), EMPTY)
        ),
        distinctUntilChanged()
      )
      .subscribe((rangeInputValue: number) => {
        this.rangeDrop.emit(rangeInputValue);
        this.isChangeEvent = false;
      });

    this.rangeInputUpdate$
      .pipe(
        takeUntil(this.componentDestroyed$),
        debounceTime(this.dragDebounce),
        switchMap((rangeInputValue: number) =>
          iif(() => this.isInputEvent, of(rangeInputValue), EMPTY)
        ),
        distinctUntilChanged()
      )
      .subscribe((rangeInputValue: number) => {
        this.rangeDrag.emit(rangeInputValue);
        this.isInputEvent = false;
      });
  }

  public ngAfterViewInit(): void {
    this.updateProgressDisplay(this.value);
  }

  public ngOnDestroy(): void {
    this.componentDestroyed$.next(true);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public onBlurEvent(event: FocusEvent): void {
    this.onTouched();
  }

  public onChangeEvent(event: Event): void {
    this.isChangeEvent = true;
    this.onChange((event.target as HTMLInputElement).value);
  }

  public onInputEvent(event: Event): void {
    this.isInputEvent = true;
    const target = event.target as HTMLInputElement;

    if (typeof this.options.convertValue === 'function') {
      target.value = this.options.convertValue(+target.value).toString();
    }

    this.onChange(target.value);
  }

  public onTickValueClick(value: string) {
    if (this.rangeInputField.nativeElement.value === value) return;

    this.onChange(value);
    this.cdr.detectChanges();
    this.rangeInputField.nativeElement.dispatchEvent(
      new Event('change', { bubbles: true })
    );
  }

  protected override onChange(value: string): void {
    const rangeValue: string = value.replace(/,/g, '');

    super.onChange(rangeValue);
  }

  protected override valueToModel(value: string): number {
    return +value;
  }

  protected override valueToView(value: number): string {
    if (value == null) return null;

    const valueToString: string = value.toString();

    if (this.rangeInputField) {
      this.updateProgressDisplay(valueToString);
    }
    return valueToString;
  }

  private getFormattedTickValue(value: number): string {
    if (typeof this.options.formatTickValue === 'function') {
      return this.options.formatTickValue(value);
    }

    return this.valueConverter.toView(value, this.displayFormat);
  }

  private updateProgressDisplay(value: string): void {
    const sliderProgress: number =
      ((+value - this.min) / (this.max - this.min)) * 100;

    if (!this.options.hideDisplayValue) {
      this.renderer.setStyle(
        this.rangeInputDisplay.nativeElement,
        'left',
        `${sliderProgress}%`
      );
    }

    if (this.options.showProgressBar) {
      this.renderer.setStyle(
        this.rangeInputField.nativeElement,
        'background',
        `linear-gradient(to right, #005F9E ${sliderProgress}%, #C2C2CD ${sliderProgress}%)`
      );
    }
  }

  private generateTickData(): void {
    const tickStep: number =
      (this.max - this.min) / (this.options.tickSteps - 1);

    this.tickData = Array(this.options.tickSteps)
      .fill(null)
      .map((_, i: number) => {
        const value: number = tickStep * i + this.min;

        return {
          x: ((tickStep * i) / (this.max - this.min)) * 100,
          value: value.toString(),
          displayValue:
            i % this.options.tickValueSteps === 0
              ? this.getFormattedTickValue(value)
              : null,
        };
      });
  }
}

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

export type RangeInputConvertFormat = (value: number) => string;

interface TickData {
  x: number;
  value: string;
  displayValue: string;
}
