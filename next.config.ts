const { heroui } = require("@heroui/react");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {

      },
    },
  },
  darkMode: "class",
  plugins: [
    heroui({
      themes: {
        light: {
          colors: {
            background: "#F6F8FB",
            foreground: "#141516f5",
            primary: "#0078D4",
            danger: "#ff5555",
          },
        },
        dark: {
          colors: {
            background: "#141516f5",
            foreground: "#E5E7EB",
            primary: "#0078D4",
            danger: "#ff5555",
          },
        },
      },
    }),
  ],
};
