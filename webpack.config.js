const path = require("path");
module.exports = {
	mode: "development",
	devtool: "source-map",
	entry: "./src/index.js",
	output: {
		filename: "bundle.js",
		path: path.resolve(__dirname, "dist")
	},
	module: {
		rules: [
			{
				test: /\.m?js$/,
				use: {
					loader: "babel-loader",
					options: {
						presets: ["@babel/preset-env"]
					}
				}
			}
		]
	},
	resolve: {
		extensions: [".js"]
	},
	watchOptions: {
		poll: true,
		ignored: /node_modules/
	}
};
