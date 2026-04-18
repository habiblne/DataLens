import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      boxShadow: {
        glow: "0 24px 80px rgba(16, 185, 129, 0.18)",
        soft: "0 18px 50px rgba(0, 0, 0, 0.28)"
      },
      colors: {
        ink: "#f8fafc",
        mist: "#0f172a"
      }
    }
  },
  plugins: []
};

export default config;
