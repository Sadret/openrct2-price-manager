import typescript from "@rollup/plugin-typescript";

export default {
	input: "./src/main.ts",
	output: {
		format: "iife",
		file: "./build/openrct2-price-manager-develop.js",
	},
	plugins: [
		typescript(),
	],
};
