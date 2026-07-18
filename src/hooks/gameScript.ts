import { expose } from "@/exposed";
import { DumpKey } from "./dump";
import { MAIN_LOGGER as logger } from "@/utils";

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
export let scriptEl: HTMLScriptElement;

async function init() {
	const sc = Object.values(document.scripts).find((script) =>
		isIndexScript(script),
	);
	if (!sc) {
		logger.error("Failed to find game script");
		return;
	}
	scriptEl = sc;
	if (scriptEl?.src) {
		const res = await fetch(scriptEl.src);
		gameScript = await res.text();
	}
	expose("dumps", () => MATCHED_DUMPS);
}
export const gameScriptReady = init();
