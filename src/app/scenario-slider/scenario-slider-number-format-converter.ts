import { Injectable } from '@angular/core';
import { RangeInputNumberFormatConverter } from '../shared/range-input/range-input-number-format-converter';
import { NumberFormatValueConverter } from '../shared/service/number-converter';

export interface ScenarioNumberFormatConverterOptions {
  format: string;
  maximum: number;
}

@Injectable()
export class ScenarioNumberFormatConverter implements RangeInputNumberFormatConverter {
  public constructor(
    protected numberFormatValueConverter: NumberFormatValueConverter,
  ) {}

  public toView(
    value: number,
    options: ScenarioNumberFormatConverterOptions,
  ): string {
    const x: string = this.numberFormatValueConverter.toView(
      this.test(value, options),
      options.format,
    );
    // console.log('ScenarioNumberFormatConverter toView', x, options);
    return x;
  }

  public fromView(
    value: string,
    options: ScenarioNumberFormatConverterOptions,
  ): number {
    const x: number = this.test(
      this.numberFormatValueConverter.fromView(value, options.format),
      options,
    );
    // console.log('ScenarioNumberFormatConverter fromView', x, options);
    return x;
  }

  protected test(
    value: number,
    options: ScenarioNumberFormatConverterOptions,
  ): number {
    return Math.round(value) > options.maximum
      ? options.maximum
      : Math.round(value);
  }
}
