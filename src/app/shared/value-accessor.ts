import { ControlValueAccessor } from '@angular/forms';

export abstract class ValueAccessor<TViewValue, TModelValue> implements ControlValueAccessor {
  private beforeViewValueToModelValueFns: ((value: TViewValue) => TViewValue)[] = [];
  private afterViewValueToModelValueFns: ((value: TModelValue) => TModelValue)[] = [];
  private beforeModelValueToViewValueFns: ((value: TModelValue) => TModelValue)[] = [];
  private afterModelValueToViewValueFns: ((value: TViewValue) => TViewValue)[] = [];
  private beforeOnChangeFns: ((value: TModelValue) => void)[] = [];
  private afterOnChangeFns: ((value: TModelValue) => void)[] = [];
  private onChangeFns: ((value: TModelValue) => void)[] = [];
  private onTouchedFns: (() => void)[] = [];

  public registerBeforeViewValueToModelValue(fn: (value: TViewValue) => TViewValue): void {
    this.beforeViewValueToModelValueFns.push(fn);
  }

  public registerAfterViewValueToModelValue(fn: (value: TModelValue) => TModelValue): void {
    this.afterViewValueToModelValueFns.unshift(fn);
  }

  public registerBeforeModelValueToViewValue(fn: (value: TModelValue) => TModelValue): void {
    this.beforeModelValueToViewValueFns.push(fn);
  }

  public registerAfterModelValueToViewValue(fn: (value: TViewValue) => TViewValue): void {
    this.afterModelValueToViewValueFns.unshift(fn);
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
    this.writeValueToView(this.executeModelValueToViewValue(value));
  }

  protected abstract writeValueToView(value: TViewValue): void;

  protected onChange(value: TViewValue): void {
    const modelValue: TModelValue = this.executeViewValueToModelValue(value);
    this.executeRegisteredFns(this.beforeOnChangeFns, modelValue);
    this.executeRegisteredFns(this.onChangeFns, modelValue);
    this.executeRegisteredFns(this.afterOnChangeFns, modelValue);
    this.writeValue(modelValue);
  }

  protected onTouched(): void {
    this.executeRegisteredFns(this.onTouchedFns);
  }

  protected viewValueToModelValue(value: TViewValue): TModelValue {
    return value as unknown as TModelValue;
  }

  protected modelValueToViewValue(value: TModelValue): TViewValue {
    return value as unknown as TViewValue;
  }

  private executeViewValueToModelValue(value: TViewValue): TModelValue {
    return this.executeRegisteredFns(
      this.afterViewValueToModelValueFns,
      this.viewValueToModelValue(this.executeRegisteredFns(this.beforeViewValueToModelValueFns, value)),
    );
  }

  private executeModelValueToViewValue(value: TModelValue): TViewValue {
    return this.executeRegisteredFns(
      this.afterModelValueToViewValueFns,
      this.modelValueToViewValue(this.executeRegisteredFns(this.beforeModelValueToViewValueFns, value)),
    );
  }

  private executeRegisteredFns<TValue>(fns: ((value?: TValue) => TValue | void)[], value?: TValue): any {
    return fns.reduce(
      (previousValue: TValue, fn: (currentValue?: TValue) => TValue): TValue | void => fn(previousValue ?? value),
      value,
    );
  }
}
