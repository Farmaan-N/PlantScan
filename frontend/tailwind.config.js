/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Botanical color palette
        forest: {
          50:  '#f0f7f0',
          100: '#dcefdc',
          200: '#bce0bc',
          300: '#8fc98f',
          400: '#5cac5c',
          500: '#3a8f3a',  // Main forest green
          600: '#2d7230',
          700: '#255a27',
          800: '#1f4821',
          900: '#1a3b1c',
        },
        sage: {
          50:  '#f4f7f2',
          100: '#e6ede1',
          200: '#cddbC6',
          300: '#abc3a1',
          400: '#84a678',
          500: '#668b5a',  // Sage green
          600: '#517048',
          700: '#425a3b',
          800: '#364930',
          900: '#2d3d28',
        },
        earth: {
          50:  '#faf7f2',
          100: '#f2ece0',
          200: '#e4d8c0',
          300: '#d0bc96',
          400: '#b89c6c',
          500: '#a08450',  // Earth brown
          600: '#8a6e42',
          700: '#705737',
          800: '#5c4730',
          900: '#4d3c28',
        },
        cream: {
          50:  '#fefdf9',
          100: '#fdf9ef',
          200: '#faf2db',
          300: '#f5e7bc',
          400: '#eed89a',
          500: '#e5c776',  // Warm cream
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'system-ui', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '0.7' },
          '50%': { opacity: '1' },
        },
      },
      boxShadow: {
        'glass': '0 8px 32px rgba(0, 0, 0, 0.12)',
        'glass-lg': '0 16px 48px rgba(0, 0, 0, 0.16)',
      },
    },
  },
  plugins: [],
}
