# Testing Guide - Platform Status Component

This guide walks you through testing all states of the Platform Status component.

## 🎯 Test Scenarios

### Scenario 1: Operational Status (Default)

**Expected Behavior:**
- ✅ Green dot indicator
- ✅ "All systems operational" label
- ✅ 100% uptime displayed
- ✅ Recent backup timestamp
- ✅ No warning messages

**How to Test:**
```bash
# Ensure .env.local points to default mock
NEXT_PUBLIC_STATUS_JSON_URL="http://localhost:3000/mocks/status.json"

# Start dev server
npm run dev

# Visit http://localhost:3000
```

**What to Check:**
- [ ] Green circle (🟢) appears next to "Platform Status"
- [ ] Text reads "All systems operational"
- [ ] Uptime shows "24h: 100% · 7d: 99.98%"
- [ ] Last backup timestamp is displayed
- [ ] Infrastructure model text appears

---

### Scenario 2: Degraded Status

**Expected Behavior:**
- ⚠️ Yellow dot indicator
- ⚠️ "Minor degradation" label
- ⚠️ Reduced uptime percentages
- ⚠️ Warning message in infrastructure notes

**How to Test:**

1. Edit `.env.local`:
   ```bash
   NEXT_PUBLIC_STATUS_JSON_URL="http://localhost:3000/mocks/status-degraded.json"
   ```

2. Restart dev server (Ctrl+C, then `npm run dev`)

3. Refresh browser

**What to Check:**
- [ ] Yellow circle (🟡) appears
- [ ] Text reads "Minor degradation"
- [ ] Uptime shows lower values (98.5% / 99.2%)
- [ ] Backup status shows "warning"
- [ ] Infrastructure notes mention investigation

---

### Scenario 3: Outage Status

**Expected Behavior:**
- 🔴 Red dot indicator
- 🔴 "Service disruption" label
- 🔴 Significantly reduced uptime
- 🔴 Failed backup status
- 🔴 Outage message in notes

**How to Test:**

1. Edit `.env.local`:
   ```bash
   NEXT_PUBLIC_STATUS_JSON_URL="http://localhost:3000/mocks/status-outage.json"
   ```

2. Restart dev server

3. Refresh browser

**What to Check:**
- [ ] Red circle (🔴) appears
- [ ] Text reads "Service disruption"
- [ ] Uptime shows degraded values (92% / 97.5%)
- [ ] Backup status shows "failed"
- [ ] Infrastructure notes mention service disruption

---

### Scenario 4: Unknown/Unavailable Status

**Expected Behavior:**
- ⚪ Gray dot indicator
- ⚪ "Status unavailable" label
- ⚪ No uptime metrics shown
- ⚪ No backup information
- ⚪ Component renders without crashing

**How to Test (Option A - Missing File):**

1. Edit `.env.local`:
   ```bash
   NEXT_PUBLIC_STATUS_JSON_URL="http://localhost:3000/mocks/nonexistent.json"
   ```

2. Restart dev server

**How to Test (Option B - Empty URL):**

1. Edit `.env.local`:
   ```bash
   NEXT_PUBLIC_STATUS_JSON_URL=""
   ```

2. Restart dev server

**What to Check:**
- [ ] Gray circle (⚫) appears
- [ ] Text reads "Status unavailable"
- [ ] Updated timestamp shows "N/A"
- [ ] No uptime or backup data displayed
- [ ] Page doesn't crash or show errors

---

### Scenario 5: Stale Data Warning

**Expected Behavior:**
- ⚠️ Warning icon and message appear
- ⚠️ "Data may be outdated" text shown
- ⚠️ Status still displays but with warning

**How to Test:**

1. Edit `.env.local`:
   ```bash
   NEXT_PUBLIC_STATUS_JSON_URL="http://localhost:3000/mocks/status-stale.json"
   ```

2. Restart dev server

**What to Check:**
- [ ] Status renders normally (green dot)
- [ ] ⚠️ symbol appears below timestamp
- [ ] "Data may be outdated" warning shown
- [ ] Warning text is yellow/amber color

**Alternative Test:**
Edit `public/mocks/status.json` and set `updated_at` to yesterday:
```json
{
  "updated_at": "2025-11-09T10:00:00Z"
}
```

---

### Scenario 6: Network Error Handling

**Expected Behavior:**
- Component renders in "unknown" state
- No JavaScript errors in console (warnings OK)
- Page loads successfully

**How to Test:**

1. Set invalid URL in `.env.local`:
   ```bash
   NEXT_PUBLIC_STATUS_JSON_URL="https://invalid-domain-that-does-not-exist.com/status.json"
   ```

2. Restart dev server

**What to Check:**
- [ ] Page loads without breaking
- [ ] Gray dot with "Status unavailable"
- [ ] Console shows warning (not error)
- [ ] Rest of page renders normally

---

### Scenario 7: Malformed JSON

**Expected Behavior:**
- Graceful fallback to "unknown" state
- Console warning logged
- Component doesn't crash

**How to Test:**

1. Create `public/mocks/status-broken.json`:
   ```json
   {
     "updated_at": "2025-11-10T12:00:00Z",
     "platform_status": "operational"
     // Missing closing brace
   ```

2. Point to it in `.env.local`:
   ```bash
   NEXT_PUBLIC_STATUS_JSON_URL="http://localhost:3000/mocks/status-broken.json"
   ```

3. Restart dev server

**What to Check:**
- [ ] Component shows "unknown" state
- [ ] No crash or blank page
- [ ] Console shows parsing error warning

---

