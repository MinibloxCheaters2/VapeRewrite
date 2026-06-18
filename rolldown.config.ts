import { readPackageUp } from "read-package-up";
import { defineConfig } from "rolldown";
import userscript from "rolldown-plugin-userscript";
import swc from "@wq2/rolldown-plugin-swc";
import solid from "@wq2/rolldown-plugin-solid-oxc";
import { withFilter } from "rolldown/filter";
import minify from "./minifyPlugin";
import inlineCSS from "./inlineCSS";

const { packageJson } = (await readPackageUp())!;

export const BUILD_DATE = new Date();

// on April 1st, Baby Oil Rewrite. otherwise, Vape Rewrite.
export const REAL_CLIENT_NAME =
	BUILD_DATE.getMonth() === 3 && BUILD_DATE.getDate() === 1
		? ("Baby Oil Rewrite" as const)
		: ("Vape Rewrite" as const);

export default defineConfig({
	input: "src/index.ts",
	plugins: [
		// Babel, ESBuild, and SWC supports 2023-11 decorators
		// ESBuild is written in Go (garbage collector) and Babel is written in JS (not native),
		// I chose SWC.
		withFilter(
			swc({
				jsc: {
					parser: { decorators: true, syntax: "typescript" },
					transform: { decoratorVersion: "2023-11" },
				},
			}),
			// Only run this transform if the file contains a decorator (and if it's a JS or TS file).
			{
				transform: {
					code: "@Subscribe",
					moduleType: ["js", "ts", "jsx", "tsx"],
				},
			},
		),
		withFilter(solid(), {
			transform: { moduleType: ["jsx", "tsx"] },
		}),
		inlineCSS(),
		// this MUST be before UserScript, so the comments from it won't be removed.
		process.env.NODE_ENV === "production" ? minify() : undefined,
		userscript(
			(meta: string) => {
				const newMeta = meta
					.replace(
						"process.env.AUTHOR",
						packageJson.author?.name ?? "Unspecified",
					)
					.replace("process.env.VERSION", packageJson.version)
					.replace("process.env.NAME", REAL_CLIENT_NAME);
				return newMeta;
			},
			{
				threadNumber: 8,
			},
		),
	],
	transform: {
		assumptions: {
			setPublicClassFields: true,
			noDocumentAll: true,
		},
	},
	output: {
		format: "iife",
		file: `dist/vape-rewrite.user.js`,
		minify: false,
		sourcemap: false, // sadly this doesn't work since we broke it with something
	},
	emitAssets: false, // if available in your version
	resolve: {
		tsconfigFilename: "./tsconfig.json",
	},
});
