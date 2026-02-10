import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
  darkMode: "class",
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ['var(--font-open-sans)', 'Open Sans', 'sans-serif'],
        heading: ['var(--font-poppins)', 'Poppins', 'sans-serif'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        success: {
          DEFAULT: "var(--success)",
        },
        warning: {
          DEFAULT: "var(--warning)",
        },
        error: {
          DEFAULT: "var(--error)",
        },
        surface: {
          DEFAULT: "#1A1A1A",
          light: "#222222",
          dark: "#141414",
        },
        text: {
          main: "#FFFFFF",
          muted: "#A3A3A3",
          subtle: "#666666",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        'neu-outset': '6px 6px 12px rgba(0, 0, 0, 0.7), -4px -4px 10px rgba(60, 60, 60, 0.15)',
        'neu-inset': 'inset 4px 4px 8px rgba(0, 0, 0, 0.6), inset -3px -3px 6px rgba(60, 60, 60, 0.1)',
        'neu-soft': '4px 4px 8px rgba(0, 0, 0, 0.5), -3px -3px 6px rgba(50, 50, 50, 0.12)',
        'neu-pressed': 'inset 2px 2px 5px rgba(0, 0, 0, 0.6), inset -2px -2px 4px rgba(50, 50, 50, 0.08)',
        'glow-primary': '0 0 20px -5px rgba(16, 185, 129, 0.4)',
        'glow-accent': '0 0 20px -5px rgba(59, 130, 246, 0.4)',
        'glow-warm': '0 0 20px -5px rgba(245, 158, 11, 0.4)',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [tailwindcssAnimate],
};

export default config;
