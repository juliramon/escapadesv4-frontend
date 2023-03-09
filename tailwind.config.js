const colors = {
	primary: {
		50: "#f2f3f6",
		100: "#ccd1dc",
		200: "#99a3b9",
		300: "#667496",
		400: "#334673",
		500: "#001850", // color text
		600: "#001340",
		700: "#000e30",
		800: "#000a20",
		900: "#000510",
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
