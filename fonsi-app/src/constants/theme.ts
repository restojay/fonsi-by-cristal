/**
 * Theme constants matching the Fonsi by Cristal website
 * Premium dark luxury aesthetic with gold accents
 */

export const COLORS = {
  // Primary colors - luxury dark theme
  primary: '#c9a96e', // Gold
  primaryDark: '#a88652',
  primaryLight: '#d9b899',

  // Background colors
  bgPrimary: '#0a0a0a', // Nearly black
  bgSecondary: '#1a1a1a', // Dark gray
  bgTertiary: '#2a2a2a', // Lighter gray

  // Text colors
  textPrimary: '#ffffff', // White
  textSecondary: '#e0e0e0', // Light gray
  textMuted: '#888888', // Medium gray

  // Status colors
  success: '#4caf50',
  error: '#f44336',
  warning: '#ff9800',
  info: '#2196f3',

  // Borders
  borderColor: '#333333',
  borderColorLight: '#444444',

  // UI elements
  tabActive: '#c9a96e',
  tabInactive: '#666666',
  cardBg: '#151515',
  inputBg: '#1a1a1a',
  inputBorder: '#333333',
  buttonBg: '#c9a96e',
  buttonBgHover: '#a88652',
  buttonDisabled: '#555555',
};

export const FONTS = {
  // Font families
  serif: 'Georgia, serif', // For headers
  sansSerif: 'System, -apple-system, sans-serif', // For body text
  mono: 'Courier New, monospace', // For code/special text

  // Font sizes (in pixels)
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 28,
  '4xl': 32,

  // Font weights
  light: '300',
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
};

export const BORDER_RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 20,
  full: 9999,
};

export const SHADOWS = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 7,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 5.46,
    elevation: 10,
  },
};
