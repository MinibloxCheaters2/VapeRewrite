/**
 * Hooks into Webpack to get a webpack require instance.
 * It'd be probably a bit harder for me if I had to do it without the thing being exposed
 * @module
 */

import { expose } from "@vape/core/exposed";

type ModuleID = string | number;

interface WebpackRequire {
	(moduleId: ModuleID): any;

	m: Record<ModuleID, any>;
	c?: Record<ModuleID, any>;

	amdD?: (...args: any[]) => any;
	amdO?: any;
	O?: (...args: any[]) => any;
	n?: (module: any) => any;
	t?: (value: any, mode?: number) => any;
	d?: (exports: any, definition: any) => void;
	e?: (chunkId: string | number) => Promise<void>;
	u?: (chunkId: string | number) => string;
	miniCssF?: (chunkId: string | number) => string;
	g?: any;
	o?: (obj: any, prop: PropertyKey) => boolean;
	l?: (...args: any[]) => any;
	r?: (exports: any) => void;
	nmd?: (module: any) => any;
	p?: string;
}

type WebpackChunk = [
	chunkIds: Array<ModuleID>,
	modules: Record<ModuleID, WebpackModule>,
	runtime?: (require: WebpackRequire) => void,
];

type WebpackModule = (
	module: { exports: unknown },
	exports: unknown,
	require: WebpackRequire,
) => void;

type WebpackChunkArray = Omit<Array<WebpackChunk>, "push"> & {
	push(
		chunk: [
			ids: ModuleID[],
			modules: Record<number, (require: WebpackRequire) => void>,
			fn: (require: WebpackRequire) => void,
		],
	): void;
};

function findWebpackChunk(): WebpackChunkArray {
	const ignored = Object.keys(window);
	const allEntries = Object.entries(unsafeWindow);
	const ourEntries = allEntries.filter(([k]) => !ignored.includes(k));
	const webpackChunks = ourEntries.find(([, v]) => {
		return typeof v === "object" && Array.isArray(v);
	})[1];
	return webpackChunks as unknown as WebpackChunkArray;
}

export const webpackChunk = findWebpackChunk();
expose("chunk", () => webpackChunk);

export let webpackRequire: WebpackRequire;

const n = crypto.randomUUID();

webpackChunk.push([
	[n],
	{},
	(req) => {
		webpackRequire = req;
		expose("require", () => webpackRequire);
	},
]);
const i = webpackChunk.findIndex((x) => x[0].length === 1 && x[0][0] === n);
if (i !== -1) webpackChunk.splice(i, 1);
