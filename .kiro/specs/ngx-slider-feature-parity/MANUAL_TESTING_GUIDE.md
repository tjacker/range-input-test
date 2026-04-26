# Manual Testing Guide: iOS and Screen Reader Testing

## Overview

This guide provides step-by-step instructions for manual testing of the RangeInputComponent on iOS devices and with screen readers. These tests validate Requirements 6.5 and 7.1-7.7 from the requirements document.

## Prerequisites

### Required Devices and Software

- **iOS Device**: iPhone or iPad running iOS 15.0 or later
- **macOS Device**: For VoiceOver testing (optional but recommended)
- **Windows Device**: For NVDA/JAWS testing
- **Browsers**:
  - Safari on iOS (primary)
  - Safari on macOS (for VoiceOver)
  - Chrome/Edge on Windows (for NVDA/JAWS)

### Test Application Setup

1. Build the application for production:

   ```bash
   npm run build
   ```

2. Serve the application on your local network:

   ```bash
   # Option 1: Use a simple HTTP server
   npx http-server dist/range-input-test -p 8080

   # Option 2: Use Angular dev server with network access
   ng serve --host 0.0.0.0 --port 4200
   ```

3. Find your local IP address:

   ```bash
   # macOS/Linux
   ifconfig | grep "inet "

   # Windows
   ipconfig
   ```

4. Access the app on your iOS device:
   - Open Safari on iOS
   - Navigate to `http://[YOUR_IP]:8080` or `http://[YOUR_IP]:4200`
   - Bookmark the page for easy access during testing

---

## Part 1: iOS Device Testing (Task 11.1)

### Test Environment Setup

**Device Information to Record:**

- Device model: ******\_\_\_\_******
- iOS version: ******\_\_\_\_******
- Safari version: ******\_\_\_\_******
- Screen size: ******\_\_\_\_******
- Date tested: ******\_\_\_\_******

---

### Test Case 1.1: Basic Touch Interaction

**Objective**: Verify basic slider functionality works on iOS Safari

**Steps**:

1. Open the test page on iOS Safari
2. Locate a single-handle slider
3. Tap directly on the slider thumb (handle)
4. Drag the thumb left and right
5. Release the thumb

**Expected Results**:

- [ ] Thumb responds to tap immediately
- [ ] Thumb follows finger during drag
- [ ] Value updates in real-time during drag
- [ ] Drag is smooth without lag
- [ ] Release completes the interaction

**Actual Results**:

```
[Record observations here]
```

**Issues Found**: ☐ None ☐ Minor ☐ Major

```
[Describe any issues]
```

---

### Test Case 1.2: Two-Tap Interaction Pattern

**Objective**: Verify iOS's native two-tap behavior is handled gracefully

**Steps**:

1. Tap on the slider track (NOT on the thumb)
2. Observe what happens
3. Tap again on the track
4. Observe if the thumb moves

**Expected Results**:

- [ ] First tap focuses the slider (may not move thumb)
- [ ] Second tap moves thumb to tapped location
- [ ] Behavior is consistent with native iOS range inputs
- [ ] No JavaScript errors occur

**Actual Results**:

```
[Record observations here]
```

**Notes**: This is native iOS behavior and cannot be changed. Document if it causes usability issues.

---

### Test Case 1.3: Scrollable Container Test

**Objective**: Verify slider works correctly inside scrollable containers (Requirement 7.3)

**Steps**:

1. Navigate to a page with a slider inside a scrollable div
2. Try to scroll the container by dragging near (but not on) the slider
3. Try to scroll by dragging on the slider track
4. Tap the slider thumb and drag horizontally
5. Tap the slider thumb and drag vertically

**Expected Results**:

- [ ] Scrolling works when dragging outside the slider
- [ ] Horizontal drag on thumb moves slider (not scroll)
- [ ] Vertical drag on thumb does NOT scroll the container
- [ ] `touch-action: none` prevents scroll conflicts
- [ ] Slider remains usable in scrollable context

**Actual Results**:

```
[Record observations here]
```

**Issues Found**: ☐ None ☐ Minor ☐ Major

```
[Describe any issues]
```

---

### Test Case 1.4: Step Attribute Behavior

