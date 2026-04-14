/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'pos-dark': '#0f172a',
        'pos-accent': '#3b82f6',
        'pos-danger': '#ef4444',
        'pos-success': '#22c55e',
      },
      borderRadius: {
        'premium': '1rem',
      }
    },
  },
  plugins: [],
}
