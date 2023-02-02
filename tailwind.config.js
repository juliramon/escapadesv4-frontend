const colors = {
	primary: {
		50: "#f2f4f8",
		100: "#e6e9f0",
		200: "#bfc7da",
		300: "#99a6c4",
		400: "#4d6397",
		500: "#00206b",
		600: "#001d60",
		700: "#001850", // color text
		800: "#001340",
		900: "#001034",
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
		50: "#fff8ed",
		100: "#fff0d4",
		200: "#ffdea9",
		300: "#ffbd5e",
		400: "#fea239",
		500: "#fc8413",
		600: "#ed6909",
		700: "#c54f09",
		800: "#9c3e10",
		900: "#7e3510",
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
				13: "13px",
				15: "15px",
				16: "16px",
				base: "17px",
			},
			fontFamily: {
				body: ["Circular", "sans-serif"],
				headings: ["Circular", "sans-serif"],
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
