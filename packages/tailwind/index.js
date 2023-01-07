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
};
