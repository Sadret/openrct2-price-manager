import typescript from "@rollup/plugin-typescript";
import {
	terser
} from "rollup-plugin-terser";

export default {
	input: "./src/main.ts",
	output: {
		format: "iife",
		file: "./build/openrct2-price-manager-1.1.4.js",
	},
	plugins: [
		typescript(),
		terser({
			format: {
				preamble: "// Copyright (c) 2025 Sadret",
			},
		}),
	],
};
