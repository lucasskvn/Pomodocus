/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        fredoka: ['Fredoka', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      colors: {
        'bg-dark': '#0f1923',
        'accent-green': '#4ade80',
        'accent-amber': '#fbbf24',
        rarity: {
          common: '#94a3b8',
          rare: '#60a5fa',
          epic: '#a855f7',
          legendary: '#f59e0b',
        },
      },
    },
  },
  plugins: [],
}
