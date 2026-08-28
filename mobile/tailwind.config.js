/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.tsx", "./src/**/*.{js,jsx,ts,tsx}", "./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: "#1A153B",
        "navy-light": "#25204D",
        "navy-muted": "#2E2960",
        indigoText: "#4338CA",
      },
      borderRadius: {
        card: "16px",
      },
    },
  },
  plugins: [],
};
