/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // ── Primary: Forest / Emerald greens ──
        primary: {
          DEFAULT: "#1F4A33",
          50: "#EDF7F2",
          100: "#D0EBE0",
          200: "#A1D7C1",
          300: "#72C3A2",
          400: "#4CB27E",
          500: "#3D8F65", // Base
          600: "#2E6C4C",
          700: "#1F4A33",
          800: "#10271A",
          900: "#093102", // ultra-dark anchor
          950: "#040F01",
        },

        // ── Accent: Electric Lime ──
        lime: {
          DEFAULT: "#ABDD33",
          50: "#F5FBDE",
          100: "#EAF7BC",
          200: "#D5EF79",
          300: "#C0E756",
          400: "#ABDD33", // Base
          500: "#89B128",
          600: "#67851E",
          700: "#455914",
          800: "#232C0A",
          900: "#111602",
        },

        // ── Secondary: True Green ──
        emerald: {
          DEFAULT: "#0C9D61",
          50: "#E6F8F1",
          100: "#C0EDD9",
          200: "#81DBB3",
          300: "#42C98D",
          400: "#0C9D61", // Base
          500: "#097D4E",
          600: "#075E3A",
          700: "#043F27",
          800: "#021F14",
          900: "#010F0A",
        },

        // ── Amber: Warning / Energy ──
        amber: {
          DEFAULT: "#FE9B0E",
          50: "#FFF6E6",
          100: "#FEEABD",
          200: "#FDD57B",
          300: "#FDBF39",
          400: "#FE9B0E", // Base
          500: "#CB7C0B",
          600: "#985D08",
          700: "#663F06",
          800: "#332003",
          900: "#1A1001",
        },

        // ── Danger / Error ──
        danger: {
          DEFAULT: "#F2334A",
          50: "#FEE8EB",
          100: "#FCCDD2",
          200: "#F99BA5",
          300: "#F66978",
          400: "#F2334A", // Base
          500: "#C2293B",
          600: "#911F2C",
          700: "#61141E",
          800: "#300A0F",
          900: "#180507",
        },

        // ── Neutral / Surface ──
        neutral: {
          DEFAULT: "#F4F4F5",
          0: "#FFFFFF",
          50: "#F4F4F5",
          100: "#E4E4E7",
          200: "#D1D1D6",
          300: "#A1A1AA",
          400: "#71717A",
          500: "#52525B",
          600: "#3F3F46",
          700: "#27272A",
          800: "#18181B",
          900: "#09090B",
        },

        // ── Surface aliases ──
        surface: {
          DEFAULT: "#FFFFFF",
          muted: "#F4F4F5",
          subtle: "#E4E4E7",
          dark: "#093102",
        },

        // ── Semantic aliases ──
        success: "#0C9D61",
        warning: "#FE9B0E",
        error: "#F2334A",
        info: "#4CB27E",
      },

      fontFamily: {
        sans: ["'DM Sans'", "ui-sans-serif", "system-ui", "sans-serif"],
        heading: ["'Sora'", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono'", "ui-monospace", "monospace"],
      },

      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "0.875rem" }],
      },

      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },

      boxShadow: {
        sm: "0 2px 8px 0 rgba(61,143,101,0.08)",
        md: "0 4px 20px 0 rgba(61,143,101,0.14)",
        lg: "0 8px 40px 0 rgba(61,143,101,0.20)",
        lime: "0 4px 20px 0 rgba(171,221,51,0.30)",
        "lime-lg": "0 8px 40px 0 rgba(171,221,51,0.25)",
        amber: "0 4px 20px 0 rgba(254,155,14,0.28)",
        danger: "0 4px 20px 0 rgba(242,51,74,0.25)",
        "inner-sm": "inset 0 1px 4px 0 rgba(9,49,2,0.08)",
        glow: "0 0 0 3px rgba(171,221,51,0.35)",
      },

      backgroundImage: {
        "brand-gradient":
          "linear-gradient(135deg, #093102 0%, #3D8F65 60%, #4CB27E 100%)",
        "lime-gradient": "linear-gradient(135deg, #ABDD33 0%, #89B128 100%)",
        "emerald-gradient": "linear-gradient(135deg, #0C9D61 0%, #3D8F65 100%)",
        "dark-gradient": "linear-gradient(180deg, #093102 0%, #1F4A33 100%)",
        "surface-gradient": "linear-gradient(180deg, #FFFFFF 0%, #F4F4F5 100%)",
        "hero-gradient":
          "linear-gradient(135deg, #093102 0%, #3D8F65 45%, #ABDD33 100%)",
        "card-gradient":
          "linear-gradient(145deg, rgba(255,255,255,0.9) 0%, rgba(244,244,245,0.6) 100%)",
      },

      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-in-right": {
          "0%": { opacity: "0", transform: "translateX(24px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "slide-down": {
          "0%": { opacity: "0", transform: "translateY(-8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "pulse-lime": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(171,221,51,0.5)" },
          "50%": { boxShadow: "0 0 0 8px rgba(171,221,51,0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "spin-slow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        progress: {
          "0%": { width: "0%" },
          "100%": { width: "var(--progress-width, 100%)" },
        },
      },

      animation: {
        "fade-up": "fade-up 0.45s ease-out both",
        "fade-in": "fade-in 0.35s ease-out both",
        "slide-in-right": "slide-in-right 0.45s ease-out both",
        "slide-down": "slide-down 0.3s ease-out both",
        "scale-in": "scale-in 0.25s ease-out both",
        "pulse-lime": "pulse-lime 2.2s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
        "spin-slow": "spin-slow 3s linear infinite",
        progress: "progress 0.6s ease-out both",
      },
    },
  },
  plugins: [],
};
