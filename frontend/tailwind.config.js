/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        umsu: {
          canvas: "var(--color-bg-canvas)",
          surface: "var(--color-bg-surface)",
          elevated: "var(--color-bg-elevated)",
          border: "var(--color-border)",
          gold: "#facc15",
          royal: "#3b82f6",
          orange: "#f59e0b",
          emerald: "#10b981",
          rose: "#f43f5e",
        },
        slate: {
          50: "var(--color-bg-canvas)",
          100: "var(--color-text-100)",
          200: "var(--color-text-200)",
          300: "var(--color-text-300)",
          400: "var(--color-text-400)",
          500: "var(--color-text-500)",
          900: "var(--color-bg-slate-900)",
          950: "var(--color-bg-slate-950)",
        }
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "Inter", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      }
    },
  },
  plugins: [],
}
