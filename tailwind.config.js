/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#F0F9F6',
          100: '#DDF0EB',
          200: '#BCE1D8',
          300: '#90CDC0',
          400: '#5FB4A3',
          500: '#3D9B89',
          600: '#2D7A6E', // Primary Dark Pine/Teal (Mockup hero color)
          700: '#246258',
          800: '#1F4F48',
          900: '#193F3A',
        },
        agri: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        aqua: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
        },
        livestock: {
          50: '#fffbe8',
          100: '#fef3c7',
          200: '#fde68a',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
        },
        pastel: {
          teal: '#E6F4F1',
          blue: '#EBF4FE',
          amber: '#FEF6E8',
          rose: '#FEECEE',
          purple: '#F5EDFD',
          emerald: '#ECFDF5',
          indigo: '#EEF2FF',
          gray: '#F1F5F9'
        }
      },
      boxShadow: {
        'soft': '0 2px 10px rgba(0, 0, 0, 0.03), 0 1px 3px rgba(0, 0, 0, 0.02)',
        'card': '0 4px 20px -2px rgba(0, 0, 0, 0.04), 0 2px 6px -1px rgba(0, 0, 0, 0.02)',
        'elevated': '0 10px 30px -4px rgba(0, 0, 0, 0.06), 0 4px 12px -2px rgba(0, 0, 0, 0.03)',
        'float': '0 12px 36px rgba(45, 122, 110, 0.25)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      }
    },
  },
  plugins: [],
}
