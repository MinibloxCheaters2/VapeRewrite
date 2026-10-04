declare module "*.module.css" {
	export const stylesheet: string;
	const classMap: {
		[key: string]: string;
	};
	export default classMap;
}

declare module "*.css" {
	/**
	 * Generated CSS
	 */
	const css: string;
	export default css;
}

declare module "*?userscript-metadata";
