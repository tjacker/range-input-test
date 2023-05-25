import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { OptionalAttributesDirective } from './directives/optional-attributes';
import { RangeInputComponent } from './range-input/range-input';

@NgModule({
  declarations: [OptionalAttributesDirective, RangeInputComponent],
  imports: [CommonModule],
  exports: [OptionalAttributesDirective, RangeInputComponent],
})
export class SharedModule {}
