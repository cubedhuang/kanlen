const defaultTheme = require('tailwindcss/defaultTheme');
const plugin = require('tailwindcss/plugin');

/** @type {import('tailwindcss').Config}*/
const config = {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			fontFamily: {
				sans: ['Inter', ...defaultTheme.fontFamily.sans],
				display: ["'Crimson Pro'", ...defaultTheme.fontFamily.serif]
			}
		}
	},

	plugins: [
		plugin(({ addVariant }) => {
			addVariant('hocus', ['&:hover', '&:focus']);
			addVariant('hocus-visible', ['&:hover', '&:focus-visible']);
		})
	]
};

module.exports = config;
