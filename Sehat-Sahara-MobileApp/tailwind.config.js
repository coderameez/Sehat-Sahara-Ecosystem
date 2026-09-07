/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // ── Sehat Sahara Brand Greens ──────────────────────────────────
        // Extracted from Build Guide pages 28-36 approved references.
        brand: {
          50:  '#EBF5EF',
          100: '#D1EBD9',
          200: '#A3D7B3',
          300: '#75C38D',
          400: '#47AF67',
          500: '#1E9B46',   // Bright success/safe green (chips, verified)
          600: '#166B32',   // Accessible action green (buttons, links)
          700: '#0D5226',   // Header backgrounds, active nav
          800: '#073D1B',   // Dark overlays on brand
          900: '#032910',   // Deep text on light brand surfaces
        },
        // ── SOS / Critical / Emergency ────────────────────────────────
        sos: {
          50:  '#FFF1F2',
          100: '#FFE1E3',
          500: '#E6192B',
          600: '#C8121F',
          700: '#9B0D18',
        },
        // ── Warning / Amber ───────────────────────────────────────────
        warning: {
          50:  '#FFFBEB',
          100: '#FEF3C7',
          500: '#F59E0B',
          600: '#D97706',
        },
        // ── App Surface Hierarchy ────────────────────────────────────
        // White app surface, subtle page background, muted section fills
        surface: {
          DEFAULT: '#FFFFFF',
          page:    '#F8FAFC',  // overall page background within app
          section: '#F1F5F9',  // card section / grouped field bg
          border:  '#E2E8F0',  // default border
          dark:    '#334155',  // dark surface (bottom-nav active icon bg)
        },
        // ── Desktop outer canvas ──────────────────────────────────────
        canvas: '#EFF1F3',
      },

      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },

      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.875rem' }], // 10px
      },

      borderRadius: {
        // Aligned with Build Guide card proportions
        'sm':     '0.375rem',  //  6px
        'md':     '0.5rem',    //  8px
        DEFAULT:  '0.75rem',   // 12px
        'lg':     '0.75rem',   // 12px
        'xl':     '1rem',      // 16px — compact cards
        '2xl':    '1.25rem',   // 20px — large cards
        '3xl':    '1.5rem',    // 24px — bottom sheets, modals
        '4xl':    '2rem',      // 32px — pill overlay sheets
        'full':   '9999px',    // pills, chips, avatar
        'device': '2.625rem',  // 42px — phone frame outer radius
      },

      boxShadow: {
        // Restrained, card-appropriate shadows matching reference density
        'card':         '0 1px 3px 0 rgba(0,0,0,0.06), 0 1px 2px -1px rgba(0,0,0,0.04)',
        'card-hover':   '0 4px 12px -2px rgba(0,0,0,0.08), 0 2px 6px -1px rgba(0,0,0,0.04)',
        'card-elevated':'0 8px 20px -4px rgba(0,0,0,0.10), 0 4px 8px -2px rgba(0,0,0,0.05)',
        'input':        '0 0 0 3px rgba(22,107,50,0.15)',  // focus ring for brand
        'input-error':  '0 0 0 3px rgba(198,18,31,0.15)',  // focus ring for sos
      },
    },
  },
  safelist: ['md:hidden', 'md:flex'],
  plugins: [],
}