## 🌐 Testing on Both Pages

The status component appears on:
1. **Homepage** - `/` (hero section)
2. **Status Page** - `/status` (expanded view)

### Test Both Locations

For each scenario above:

1. Check homepage: `http://localhost:3000`
2. Check status page: `http://localhost:3000/status`

**What to Verify:**
- [ ] Component renders identically on both pages
- [ ] Same status indicator color
- [ ] Same text and metrics
- [ ] No styling differences

---

## 📱 Responsive Testing

Test on different screen sizes:

### Desktop (1920×1080)
- [ ] Status card fits nicely on homepage
- [ ] `/status` page centered and readable

### Tablet (768×1024)
- [ ] Status card maintains readability
- [ ] Text doesn't overflow
- [ ] Buttons/links are tappable

### Mobile (375×667)
- [ ] Status card is full-width
- [ ] All text visible without scrolling
- [ ] No horizontal overflow

**How to Test:**
1. Open browser DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Select different devices
4. Check each status state

---

## 🔍 Browser Testing

Test in multiple browsers:

- [ ] **Chrome/Edge** (Chromium)
- [ ] **Firefox**
- [ ] **Safari** (macOS/iOS)

**Regression Checks:**
- Status indicator circles render correctly
- Colors match design (green/yellow/red/gray)
- Fonts load properly
- No layout shifts

---

## ⚡ Performance Testing

### Lighthouse Audit

```bash
# Build production version
npm run build
npm start

# Run Lighthouse (separate terminal)
npx lighthouse http://localhost:3000 --view
```

**Target Scores:**
- [ ] Performance: > 90
- [ ] Accessibility: > 95
- [ ] Best Practices: > 90
- [ ] SEO: > 90

**Key Metrics:**
- [ ] First Contentful Paint < 1.5s
- [ ] Largest Contentful Paint < 2.5s
- [ ] Cumulative Layout Shift < 0.1

---

## 🐛 Known Issues to Watch For

### Issue 1: CORS Errors (Production Only)
**Symptom:** Status shows "unknown" in production but works locally
**Cause:** `status.json` endpoint doesn't allow CORS
**Fix:** Ensure Spaces/CDN has `Access-Control-Allow-Origin: *`

### Issue 2: Stale Browser Cache
**Symptom:** Old status data persists after changes
**Cause:** Aggressive browser caching
**Fix:** Hard refresh (Ctrl+Shift+R) or clear cache

### Issue 3: Timezone Confusion
**Symptom:** "Stale data" warning when data is fresh
**Cause:** Timestamp parsing or timezone mismatch
**Check:** Ensure `updated_at` is in ISO 8601 UTC format

---

## ✅ QA Sign-Off Checklist

Before marking Phase 1 complete, verify:

### Functionality
- [ ] All 7 test scenarios pass
- [ ] Component works on both pages
- [ ] Error states handled gracefully
- [ ] No console errors (warnings OK)

### Design/UX
- [ ] Status colors match specification
- [ ] Text is readable on all backgrounds
- [ ] Responsive on mobile/tablet/desktop
- [ ] Loading states are smooth

### Code Quality
- [ ] TypeScript types are correct
- [ ] No ESLint errors
- [ ] Code follows project conventions
- [ ] Comments explain complex logic

### Documentation
- [ ] README has clear setup steps
- [ ] Environment variables documented
- [ ] Testing scenarios covered
- [ ] Known issues listed

---

## 🚀 Quick Test Script

Run through all scenarios quickly:

```bash
#!/bin/bash
# quick-test.sh

echo "Testing Operational..."
echo 'NEXT_PUBLIC_STATUS_JSON_URL="http://localhost:3000/mocks/status.json"' > .env.local
npm run dev & sleep 5 && open http://localhost:3000 && sleep 3 && pkill -f "next dev"

echo "Testing Degraded..."
echo 'NEXT_PUBLIC_STATUS_JSON_URL="http://localhost:3000/mocks/status-degraded.json"' > .env.local
npm run dev & sleep 5 && open http://localhost:3000 && sleep 3 && pkill -f "next dev"

echo "Testing Outage..."
echo 'NEXT_PUBLIC_STATUS_JSON_URL="http://localhost:3000/mocks/status-outage.json"' > .env.local
npm run dev & sleep 5 && open http://localhost:3000 && sleep 3 && pkill -f "next dev"

echo "Testing Unknown..."
echo 'NEXT_PUBLIC_STATUS_JSON_URL=""' > .env.local
npm run dev & sleep 5 && open http://localhost:3000 && sleep 3 && pkill -f "next dev"

echo "Restoring default..."
cp .env.example .env.local

echo "All tests complete!"
```

---

## 📊 Test Results Template

```markdown
## Test Run: [Date]

**Tester:** [Name]
**Environment:** Local development
**Browser:** Chrome 119 / Firefox 120 / Safari 17

| Scenario | Homepage | Status Page | Mobile | Notes |
|----------|----------|-------------|--------|-------|
| Operational | ✅ | ✅ | ✅ | - |
| Degraded | ✅ | ✅ | ✅ | - |
| Outage | ✅ | ✅ | ✅ | - |
| Unknown | ✅ | ✅ | ✅ | - |
| Stale Data | ✅ | ✅ | ✅ | - |
| Network Error | ✅ | ✅ | ✅ | - |
| Malformed JSON | ✅ | ✅ | ✅ | - |

**Issues Found:** None / [List issues]

**Sign-Off:** ✅ Ready for Phase 2
```

---

**Questions?** See `docs/implementation-guide.md` or contact the QA team.
