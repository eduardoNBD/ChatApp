/** @type {import('tailwindcss').Config} */
export default {
	content: [
		"./index.html",
		"./src/**/*.{js,ts,jsx,tsx,html}",
	],
	mode: 'jit', 
	theme: {
		extend: {},
		screens: {
			'xs': '530px',
			'sm': '758px',
			'md': '960px',
			'lg': '1440px',
		},
	},
	variants: {
		extend: {},
	},
	plugins: [],
}
