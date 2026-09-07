/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#EBF5EF',
          100: '#D1EBD9',
          200: '#A3D7B3',
          300: '#75C38D',
          400: '#47AF67',
          500: '#1E9B46',
          600: '#166B32', // Primary brand
          700: '#0D5226', // Dark emphasis
          800: '#073D1B',
          900: '#015433', // Deep brand green
          deep: '#015433',
        },
        darkbg: {
          900: '#071A10',
          800: '#0A2415',
          700: '#0D5226',
          card: '#0D2718',
          border: '#163824',
        },
        page: {
          light: '#F8FAFC',
          dark: '#071A10',
        },
        surface: {
          white: '#FFFFFF',
          light: '#F8FAFC',
          muted: '#F1F5F9',
          border: '#E2E8F0',
        },
        limeacc: {
          DEFAULT: '#22C55E',
          bright: '#4ADE80',
          glow: 'rgba(74, 222, 128, 0.15)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
        'card': '0 4px 6px -1px rgba(13, 82, 38, 0.05), 0 2px 4px -2px rgba(13, 82, 38, 0.05)',
        'card-hover': '0 10px 15px -3px rgba(13, 82, 38, 0.08), 0 4px 6px -4px rgba(13, 82, 38, 0.08)',
        'dark-card': '0 4px 20px 0 rgba(0, 0, 0, 0.35)',
      },
    },
  },
  plugins: [],
};
