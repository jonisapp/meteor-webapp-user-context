const path = require('path');

module.exports = {
	entry: './src/index.ts',
	experiments: {
		outputModule: true,
	},
	output: {
		filename: 'index.js',
		path: path.resolve(__dirname, 'dist'),
		globalObject: 'this',
		library: {
			type: 'module',
		},
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
