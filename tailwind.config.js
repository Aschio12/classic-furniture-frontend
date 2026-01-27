/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2E2E2E',
        surface: '#F7F6F2',
        accent: '#C4B37A',
      },
    },
  },
  plugins: [],
};
