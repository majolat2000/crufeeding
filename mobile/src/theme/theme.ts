/**
 * Crawford Royal Theme — Blue / Gold / Green
 * Dark, flashy, premium palette for the feeding platform.
 */

export const colors = {
  bg: '#090D16',
  surface: '#111827',
  surfaceOverlay: '#1E293B',

  gold: '#F59E0B',
  goldBright: '#FBBF24',
  goldText: '#FCD34D',
  goldGlow: 'rgba(245, 158, 11, 0.15)',

  emerald: '#10B981',
  emeraldGlow: 'rgba(16, 185, 129, 0.15)',

  textPrimary: '#FFFFFF',
  textMuted: '#94A3B8',

  border: 'rgba(245, 158, 11, 0.25)',
  borderSubtle: 'rgba(255, 255, 255, 0.08)',
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
  full: 9999,
} as const;

export const shadow = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  glow: {
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 12,
  },
} as const;
