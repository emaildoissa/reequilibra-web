/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                premium: {
                    50: "#fafafa",
                    100: "#f4f4f5",
                    200: "#e4e4e7",
                    300: "#d4d4d8",
                    400: "#a1a1aa",
                    500: "#71717a",
                    600: "#52525b",
                    700: "#3f3f46",
                    800: "#27272a",
                    900: "#18181b",
                    950: "#09090b",
                },
                brand: {
                    50: "#eef2ff",
                    100: "#e0e7ff",
                    200: "#c7d2fe",
                    300: "#a5b4fc",
                    400: "#6366f1",
                    500: "#635bff",
                    600: "#4f46e5",
                    700: "#4338ca",
                    800: "#3730a3",
                    900: "#312e81",
                    950: "#1e1b4b",
                },
                accent: {
                    pink: "#f472b6",
                    violet: "#a78bfa",
                    sky: "#38bdf8",
                    emerald: "#34d399",
                    amber: "#fbbf24",
                    rose: "#fb7185",
                },
                surface: {
                    primary: "#09090b",
                    secondary: "#12121a",
                    tertiary: "#1c1c24",
                    card: "#18181b",
                    elevated: "#1f1f23",
                },
                border: {
                    DEFAULT: "#2a2a35",
                    light: "#3f3f46",
                },
                glass: {
                    light: "rgba(255, 255, 255, 0.05)",
                    medium: "rgba(255, 255, 255, 0.08)",
                    border: "rgba(255, 255, 255, 0.1)",
                }
            },
            fontFamily: {
                sans: ["Inter", "system-ui", "sans-serif"],
                display: ["Inter", "sans-serif"],
                mono: ["JetBrains Mono", "monospace"],
            },
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
                "premium-gradient": "linear-gradient(135deg, #635bff 0%, #8b5cf6 50%, #ec4899 100%)",
                "glow-brand": "linear-gradient(135deg, rgba(99, 91, 255, 0.3) 0%, rgba(139, 92, 246, 0.1) 100%)",
            },
            boxShadow: {
                glow: "0 0 40px rgba(99, 91, 255, 0.15)",
                "glow-lg": "0 0 60px rgba(99, 91, 255, 0.25)",
                "glow-sm": "0 0 20px rgba(99, 91, 255, 0.1)",
                card: "0 4px 24px rgba(0, 0, 0, 0.3)",
                "inner-glow": "inset 0 1px 0 rgba(255, 255, 255, 0.05)",
            },
            backdropBlur: {
                xs: "2px",
            },
            animation: {
                "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
                "fade-in": "fadeIn 0.5s ease-out",
                "slide-up": "slideUp 0.5s ease-out",
                "scale-in": "scaleIn 0.3s ease-out",
            },
            keyframes: {
                fadeIn: {
                    "0%": { opacity: "0" },
                    "100%": { opacity: "1" },
                },
                slideUp: {
                    "0%": { opacity: "0", transform: "translateY(10px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                },
                scaleIn: {
                    "0%": { opacity: "0", transform: "scale(0.95)" },
                    "100%": { opacity: "1", transform: "scale(1)" },
                },
            },
            borderRadius: {
                xl: "1rem",
                "2xl": "1.25rem",
                "3xl": "1.5rem",
            },
        },
    },
    plugins: [],
}