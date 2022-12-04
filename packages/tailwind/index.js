/** @type {import('tailwindcss').Config} */
module.exports = {
  plugins: [require("flowbite/plugin")],
  darkMode: "media",
  content: [
    "../../node_modules/flowbite-react/**/*.js",
    "../../packages/ui/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "./src/_app.tsx",
  ],
  theme: {
    extend: {},
    colors: {
      green: {
        50: "#f0fde8",
        100: "#dbfacd",
        200: "#baf6a0",
        300: "#8fed69",
        400: "#69df3c",
        500: "#44b91b",
        600: "#349d13",
        700: "#297813",
        800: "#255f15",
        900: "#225116",
      },
    },
  },
};
