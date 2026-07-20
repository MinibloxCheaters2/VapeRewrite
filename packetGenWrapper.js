// packetGenWrapper.js
import init, * as wasmExports from "https://cdn.jsdelivr.net/npm/@wq2/packet-gen-wasm@0.0.0/packet_gen_wasm.js";

init(
	"https://cdn.jsdelivr.net/npm/@wq2/packet-gen-wasm@0.0.0/packet_gen_wasm_bg.wasm",
).then(() => {
	window.WASM = wasmExports;
});
