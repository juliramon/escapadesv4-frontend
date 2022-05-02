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
        primary: {
          100: "#6376a0",
          200: "#002b8f",
          300: "#00206b",
        },
        secondary: {
          100: "#ffffff",
          200: "#f2f7f9",
          300: "#ebf1ff",
        },
        tertiary: {
          100: "#fd8281",
        },
      },
      fontFamily: {
        sans: ["Inter"],
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
