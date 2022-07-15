const path = require('path');

module.exports = {
	entry: './src/main.ts',
	output: {
		filename: 'index.js',
		path: path.resolve(__dirname, 'dist'),
		library: 'meteor_wepapp_user_context',
	},
	module: {
		rules: [
			{
				test: /\.ts$/,
				use: 'ts-loader',
				include: [path.resolve(__dirname, 'src')],
			},
		],
	},
	devtool: 'source-map',
	mode: 'production',
};
