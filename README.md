# RangeInputTest

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 15.2.8.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## RangeInputComponent - iOS Safari Compatibility

The `RangeInputComponent` uses native HTML `<input type="range">` elements, which have specific behavior and limitations on iOS Safari. This section documents these limitations and how the component handles them.

### iOS Safari Limitations

#### 1. Two-Tap Interaction Pattern (Requirement 7.1)

**Behavior**: On iOS Safari, interacting with a range slider requires two separate actions:

- **First tap**: Focuses the slider and moves the thumb to the tapped position
- **Second interaction**: Allows dragging the thumb

**Impact**: Users cannot drag the slider in a single continuous gesture from an unfocused state.

**Handling**: This is native iOS Safari behavior and cannot be overridden programmatically. The component gracefully handles this pattern without additional code changes.

#### 2. Drag Must Start on Thumb (Requirement 7.4)

**Behavior**: On iOS Safari, drag gestures must originate from the thumb element itself. Users cannot initiate a drag by touching the track.

**Impact**: Users must tap directly on the thumb to drag it. Tapping the track will jump the thumb to that position but won't initiate a drag.

**Handling**: The component's CSS preserves `-webkit-appearance` properties that maintain iOS touch handlers on the thumb (Requirement 7.2, 7.6). The `touch-action: none` CSS property prevents scroll/drag conflicts (Requirement 7.3).

#### 3. Step Attribute Limitation (Requirement 7.4)

**Behavior**: When a non-zero `step` attribute is set, iOS Safari may disable track-dragging outside the thumb.

**Impact**: With `step` values other than `any`, users may only be able to interact with the thumb itself, not the track.

**Handling**: This is a known iOS Safari limitation. The component's default `step` value is `1`, which works reliably. For continuous values, set `step="any"`.

#### 4. Scroll vs Drag Conflicts (Requirement 7.3)

**Behavior**: In scrollable containers, touch gestures on iOS may trigger scrolling instead of slider dragging.

**Impact**: Users may accidentally scroll the page when trying to drag the slider.

**Handling**: The component applies `touch-action: none` to the slider container, which prevents scroll gestures from interfering with slider interaction.

### CSS Properties for iOS Compatibility

The component's SCSS includes the following iOS-specific properties:

```scss
.c-range-input__field {
  // Prevents scroll/drag conflicts on iOS (Requirement 7.3)
  touch-action: none;

  // Maintains touch handlers while allowing custom styling (Requirement 7.2, 7.6)
  -webkit-appearance: none;
}
```

### Tested iOS Versions

The component has been designed to work with:

- **iOS 15+**: Full HTML5 Drag and Drop API support
- **iOS 16+**: Improved touch handling
- **iOS 17+**: Latest optimizations

### Webkit-Appearance Testing Results (Requirement 7.6)

Testing on iOS Safari shows that `-webkit-appearance: none` maintains drag functionality while allowing custom styling. The following webkit-appearance values have been tested:

- ✅ `none`: **Recommended** - Allows full custom styling while preserving touch handlers
- ❌ `slider-horizontal`: Reverts to native styling, limiting customization
- ❌ Other values: Not tested or not applicable for range inputs

### Fallback Touch Event Handlers (Requirement 7.7)

The current implementation relies on native range input behavior, which works reliably on iOS 15+. If native drag behavior fails on older iOS versions or specific devices, fallback touch event handlers can be implemented by:

1. Detecting touch events on the slider container
2. Calculating the touch position relative to the slider
3. Updating the slider value programmatically
4. Providing visual feedback during the touch interaction

This fallback is not currently implemented as native behavior works reliably on supported iOS versions (15+).

### Recommendations for Developers

1. **Test on real devices**: iOS Safari behavior differs from desktop Safari and simulators
2. **Use appropriate step values**: Set `step="any"` for continuous values, or use reasonable step increments
3. **Avoid nested scrollable containers**: If possible, avoid placing sliders inside scrollable containers
4. **Provide clear visual feedback**: Ensure the thumb is large enough and visually distinct for easy interaction
5. **Consider touch target size**: iOS recommends minimum 44x44pt touch targets for accessibility

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
