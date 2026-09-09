import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "mv-primary": "#1A56DB",
        "mv-primary-dark": "#1648C0",
        "mv-navy": "#0F2C6B",
        "mv-navy-deep": "#0A2558",
        "mv-accent-sky": "#7EB3FF",
        "mv-red": "#DC2626",
        "mv-red-dark": "#B91C1C",
        "mv-bg": "#F8FAFF",
        "mv-text": "#111827",
        "mv-muted": "#6B7280",
        "mv-border": "#E5E7EB",
        "mv-blue-light": "#EBF2FF",
      },
      fontFamily: {
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
        heading: ["var(--font-heading)", "var(--font-body)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl: "var(--mv-radius-xl, 12px)",
      },
    },
  },
  plugins: [],
};

export default config;
