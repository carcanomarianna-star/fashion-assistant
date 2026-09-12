import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        editorial: {
          50: "#FAF8F5",
          100: "#F5F0E8",
          200: "#EAE0D2",
          300: "#D7C4B0",
          400: "#B99F84",
          500: "#9A7E64",
          600: "#7E634D",
          700: "#634D3C",
          800: "#4B3B2E",
          900: "#32271F",
        },
        formula: {
          red: "#C0392B",
          camel: "#C19A6B",
          navy: "#1B263B",
          pink: "#E8A598",
          cream: "#F5F0E6",
          emerald: "#1B4D3E",
          orange: "#D35400",
          cobalt: "#0047AB",
          denim: "#4A6FA5",
          tan: "#D2B48C",
          olive: "#556B2F",
          brown: "#5C4033",
          yellow: "#E5A93C",
          lilac: "#C8A2C8",
          gray: "#708090",
          purple: "#663399",
          white: "#FFFFFF",
          black: "#1A1A1A",
          burgundy: "#800020",
        },
      },
      fontFamily: {
        serif: ["Georgia", "Playfair Display", "serif"],
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.08)',
        'glass-hover': '0 12px 40px 0 rgba(31, 38, 135, 0.15)',
        'editorial': '0 10px 25px -5px rgba(60, 40, 20, 0.06), 0 8px 10px -6px rgba(60, 40, 20, 0.04)',
      },
    },
  },
  plugins: [],
};

export default config;
