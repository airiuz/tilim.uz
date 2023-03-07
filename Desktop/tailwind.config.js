/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#3474DF",
        darkPrimary: "#6A92CA",
        darkSecondary: "#2A303A",
        darkTernary: "#DDD8C7",
      },
    },
  },
  plugins: [],
};
