import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#F9F9FB",
        primary: "#1A1A1A",
        accent: "#D7C08C",
      },
    },
  },
  plugins: [],
};

export default config;
