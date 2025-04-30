/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: {
          dark: '#1A1A1A',
          light: '#2C2C2C',
        },
        primary: {
          50: '#E8F8F0',
          100: '#D1F2E1',
          200: '#A3E5C4',
          300: '#75D9A6',
          400: '#47CC89',
          500: '#2ECC71', // Main green
          600: '#27AE60', // Secondary green
          700: '#208E4E',
          800: '#196F3D',
          900: '#124F2C',
        },
        accent: {
          50: '#F4FBF7',
          100: '#E9F7EF',
          200: '#D4EFDF',
          300: '#A8E6CF', // Accent green
          400: '#7DDCB5',
          500: '#52D29A',
          600: '#27C780',
          700: '#1FA367',
          800: '#187F4E',
          900: '#115B35',
        },
        gray: {
          50: '#F9F9F9',
          100: '#E0E0E0', // Light gray
          200: '#CCCCCC',
          300: '#B3B3B3',
          400: '#999999',
          500: '#808080',
          600: '#666666',
          700: '#4D4D4D',
          800: '#333333', // Subtle hover
          900: '#2C2C2C', // Dark gray
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px rgba(0, 0, 0, 0.2)',
        'glass-lg': '0 12px 42px rgba(0, 0, 0, 0.3)',
      },
      backdropBlur: {
        'xs': '2px',
      },
    },
  },
  plugins: [],
};