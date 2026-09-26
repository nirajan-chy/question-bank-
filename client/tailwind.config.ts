import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

/**
 * Every colour resolves through a CSS custom property so light/dark themes
 * (and any future rebrand) only need to change `styles/globals.css`.
 * If you find yourself typing a raw palette class in a component, it belongs
 * in a token here instead.
 */
const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./features/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./services/**/*.{ts,tsx}",
    "./store/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: "1rem", sm: "1.5rem", lg: "2rem" },
      screens: { "2xl": "1280px" },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          soft: "hsl(var(--primary) / 0.12)",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        info: {
          DEFAULT: "hsl(var(--info))",
          foreground: "hsl(var(--info-foreground))",
        },
        /** Warm secondary brand used for high-emphasis calls to action. */
        cta: {
          DEFAULT: "hsl(var(--cta))",
          foreground: "hsl(var(--cta-foreground))",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "0.875rem" }],
      },
      borderRadius: {
        sm: "calc(var(--radius) - 4px)",
        md: "calc(var(--radius) - 2px)",
        lg: "var(--radius)",
        xl: "calc(var(--radius) + 4px)",
        "2xl": "calc(var(--radius) + 10px)",
        "3xl": "calc(var(--radius) + 20px)",
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
        "fade-up": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-up": "fade-up 0.4s ease-out both",
        float: "float 6s ease-in-out infinite",
        shimmer: "shimmer 2s infinite",
      },
      backgroundImage: {
        "brand-gradient":
          "linear-gradient(135deg, hsl(var(--brand-from)), hsl(var(--brand-to)))",
        "brand-soft":
          "linear-gradient(135deg, hsl(var(--primary) / 0.12), hsl(var(--primary) / 0.04))",
        "cta-gradient":
          "linear-gradient(135deg, hsl(var(--cta)), hsl(var(--cta) / 0.85))",
        "mesh-light": `radial-gradient(at 12% -10%, hsl(var(--primary) / 0.10) 0px, transparent 55%),
          radial-gradient(at 88% 110%, hsl(var(--cta) / 0.07) 0px, transparent 55%)`,
        "mesh-dark": `radial-gradient(at 12% -10%, hsl(var(--primary) / 0.16) 0px, transparent 55%),
          radial-gradient(at 88% 110%, hsl(var(--cta) / 0.10) 0px, transparent 55%)`,
        "grid-pattern":
          "linear-gradient(to right, hsl(var(--border) / 0.7) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--border) / 0.7) 1px, transparent 1px)",
      },
      boxShadow: {
        card: "0 1px 2px 0 hsl(var(--shadow-color) / 0.06), 0 1px 3px 0 hsl(var(--shadow-color) / 0.05)",
        "card-hover":
          "0 4px 12px -2px hsl(var(--shadow-color) / 0.10), 0 16px 32px -12px hsl(var(--shadow-color) / 0.12)",
        "card-inset": "inset 0 1px 0 0 hsl(var(--shadow-color) / 0.04)",
        glow: "0 0 0 1px hsl(var(--primary) / 0.10), 0 8px 28px -12px hsl(var(--primary) / 0.40)",
        "glow-sm": "0 0 0 1px hsl(var(--primary) / 0.08), 0 4px 14px -8px hsl(var(--primary) / 0.35)",
      },
    },
  },
  plugins: [animate],
};

export default config;
