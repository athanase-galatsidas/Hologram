module.exports = {
	darkMode: 'media', // or 'class'
	content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
	theme: {
		extend: {
			spacing: {
				128: '32rem',
			},
		},
	},
	variants: {
		extend: {},
	},
	plugins: [],
};
