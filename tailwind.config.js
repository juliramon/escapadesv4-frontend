const colors = {
  primary: {
    50: "#f8fafc",
    100: "#f1f5f9",
    200: "#e2e8f0",
    300: "#cbd5e1",
    400: "#94a3b8",
    500: "#64748b",
    600: "#475569",
    700: "#334155",
    800: "#1e293b",
    900: "#0f172a",
  },
  secondary: {
    50: "#ffbfa8",
    100: "#ffb59e",
    200: "#ffab94",
    300: "#ffa18a",
    400: "#ff9780",
    500: "#ff8d76",
    600: "#f5836c",
    700: "#eb7962",
    800: "#e16f58",
    900: "#d7654e",
  },
  tertiary: {
    50: "#fffbeb",
    100: "#fef3c7",
    200: "#fde68a",
    300: "#fcd34d",
    400: "#ffc768",
    500: "#fbbf24",
    600: "#d97706",
    700: "#b45309",
    800: "#92400e",
    900: "#78350f",
  },
};

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "false", // or 'media' or 'class'
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
    },
    extend: {
      colors: {
        ...colors,
      },
      fontSize: {
        10: "10px",
        base: "16px",
      },
      fontFamily: {
        body: ["Work Sans", "sans-serif"],
        headings: ["Unna", "serif"],
      },
      borderRadius: {
        350: "350px",
      },
      lineHeight: {
        12: "3.2",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require("@tailwindcss/aspect-ratio")],
};
