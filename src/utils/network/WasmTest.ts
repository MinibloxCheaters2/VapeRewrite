import { gameScript, gameScriptReady } from "@/hooks/gameScript";
//import { parse } from "@wq2/packet-gen-wasm";
import logger from "../logging/loggers";
import type * as VMModule from "@wq2/packet-gen-wasm";

async function load() {
	const wasmExports = (await import(
		"https://cdn.jsdelivr.net/npm/@wq2/packet-gen-wasm@0.0.1/packet_gen_wasm.js" as "@wq2/packet-gen-wasm"
	)) as typeof VMModule & {
		default: (path?: { module_or_path: string }) => Promise<void>;
	};

	await wasmExports.default({
		module_or_path:
			"https://cdn.jsdelivr.net/npm/@wq2/packet-gen-wasm@0.0.1/packet_gen_wasm_bg.wasm",
	});

	return wasmExports;
}

async function init() {
	await gameScriptReady;
	const wasmExports = await load();
	const result = wasmExports.parse(gameScript);
	logger.info("Parsed game script", result);
	return result;
}

export const ready = init();
