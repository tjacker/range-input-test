import { NgControl, ValidatorFn } from '@angular/forms';
import { ValueAccessor } from './value-accessor';

export abstract class InputControl<
  TViewValue,
  TModelValue
> extends ValueAccessor<TViewValue, TModelValue> {
  public abstract model: NgControl;

  private validators: ValidatorFn[] = [];

  public constructor() {
    super();

    this.registerBeforeOnChange(this.beforeOnChange);

    this.registerAfterOnChange(this.afterOnChange);
  }

  public get invalid(): boolean {
    if (this.model == null) {
      return false;
    }

    const { dirty, invalid, touched } = this.model;

    return invalid ? dirty || touched : false;
  }

  public get failures(): string[] {
    if (this.model == null) {
      return [];
    }

    const messages: string[] = [];

    const { errors } = this.model;

    Object.getOwnPropertyNames(errors).forEach((key: string): void => {
      switch (typeof errors[key]) {
        case 'string':
          messages.push(errors[key]);
          break;
        default:
          messages.push(`Validation failed: ${key}`);
      }
    });

    return messages;
  }

  protected beforeOnChange = (): void => {
    this.validators = [];
    if (this.model.control.validator != null) {
      this.validators.push(this.model.control.validator);
    }
    this.model.control.clearValidators();
  };

  protected afterOnChange = (): void => {
    this.model.control.setValidators(this.validators);
    this.model.control.updateValueAndValidity();
  };
}
