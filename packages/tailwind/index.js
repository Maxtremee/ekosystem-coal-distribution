/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "../../node_modules/flowbite-react/**/*.js",
    "../../packages/ui/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "./src/_app.tsx",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("flowbite/plugin")],
};
