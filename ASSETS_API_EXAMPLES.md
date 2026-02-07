# Assets API Examples & Testing

This document provides example API responses and testing scenarios for the Assets visualization feature.

## API Endpoints

### Standard Assets Endpoint
```
GET /assets?window=<window>
```

### Carbon Assets Endpoint (Future)
```
GET /assets/carbon?window=<window>
```

## Window Parameter Formats

### Preset Windows
```
7d        - Last 7 days
today     - Today
lastweek  - Last week
month     - Current month
30d       - Last 30 days
90d       - Last 90 days
```

### Custom Date Ranges

#### ISO Format
```
2023-01-18T10:30:00Z,2023-01-19T10:30:00Z
```

#### Unix Timestamps
```
1674073869,1674193869
```

## Example API Responses

### Response Format 1: Array of Assets

```json
[
  {
    "name": "web-app-pod-1",
    "type": "Pod",
    "provider": "AWS",
    "cluster": "production-us-east-1",
    "namespace": "default",
    "totalCost": 456.78,
    "cost": 456.78,
    "cpuCost": 234.56,
    "ramCost": 189.99,
    "gpuCost": 32.23
  },
  {
    "name": "db-postgres-1",
    "type": "Node",
    "provider": "AWS",
    "cluster": "production-us-east-1",
    "namespace": "database",
    "totalCost": 789.12,
    "cost": 789.12,
    "cpuCost": 345.67,
    "ramCost": 389.99,
    "gpuCost": 53.46
  },
  {
    "name": "cache-redis-1",
    "type": "Pod",
    "provider": "GCP",
    "cluster": "staging-us-central-1",
    "namespace": "cache",
    "totalCost": 123.45,
    "cost": 123.45,
    "cpuCost": 56.78,
    "ramCost": 45.67,
    "gpuCost": 21.00
  }
]
```

### Response Format 2: Object with Assets

```json
{
  "data": [
    {
      "name": "api-gateway",
      "type": "Service",
      "provider": "AWS",
      "cluster": "production",
      "namespace": "ingress",
      "cost": 567.89,
      "cpuCost": 234.56,
      "ramCost": 278.90,
      "gpuCost": 54.43
    },
    {
      "name": "worker-node-1",
      "type": "Node",
      "provider": "Azure",
      "cluster": "worker-pool",
      "namespace": "workloads",
      "cost": 892.34,
      "cpuCost": 456.78,
      "ramCost": 345.67,
      "gpuCost": 89.89
    }
  ],
  "window": {
    "start": "2023-01-18T00:00:00Z",
    "end": "2023-01-25T00:00:00Z"
  }
}
```

### Response Format 3: Nested Assets Object

```json
{
  "assets": {
    "pod-1": {
      "name": "analytics-service",
      "type": "Pod",
      "provider": "AWS",
      "cluster": "analytics-prod",
      "namespace": "analytics",
      "cost": 234.56,
      "cpuCost": 123.45,
      "memCost": 89.12,
      "gpuCost": 21.99
    },
    "node-1": {
      "name": "compute-node-gpu-1",
      "type": "Node",
      "provider": "AWS",
      "cluster": "ml-cluster",
      "namespace": "ml-workloads",
      "cost": 1234.56,
      "cpuCost": 456.78,
      "memCost": 567.89,
      "gpuCost": 209.89
    }
  }
}
```

## Complete Test Scenario

### Setup
1. Start OpenCost server:
```bash
docker run -d -p 9090:9090 ghcr.io/opencost/opencost:latest
```

2. Start OpenCost UI (in your repository):
```bash
npm install
npm run serve
```

### Test Cases

#### Test 1: Basic Data Load
**Request:**
```bash
curl "http://localhost:9090/assets?window=7d"
```

**Expected:**
- Status code: 200
- Response contains array or object with asset data
- Each asset has: name, type, provider, cost, cpuCost, ramCost, gpuCost

