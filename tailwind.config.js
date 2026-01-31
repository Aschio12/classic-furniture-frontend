/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2B2B2A',
        surface: '#F6F3ED',
        accent: '#BFA86A',
      },
    },
  },
  plugins: [],
};
