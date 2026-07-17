import { DumpKey } from "./dump";

function isIndexPath(pathname: string): boolean {
	return pathname.startsWith("/assets/index-") && pathname.endsWith(".js");
}

function isIndexScript(script: HTMLScriptElement): boolean {
	const { src } = script;
	if (src.length <= 17 /*length of /assets/index- + length of .js*/)
		return false;
	if (script.type !== "module" || script.crossOrigin !== "anonymous")
		return false;
	try {
		return isIndexPath(new URL(src).pathname);
	} catch {
		return false;
	}
}

export const MATCHED_DUMPS = {} as Record<DumpKey, string>;
export let gameScript: string;

async function init() {
	const scriptEl = Object.values(document.scripts).find((script) =>
		isIndexScript(script),
	);
	if (scriptEl?.src) {
		const res = await fetch(scriptEl.src);
		gameScript = await res.text();
	}
}
export const gameScriptReady = init();
