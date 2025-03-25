/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      animation: {
        "bounce-once": "bounce 1s ease-in-out 1",
      },
    },
  },
  plugins: [],
}
