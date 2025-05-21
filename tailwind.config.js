/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#01796F',
        accent: '#A0E8CE',
        background: '#F8FAF9',
        text: '#111827',
      },
    },
  },
  plugins: [],
};
