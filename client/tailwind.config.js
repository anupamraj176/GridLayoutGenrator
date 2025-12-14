/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#020E0E',
          primary: '#05614B',
          accent: '#01DE82',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Ensure a clean font is used if available, or fallback
      }
    },
  },
  plugins: [],
}