/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        navy: '#1A153B',
        'navy-light': '#25204D',
        'navy-muted': '#2E2960',
      },
      borderRadius: { card: '16px' },
    },
  },
  plugins: [],
};
