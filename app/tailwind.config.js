/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
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
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
          foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
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
        // Warm editorial palette
        cream: '#f5f1ed',
        'warm-gray': '#3a3430',
        'warm-border': '#4a4440',
        'card-bg': '#1a1a1a',
        canvas: '#0a0a0a',
        'warm-orange': '#ff7043',
        gold: '#c9a961',
      },
      fontFamily: {
        serif: ["'Playfair Display'", 'var(--font-serif)', 'serif'],
        sans: ["'Inter'", 'var(--font-body)', 'sans-serif'],
        mono: ["'JetBrains Mono'", 'var(--font-mono)', 'monospace'],
      },
      fontSize: {
        'h1': ['clamp(2.7rem, 6.5vw, 4.8rem)', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        'h2': ['clamp(2rem, 4.5vw, 3.15rem)', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        'h3': ['clamp(1.35rem, 3.2vw, 2.25rem)', { lineHeight: '1.1', letterSpacing: '-0.01em' }],
        'h4': ['2.5rem', { lineHeight: '1.1' }],
        'h5': ['1.5rem', { lineHeight: '1.2' }],
        'h6': ['1.25rem', { lineHeight: '1.3' }],
        'small': ['0.875rem', { lineHeight: '1.5' }],
        'xs': ['0.75rem', { lineHeight: '1.5' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
      },
      borderRadius: {
        xl: "calc(var(--radius) + 4px)",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xs: "calc(var(--radius) - 6px)",
      },
      boxShadow: {
        xs: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        'warm-glow': '0 0 24px rgba(255, 112, 67, 0.15)',
        'warm-glow-lg': '0 0 40px rgba(255, 112, 67, 0.25)',
        'gold-glow': '0 0 20px rgba(201, 169, 97, 0.15)',
        'card-hover': '0 8px 24px rgba(0, 0, 0, 0.6)',
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
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(15%)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          from: { transform: "scale(1.2) translate3d(42vw, 30vh, 0)" },
          to: { transform: "scale(1) translate3d(0, 0, 0)" },
        },
        "hero-reveal": {
          "0%": {
            opacity: "0",
            transform: "scale(1.1)",
          },
          "100%": {
            opacity: "1",
            transform: "scale(1)",
          },
        },
        "text-slide-out": {
          from: { transform: "translateY(0)" },
          to: { transform: "translateY(-150%)" },
        },
        "text-slide-in": {
          from: { transform: "translateY(150%)" },
          to: { transform: "translateY(0)" },
        },
        "slide-in-right": {
          from: { transform: "translateX(100%)", opacity: "0" },
          to: { transform: "translateX(0)", opacity: "1" },
        },
        "spin-slow": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 24px rgba(255, 112, 67, 0.15)" },
          "50%": { boxShadow: "0 0 40px rgba(255, 112, 67, 0.25)" },
        },
        "subtle-float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-4px)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "caret-blink": "caret-blink 1.25s ease-out infinite",
        "fade-in": "fade-in 0.8s cubic-bezier(0.165, 0.840, 0.440, 1) forwards",
        "fade-up": "fade-up 0.8s cubic-bezier(0.165, 0.840, 0.440, 1) forwards",
        "slide-up": "slide-up 0.8s cubic-bezier(0.165, 0.840, 0.440, 1) forwards",
        "scale-in": "scale-in 1.8s cubic-bezier(0.215, 0.610, 0.355, 1) forwards",
        "hero-reveal": "hero-reveal 1.8s cubic-bezier(0.215, 0.610, 0.355, 1) forwards",
        "text-slide-out": "text-slide-out 0.35s cubic-bezier(0.250, 0.460, 0.450, 0.940) forwards",
        "text-slide-in": "text-slide-in 0.35s cubic-bezier(0.250, 0.460, 0.450, 0.940) forwards",
        "slide-in-right": "slide-in-right 0.5s cubic-bezier(0.215, 0.610, 0.355, 1) forwards",
        "spin-slow": "spin-slow 20s linear infinite",
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
        "subtle-float": "subtle-float 3s ease-in-out infinite",
      },
      transitionTimingFunction: {
        'out-quad': 'cubic-bezier(0.250, 0.460, 0.450, 0.940)',
        'out-cubic': 'cubic-bezier(0.215, 0.610, 0.355, 1)',
        'out-quart': 'cubic-bezier(0.165, 0.840, 0.440, 1)',
        'out-circ': 'cubic-bezier(0.075, 0.820, 0.165, 1)',
        'in-out-quad': 'cubic-bezier(0.455, 0.030, 0.515, 0.955)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