**Objective**: Test slider behavior with various step values (Requirement 7.4)

**Test Scenarios**:

#### Scenario A: step="1" (integer steps)

1. Find slider with step="1"
2. Tap thumb and drag slowly
3. Tap on track away from thumb

**Results**:

- [ ] Thumb moves in discrete steps
- [ ] Track tap works: ☐ Yes ☐ No
- [ ] Drag from thumb works: ☐ Yes ☐ No

#### Scenario B: step="0.1" (decimal steps)

1. Find slider with step="0.1"
2. Tap thumb and drag slowly
3. Tap on track away from thumb

**Results**:

- [ ] Thumb moves in 0.1 increments
- [ ] Track tap works: ☐ Yes ☐ No
- [ ] Drag from thumb works: ☐ Yes ☐ No

#### Scenario C: step="10" (large steps)

1. Find slider with step="10"
2. Tap thumb and drag slowly
3. Tap on track away from thumb

**Results**:

- [ ] Thumb moves in steps of 10
- [ ] Track tap works: ☐ Yes ☐ No
- [ ] Drag from thumb works: ☐ Yes ☐ No

**Known iOS Limitation**: Track-dragging (outside thumb) may not work with non-zero step values. This is a Safari limitation.

**Actual Results**:

```
[Record observations for each scenario]
```

---

### Test Case 1.5: Drag Gesture Reliability

**Objective**: Verify drag gestures work reliably when starting from thumb (Requirement 7.5)

**Steps**:

1. Tap precisely on the slider thumb
2. Without lifting finger, drag left
3. Drag right
4. Drag to minimum value
5. Drag to maximum value
6. Release

**Repeat 10 times and record success rate**:

- Successful drags: **\_** / 10
- Failed drags: **\_** / 10

**Expected Results**:

- [ ] 100% success rate when starting drag from thumb
- [ ] Thumb follows finger precisely
- [ ] No "stuck" thumb behavior
- [ ] No accidental scrolling

**Actual Results**:

```
[Record observations]
```

**Issues Found**: ☐ None ☐ Minor ☐ Major

```
[Describe any issues]
```

---

### Test Case 1.6: Webkit Appearance Compatibility

**Objective**: Verify custom styling doesn't break touch handlers (Requirement 7.2, 7.6)

**Steps**:

1. Inspect the slider's CSS in Safari Web Inspector
2. Check for `-webkit-appearance` properties
3. Test drag functionality with current styling
4. Note which webkit properties are present

**CSS Properties to Check**:

- [ ] `-webkit-appearance` value: ******\_\_\_\_******
- [ ] `-webkit-tap-highlight-color` present: ☐ Yes ☐ No
- [ ] Custom thumb styling applied: ☐ Yes ☐ No
- [ ] Custom track styling applied: ☐ Yes ☐ No

**Functionality Check**:

- [ ] Drag from thumb works: ☐ Yes ☐ No
- [ ] Touch events fire correctly: ☐ Yes ☐ No
- [ ] Visual styling matches design: ☐ Yes ☐ No

**Actual Results**:

```
[Record observations]
```

---

### Test Case 1.7: Range Slider (Dual-Handle) on iOS

**Objective**: Verify dual-handle mode works on iOS

**Steps**:

1. Navigate to a range slider (two handles)
2. Tap and drag the minimum handle
3. Tap and drag the maximum handle
4. Try to make handles overlap
5. Test in scrollable container

**Expected Results**:

- [ ] Both handles are independently draggable
- [ ] Min handle cannot exceed max handle
- [ ] Max handle cannot go below min handle
- [ ] Both handles remain accessible when overlapped
- [ ] Works correctly in scrollable containers

**Actual Results**:

```
[Record observations]
```

**Issues Found**: ☐ None ☐ Minor ☐ Major

```
[Describe any issues]
```

---

### Test Case 1.8: Performance and Responsiveness

**Objective**: Verify slider performs well on iOS

**Steps**:

1. Drag slider rapidly back and forth
2. Observe frame rate and smoothness
3. Check for any lag or stuttering
4. Test with animations enabled
5. Test with animations disabled

**Performance Metrics**:

