import { heroui } from '@heroui/react'

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {

    },
  },
  darkMode: "class",
  plugins: [heroui({
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
          title: "#3D5066",
          input: "#F0F0F0"
        }
      },
      dark: {
        colors: {
          background: "#0a0a0a",
          foreground: "#F8F9FA",
          primary: "#2563EB",
          danger: "#EF4444",
          success: "#0A9C71",
          warning: "#E08420",
          stroke: "#1a1a1a",
          main: "#000",
          title: "#3D5066",
          input: "#F0F0F0"
        }
      }
    }
  })],
}

module.exports = config;