**UI Verification:**
- Summary cards populate with correct totals
- Chart displays top 10 assets
- Table shows all assets with data
- No error messages

#### Test 2: Different Time Windows
**Requests:**
```bash
# Today
curl "http://localhost:9090/assets?window=today"

# Last week
curl "http://localhost:9090/assets?window=lastweek"

# Last 30 days
curl "http://localhost:9090/assets?window=30d"
```

**Expected:**
- Data changes for different windows
- Costs may be lower/higher depending on window
- Table re-sorts by new data

#### Test 3: Custom Date Range
**Request:**
```bash
curl "http://localhost:9090/assets?window=2023-01-18T00:00:00Z,2023-01-25T00:00:00Z"
```

**Expected:**
- Returns assets data for specified date range
- UI displays custom date range information

#### Test 4: Large Dataset
**Scenario:** API returns 100+ assets

**Expected:**
- Charts show top 10 assets
- Table paginates smoothly
- No performance lag
- Sort operations complete < 1 second

#### Test 5: Minimal Dataset
**Scenario:** API returns 1-3 assets

**Expected:**
- Summary cards show correct totals
- Charts render with limited data
- Table displays all available assets
- No empty state warnings (unless truly empty)

#### Test 6: Empty Response
**Scenario:** No assets for selected window

**Expected:**
- Empty state message: "No asset data available"
- Summary cards show zero values
- Charts show "No chart data available"
- Table shows "No asset data available"

#### Test 7: API Error
**Scenario:** OpenCost not running or API disabled

**Expected:**
- Error message: "Assets API not available"
- Loading spinner briefly appears then disappears
- Refresh button is clickable
- User can attempt to load again

#### Test 8: Malformed Response
**Scenario:** API returns invalid JSON or missing fields

**Expected:**
- Missing fields get default values
- Table cells show "-" for undefined values
- No console errors
- Feature remains functional

#### Test 9: Currency Conversion
**Requests:**
```bash
# USD
http://localhost:3000/assets?window=7d&currency=USD

# EUR
http://localhost:3000/assets?window=7d&currency=EUR

# GBP
http://localhost:3000/assets?window=7d&currency=GBP
```

**Expected:**
- Currency selector updates
- All costs reformat with new symbol
- Exchange rates applied correctly
- URL persists currency selection

#### Test 10: Mobile Responsiveness
**Viewport Sizes:**
- 375px (iPhone SE)
- 768px (iPad)
- 1920px (Desktop)

**Expectations:**
- **Mobile (375px)**:
  - Summary cards stack vertically
  - Table shows 3 columns: Name, Cost, CPU
  - Charts height: 300px
  - Controls arrange vertically

- **Tablet (768px)**:
  - Summary cards: 2 columns
  - Table shows all columns
  - Charts height: 400px
  - Controls arrange horizontally

- **Desktop (1920px)**:
  - Summary cards: 5 columns optimal
  - Table full featured
  - Charts height: 400px
  - Full control panel visible

## Performance Benchmarks

### Expected Performance
```
Component              Load Time    Render Time    Memory
─────────────────────────────────────────────────────
AssetsSummary          < 100ms      < 50ms        ~2MB
AssetsChart (100 rows) < 300ms      < 150ms       ~5MB
AssetsTable (100 rows) < 200ms      < 100ms       ~3MB
Full Page              < 1s         < 300ms       ~10MB
```

### Stress Test
**Scenario:** 1000 assets
- Chart render time: < 500ms (shows top 10)
- Table sort time: < 200ms
- Initial load: < 2 seconds
- Memory usage: stable < 20MB

## cURL Examples

### Get Assets for Last 7 Days
```bash
curl -X GET "http://localhost:9090/assets?window=7d" \
  -H "Content-Type: application/json"
```

### Get Assets for Today
```bash
curl -X GET "http://localhost:9090/assets?window=today" \
  -H "Content-Type: application/json"
```

