import babelPlugin from "@rollup/plugin-babel";
import commonjsPlugin from "@rollup/plugin-commonjs";
import jsonPlugin from "@rollup/plugin-json";
import resolvePlugin from "@rollup/plugin-node-resolve";
import replacePlugin from "@rollup/plugin-replace";
import terser from "@rollup/plugin-terser";
import { isAbsolute, relative, resolve } from "node:path";
import { readPackageUp } from "read-package-up";
import { defineConfig, type IsExternal } from "rollup";
import postcssPlugin from "rollup-plugin-postcss";
import userscript from "rollup-plugin-userscript";
import tsconfigPaths from "rollup-plugin-tsconfig-paths";

const {packageJson} = (await readPackageUp())!;
const extensions = [".ts", ".tsx", ".mjs", ".js", ".jsx"];

export default defineConfig(
	{
		input: "src/index.ts",
		plugins: [
			tsconfigPaths(),
			postcssPlugin({
				inject: false,
				minimize: true,
			}),
			babelPlugin({
				// import helpers from '@babel/runtime'
				babelHelpers: "runtime",
				plugins: [
					[
						import.meta.resolve("@babel/plugin-transform-runtime"),
						{
							useESModules: true,
							version: "^7.28.6", // see https://github.com/babel/babel/issues/10261#issuecomment-514687857
						},
					],
				],
				exclude: "node_modules/**",
				extensions,
			}),
			replacePlugin({
				values: {
					"process.env.NODE_ENV": JSON.stringify(
						process.env.NODE_ENV,
					),
				},
				preventAssignment: true,
			}),
			resolvePlugin({ browser: false, extensions }),
			commonjsPlugin(),
			jsonPlugin(),
			process.env.NODE_ENV === "production"
				? terser({ ecma: 2020, ie8: false })
				: undefined,
			userscript((meta) => {
				const newMeta = meta
					.replace("process.env.AUTHOR", packageJson.author?.name ?? "Unspecified")
					.replace("process.env.VERSION", packageJson.version);
				return newMeta;
			}),
		],
		external: defineExternal(["@wq2/ui", "@violentmonkey/dom"]),
		output: {
			format: "iife",
			file: `dist/vape-rewrite.user.js`,
			globals: {
				"@violentmonkey/dom": "VM",
				"@wq2/ui": "VM",
			},
			indent: false,
		},
	}
);

function defineExternal(externals: ((string | ((id: string) => boolean)) | RegExp)[]): IsExternal {
	return (id) =>
		externals.some((pattern) => {
			if (typeof pattern === "function") return pattern(id);
			if (pattern instanceof RegExp) {
				return pattern.test(id);
			}
			if (isAbsolute(pattern)) {
				return !relative(pattern, resolve(id)).startsWith("..");
			}
			return id === pattern || id.startsWith(pattern + "/");
		});
}
