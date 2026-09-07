/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./AdminApp.tsx",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./data/**/*.{js,ts,jsx,tsx}",
    "./config/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#EBF5EF',
          100: '#D1EBD9',
          200: '#A3D7B3',
          300: '#75C38D',
          400: '#47AF67',
          500: '#1E9B46',
          600: '#166B32',
          700: '#0D5226',
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
          DEFAULT: '#FFFFFF',
          page:    '#F8FAFC',
          section: '#F1F5F9',
          border:  '#E2E8F0',
          dark:    '#334155',
        },
        canvas: '#EFF1F3',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.875rem' }],
      },
      borderRadius: {
        'sm':     '0.375rem',
        'md':     '0.5rem',
        DEFAULT:  '0.75rem',
        'lg':     '0.75rem',
        'xl':     '1rem',
        '2xl':    '1.25rem',
        '3xl':    '1.5rem',
        '4xl':    '2rem',
        'full':   '9999px',
      },
      boxShadow: {
        'card':         '0 1px 3px 0 rgba(0,0,0,0.06), 0 1px 2px -1px rgba(0,0,0,0.04)',
        'card-hover':   '0 4px 12px -2px rgba(0,0,0,0.08), 0 2px 6px -1px rgba(0,0,0,0.04)',
        'card-elevated':'0 8px 20px -4px rgba(0,0,0,0.10), 0 4px 8px -2px rgba(0,0,0,0.05)',
        'input':        '0 0 0 3px rgba(22,107,50,0.15)',
        'input-error':  '0 0 0 3px rgba(198,18,31,0.15)',
      },
    },
  },
  safelist: ['md:hidden', 'md:flex'],
  plugins: [],
};
