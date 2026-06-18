import { Plugin } from "rolldown";

export default function inlineCSS(): Plugin {
	return {
		name: "css-inline",
		transform: {
			filter: {
				moduleType: ["css"],
			},
			order: "post",
			handler(code) {
				return {
					code: `export default ${JSON.stringify(code)};`,
					moduleType: "js",
				};
			},
		},
	};
}
