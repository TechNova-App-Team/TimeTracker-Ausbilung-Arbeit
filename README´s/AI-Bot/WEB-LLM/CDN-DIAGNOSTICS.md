# WebLLM CDN Diagnostics & Troubleshooting

## Update: January 3, 2026

### ✅ Fixed Issue
**Error:** `Fehler beim Laden von https://cdn.jsdelivr.net/npm/@mlc-ai/web-llm@0.2.10/dist/web-llm.js`

**Root Cause:** Outdated CDN URLs pointing to old version (0.2.10) and using incorrect dist paths.

**Solution:** Updated to official ESM CDN URLs for WebLLM v0.2.80

---

## New CDN URLs (Working)

### Primary CDN
```
https://esm.run/@mlc-ai/web-llm@0.2.80
```
- ✅ Official ESM import URL
- ✅ Most reliable
- ✅ Recommended by WebLLM team

### Fallback CDN #1
```
https://cdn.jsdelivr.net/npm/@mlc-ai/web-llm@0.2.80/+esm
```
- ✅ jsdelivr ESM endpoint
- ✅ Global CDN network
- ✅ Good reliability

### Fallback CDN #2
```
https://unpkg.com/@mlc-ai/web-llm@0.2.80/+esm
```
- ✅ unpkg ESM endpoint
- ✅ Alternative provider
- ✅ Last resort fallback

---

## How Loading Works

1. **Script Loading** → Primary ESM URL
2. **Fallback #1** → If primary fails, try jsdelivr ESM
3. **Fallback #2** → If both fail, try unpkg ESM
4. **Network Check** → If all CDNs fail, diagnose network

---

## Troubleshooting Guide

### ❌ "Fehler beim Laden von CDN"

#### Step 1: Check Internet Connection
```javascript
// In browser console:
window.webLLMIntegration.checkNetworkConnection()
```
Expected output: `true` (connected) or `false` (no connection)

#### Step 2: Test CDN Accessibility
```javascript
// Test primary CDN
fetch('https://esm.run/@mlc-ai/web-llm@0.2.80', {mode: 'no-cors'})
  .then(() => console.log('✅ Primary CDN reachable'))
  .catch(e => console.log('❌ Primary CDN failed:', e))

// Test fallback CDN
fetch('https://cdn.jsdelivr.net/npm/@mlc-ai/web-llm@0.2.80/+esm', {mode: 'no-cors'})
  .then(() => console.log('✅ Fallback CDN reachable'))
  .catch(e => console.log('❌ Fallback CDN failed:', e))
```

#### Step 3: Check Browser Console
- Open DevTools (F12)
- Go to **Console** tab
- Look for WebLLM logs starting with `[WebLLM]`
- Check Network tab for failed requests (should be 3 or fewer)

#### Step 4: Run Validator
```javascript
// Full diagnostic check
window.webLLMValidator.runAll()
```

### ⚠️ Possible Issues & Solutions

#### 1. **No Internet Connection**
```
❌ Error: NetworkError
```
**Solution:** Check internet, ensure WiFi/data is active

#### 2. **Firewall/Proxy Blocking**
```
❌ Error: Failed to fetch / Access denied
```
**Solution:** 
- Check corporate/school firewall settings
- Try VPN if available
- Contact IT department

#### 3. **Browser Cache Corruption**
```
❌ Same error repeatedly
```
**Solution:**
- Clear browser cache: Ctrl+Shift+Delete (or Cmd+Shift+Delete on Mac)
- Hard refresh: Ctrl+Shift+R
- Try in incognito/private mode

#### 4. **CDN Server Downtime**
```
❌ All three CDNs timeout
```
**Solution:**
- This is temporary CDN issue
- Wait 5-10 minutes
- Try again
- All three CDNs unlikely to be down simultaneously

#### 5. **Old Browser/CORS Issues**
```
❌ Error: CORS issue / Blocked by policy
```
**Solution:**
- Update browser to latest version
- Try different browser (Chrome, Firefox, Edge, Safari)
- Check if WebAssembly is supported

---

## Browser Compatibility Check

Run this to verify your browser supports WebLLM:

```javascript
// Check required features
{
  'WebAssembly': typeof WebAssembly !== 'undefined',
  'IndexedDB': !!window.indexedDB,
  'Web Workers': typeof Worker !== 'undefined',
  'Fetch API': typeof fetch !== 'undefined',
  'localStorage': typeof Storage !== 'undefined'
}
```

All should return `true` for WebLLM to work.

---

## Network Diagnostics Console Commands

Copy & paste these in browser console for detailed diagnostics:

### Full System Check
```javascript
window.webLLMValidator.runAll()
window.webLLMValidator.printDebug()
```

### Network Connectivity
```javascript
window.webLLMIntegration.checkNetworkConnection()
```

### Clear Cache & Reset
```javascript
localStorage.clear()
window.webLLMIntegration.clearCache()
location.reload()
```

### Test Message Generation
```javascript
window.webLLMIntegration.generateResponse('Hello WebLLM!')
```

---

## Version Information

| Component | Version |
|-----------|---------|
| WebLLM | 0.2.80 |
| Model | Llama-3.2-1B-Instruct-q4f32_1 |
| Model Size | ~800 MB |
| Load Time (first) | 2-5 minutes |
| Load Time (cached) | <5 seconds |

---

## Common Error Messages & Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| `CDN fehlgeschlagen` | Network/CDN down | Wait, check internet, try again |
| `WebAssembly nicht unterstützt` | Old browser | Update browser |
| `IndexedDB nicht verfügbar` | Storage disabled | Check browser privacy settings |
| `timeout` | Slow connection/CDN | Wait, try again, check internet |
| `Nicht genug Speicher` | Device full/low RAM | Close tabs, restart browser |

---

## Success Indicators

✅ **You'll see these when working correctly:**

1. Loading bar appears (0-100%)
2. Console shows: `[WebLLM] Script geladen: https://esm.run/@mlc-ai/web-llm@0.2.80`
3. Button changes to: "🧠 WebLLM (aktiv)"
4. Chat works with WebLLM responses
5. Model caches in IndexedDB (visible in DevTools)

---

## Performance Tips

💡 **For faster loading:**
- Use modern browser (Chrome 120+, Edge, Firefox)
- Close unnecessary tabs
- Use WiFi instead of mobile data
- Wait during initial ~3MB download
- Subsequent loads are <5 seconds from cache

---

## Report a Bug

If you've tried all steps and still have issues:

1. Run: `window.webLLMValidator.runAll()`
2. Copy console output
3. Note your browser/OS
4. Check: Is internet working?
5. Include the full error message

---

**Last Updated:** January 3, 2026
**Status:** ✅ All CDN URLs tested and working
