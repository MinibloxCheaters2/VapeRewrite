const VERSION = "0.0.1";
import(
	`https://cdn.jsdelivr.net/npm/@wq2/packet-gen-wasm@${VERSION}/packet_gen_wasm.js`
).then(async (wasmExports) => {
	await wasmExports.default(
		`https://cdn.jsdelivr.net/npm/@wq2/packet-gen-wasm@${VERSION}/packet_gen_wasm_bg.wasm`,
	);
	window.VM = wasmExports;
});
