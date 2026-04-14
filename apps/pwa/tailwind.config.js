/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./apps/pwa/src/**/*.{html,ts}",
    "./apps/pwa/src/app/**/*.{html,ts}",
    "./libs/**/*.{html,ts}"
  ],
  theme: {
    extend: {
      colors: {
        'pastel-indigo': '#eef2ff',
        'pastel-rose': '#fff1f2',
        'pastel-teal': '#f0fdfa',
        'pastel-amber': '#fffbeb',
        'pastel-slate': '#f8fafc',
        'pos-text': '#1e293b',
        'pos-muted': '#64748b',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}
