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
        teal: {
          DEFAULT: "#2A9D8F",
          light: "#E8F5F3",
        },
        gold: "#FFD700",
        silver: "#C0C0C0",
        bronze: "#CD7F32",
        navy: {
          DEFAULT: "#0F1F2E",
          dark: "#0A1628",
        },
        paper: "#F7F5F0",
        slate: "#4A6572",
        correct: "#22C55E",
        wrong: "#EF4444",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      transitionDuration: {
        DEFAULT: "300ms",
      },
    },
  },
  plugins: [],
};
export default config;
