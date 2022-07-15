const path = require('path');

module.exports = {
	entry: './src/main.js',
	output: {
		filename: 'index.js',
		path: path.resolve(__dirname, 'dist'),
		library: 'meteor_wepapp_user_context',
	},
	mode: 'production',
};
