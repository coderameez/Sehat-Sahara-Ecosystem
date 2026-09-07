/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
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
        txt: {
          primary:   '#0F172A',
          secondary: '#475569',
          muted:     '#94A3B8',
          disabled:  '#CBD5E1',
        },
      },
      boxShadow: {
        'card':     '0 1px 3px 0 rgba(0,0,0,0.06), 0 1px 2px -1px rgba(0,0,0,0.04)',
        'card-hover': '0 4px 12px -2px rgba(0,0,0,0.08), 0 2px 6px -1px rgba(0,0,0,0.04)',
        'modal':    '0 8px 20px -4px rgba(0,0,0,0.10), 0 4px 8px -2px rgba(0,0,0,0.05)',
        'focus-ring': '0 0 0 3px rgba(22,107,50,0.15)',
      },
      borderRadius: {
        'card': '16px',
        'input': '12px',
        'modal': '24px',
        'hero': '20px',
      },
    },
  },
  plugins: [],
}
