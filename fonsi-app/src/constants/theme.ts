/**
 * Theme constants matching the Fonsi by Cristal website
 * Monochrome dark aesthetic with white/grey accents
 */

export const COLORS = {
  // Primary colors - monochrome theme
  primary: '#ffffff', // White accent
  primaryDark: '#d0d0d0',
  primaryLight: '#f0f0f0',

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
  successDark: '#2e7d32',
  error: '#f44336',
  errorDark: '#c62828',
  warning: '#ff9800',
  warningDark: '#e65100',
  info: '#2196f3',
  infoDark: '#1565c0',

  // Borders
  borderColor: '#333333',
  borderColorLight: '#444444',

  // UI elements
  tabActive: '#ffffff',
  tabInactive: '#666666',
  cardBg: '#151515',
  inputBg: '#1a1a1a',
  inputBorder: '#333333',
  buttonBg: '#ffffff',
  buttonBgHover: '#e0e0e0',
  buttonDisabled: '#555555',

  // Glass-morphism
  glassBackground: 'rgba(255, 255, 255, 0.05)',
  glassBorder: 'rgba(255, 255, 255, 0.1)',
  glassBackgroundLight: 'rgba(255, 255, 255, 0.08)',
};

export const GRADIENTS = {
  goldGradient: ['#ffffff', '#e0e0e0', '#ffffff'] as const,
  goldHorizontal: ['#d0d0d0', '#ffffff', '#f0f0f0'] as const,
  darkCard: ['#1a1a1a', '#151515'] as const,
  hero: ['#1a1a1a', '#0a0a0a'] as const,
  heroGold: ['rgba(255, 255, 255, 0.08)', 'rgba(255, 255, 255, 0.02)', '#0a0a0a'] as const,
  shimmer: ['#1a1a1a', '#2a2a2a', '#1a1a1a'] as const,
  tabBar: ['#141414', '#0f0f0f'] as const,
  headerGold: ['rgba(255, 255, 255, 0.05)', 'rgba(10, 10, 10, 1)'] as const,
  goldButton: ['#f0f0f0', '#ffffff', '#d0d0d0'] as const,
  statusSuccess: ['#2e7d32', '#4caf50'] as const,
  statusWarning: ['#e65100', '#ff9800'] as const,
  statusInfo: ['#1565c0', '#2196f3'] as const,
  statusError: ['#c62828', '#f44336'] as const,
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
  '4xl': 32,
  '5xl': 36,

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
  gold: {
    shadowColor: '#ffffff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
};

export const ANIMATION = {
  spring: {
    damping: 15,
    stiffness: 150,
    mass: 1,
  },
  springBouncy: {
    damping: 10,
    stiffness: 200,
    mass: 0.8,
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

export const ICONS = {
  // Tab bar
  home: 'home' as const,
  services: 'scissors' as const,
  book: 'calendar' as const,
  profile: 'user' as const,

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
