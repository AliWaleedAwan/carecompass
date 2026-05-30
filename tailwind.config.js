/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        base: "#0A1411",
        panel: "#0F1C18",
        line: "#22332D",
        fg: "#E9F1EC",
        muted: "#9DB3AB",
        teal: "#2DD4A7",
        "teal-deep": "#0E6B5C",
        emergency: "#FF6B6B",
        urgent: "#F2A33C",
        routine: "#5AA9E6",
        selfcare: "#4FD18B",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};
