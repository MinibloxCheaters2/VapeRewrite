import babelPlugin from "@rollup/plugin-babel";
import commonjsPlugin from "@rollup/plugin-commonjs";
import jsonPlugin from "@rollup/plugin-json";
import resolvePlugin from "@rollup/plugin-node-resolve";
import replacePlugin from "@rollup/plugin-replace";
import terser from "@rollup/plugin-terser";
import { isAbsolute, relative, resolve } from "path";
import { readPackageUp } from "read-package-up";
import { defineConfig } from "rollup";
import postcssPlugin from "rollup-plugin-postcss";
import userscript from "rollup-plugin-userscript";
import obfuscator from 'rollup-plugin-obfuscator';

const { packageJson } = await readPackageUp();
const extensions = [".ts", ".tsx", ".mjs", ".js", ".jsx"];

export default defineConfig(
  Object.entries({
    "vape-rewrite": "src/vape-rewrite/index.ts",
  }).map(([name, entry]) => ({
    input: entry,
    plugins: [
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
              version: "^7.5.0", // see https://github.com/babel/babel/issues/10261#issuecomment-514687857
            },
          ],
        ],
        exclude: "node_modules/**",
        extensions,
      }),
      replacePlugin({
        values: {
          "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
        },
        preventAssignment: true,
      }),
      resolvePlugin({ browser: false, extensions }),
      commonjsPlugin(),
      jsonPlugin(),
      process.env.NODE_ENV === "production"
        ? terser({ ecma: 2020, ie8: false })
        : undefined,
      process.env.NODE_ENV === "obfusproduction"
        ? obfuscator({
          exclude: /solid-js|@violentmonkey/,

            options:{
              compact: true,
              controlFlowFlattening: true,
              controlFlowFlatteningThreshold: 0.6,
              numbersToExpressions: true,
              deadCodeInjection: true,
              deadCodeInjectionThreshold: 0.05,
              simplify: false,
              selfDefending: false,
              target: 'browser',
              stringArray: true,
              stringArrayThreshold: 0.5,
              stringArrayWrappersParametersMaxCount: 2,
              stringArrayWrappersChainedCalls: true,
              stringArrayShuffle: true,
              stringArrayIndexShift: true,
              renameGlobals: false,
              debugProtection: false,
              stringArrayRotate: true
            }
        })
        : undefined,
      userscript((meta) => {
        const newMeta = meta
          .replace("process.env.AUTHOR", packageJson.author.name)
          .replace("process.env.VERSION", packageJson.version);
        return newMeta;
      }),
    ],
    external: defineExternal([
      "@violentmonkey/ui",
      "@violentmonkey/dom",
    ]),
    output: {
      format: "iife",
      file: `dist/${name}.user.js`,
      globals: {
        "@violentmonkey/dom": "VM",
        "@violentmonkey/ui": "VM",
      },
      indent: false,
    },
  })),
);

function defineExternal(externals) {
  return (id) =>
    externals.some((pattern) => {
      if (typeof pattern === "function") return pattern(id);
      if (pattern && typeof pattern.test === "function") {
        return pattern.test(id);
      }
      if (isAbsolute(pattern)) {
        return !relative(pattern, resolve(id)).startsWith("..");
      }
      return id === pattern || id.startsWith(pattern + "/");
    });
}
