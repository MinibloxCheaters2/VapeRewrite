/**
 * Reused from Trollium V4 because I wrote it and I'm lazy, so why not reuse it?
 * @module
 */
import { transform } from "lightningcss";
import type { CustomAtRules, TransformOptions } from "lightningcss";
import type { Plugin } from "rolldown";
import { withFilter } from "rolldown/filter";

function plugin<C extends CustomAtRules>(opts?: TransformOptions<C>): Plugin {
	return withFilter(
		{
			name: "css-minify",
			transform: {
				filter: { id: "**/*.css" },
				handler(code, id) {
					const [e, d] = [new TextEncoder(), new TextDecoder()];
					const result = transform({
						sourceMap: true,
						filename: id,
						minify: true,
						code: e.encode(code),
						...opts,
					});
					return {
						code: d.decode(result.code), map: result.map
							? d.decode(result.map)
							: undefined,
						moduleType: "text"
					};
				},
			},
		},
		{
			load: { id: ["*.css"] },
		},
	);
}
export default plugin;
