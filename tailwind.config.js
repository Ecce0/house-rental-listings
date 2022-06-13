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
		mytheme: {
			info: '#8CCAC1',

			success: '#9CB686',

			warning: '#FFD261',

			error: '#FC9783',
		},
	},
}