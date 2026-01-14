/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        genesys: {
          orange: "#FF4F1F",
          "orange-dark": "#E54318",
          navy: "#0D1630",
          cream: "#F9F8F5",
        },
      },
    },
  },
  plugins: [],
};
