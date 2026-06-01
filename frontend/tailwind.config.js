/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        darkBg: '#090d16', // Slate dark background
        darkCard: 'rgba(15, 23, 42, 0.75)', // Transparent glass cards
        accentEmerald: {
          light: '#34d399',
          DEFAULT: '#10b981',
          dark: '#059669',
          glow: 'rgba(16, 185, 129, 0.25)'
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif']
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.45)',
        'emerald-glow': '0 0 25px rgba(16, 185, 129, 0.25)'
      },
      backdropBlur: {
        'glass': '16px'
      }
    }
  },
  plugins: []
}
