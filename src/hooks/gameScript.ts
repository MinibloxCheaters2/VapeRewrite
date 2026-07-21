import { CHECK_UNMATCHED_DUMPS } from "@/debugControls";
import { expose } from "@/exposed";
import { MAIN_LOGGER as logger } from "@/utils";
import DUMP_REGEXES, { type DumpKey } from "./dump";

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

function matchDump(
	code: string,
	key: DumpKey,
	regex: RegExp,
): [DumpKey, string | undefined] {
	const matched = code.match(regex);
	return [key, matched?.[1]];
}

async function runDumps(code: string): Promise<void> {
	const entries = Object.entries(DUMP_REGEXES) as [DumpKey, RegExp][];
	const results = await Promise.all(
		entries.map(
			([key, regex]) =>
				new Promise<[DumpKey, string | undefined]>((resolve) =>
					queueMicrotask(() => resolve(matchDump(code, key, regex))),
				),
		),
	);
	for (const [key, value] of results) {
		if (value !== undefined) {
			MATCHED_DUMPS[key] = value;
		} else if (CHECK_UNMATCHED_DUMPS) {
			logger.warn(`Unmatched dump: ${key} with regex`, DUMP_REGEXES[key]);
		}
	}
}

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
		await runDumps(gameScript);
	}
	expose("dumps", () => MATCHED_DUMPS);
}
export const gameScriptReady = init();