- Visual smoothness: ☐ Excellent ☐ Good ☐ Fair ☐ Poor
- Response time: ☐ Immediate ☐ Slight delay ☐ Noticeable lag
- Animation quality: ☐ Smooth ☐ Choppy ☐ N/A

**Actual Results**:

```
[Record observations]
```

---

### Test Case 1.9: Orientation Change

**Objective**: Verify slider works after device rotation

**Steps**:

1. Test slider in portrait mode
2. Rotate device to landscape mode
3. Test slider again
4. Rotate back to portrait
5. Test slider again

**Expected Results**:

- [ ] Slider repositions correctly after rotation
- [ ] Touch targets remain accurate
- [ ] Values are preserved
- [ ] No visual glitches

**Actual Results**:

```
[Record observations]
```

---

### Test Case 1.10: Multi-Touch Scenarios

**Objective**: Verify slider handles multi-touch correctly

**Steps**:

1. For range slider: Try dragging both handles simultaneously with two fingers
2. Try pinch-to-zoom gesture on slider
3. Try two-finger scroll while interacting with slider

**Expected Results**:

- [ ] Dual-handle: Both handles can be dragged simultaneously
- [ ] Pinch-to-zoom is prevented on slider
- [ ] Two-finger scroll works outside slider
- [ ] No conflicts between gestures

**Actual Results**:

```
[Record observations]
```

---

## Part 2: Screen Reader Testing (Task 11.2)

### Test Environment Setup

**Screen Reader Information to Record:**

#### VoiceOver (iOS)

- Device: ******\_\_\_\_******
- iOS version: ******\_\_\_\_******
- VoiceOver version: ******\_\_\_\_******

#### VoiceOver (macOS)

- macOS version: ******\_\_\_\_******
- Safari version: ******\_\_\_\_******

#### NVDA (Windows)

- NVDA version: ******\_\_\_\_******
- Browser: ******\_\_\_\_******

#### JAWS (Windows)

- JAWS version: ******\_\_\_\_******
- Browser: ******\_\_\_\_******

---

### Test Case 2.1: VoiceOver on iOS

**Objective**: Verify slider is accessible with VoiceOver on iOS (Requirement 6.5)

**Setup**:

1. Enable VoiceOver: Settings → Accessibility → VoiceOver → On
2. Open Safari and navigate to test page
3. Use swipe gestures to navigate

**Steps**:

#### Basic Announcement

1. Swipe right until slider is focused
2. Listen to VoiceOver announcement

**Expected Announcement**:

- [ ] Control type announced (e.g., "slider", "adjustable")
- [ ] Current value announced
- [ ] Minimum value announced
- [ ] Maximum value announced
- [ ] Label/purpose announced

**Actual Announcement**:

```
[Record exact VoiceOver speech]
```

#### Value Adjustment

1. With slider focused, swipe up to increase value
2. Listen to announcement
3. Swipe down to decrease value
4. Listen to announcement

**Expected Results**:

- [ ] Swipe up increases value
- [ ] Swipe down decreases value
- [ ] New value is announced after each change
- [ ] Changes respect step value

**Actual Results**:

```
[Record observations]
```

#### ARIA Attributes Check

1. Use VoiceOver rotor to check attributes
2. Verify aria-valuemin, aria-valuemax, aria-valuenow
3. Check for aria-valuetext if custom formatting is used

**Attributes Found**:

- [ ] aria-valuemin: ******\_\_\_\_******
- [ ] aria-valuemax: ******\_\_\_\_******
- [ ] aria-valuenow: ******\_\_\_\_******
- [ ] aria-valuetext: ******\_\_\_\_******
- [ ] aria-label: ******\_\_\_\_******

**Issues Found**: ☐ None ☐ Minor ☐ Major

```
[Describe any issues]
```

---

### Test Case 2.2: VoiceOver on macOS

**Objective**: Verify slider works with VoiceOver on macOS

**Setup**:

1. Enable VoiceOver: Cmd+F5 or System Preferences → Accessibility
2. Open Safari and navigate to test page
3. Use VO+Right Arrow to navigate

**Steps**:

#### Keyboard Navigation with VoiceOver

