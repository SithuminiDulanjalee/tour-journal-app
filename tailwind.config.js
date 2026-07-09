/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './context/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        paper: '#FBF7EF',
        ink: '#1E2A3C',
        stamp: '#C8862A',
        teal: '#2F6F62',
      },
    },
  },
  plugins: [],
};