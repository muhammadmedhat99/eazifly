// tailwind.config.js
const { heroui } = require("@heroui/react");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  plugins: [
    heroui({
      themes: {
        light: {
          colors: {
            background: "#F8F9FA",
            foreground: "#0a0a0a",
            primary: "#2563EB",
            danger: "#EF4444",
            success: "#0A9C71",
            warning: "#E08420",
            stroke: "#E5E7EB",
            main: "#fff",
            light: "#F8F9FA"
          },
        },
        dark: {
          colors: {
            background: "#0a0a0a",
            foreground: "#F8F9FA",
            primary: "#2563EB",
            danger: "#EF4444",
            success: "#0A9C71",
            warning: "#E08420",
            stroke: "1a1a1a",
            main: "#000",
            light: "#0f0f0f"
          },
        },
      },
    }),
  ],
};