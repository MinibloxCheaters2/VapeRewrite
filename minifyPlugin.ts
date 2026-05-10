import { MinifyOptions, minifySync } from "oxc-minify";
import type { Plugin } from "rolldown";
import { withFilter } from "rolldown/filter";

type Opts = MinifyOptions | undefined | null;

function minifyPlugin(opts?: Opts): Plugin {
	return withFilter(
		{
			name: "oxc-minify",
			renderChunk: {
				order: "pre",
				handler(code, chunk) {
					const result = minifySync(chunk.fileName, code, opts);
					return { code: result.code, map: result.map };
				},
			}
		},
		{
			load: { id: ["*.js", "*.jsx", "*.ts", "*.tsx"] },
		},
	);
}

export default minifyPlugin;
