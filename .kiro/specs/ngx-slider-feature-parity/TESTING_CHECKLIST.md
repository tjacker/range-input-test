# Quick Testing Checklist

## iOS Device Testing Quick Reference

### Device Info

- Device: ******\_\_\_\_******
- iOS Version: ******\_\_\_\_******
- Date: ******\_\_\_\_******

### Quick Tests (15 minutes)

#### ✓ Basic Touch

- [ ] Tap thumb and drag - works smoothly
- [ ] Tap track (not thumb) - two-tap pattern works
- [ ] No lag or stuttering

#### ✓ Scrollable Container

- [ ] Can scroll container without triggering slider
- [ ] Can drag slider without scrolling
- [ ] No conflicts between scroll and drag

#### ✓ Step Values

- [ ] step="1" - drag from thumb works
- [ ] step="0.1" - drag from thumb works
- [ ] step="10" - drag from thumb works
- [ ] Note: Track-tap may not work (iOS limitation)

#### ✓ Range Slider

- [ ] Both handles draggable independently
- [ ] Min cannot exceed max
- [ ] Max cannot go below min
- [ ] Handles accessible when overlapped

#### ✓ Performance

- [ ] Smooth animation (if enabled)
- [ ] No lag during rapid dragging
- [ ] Orientation change works

### Issues Found

```
[Quick notes]
```

---

## Screen Reader Testing Quick Reference

### VoiceOver (iOS) - 10 minutes

#### ✓ Basic Announcement

- [ ] Swipe to slider - announces type, value, range
- [ ] Swipe up - increases value
- [ ] Swipe down - decreases value
- [ ] Value changes announced

#### ✓ Range Slider

- [ ] Both handles discoverable
- [ ] Distinct labels (min/max)
- [ ] Independent adjustment

### VoiceOver (macOS) - 10 minutes

#### ✓ Keyboard Navigation

- [ ] Arrow keys work (↑↓←→)
- [ ] Home/End work
- [ ] Page Up/Down work
- [ ] Values announced

### NVDA (Windows) - 10 minutes

#### ✓ Basic Tests

- [ ] Tab to slider - announces correctly
- [ ] Arrow keys work
- [ ] Home/End work
- [ ] Page Up/Down work
- [ ] Works in forms mode

### JAWS (Windows) - 10 minutes

#### ✓ Basic Tests

- [ ] Tab to slider - announces correctly
- [ ] Arrow keys work
- [ ] Home/End work
- [ ] Page Up/Down work
- [ ] Works in forms mode

### Issues Found

```
[Quick notes]
```

---

## Critical Issues to Watch For

### iOS

- ⚠️ Slider doesn't respond to touch at all
- ⚠️ Scrolling always triggers slider (or vice versa)
- ⚠️ Handles not accessible when overlapped
- ⚠️ Severe lag or stuttering

### Screen Readers

- ⚠️ Slider not announced at all
- ⚠️ Value changes not announced
- ⚠️ Keyboard navigation doesn't work
- ⚠️ Range slider handles not distinguishable

---

## Test URLs

- **Local Dev**: http://localhost:4200/test
- **Network**: http://[YOUR_IP]:4200/test
- **Production Build**: http://[YOUR_IP]:8080/test

---

## Quick Commands

```bash
# Start dev server (network access)
ng serve --host 0.0.0.0 --port 4200

# Build and serve production
npm run build
npx http-server dist/range-input-test -p 8080

# Find your IP
ifconfig | grep "inet "  # macOS/Linux
ipconfig                 # Windows
```

---

## Pass/Fail Criteria

### iOS Testing

- **PASS**: All basic interactions work, known limitations documented
- **FAIL**: Critical functionality broken (can't drag, severe conflicts)

### Screen Reader Testing

- **PASS**: All screen readers announce slider correctly, keyboard nav works
- **FAIL**: Any screen reader cannot use slider at all

---

## Next Steps After Testing

1. Fill out detailed results in `MANUAL_TESTING_GUIDE.md`
2. Document all issues found
3. Update tasks.md to mark task 11 as complete
4. Create GitHub issues for any bugs found
5. Update documentation with iOS limitations

---

## Emergency Contacts

- **Tester**: ******\_\_\_\_******
- **Developer**: ******\_\_\_\_******
- **Date Completed**: ******\_\_\_\_******
