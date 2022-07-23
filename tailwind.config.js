const colors = {
  primary: {
    100: "#F2F7F9",
    200: "#DAEAEF",
    300: "#E7EBF5",
    400: "#435A8C",
    500: "#00206B",
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
        15: "15px",
        base: "17px",
      },
      fontFamily: {
        body: ["CircularStd", "sans-serif"],
        headings: ["CircularStd", "sans-serif"],
      },
      borderRadius: {
        350: "350px",
      },
      lineHeight: {
        1.1: "1.1",
        12: "3.2",
      },
      minWidth: {
        "1/2": "50%",
      },
      height: {
        "1/2": "50%",
        "50vh": "50vh",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    require("@tailwindcss/aspect-ratio"),
    require("@tailwindcss/line-clamp"),
  ],
};
