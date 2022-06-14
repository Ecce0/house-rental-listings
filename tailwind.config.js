module.exports = {
	content: ['./src/**/*.{js,jsx,ts,tsx}'],
	theme: {
		extend: {},
	},
	plugins: [require('daisyui')],
	daisyui: {
		styled: true,
		themes: ['luxury'],
		base: true,
		utils: true,
		logs: true,
		rtl: false,
		prefix: '',
	},
	themes: {
		
	},
}