/**
 * Carbon Design System inspired tokens for Assets visualization
 * Aligned with IBM Carbon Design System color palette
 */

// Primary colors
export const colors = {
  // Core IBM Blue
  primary: "#0f62fe",
  primaryHover: "#0353e9",
  primaryActive: "#002d9c",

  // Accent colors
  success: "#24a148",
  warning: "#f1c21b",
  danger: "#da1e28",
  info: "#0043ce",

  // Neutral palette
  gray100: "#f4f4f4",
  gray200: "#e8e8e8",
  gray300: "#d1d1d1",
  gray400: "#bdbdbd",
  gray500: "#a8a8a8",
  gray600: "#8a8a8a",
  gray700: "#525252",
  gray800: "#393939",
  gray900: "#161f36",

  // Text
  textPrimary: "#161f36",
  textSecondary: "#525252",
  textHint: "#8a8a8a",

  // Backgrounds
  background: "#ffffff",
  backgroundSecondary: "#f4f4f4",
  backgroundTertiary: "#e8e8e8",

  // Borders
  border: "#e0e0e0",
  borderStrong: "#bdbdbd",
};

// Typography scale
export const typography = {
  fontFamily: {
    primary: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
    code: "'IBM Plex Mono', monospace",
  },
  fontSize: {
    xs: "12px",
    sm: "14px",
    base: "16px",
    lg: "18px",
    xl: "20px",
    "2xl": "24px",
    "3xl": "32px",
  },
  fontWeight: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
};

// Spacing scale (rem based)
export const spacing = {
  0: "0",
  1: "0.25rem",
  2: "0.5rem",
  3: "0.75rem",
  4: "1rem",
  6: "1.5rem",
  8: "2rem",
  12: "3rem",
  16: "4rem",
};

// Border radius
export const borderRadius = {
  none: "0",
  sm: "2px",
  base: "4px",
  lg: "8px",
  xl: "16px",
};

// Shadows (elevation)
export const shadows = {
  none: "none",
  sm: "0 2px 4px rgba(0, 0, 0, 0.08)",
  base: "0 4px 8px rgba(0, 0, 0, 0.12)",
  md: "0 8px 16px rgba(0, 0, 0, 0.16)",
  lg: "0 12px 24px rgba(0, 0, 0, 0.2)",
  xl: "0 20px 32px rgba(0, 0, 0, 0.24)",
};

// Component specific tokens
export const assets = {
  summaryCardPadding: "20px",
  summaryCardBorderRadius: "8px",
  tableHeaderBackground: "#f4f4f4",
  tableHeaderBorderColor: "#e0e0e0",
  tableRowHoverBackground: "#f9f9f9",
};
