/**
 * Sehat Sahara Design Tokens
 * Extracted from approved Build Guide visual references (Pages 28–36).
 * These are the single source of truth for non-Tailwind usage (inline styles, etc.)
 */

export const colors = {
  brand: {
    50:  '#EBF5EF',
    100: '#D1EBD9',
    200: '#A3D7B3',
    300: '#75C38D',
    400: '#47AF67',
    500: '#1E9B46',  // Bright success/safe green
    600: '#166B32',  // Primary action green (buttons, links, active states)
    700: '#0D5226',  // Header / heavy emphasis
    800: '#073D1B',
    900: '#032910',
  },
  sos: {
    50:  '#FFF1F2',
    100: '#FFE1E3',
    500: '#E6192B',
    600: '#C8121F',
    700: '#9B0D18',
  },
  warning: {
    50:  '#FFFBEB',
    100: '#FEF3C7',
    500: '#F59E0B',
    600: '#D97706',
  },
  surface: {
    white:   '#FFFFFF',
    page:    '#F8FAFC',
    section: '#F1F5F9',
    border:  '#E2E8F0',
  },
  text: {
    primary:   '#0F172A',
    secondary: '#475569',
    muted:     '#94A3B8',
    disabled:  '#CBD5E1',
    inverse:   '#FFFFFF',
  },
  canvas: '#EFF1F3',  // Desktop outer presentation background
} as const;

export const radii = {
  sm:     '0.375rem',
  md:     '0.5rem',
  lg:     '0.75rem',
  xl:     '1rem',
  '2xl':  '1.25rem',
  '3xl':  '1.5rem',
  full:   '9999px',
} as const;

export const shadows = {
  card:         '0 1px 3px 0 rgba(0,0,0,0.06), 0 1px 2px -1px rgba(0,0,0,0.04)',
  cardHover:    '0 4px 12px -2px rgba(0,0,0,0.08), 0 2px 6px -1px rgba(0,0,0,0.04)',
  cardElevated: '0 8px 20px -4px rgba(0,0,0,0.10), 0 4px 8px -2px rgba(0,0,0,0.05)',
} as const;

export const spacing = {
  pagePaddingX: '1.25rem',  // 20px — horizontal page padding
  pagePaddingY: '1rem',     // 16px — vertical section spacing
  cardPadding:  '1rem',     // 16px — standard card inner padding
  headerH:      '56px',     // App header height
  bottomNavH:   '64px',     // Bottom navigation height
} as const;
