/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        agri: {
          50: '#f2f9f3',
          100: '#e1f2e5',
          500: '#2e7d32',
          600: '#236928',
          700: '#1b5e20',
          800: '#164d1a',
          900: '#113c14',
        }
      }
    },
  },
  plugins: [],
}
