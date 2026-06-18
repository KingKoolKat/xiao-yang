import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        garden: {
          ivory: "#FFFDF6",
          parchment: "#F7F0DC",
          dew: "#F1F8EA",
          cream: "#E8D9BA",
          seed: "#D9B978",
          leaf: "#BFDDA7",
          sprout: "#7DB866",
          moss: "#2F6B45",
          clay: "#B85C3B",
          blossom: "#F3B8C3",
          petal: "#F9DCE3",
          pond: "#B7D9CF",
          cocoa: "#4A342A",
          taupe: "#766456",
          mist: "#EEF3E4"
        }
      },
      fontFamily: {
        sans: ["var(--font-body)", "Nunito Sans", "system-ui", "sans-serif"],
        hand: ["var(--font-hand)", "LXGW WenKai TC", "serif"]
      },
      boxShadow: {
        soft: "0 12px 30px rgba(47, 107, 69, 0.12)"
      }
    }
  },
  plugins: []
};

export default config;
