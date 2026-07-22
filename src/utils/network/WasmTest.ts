import type * as VMModule from "@wq2/packet-gen-wasm";
import { gameScript, gameScriptReady } from "@/hooks/gameScript";
import { AnyPacket } from "@wq2/miniblox-sdk";

export let packets = new Map<string, AnyPacket>();

async function load() {
	const wasmExports = (await import(
		"https://cdn.jsdelivr.net/npm/@wq2/packet-gen-wasm@0.0.2/packet_gen_wasm.js" as "@wq2/packet-gen-wasm"
	)) as typeof VMModule & {
		default: (path?: { module_or_path: string }) => Promise<void>;
	};

	await wasmExports.default({
		module_or_path:
			"https://cdn.jsdelivr.net/npm/@wq2/packet-gen-wasm@0.0.2/packet_gen_wasm_bg.wasm",
	});

	return wasmExports;
}

async function init() {
	const wasmExports = await load();
	await gameScriptReady;
	const result = wasmExports.parse(gameScript);
	return { wasmExports, result };
}

export const ready = init();

// async function fillDummyPackets() {
// 	await scrapeReady;
// 	const { result } = await ready;
// 	result.messages.forEach(x => {
// 		packets.getOrInsertComputed(x.typeName, () => asMessage(x));
// 	});
// }

// ready.then(fillDummyPackets);