1. Tab to slider
2. Press VO+Space to interact
3. Press Right Arrow to increase value
4. Press Left Arrow to decrease value
5. Press Up Arrow to increase value
6. Press Down Arrow to decrease value
7. Press Home to go to minimum
8. Press End to go to maximum
9. Press Page Up for large increase
10. Press Page Down for large decrease

**Expected Results**:

- [ ] All arrow keys work correctly
- [ ] Home/End keys work
- [ ] Page Up/Down keys work
- [ ] VoiceOver announces each value change
- [ ] Step size is respected

**Actual Results**:

```
[Record observations for each key]
```

#### Range Slider with VoiceOver

1. Navigate to range slider (dual-handle)
2. Tab to first handle
3. Listen to announcement
4. Tab to second handle
5. Listen to announcement
6. Adjust both handles

**Expected Results**:

- [ ] Both handles are discoverable
- [ ] Each handle has distinct label (min/max)
- [ ] Each handle announces its own value
- [ ] Both handles are independently adjustable

**Actual Results**:

```
[Record observations]
```

**Issues Found**: ☐ None ☐ Minor ☐ Major

```
[Describe any issues]
```

---

### Test Case 2.3: NVDA on Windows

**Objective**: Verify slider works with NVDA screen reader

**Setup**:

1. Install NVDA from https://www.nvaccess.org/
2. Start NVDA (Ctrl+Alt+N)
3. Open Chrome or Edge
4. Navigate to test page

**Steps**:

#### Basic Navigation

1. Press Tab to navigate to slider
2. Listen to NVDA announcement

**Expected Announcement**:

- [ ] Control type announced
- [ ] Current value announced
- [ ] Range announced (min to max)
- [ ] Label announced

**Actual Announcement**:

```
[Record exact NVDA speech]
```

#### Keyboard Navigation

1. With slider focused, press Right Arrow
2. Press Left Arrow
3. Press Up Arrow
4. Press Down Arrow
5. Press Home
6. Press End
7. Press Page Up
8. Press Page Down

**Expected Results**:

- [ ] All keys work as expected
- [ ] NVDA announces value changes
- [ ] No conflicts with NVDA shortcuts

**Actual Results**:

```
[Record observations for each key]
```

#### Forms Mode

1. Press NVDA+Space to toggle forms mode
2. Test keyboard navigation in both modes

**Results**:

- [ ] Works in forms mode: ☐ Yes ☐ No
- [ ] Works in browse mode: ☐ Yes ☐ No

**Issues Found**: ☐ None ☐ Minor ☐ Major

```
[Describe any issues]
```

---

### Test Case 2.4: JAWS on Windows

**Objective**: Verify slider works with JAWS screen reader

**Setup**:

1. Start JAWS
2. Open Chrome or Edge
3. Navigate to test page

**Steps**:

#### Basic Navigation

1. Press Tab to navigate to slider
2. Listen to JAWS announcement

**Expected Announcement**:

- [ ] Control type announced
- [ ] Current value announced
- [ ] Range announced
- [ ] Label announced
- [ ] Instructions provided (if any)

**Actual Announcement**:

```
[Record exact JAWS speech]
```

#### Keyboard Navigation

1. Test all keyboard shortcuts (arrows, Home, End, Page Up/Down)
2. Listen to announcements

**Expected Results**:

- [ ] All keys work correctly
- [ ] JAWS announces value changes
- [ ] Announcements are clear and helpful

**Actual Results**:

```
[Record observations]
```

#### Virtual Cursor Mode

1. Test with virtual cursor on
2. Test with virtual cursor off (forms mode)

**Results**:

- [ ] Works with virtual cursor: ☐ Yes ☐ No
- [ ] Works in forms mode: ☐ Yes ☐ No

**Issues Found**: ☐ None ☐ Minor ☐ Major

```
[Describe any issues]
```

---

### Test Case 2.5: Keyboard Navigation Isolation (Dual-Handle)

**Objective**: Verify keyboard navigation only affects focused handle (Requirement 2.9)

**Steps** (test with each screen reader):

1. Navigate to range slider
2. Tab to minimum handle
3. Press Right Arrow 5 times
4. Note the value changes
5. Tab to maximum handle
6. Press Left Arrow 5 times
7. Note the value changes

