import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[mgCommonFormsOptionalAttributes]',
})
export class OptionalAttributesDirective implements OnInit {
  @Input('mgCommonFormsOptionalAttributes')
  public attributes: OptionalAttributes;

  public constructor(private elRef: ElementRef, private renderer: Renderer2) {}

  public ngOnInit(): void {
    this.setAttributes(this.attributes);
  }

  private setAttributes(attributes: OptionalAttributes): void {
    Object.keys(attributes).forEach((key: string): void => {
      const value: OptionalAttributesType = attributes[key];
      this.setAttribute(key, value);
    });
  }

  private setAttribute(key: string, value: OptionalAttributesType): void {
    if (!(value === undefined || value === null || value === '')) {
      const attr = key.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
      this.renderer.setAttribute(
        this.elRef.nativeElement,
        attr,
        value as string
      );
    }
  }
}

export interface OptionalAttributes {
  id?: string;
  placeholder?: string;
  size?: number;
  title?: string;
  [key: string]: OptionalAttributesType;
}

export type OptionalAttributesType = boolean | number | string;
