import { Component } from '@angular/core';
import { RangeInputOptions } from '../shared/range-input/range-input';

@Component({
  selector: 'mg-test-page',
  templateUrl: './test-page.component.html',
  styleUrls: ['./test-page.component.scss'],
  standalone: false,
})
export class TestPageComponent {
  // Test Case 1: Basic single-handle slider
  public basicValue = 50;
  public basicOptions: RangeInputOptions = {
    hideDisplayValue: false,
    showProgressBar: true,
  };

  // Test Case 2: Slider with step="1"
  public integerStepValue = 5;
  public integerStepOptions: RangeInputOptions = {
    hideDisplayValue: false,
    showProgressBar: true,
  };

  // Test Case 3: Slider with step="0.1"
  public decimalStepValue = 5.5;
  public decimalStepOptions: RangeInputOptions = {
    hideDisplayValue: false,
    showProgressBar: true,
  };

  // Test Case 4: Slider with step="10"
  public largeStepValue = 50;
  public largeStepOptions: RangeInputOptions = {
    hideDisplayValue: false,
    showProgressBar: true,
  };

  // Test Case 5: Range slider (dual-handle)
  public rangeValue = 50; // Single value for backward compatibility
  public rangeOptions: RangeInputOptions = {
    enableRangeMode: true,
    minValue: 25,
    maxValue: 75,
    hideDisplayValue: false,
    showProgressBar: true,
  };

  // Test Case 6: Slider with percentage formatting
  public percentageValue = 50;
  public percentageOptions: RangeInputOptions = {
    hideDisplayValue: false,
    showProgressBar: true,
    formatDisplayValue: (value: number) => `${value}%`,
    ariaValueTextFormatter: (value: number) => `${value} percent`,
  };

  // Test Case 7: Slider with currency formatting
  public currencyValue = 1000;
  public currencyOptions: RangeInputOptions = {
    hideDisplayValue: false,
    showProgressBar: true,
    formatDisplayValue: (value: number) => `$${value.toLocaleString()}`,
    ariaValueTextFormatter: (value: number) => `${value} dollars`,
  };

  // Test Case 8: Slider with tick marks
  public tickValue = 50;
  public tickOptions: RangeInputOptions = {
    hideDisplayValue: false,
    showProgressBar: true,
    showTicks: true,
    tickSteps: 11,
    tickValueSteps: 2,
  };

  // Test Case 9: Slider with animations
  public animatedValue = 50;
  public animatedOptions: RangeInputOptions = {
    hideDisplayValue: false,
    showProgressBar: true,
    enableAnimations: true,
    animationDuration: 300,
  };

  // Test Case 10: Slider with tooltip
  public tooltipValue = 50;
  public tooltipOptions: RangeInputOptions = {
    hideDisplayValue: false,
    showProgressBar: true,
    showTooltip: 'onHover',
    tooltipPlacement: 'top',
    formatTooltipValue: (value: number) => `Value: ${value}`,
  };

  // Test Case 11: Slider with keyboard navigation
  public keyboardValue = 50;
  public keyboardOptions: RangeInputOptions = {
    hideDisplayValue: false,
    showProgressBar: true,
    enableKeyboardNavigation: true,
    largeStepPercentage: 10,
  };

  // Test Case 12: Range slider with distinct labels
  public accessibleRangeValue = 50; // Single value for backward compatibility
  public accessibleRangeOptions: RangeInputOptions = {
    enableRangeMode: true,
    minValue: 30,
    maxValue: 70,
    hideDisplayValue: false,
    showProgressBar: true,
    minHandleAriaLabel: 'Minimum value',
    maxHandleAriaLabel: 'Maximum value',
  };

  // Test Case 13: Disabled slider
  public disabledValue = 50;
  public disabledOptions: RangeInputOptions = {
    hideDisplayValue: false,
    showProgressBar: true,
  };

  // Methods for programmatic value changes (animation testing)
  public setAnimatedValueToMin(): void {
    this.animatedValue = 0;
  }

  public setAnimatedValueToMax(): void {
    this.animatedValue = 100;
  }

  public setAnimatedValueToMiddle(): void {
    this.animatedValue = 50;
  }

  public randomizeAnimatedValue(): void {
    this.animatedValue = Math.floor(Math.random() * 101);
  }

  // Event handlers for range sliders
  public onRangeChange(event: { min: number; max: number }): void {
    this.rangeOptions.minValue = event.min;
    this.rangeOptions.maxValue = event.max;
  }

  public onAccessibleRangeChange(event: { min: number; max: number }): void {
    this.accessibleRangeOptions.minValue = event.min;
    this.accessibleRangeOptions.maxValue = event.max;
  }
}
