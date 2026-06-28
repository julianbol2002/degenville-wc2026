import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        card: "var(--card)",
        border: "var(--border)",
        primary: "var(--text-primary)",
        secondary: "var(--text-secondary)",
        espn: {
          red: "#CC0000",
          "red-dark": "#990000",
          black: "#000000",
          gray: "#666666",
        },
        accent: "var(--accent)",
        correct: "#008248",
        wrong: "#CC0000",
        navy: {
          DEFAULT: "#000000",
          dark: "#0D0D0D",
        },
        paper: "#F5F5F5",
        slate: "#666666",
        gold: "#CC0000",
        silver: "#666666",
        bronze: "#999999",
        teal: {
          DEFAULT: "#CC0000",
          light: "#FFE5E5",
        },
      },
      fontFamily: {
        sans: ["Roboto Condensed", "system-ui", "sans-serif"],
        display: ["Oswald", "Roboto Condensed", "sans-serif"],
      },
      transitionDuration: {
        DEFAULT: "300ms",
      },
    },
  },
  plugins: [],
};
export default config;
