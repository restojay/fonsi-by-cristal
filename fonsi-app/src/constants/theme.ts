/**
 * Theme constants matching the Fonsi by Cristal website
 * Light monochrome aesthetic with dark accents
 */

export const COLORS = {
  // Primary colors - dark accent on light bg
  primary: '#171717', // neutral-900 for buttons/active states
  primaryDark: '#0a0a0a',
  primaryLight: '#404040',

  // Background colors - light theme
  bgPrimary: '#ffffff', // White
  bgSecondary: '#fafafa', // neutral-50
  bgTertiary: '#f5f5f5', // neutral-100

  // Text colors - dark on light
  textPrimary: '#171717', // neutral-900
  textSecondary: '#525252', // neutral-600
  textMuted: '#a3a3a3', // neutral-400

  // Status colors - muted for light theme
  success: '#16a34a', // green-600
  successDark: '#15803d', // green-700
  error: '#dc2626', // red-600
  errorDark: '#b91c1c', // red-700
  warning: '#d97706', // amber-600
  warningDark: '#b45309', // amber-700
  info: '#2563eb', // blue-600
  infoDark: '#1d4ed8', // blue-700

  // Borders
  borderColor: '#e5e5e5', // neutral-200
  borderColorLight: '#d4d4d4', // neutral-300

  // UI elements
  tabActive: '#171717',
  tabInactive: '#a3a3a3', // neutral-400
  cardBg: '#fafafa',
  inputBg: '#ffffff',
  inputBorder: '#e5e5e5',
  buttonBg: '#171717',
  buttonBgHover: '#404040',
  buttonDisabled: '#d4d4d4', // neutral-300

  // Light theme equivalents (replacing glass-morphism)
  glassBackground: '#f5f5f5', // neutral-100
  glassBorder: '#e5e5e5', // neutral-200
  glassBackgroundLight: '#fafafa', // neutral-50
};

export const GRADIENTS = {
  // Flat monochrome - no gold
  goldGradient: ['#171717', '#171717', '#171717'] as const,
  goldHorizontal: ['#171717', '#171717', '#171717'] as const,
  darkCard: ['#fafafa', '#fafafa'] as const,
  hero: ['#171717', '#171717'] as const,
  heroGold: ['#171717', '#171717', '#171717'] as const,
  shimmer: ['#e5e5e5', '#f5f5f5', '#e5e5e5'] as const,
  tabBar: ['#ffffff', '#ffffff'] as const,
  headerGold: ['#171717', '#171717'] as const,
  goldButton: ['#171717', '#171717', '#171717'] as const,
  statusSuccess: ['#16a34a', '#16a34a'] as const,
  statusWarning: ['#d97706', '#d97706'] as const,
  statusInfo: ['#2563eb', '#2563eb'] as const,
  statusError: ['#dc2626', '#dc2626'] as const,
};

export const FONTS = {
  // Font families - loaded via expo-font
  serif: 'PlayfairDisplay-Regular',
  serifSemiBold: 'PlayfairDisplay-SemiBold',
  serifBold: 'PlayfairDisplay-Bold',
  sansSerif: 'Inter-Regular',
  sansSerifMedium: 'Inter-Medium',
  sansSerifSemiBold: 'Inter-SemiBold',
  sansSerifBold: 'Inter-Bold',

  // Font sizes (in pixels)
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 28,
  '4xl': 36,
  '5xl': 42,
  '6xl': 52,

  // Font weights
  light: '300' as const,
  normal: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extrabold: '800' as const,
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
  '4xl': 56,
  '5xl': 72,
  '6xl': 96,
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
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  pressed: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  gold: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
};

export const ANIMATION = {
  spring: {
    damping: 30,
    stiffness: 300,
    mass: 1,
  },
  springBouncy: {
    damping: 10,
    stiffness: 200,
    mass: 0.8,
  },
  springGentle: {
    damping: 20,
    stiffness: 120,
    mass: 1,
  },
  timing: {
    fast: 200,
    normal: 300,
    slow: 500,
  },
  stagger: {
    delay: 80,
  },
};

export const TYPOGRAPHY = {
  sectionLabel: {
    fontSize: 10,
    fontFamily: 'Inter-SemiBold',
    textTransform: 'uppercase' as const,
    letterSpacing: 4,
    color: '#a3a3a3',
  },
  sectionTitle: {
    fontSize: 30,
    fontFamily: 'PlayfairDisplay-Bold',
    color: '#171717',
  },
  heroTitle: {
    fontSize: 52,
    fontFamily: 'PlayfairDisplay-Bold',
    color: '#171717',
  },
};

export const ICONS = {
  // Tab bar
  home: 'home' as const,
  services: 'scissors' as const,
  book: 'calendar' as const,
  about: 'info' as const,

  // General
  sparkles: 'sparkles' as const,
  arrowRight: 'arrow-right' as const,
  arrowLeft: 'arrow-left' as const,
  chevronRight: 'chevron-right' as const,
  check: 'check' as const,
  clock: 'clock' as const,
  mapPin: 'map-pin' as const,
  phone: 'phone' as const,
  mail: 'mail' as const,
  x: 'x' as const,
  edit: 'edit-2' as const,
  logOut: 'log-out' as const,

  // Settings
  bell: 'bell' as const,
  settings: 'settings' as const,
  shield: 'shield' as const,
  fileText: 'file-text' as const,

  // Time periods
  sunrise: 'sunrise' as const,
  sun: 'sun' as const,
  sunset: 'sunset' as const,

  // Categories
  categoryHair: 'content-cut' as const,
  categoryBridal: 'diamond-stone' as const,
  categoryMakeup: 'brush' as const,
  categoryWaxing: 'spa' as const,
};
