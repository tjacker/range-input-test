import { Injectable } from '@angular/core';
import * as numeral from 'numeral';
import { ValueConverter } from './value-converter';

@Injectable({ providedIn: 'root' })
export class NumberFormatValueConverter implements ValueConverter {
  public toView(value: string | number, format: string): string {
    return numeral(value).format(format);
  }

  public fromView(value: string, format: string): number {
    const numberValue = numeral(value).value() || 0;
    const stringValue = numeral(numberValue).format(format);
    return numeral(stringValue).value();
  }
}
