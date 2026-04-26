# RangeInput Component - Manual Testing Form

**Print this form and use it during testing sessions**

---

## Test Session Information

| Field            | Value                        |
| ---------------- | ---------------------------- |
| Tester Name      | ******\_\_\_\_******         |
| Date             | ******\_\_\_\_******         |
| Session Duration | ******\_\_\_\_******         |
| Testing Type     | ☐ iOS ☐ Screen Reader ☐ Both |

---

## iOS Device Testing

### Device Information

| Field          | Value                |
| -------------- | -------------------- |
| Device Model   | ******\_\_\_\_****** |
| iOS Version    | ******\_\_\_\_****** |
| Safari Version | ******\_\_\_\_****** |
| Screen Size    | ******\_\_\_\_****** |

### Test Results

| #   | Test Case               | Pass | Fail | Notes |
| --- | ----------------------- | ---- | ---- | ----- |
| 1   | Basic touch interaction | ☐    | ☐    |       |
| 2   | Two-tap pattern         | ☐    | ☐    |       |
| 3   | Scrollable container    | ☐    | ☐    |       |
| 4   | Step value: 1           | ☐    | ☐    |       |
| 5   | Step value: 0.1         | ☐    | ☐    |       |
| 6   | Step value: 10          | ☐    | ☐    |       |
| 7   | Drag reliability        | ☐    | ☐    |       |
| 8   | Webkit appearance       | ☐    | ☐    |       |
| 9   | Range slider            | ☐    | ☐    |       |
| 10  | Performance             | ☐    | ☐    |       |
| 11  | Orientation change      | ☐    | ☐    |       |
| 12  | Multi-touch             | ☐    | ☐    |       |

**Overall iOS Result**: ☐ Pass ☐ Pass with Issues ☐ Fail

---

## Screen Reader Testing

### VoiceOver (iOS)

| Field       | Value                |
| ----------- | -------------------- |
| Device      | ******\_\_\_\_****** |
| iOS Version | ******\_\_\_\_****** |
| Test Date   | ******\_\_\_\_****** |

| Test               | Pass | Fail | Notes |
| ------------------ | ---- | ---- | ----- |
| Basic announcement | ☐    | ☐    |       |
| Swipe up/down      | ☐    | ☐    |       |
| Range slider       | ☐    | ☐    |       |
| Custom formatting  | ☐    | ☐    |       |

**Result**: ☐ Pass ☐ Fail

---

### VoiceOver (macOS)

| Field          | Value                |
| -------------- | -------------------- |
| macOS Version  | ******\_\_\_\_****** |
| Safari Version | ******\_\_\_\_****** |
| Test Date      | ******\_\_\_\_****** |

| Test               | Pass | Fail | Notes |
| ------------------ | ---- | ---- | ----- |
| Basic announcement | ☐    | ☐    |       |
| Arrow keys         | ☐    | ☐    |       |
| Home/End keys      | ☐    | ☐    |       |
| Page Up/Down       | ☐    | ☐    |       |
| Range slider       | ☐    | ☐    |       |

**Result**: ☐ Pass ☐ Fail

---

### NVDA (Windows)

| Field        | Value                |
| ------------ | -------------------- |
| NVDA Version | ******\_\_\_\_****** |
| Browser      | ******\_\_\_\_****** |
| Test Date    | ******\_\_\_\_****** |

| Test               | Pass | Fail | Notes |
| ------------------ | ---- | ---- | ----- |
| Basic announcement | ☐    | ☐    |       |
| Arrow keys         | ☐    | ☐    |       |
| Home/End keys      | ☐    | ☐    |       |
| Page Up/Down       | ☐    | ☐    |       |
| Forms mode         | ☐    | ☐    |       |

**Result**: ☐ Pass ☐ Fail

---

### JAWS (Windows)

| Field        | Value                |
| ------------ | -------------------- |
| JAWS Version | ******\_\_\_\_****** |
| Browser      | ******\_\_\_\_****** |
| Test Date    | ******\_\_\_\_****** |

| Test               | Pass | Fail | Notes |
| ------------------ | ---- | ---- | ----- |
| Basic announcement | ☐    | ☐    |       |
| Arrow keys         | ☐    | ☐    |       |
| Home/End keys      | ☐    | ☐    |       |
| Page Up/Down       | ☐    | ☐    |       |
| Virtual cursor     | ☐    | ☐    |       |

**Result**: ☐ Pass ☐ Fail

---

## Critical Issues Found

| #   | Severity                   | Description | Test Case | Device/SR |
| --- | -------------------------- | ----------- | --------- | --------- |
| 1   | ☐ Critical ☐ Major ☐ Minor |             |           |           |
| 2   | ☐ Critical ☐ Major ☐ Minor |             |           |           |
| 3   | ☐ Critical ☐ Major ☐ Minor |             |           |           |
| 4   | ☐ Critical ☐ Major ☐ Minor |             |           |           |
| 5   | ☐ Critical ☐ Major ☐ Minor |             |           |           |

**Severity Definitions**:

- **Critical**: Blocks core functionality, must fix before release
- **Major**: Significant impact, should fix before release
- **Minor**: Low impact, can be addressed in future release

---

## Known Limitations Confirmed

| Limitation                              | Confirmed | Notes |
| --------------------------------------- | --------- | ----- |
| iOS two-tap pattern                     | ☐         |       |
| iOS drag from thumb only                | ☐         |       |
| iOS step attribute limitation           | ☐         |       |
| Scroll conflicts (without touch-action) | ☐         |       |

---

## Overall Test Summary

### iOS Testing

- **Status**: ☐ Complete ☐ Incomplete
- **Result**: ☐ Pass ☐ Pass with Issues ☐ Fail
- **Critical Issues**: **\_** found
- **Recommendation**: ☐ Approve ☐ Fix and Retest ☐ Reject

### Screen Reader Testing

- **Status**: ☐ Complete ☐ Incomplete
- **VoiceOver (iOS)**: ☐ Pass ☐ Fail ☐ Not Tested
- **VoiceOver (macOS)**: ☐ Pass ☐ Fail ☐ Not Tested
- **NVDA**: ☐ Pass ☐ Fail ☐ Not Tested
- **JAWS**: ☐ Pass ☐ Fail ☐ Not Tested
- **Critical Issues**: **\_** found
- **Recommendation**: ☐ Approve ☐ Fix and Retest ☐ Reject

---

## Sign-off

| Role     | Name | Signature | Date |
| -------- | ---- | --------- | ---- |
| Tester   |      |           |      |
| Reviewer |      |           |      |
| Approver |      |           |      |

---

## Next Steps

☐ Transfer results to `MANUAL_TESTING_GUIDE.md`
☐ Create GitHub issues for bugs found
☐ Update `tasks.md` with completion status
☐ Schedule retest if needed
☐ Archive this form with test documentation

---

**Form Version**: 1.0
**Last Updated**: [Date]
