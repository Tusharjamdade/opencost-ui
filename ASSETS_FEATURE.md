# Assets Visualization Feature

## Overview

The Assets visualization feature is a new addition to the OpenCost UI that displays asset cost data from the OpenCost Assets API. This feature provides comprehensive visibility into infrastructure costs broken down by asset type, with support for Carbon Design System styling and fully responsive design.

## Features

### 1. **Assets Dashboard**
- Located at `/assets` route
- Displays comprehensive asset cost information
- Responsive design that works seamlessly on mobile, tablet, and desktop

### 2. **Summary Cards**
- **Total Cost**: Aggregated cost across all assets
- **CPU Cost**: Total CPU-related expenses
- **RAM Cost**: Total memory-related expenses
- **GPU Cost**: Total GPU-related expenses
- **Total Assets**: Count of tracked assets

Each card features:
- Carbon Design System color scheme
- Hover effects with smooth transitions
- Responsive grid layout

### 3. **Interactive Charts**
Two chart views with tabbed interface:

#### Chart 1: Top Assets by Cost (Bar Chart)
- Shows top 10 assets by cost
- Stacked bar chart displaying CPU, RAM, and GPU costs
- Responsive sizing for mobile and desktop
- Interactive tooltips with currency formatting

#### Chart 2: Cost Breakdown by Type (Pie Chart)
- Shows percentage distribution of costs by type (CPU, RAM, GPU, Other)
- Responsive radius adjustment for mobile
- Interactive legend with cost values

### 4. **Detailed Assets Table**
- Sortable columns by any metric
- Responsive table layout:
  - **Desktop**: Shows all 9 columns (Name, Type, Provider, Cluster, Namespace, Cost, CPU, RAM, GPU)
  - **Mobile**: Shows essential columns (Name, Cost, CPU)
- Currency formatting support
- Striped rows for better readability
- Hover effects on rows

### 5. **Time Window Selection**
Quick access to preset windows:
- Last 7 Days (default)
- Today
- Last Week
- Last Month
- Last 30 Days
- Last 90 Days
- Custom date range support

### 6. **Currency Support**
- Multi-currency support with automatic formatting
- List of all major currency codes
- Persists selection in URL query parameters

## Architecture

### Directory Structure
```
src/
├── pages/
│   └── Assets.js                 # Main Assets page component
├── components/
│   └── assets/
│       ├── index.js              # Components barrel export
│       ├── tokens.js             # Carbon Design System tokens
│       ├── AssetsSummary.js       # Summary cards component
│       ├── AssetsChart.js         # Charts component (bar + pie)
│       └── AssetsTable.js         # Data table component
└── services/
    └── assets.js                  # API service for Assets endpoint
```

### Key Components

#### AssetsService (`src/services/assets.js`)
- Handles API communication with OpenCost Assets endpoints
- Supports multiple time windows
- Error handling and response transformation
- Methods:
  - `fetchAssetsData(window)`: Fetch general asset data
  - `fetchCarbonAssetsData(window)`: Fetch carbon cost data (future extension)

#### Assets Page (`src/pages/Assets.js`)
- Main page component managing state and data flow
- URL parameter handling for window and currency
- Data transformation from API response to component structure
- Integrates all sub-components

#### AssetsSummary (`src/components/assets/AssetsSummary.js`)
- Displays five summary cards with key metrics
- Responsive grid layout (adjusts from 5 cols → 2 cols on mobile)
- Carbon Design color scheme
- Hover animations

#### AssetsChart (`src/components/assets/AssetsChart.js`)
- Tab-based interface for two chart types
- Uses Recharts for visualization
- Responsive sizing (300px height on mobile, 400px on desktop)
- Interactive tooltips and legends

#### AssetsTable (`src/components/assets/AssetsTable.js`)
- Sortable data table
- Responsive column hiding on mobile
- Alternate row coloring
- Currency formatting for all numeric values