**Expected Results**:

- [ ] Only focused handle moves
- [ ] Other handle remains unchanged
- [ ] Screen reader announces correct handle
- [ ] Screen reader announces correct value

**Actual Results**:

**VoiceOver (iOS)**:

```
[Record observations]
```

**VoiceOver (macOS)**:

```
[Record observations]
```

**NVDA**:

```
[Record observations]
```

**JAWS**:

```
[Record observations]
```

**Issues Found**: ☐ None ☐ Minor ☐ Major

```
[Describe any issues]
```

---

### Test Case 2.6: Custom Formatting with Screen Readers

**Objective**: Verify custom formatters work with screen readers (Requirement 6.4)

**Test Scenarios**:

#### Percentage Formatting

1. Navigate to slider with percentage formatting (e.g., "50%")
2. Listen to screen reader announcement

**Expected**: Screen reader says "50 percent" or "50%"

**Actual**:

- VoiceOver (iOS): ******\_\_\_\_******
- VoiceOver (macOS): ******\_\_\_\_******
- NVDA: ******\_\_\_\_******
- JAWS: ******\_\_\_\_******

#### Currency Formatting

1. Navigate to slider with currency formatting (e.g., "$1,000")
2. Listen to screen reader announcement

**Expected**: Screen reader says "1000 dollars" or "$1,000"

**Actual**:

- VoiceOver (iOS): ******\_\_\_\_******
- VoiceOver (macOS): ******\_\_\_\_******
- NVDA: ******\_\_\_\_******
- JAWS: ******\_\_\_\_******

#### Custom aria-valuetext

1. Navigate to slider with custom aria-valuetext formatter
2. Verify screen reader uses aria-valuetext instead of aria-valuenow

**Expected**: Screen reader announces custom formatted text

**Actual**:

- VoiceOver (iOS): ******\_\_\_\_******
- VoiceOver (macOS): ******\_\_\_\_******
- NVDA: ******\_\_\_\_******
- JAWS: ******\_\_\_\_******

**Issues Found**: ☐ None ☐ Minor ☐ Major

```
[Describe any issues]
```

---

### Test Case 2.7: Tick Marks Accessibility

**Objective**: Verify tick marks are accessible to screen readers (Requirement 6.7)

**Steps**:

1. Navigate to slider with tick marks enabled
2. Use screen reader to explore tick values
3. Check if tick values are announced
4. Verify tick marks have appropriate ARIA roles

**Expected Results**:

- [ ] Tick values are discoverable
- [ ] Tick values are announced correctly
- [ ] Tick marks don't interfere with slider operation
- [ ] ARIA roles are appropriate

**Actual Results**:

**VoiceOver (iOS)**:

```
[Record observations]
```

**VoiceOver (macOS)**:

```
[Record observations]
```

**NVDA**:

```
[Record observations]
```

**JAWS**:

```
[Record observations]
```

**Issues Found**: ☐ None ☐ Minor ☐ Major

```
[Describe any issues]
```

---

## Test Results Summary

### iOS Testing Summary

**Overall Status**: ☐ Pass ☐ Pass with Issues ☐ Fail

**Critical Issues**:

```
[List any critical issues that block functionality]
```

**Minor Issues**:

```
[List any minor issues that don't block functionality]
```

**iOS Limitations Confirmed**:

- [ ] Two-tap interaction pattern (expected)
- [ ] Drag must start from thumb (expected)
- [ ] Step attribute limitations (expected)
- [ ] Other: ******\_\_\_\_******

**Recommendations**:

```
[Provide recommendations for improvements]
```

---

### Screen Reader Testing Summary

**Overall Status**: ☐ Pass ☐ Pass with Issues ☐ Fail

**Screen Reader Compatibility**:

- VoiceOver (iOS): ☐ Pass ☐ Fail
- VoiceOver (macOS): ☐ Pass ☐ Fail
- NVDA: ☐ Pass ☐ Fail
- JAWS: ☐ Pass ☐ Fail

**Critical Issues**:

```
[List any critical accessibility issues]
```

**Minor Issues**:

```
[List any minor accessibility issues]
```

