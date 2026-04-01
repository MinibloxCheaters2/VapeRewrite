import { isAbsolute, relative, resolve } from "node:path";
import { readPackageUp } from "read-package-up";
import { defineConfig, ExternalOption } from "rolldown";
import userscript from "rolldown-plugin-userscript";
import swc from "rolldown-plugin-swc";
import solid from "@wq2/rolldown-plugin-solid-oxc";
import { withFilter } from "rolldown/filter";

const { packageJson } = (await readPackageUp())!;

export const BUILD_DATE = new Date();

// on April 1st, Baby Oil Rewrite. otherwise, Vape Rewrite.
export const REAL_CLIENT_NAME =
	BUILD_DATE.getMonth() === 3 && BUILD_DATE.getDate() === 1
		? ("Baby Oil Rewrite" as const)
		: ("Vape Rewrite" as const);

export default defineConfig(
	{
		input: "src/index.ts",
		plugins: [
			userscript((meta: string) => {
				const newMeta = meta
					.replace("process.env.AUTHOR", packageJson.author?.name ?? "Unspecified")
					.replace("process.env.VERSION", packageJson.version)
					.replace("process.env.NAME", REAL_CLIENT_NAME);
				return newMeta;
			}, {
				threadNumber: 8
			}),
			// Babel, ESBuild, and SWC supports 2023-11 decorators
			// but babel is slow (single-threaded) and ESBuild is garbage (Golang :puke:)
			// SWC is the option. Can't sadly use
			withFilter(
				swc({
					jsc: {
						parser: { decorators: true, syntax: "typescript" },
						//@ts-expect-error: SWC supports this now
						transform: { decoratorVersion: "2023-11" }
					}
				}),
				// Only run this transform if the file contains a decorator (and if it's a JS or TS file).
				{ transform: { code: "@Subscribe", moduleType: ["js", "ts", "jsx", "tsx"] } }
			),
			withFilter(solid(), {
				transform: { moduleType: ["jsx", "tsx"] }
			})
		],
		transform: {
			assumptions: {
				setPublicClassFields: true,
				noDocumentAll: true
			}
		},
		external: defineExternal(["@violentmonkey/dom"]),
		output: {
			format: "iife",
			file: `dist/vape-rewrite.user.js`,
			globals: {
				"@violentmonkey/dom": "VM",
			},
			minify: process.env.NODE_ENV === "production",
			sourcemap: "inline",
		},
		resolve: {
			tsconfigFilename: "./tsconfig.json"
		}
	}
);

function defineExternal(externals: ((string | ((id: string) => boolean)) | RegExp)[]): ExternalOption {
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