#### Carbon Design Tokens (`src/components/assets/tokens.js`)
Centralized design system featuring:
- Color palette (primary: #0f62fe, success: #24a148, etc.)
- Typography scale
- Spacing system
- Border radius tokens
- Shadow elevation system
- Component-specific tokens

## API Integration

### Endpoints

The feature integrates with the following OpenCost API endpoints:

#### Assets API
```
GET /assets?window=<window>
```

**Supported window formats:**
- Preset: `7d`, `today`, `lastweek`, `month`, `30d`, `90d`
- Custom ISO range: `2023-01-18T10:30:00Z,2023-01-19T10:30:00Z`
- Unix timestamps: `1674073869,1674193869`

**Example Response Format:**
```json
{
  "data": [
    {
      "name": "pod-namespace/pod-name",
      "type": "Pod",
      "provider": "AWS",
      "cluster": "production",
      "namespace": "default",
      "totalCost": 123.45,
      "cpuCost": 45.67,
      "ramCost": 56.78,
      "gpuCost": 21.00
    }
  ]
}
```

#### Carbon Assets API (Future)
```
GET /assets/carbon?window=<window>
```

Will support carbon cost tracking alongside financial costs.

## Usage

### Accessing the Assets Page
1. Navigate to `/assets` in the OpenCost UI
2. Or click the "Assets" menu item in the sidebar navigation
3. Use the Date Range selector to choose a time window
4. Select currency for cost display

### Understanding the Data

The Assets feature displays:
- **Asset Name**: Identifier of the cloud resource (VM, pod, container, etc.)
- **Type**: Resource type (Pod, Node, PV, etc.)
- **Provider**: Cloud provider (AWS, GCP, Azure, etc.)
- **Cluster**: Kubernetes cluster identifier
- **Namespace**: Kubernetes namespace (if applicable)
- **Costs**: Broken down by resource type (CPU, RAM, GPU)

### Interpreting Charts

**Bar Chart (Top Assets by Cost):**
- X-axis: Asset names (top 10)
- Y-axis: Cost amount
- Stacked bars show composition of CPU, RAM, and GPU costs

**Pie Chart (Cost Breakdown):**
- Shows percentage distribution of total costs
- Helps identify which resource type drives costs
- Labels show percentage allocation

## Responsive Design

### Mobile (xs - < 576px)
- Sidebar navigation may be collapsed
- Summary cards stack vertically (1 column)
- Charts height reduced to 300px
- Table shows only Name, Cost, CPU columns
- Controls arranged vertically
- Font sizes reduced for smaller screens

### Tablet (sm - 576px to 768px)
- Summary cards: 2 columns
- Full table visibility with normal sizing
- Standard chart height (400px)
- Controls arranged horizontally

### Desktop (md+ - > 768px)
- Summary cards: 5 columns optimal layout
- All table columns visible
- Full-featured charts
- Side-by-side controls

## Carbon Design System Implementation

The Assets feature follows IBM's Carbon Design System principles:

### Color Palette
- **Primary Blue** (#0f62fe): Main interactive elements
- **Success Green** (#24a148): CPU costs
- **Warning Yellow** (#f1c21b): RAM costs
- **Danger Red** (#da1e28): GPU costs
- **Neutral Grays**: Backgrounds, borders, text

### Typography
- **Font Family**: System fonts (-apple-system, BlinkMacSystemFont, Segoe UI, Roboto)
- **Weight Scale**: Regular (400), Medium (500), Semibold (600), Bold (700)
- **Size Scale**: 12px to 32px with defined increments

### Spacing
- Consistent 4px base unit
- Tokens from 4px to 96px
- Applied to padding, margins, and gaps

### Elevation
- Subtle shadow system for depth
- From minimal (2px) to prominent (32px)
- Hover states with enhanced shadows

## Error Handling

The feature includes robust error handling:

1. **API Unavailable**: Shows user-friendly message with guidance
2. **No Data**: Displays informative empty state
3. **Network Errors**: Logs errors and shows retry option
4. **Malformed Data**: Gracefully handles missing fields with defaults

## Performance Considerations

- Responsive charts resize based on viewport
- Sorted table uses memoization to prevent re-renders
- Charts limit data to top 10 assets to maintain readability
- Efficient currency formatting via existing utility
- Image assets properly optimized

## Future Enhancements

Potential additions to the Assets feature:

1. **Carbon Emissions Tracking**: Integration with /assets/carbon endpoint
2. **Asset Filtering**: Filter by provider, cluster, namespace, type
3. **Drill-down Analytics**: Click assets for detailed breakdown
4. **Export Functionality**: Download data as CSV/JSON
5. **Custom Date Range**: Enhanced date picker UI
6. **Cost Trending**: Historical cost comparisons over time
7. **Anomaly Detection**: Alert on unusual cost spikes
8. **Advanced Filtering**: Multi-select filters for detailed analysis

## Testing

To test the Assets feature:

1. **With Mock Data**: API returns sample assets
   ```bash
   curl "http://localhost:9003/assets?window=7d"
   ```

2. **With Real OpenCost Instance**: Ensure OpenCost is running with Assets API enabled
   - Default base URL: http://localhost:9090
   - Can be configured via BASE_URL environment variable

3. **Responsive Testing**:
   - Mobile: 375px width (iPhone SE)
   - Tablet: 768px width (iPad)
   - Desktop: 1920px width (Full HD)

## Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (Chrome, Safari on iOS)

## Dependencies

The Assets feature uses existing project dependencies:
- React 19.2.3
- Material-UI (MUI) 7.3.6
- Recharts 3.6.0
- Lodash 4.17.23
- Axios 1.13.3

No additional dependencies were added.

## Troubleshooting

### No Data Displayed
1. Check if OpenCost instance is running
2. Verify BASE_URL environment variable (default: http://localhost:9090)
3. Ensure Assets API is enabled in OpenCost
4. Check browser console for API errors

### Incorrect Currency Format
1. Verify currency code is valid (e.g., USD, EUR, GBP)
2. Check console logs for currency conversion errors

### Responsive Layout Issues
1. Clear browser cache
2. Check browser DevTools responsive mode
3. Verify Material-UI responsive utilities are loading

## Contributing

When extending the Assets feature:
1. Follow existing component structure
2. Use Carbon Design tokens for styling
3. Maintain responsive design principles
4. Add error handling for new features
5. Update this documentation

## License

The Assets feature is part of the OpenCost UI project and is licensed under the Apache License 2.0.
