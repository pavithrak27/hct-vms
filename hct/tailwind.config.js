/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Aktiv Grotesk"', 'sans-serif'],
      },
      colors: {
        hct: {
          blue: '#00249c',
          gold: '#c29b0c',
          light: '#f8fafc',
          dark: '#0f172a'
        }
      }
    },
  },
  plugins: [],
}
