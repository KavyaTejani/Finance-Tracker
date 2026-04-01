/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        "bg-primary":  "#1a1a1a",
        "bg-card":     "#242424",
        "bg-elevated": "#2e2e2e",
        "accent-red":  "#e85d5d",
        "accent-blue": "#4a90d9",
        "border-dark": "#333333",
      },
    },
  },
  plugins: [],
};