### Get Assets for Custom Range
```bash
curl -X GET "http://localhost:9090/assets?window=2023-01-18T00:00:00Z,2023-01-25T00:00:00Z" \
  -H "Content-Type: application/json"
```

### Get Assets with Unix Timestamps
```bash
curl -X GET "http://localhost:9090/assets?window=1674073869,1674193869" \
  -H "Content-Type: application/json"
```

## Browser DevTools Testing

### Network Tab
1. Open DevTools (F12)
2. Go to Network tab
3. Load Assets page
4. Look for `/assets?window=7d` request
5. Verify:
   - Status: 200 OK
   - Size: appropriate for data
   - Time: < 1 second
   - Content-Type: application/json

### Console Tab
Check for:
- No error messages
- Debug logs: `[v0] Assets data received: ...`
- No warnings about missing props

### Application Tab
Check localStorage/sessionStorage:
- No sensitive data stored
- URL query parameters preserved

## Postman Testing

### Collection Example
```json
{
  "info": {
    "name": "OpenCost Assets API",
    "description": "Test collection for Assets API"
  },
  "item": [
    {
      "name": "Get Assets - 7 Days",
      "request": {
        "method": "GET",
        "url": "{{baseUrl}}/assets?window=7d"
      }
    },
    {
      "name": "Get Assets - Today",
      "request": {
        "method": "GET",
        "url": "{{baseUrl}}/assets?window=today"
      }
    }
  ],
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:9090"
    }
  ]
}
```

## Mock Server Setup

For testing without OpenCost:

```javascript
// src/services/assets.mock.js
const mockData = [
  {
    name: "web-app-pod-1",
    type: "Pod",
    provider: "AWS",
    cluster: "prod",
    namespace: "default",
    cost: 456.78,
    cpuCost: 234.56,
    ramCost: 189.99,
    gpuCost: 32.23,
  },
  // ... more assets
];

export const mockFetchAssetsData = async (window) => {
  return new Promise(resolve => {
    setTimeout(() => resolve(mockData), 500);
  });
};
```

## Debugging Tips

### Enable Verbose Logging
In `src/pages/Assets.js`, uncomment or add:
```javascript
console.log("[v0] Fetching assets with window:", window);
console.log("[v0] API response:", resp);
console.log("[v0] Transformed data:", transformedData);
console.log("[v0] Final state:", assetsData);
```

### Monitor Component Renders
Use React DevTools:
1. Install React DevTools extension
2. Go to Components tab
3. Check "Highlight updates when components render"
4. Observe re-render count and timing

### Check API Connectivity
```bash
# Test connectivity
curl -v http://localhost:9090/assets?window=7d

# Check response headers
curl -I http://localhost:9090/assets?window=7d

# Test with timeout
curl --connect-timeout 5 http://localhost:9090/assets?window=7d
```

## Integration Checklist

- [ ] API endpoint is accessible
- [ ] Sample data returns in expected format
- [ ] All currency codes are supported
- [ ] Time windows parse correctly
- [ ] Charts render with real data
- [ ] Table sorts correctly
- [ ] Mobile layout adapts properly
- [ ] Error states display correctly
- [ ] Refresh button works
- [ ] URL parameters persist
- [ ] Memory usage is stable
- [ ] Performance is acceptable

## Troubleshooting Guide

### "Assets API not available"
```bash
# Check if OpenCost is running
curl http://localhost:9090/health

# Check Assets endpoint specifically
curl http://localhost:9090/assets?window=7d
```

### "Failed to load assets data"
1. Check browser console for detailed error
2. Verify OpenCost configuration enables Assets API
3. Check for CORS issues
4. Verify BASE_URL environment variable

### "No asset data available"
1. Verify Assets API is configured in OpenCost
2. Try different time windows
3. Check OpenCost logs for data availability
4. Ensure sufficient data points in window

### Charts not rendering
1. Check if Recharts library is loaded
2. Verify data format matches expected structure
3. Check browser console for chart errors
4. Try refreshing page

---

Last Updated: February 2025
