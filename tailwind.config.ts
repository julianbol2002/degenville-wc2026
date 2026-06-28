import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: "#0F1F2E",
        paper: "#F7F5F0",
        teal: {
          DEFAULT: "#2A9D8F",
          light: "#E8F5F3",
        },
        slate: "#4A6572",
        gold: "#FFD700",
        silver: "#C0C0C0",
        bronze: "#CD7F32",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