**WCAG 2.1 Compliance**:

- Level A: ☐ Pass ☐ Fail
- Level AA: ☐ Pass ☐ Fail
- Level AAA: ☐ Pass ☐ Fail

**Recommendations**:

```
[Provide recommendations for accessibility improvements]
```

---

## Appendix A: Quick Reference

### iOS Testing Checklist

- [ ] Basic touch interaction works
- [ ] Two-tap pattern handled gracefully
- [ ] Works in scrollable containers
- [ ] Step values work correctly
- [ ] Drag from thumb is reliable
- [ ] Webkit appearance doesn't break functionality
- [ ] Range slider (dual-handle) works
- [ ] Performance is acceptable
- [ ] Orientation changes handled
- [ ] Multi-touch scenarios work

### Screen Reader Testing Checklist

- [ ] VoiceOver (iOS) - Basic functionality
- [ ] VoiceOver (iOS) - Keyboard navigation
- [ ] VoiceOver (macOS) - Basic functionality
- [ ] VoiceOver (macOS) - Keyboard navigation
- [ ] NVDA - Basic functionality
- [ ] NVDA - Keyboard navigation
- [ ] JAWS - Basic functionality
- [ ] JAWS - Keyboard navigation
- [ ] Keyboard navigation isolation (dual-handle)
- [ ] Custom formatting announced correctly
- [ ] Tick marks accessible

---

## Appendix B: Common Issues and Solutions

### iOS Issues

**Issue**: Slider doesn't respond to touch

- **Check**: Verify `-webkit-appearance` is not set to `none`
- **Check**: Verify `touch-action` is set correctly
- **Check**: Check for JavaScript errors in Safari console

**Issue**: Scrolling conflicts with slider

- **Solution**: Ensure `touch-action: none` is applied to slider container
- **Solution**: Test with different `touch-action` values

**Issue**: Track tap doesn't work

- **Expected**: This is normal iOS behavior with non-zero step values
- **Workaround**: Document this limitation for users

### Screen Reader Issues

**Issue**: Screen reader doesn't announce slider

- **Check**: Verify ARIA attributes are present
- **Check**: Verify `role="slider"` is set (or native input type="range")
- **Check**: Verify aria-label or associated label exists

**Issue**: Value changes not announced

- **Check**: Verify aria-valuenow updates on change
- **Check**: Verify aria-valuetext updates if using custom formatting
- **Check**: Test with screen reader in forms mode

**Issue**: Keyboard navigation doesn't work

- **Check**: Verify slider has focus
- **Check**: Verify event.preventDefault() is called for handled keys
- **Check**: Test with screen reader in different modes

---

## Appendix C: Testing Tools

### iOS Testing Tools

- **Safari Web Inspector**: Remote debugging for iOS Safari
- **Xcode Simulator**: Test on simulated iOS devices (limited touch testing)
- **BrowserStack**: Cloud-based iOS device testing
- **Accessibility Inspector**: Built into iOS for checking accessibility tree

### Screen Reader Testing Tools

- **VoiceOver**: Built into iOS and macOS
- **NVDA**: Free, open-source (Windows)
- **JAWS**: Commercial (Windows) - trial available
- **Accessibility Insights**: Browser extension for accessibility testing
- **axe DevTools**: Browser extension for automated accessibility checks

### Debugging Tools

- **Chrome DevTools**: Accessibility pane shows ARIA attributes
- **Firefox Accessibility Inspector**: Shows accessibility tree
- **Safari Web Inspector**: Remote debugging for iOS
- **NVDA Speech Viewer**: Shows what NVDA is announcing

---

## Document Control

**Version**: 1.0
**Last Updated**: [Date]
**Tested By**: ******\_\_\_\_******
**Review Date**: ******\_\_\_\_******

**Sign-off**:

- iOS Testing Complete: ☐ Yes ☐ No Date: **\_\_\_\_**
- Screen Reader Testing Complete: ☐ Yes ☐ No Date: **\_\_\_\_**
- Issues Documented: ☐ Yes ☐ No Date: **\_\_\_\_**
- Recommendations Provided: ☐ Yes ☐ No Date: **\_\_\_\_**
