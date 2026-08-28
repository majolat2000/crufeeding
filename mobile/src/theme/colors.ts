/**
 * Crawford Digital Feeding Management - Design Tokens
 * Primary navy is the brand anchor for all screens.
 */
export const colors = {
  navy: '#1A153B', // primary background / sidebar / header
  navyLight: '#25204D',
  navyMuted: '#2E2960',
  white: '#FFFFFF',
  card: '#FFFFFF',
  background: '#F5F5F7', // light grey behind cards
  textPrimary: '#1A153B',
  textSecondary: '#6B7280',
  textOnNavy: '#FFFFFF',
  accent: '#4F46E5',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  border: '#E5E7EB',
  borderLight: '#F3F4F6',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
} as const;
