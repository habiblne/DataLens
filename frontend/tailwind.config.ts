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
        glow: "0 0 50px -10px rgba(16, 185, 129, 0.2)",
        "glow-lg": "0 0 60px -5px rgba(16, 185, 129, 0.25)",
        soft: "0 10px 30px -10px rgba(0, 0, 0, 0.5)",
        card: "0 0 0 1px rgba(255, 255, 255, 0.08), 0 8px 24px -4px rgba(0, 0, 0, 0.6)",
        "card-hover": "0 0 0 1px rgba(255, 255, 255, 0.16), 0 12px 32px -4px rgba(0, 0, 0, 0.7)",
        "inner-specular": "inset 0 1px 0 0 rgba(255, 255, 255, 0.1)"
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
