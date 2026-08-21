/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // A floodlit pitch at night: green desaturated almost to black.
        pitch: "#0C1512",
        raised: "#131F1A",
        line: "#24352E",
        chalk: {
          DEFAULT: "#E8EDE9",
          dim: "#7E9088",
        },
        // Semantic, not decorative: gold marks the leader, red marks a
        // deduction (football's own colour for a penalty).
        gold: "#F2B441",
        // Third place. Second needs no token — chalk already reads as silver
        // against the dimmed rows below it.
        bronze: "#B87A4B",
        hit: "#E5544B",
      },
      fontFamily: {
        sans: ["Archivo", "system-ui", "sans-serif"],
        mono: ["'IBM Plex Mono'", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};
