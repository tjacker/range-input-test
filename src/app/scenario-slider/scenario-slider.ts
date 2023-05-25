import { Component, Renderer2 } from '@angular/core';
import { faLocationPin } from '@fortawesome/free-solid-svg-icons';

interface SecondaryMarkerOptions {
  placement: number;
  title: string;
}

@Component({
  selector: 'app-scenario-slider',
  templateUrl: './scenario-slider.html',
  styleUrls: ['./scenario-slider.scss'],
})
export class ScenarioSliderComponent {
  public selectedFearLabel = 'Great Recession';
  public step = 'any' as const;
  public mgDisplayFormat = '0';
  public prefix = '';
  public suffix = '';
  public scenarioSliderId = 'scenario-slider-input';
  public fearProperty = 'greatRecessionLoss';
  public minimum = 0;
  public maximum = 50.95;
  public value = 0;
  public secondaryMarkerOptions: SecondaryMarkerOptions | null;
  public options = {
    hideDisplayValue: false,
    showProgressBar: true,
    showTicks: true,
  };
  public faLocationPin = faLocationPin;
  public status = 'Initial';

  public constructor(private renderer: Renderer2) {}

  public ngOnInit(): void {
    this.initializeProperties();
  }

  public onDragHandler(): void {
    this.status = 'Dragging';
  }

  public onDropHandler(value: number): void {
    this.value = value;
    setTimeout(() => {
      this.status = 'Dropped';
    }, 0);
  }

  private getSliderOptions(fearProperty: string) {
    const recessionConvertFormat = (value: number) =>
      Math.round(value) > this.maximum
        ? `${this.maximum}`
        : `${Math.round(value)}`;

    switch (fearProperty) {
      case 'greatRecessionLoss':
        return {
          convertValue: recessionConvertFormat,
          formatDisplayValue: recessionConvertFormat,
          formatTickValue: recessionConvertFormat,
        };
      default:
        return null;
    }
  }

  private getSecondaryMarkerOptions(
    fearProperty: string
  ): SecondaryMarkerOptions | null {
    if (fearProperty === 'greatRecessionLoss') {
      const placement = (10 / this.maximum) * 100;
      const title = `Great Recession Loss 10%`;

      return { placement, title };
    }
    return null;
  }

  private initializeProperties(): void {
    this.options = {
      ...this.options,
      ...this.getSliderOptions(this.fearProperty),
    };
    this.secondaryMarkerOptions = this.getSecondaryMarkerOptions(
      this.fearProperty
    );
  }
}
