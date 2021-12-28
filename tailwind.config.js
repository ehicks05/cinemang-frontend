const colors = require("tailwindcss/colors");

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: "media", // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        "caribbean-green": {
          50: "#f3fefa",
          100: "#e8fdf6",
          200: "#c5fbe8",
          300: "#a1f8d9",
          400: "#5bf2bd",
          500: "#15eda1",
          600: "#13d591",
          700: "#10b279",
          800: "#0d8e61",
          900: "#0a744f",
        },
        gray: colors.neutral,
        blueGray: colors.slate,
      },
      screens: {
        "3xl": "2000px",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require("@tailwindcss/forms"), require("tailwindcss-brand-colors")],
};
