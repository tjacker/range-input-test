import { ControlValueAccessor } from '@angular/forms';

export abstract class ValueAccessor<TViewValue, TModelValue>
  implements ControlValueAccessor
{
  public get value(): TViewValue {
    return this._value;
  }

  public set value(value: TViewValue) {
    if (value !== this._value) {
      this._value = this.executeValueToView(this.executeValueToModel(value));
    }
  }

  private _value: TViewValue;
  private beforeValueToModelFns: ((value: TViewValue) => TViewValue)[] = [];
  private afterValueToModelFns: ((value: TModelValue) => TModelValue)[] = [];
  private beforeValueToViewFns: ((value: TModelValue) => TModelValue)[] = [];
  private afterValueToViewFns: ((value: TViewValue) => TViewValue)[] = [];
  private beforeOnChangeFns: ((value: TModelValue) => void)[] = [];
  private afterOnChangeFns: ((value: TModelValue) => void)[] = [];
  private onChangeFns: ((value: TModelValue) => void)[] = [];
  private onTouchedFns: (() => void)[] = [];

  public registerBeforeValueToModel(
    fn: (value: TViewValue) => TViewValue
  ): void {
    this.beforeValueToModelFns.push(fn);
  }

  public registerAfterValueToModel(
    fn: (value: TModelValue) => TModelValue
  ): void {
    this.afterValueToModelFns.unshift(fn);
  }

  public registerBeforeValueToView(
    fn: (value: TModelValue) => TModelValue
  ): void {
    this.beforeValueToViewFns.push(fn);
  }

  public registerAfterValueToView(fn: (value: TViewValue) => TViewValue): void {
    this.afterValueToViewFns.unshift(fn);
  }

  public registerBeforeOnChange(fn: (value: TModelValue) => void): void {
    this.beforeOnChangeFns.push(fn);
  }

  public registerAfterOnChange(fn: (value: TModelValue) => void): void {
    this.afterOnChangeFns.unshift(fn);
  }

  public registerOnChange(fn: (value: TModelValue) => void): void {
    this.onChangeFns.push(fn);
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouchedFns.push(fn);
  }

  public writeValue(value: TModelValue): void {
    this._value = this.executeValueToView(value);
  }

  protected onChange(value: TViewValue): void {
    const modelValue: TModelValue = this.executeValueToModel(value);
    this.executeRegisteredFns(this.beforeOnChangeFns, modelValue);
    this.executeRegisteredFns(this.onChangeFns, modelValue);
    this.executeRegisteredFns(this.afterOnChangeFns, modelValue);
    this.writeValue(modelValue);
  }

  protected onTouched(): void {
    this.executeRegisteredFns(this.onTouchedFns);
  }

  protected valueToModel(value: TViewValue): TModelValue {
    return value as unknown as TModelValue;
  }

  protected valueToView(value: TModelValue): TViewValue {
    return value as unknown as TViewValue;
  }

  private executeValueToModel(value: TViewValue): TModelValue {
    return this.executeRegisteredFns(
      this.afterValueToModelFns,
      this.valueToModel(
        this.executeRegisteredFns(this.beforeValueToModelFns, value)
      )
    );
  }

  private executeValueToView(value: TModelValue): TViewValue {
    return this.executeRegisteredFns(
      this.afterValueToViewFns,
      this.valueToView(
        this.executeRegisteredFns(this.beforeValueToViewFns, value)
      )
    );
  }

  private executeRegisteredFns<TValue>(
    fns: ((value?: TValue) => TValue | void)[],
    value?: TValue
  ): any {
    return fns.reduce(
      (
        previousValue: TValue,
        fn: (currentValue?: TValue) => TValue
      ): TValue | void => fn(previousValue ?? value),
      value
    );
  }
}
