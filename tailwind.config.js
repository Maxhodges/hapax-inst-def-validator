/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{svelte,js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        theme: {
          primary: "var(--color-primary)",
          secondary: "var(--color-secondary)",
          accent: "var(--color-accent)",
          alt1: "var(--color-alt1)",
          alt2: "var(--color-alt2)",
          background: "var(--color-background)",
          text: "var(--color-text)",
        },
        cyberpunk: {
          black: "#050A0E",
          yellow: "#FCEE09",
          red: "#FF003C",
          cyan: "#00F0FF",
          white: "#FAFAFA",
          "black-50": "rgba(4, 10, 14, 0.5)",
          "yellow-50": "rgba(251, 237, 8, 0.5)",
          "red-50": "rgba(255, 0, 59, 0.5)",
          "cyan-50": "rgba(0, 239, 255, 0.5)",
        },
        gray: {
          900: "#050A0E",
          800: "#0A1419",
          700: "#0F1D24",
          600: "#14262F",
          500: "#192F3A",
          400: "#1E3845",
          300: "#234150",
          200: "#284A5B",
          100: "#2D5366",
          50: "#325C71",
        },
        evangelion: {
          green: "#3f6d4e",
          lime: "#8bd450",
          purple: "#965fd4",
          darkPurple: "#734f9a",
          background: "#1d1a2f",
        },
      },

      backgroundImage: {
        "cyber-grid": `
          linear-gradient(45deg, rgba(0, 240, 255, 0.05) 25%, transparent 25%),
          linear-gradient(-45deg, rgba(0, 240, 255, 0.05) 25%, transparent 25%),
          linear-gradient(45deg, transparent 75%, rgba(0, 240, 255, 0.05) 75%),
          linear-gradient(-45deg, transparent 75%, rgba(0, 240, 255, 0.05) 75%)
        `,
        "eva-grid": `
        linear-gradient(to right, rgba(139, 212, 80, 0.03) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(139, 212, 80, 0.03) 1px, transparent 1px)
      `,

        // EVA Hex Pattern - inspired by EVA unit armor panels
        "eva-hex": `
        radial-gradient(circle farthest-side at 0% 50%, rgba(150, 95, 212, 0.07) 23.5%, rgba(240, 240, 240, 0.001) 0),
        radial-gradient(circle farthest-side at 5.2% 34.7%, rgba(150, 95, 212, 0.07) 8%, rgba(240, 240, 240, 0.001) 0),
        radial-gradient(circle farthest-side at 2.4% 13.2%, rgba(150, 95, 212, 0.07) 8%, rgba(240, 240, 240, 0.001) 0)
      `,

        // Terminal Scan - inspired by NERV computer displays
        "eva-scan": `
        linear-gradient(to bottom,
          transparent 50%,
          rgba(139, 212, 80, 0.03) 50%,
          rgba(139, 212, 80, 0.03) 51%,
          transparent 51%
        )
      `,

        // NERV Pattern - inspired by the NERV logo and angular designs
        "eva-nerv": `
        linear-gradient(60deg, rgba(150, 95, 212, 0.05) 25%, transparent 25.5%, transparent 75%, rgba(150, 95, 212, 0.05) 75.5%),
        linear-gradient(-60deg, rgba(139, 212, 80, 0.05) 25%, transparent 25.5%, transparent 75%, rgba(139, 212, 80, 0.05) 75.5%)
      `,

        // Circuit Pattern - inspired by MAGI system displays
        "eva-circuit": `
        linear-gradient(to right, rgba(139, 212, 80, 0.03) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(139, 212, 80, 0.03) 1px, transparent 1px),
        radial-gradient(circle at center, rgba(150, 95, 212, 0.05) 2px, transparent 2px)
      `,
      },

      keyframes: {
        glitch: {
          "0%": { transform: "translate(0)" },
          "20%": { transform: "translate(-2px, 2px)" },
          "40%": { transform: "translate(-2px, -2px)" },
          "60%": { transform: "translate(2px, 2px)" },
          "80%": { transform: "translate(2px, -2px)" },
          "100%": { transform: "translate(0)" },
        },
      },
      animation: {
        glitch: "glitch 1s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
