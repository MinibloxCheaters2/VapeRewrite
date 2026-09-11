/**
 * The game's detections do
 * ```js
 * new Function("main", `"use strict";${code}`)(main)
 * ```
 * we can hook `new Function` to return a wrapper around the detection function, and
 * also grab the object passed to it.
 * There would be a better way if we were running before the game, but sadly, we don't.
 * I *could* run before the game, but the problem with that is,
 * I'd rather make it easier for myself to make paste-in-console support than make this easier to use,
 * especially when its just waiting a few seconds for the client to receive a payload
 * from the server.
 * @module
 */

import { expose } from "@vape/core/exposed";
// import DetectionDebugger from "@/features/modules/impl/utility/DetectionDebugger";
import { showNotification } from "@vape/core/ui/notifications";
import createProxy from "@vape/core/utils/helpers/proxy";

import { origArrayFrom } from "./gameHook";

const w = (unsafeWindow ?? window) as typeof window;
export const origFunction = w.Function;

export let main;
export function thing(cls: any, contributed = false) {
	if (main !== undefined) return;
	if (cls == null) return;
	if (typeof cls !== "object" && "constructor" in cls) return;
	if (["cam", "assets"].every((x) => x in cls)) {
		main = cls;
		showNotification("Vape", "All features are now unlocked.", "info", 1.5e3);
		if (!contributed) w.Function = origFunction;
		Array.from = origArrayFrom;
		expose("main", () => main);
		return main;
		// if (DetectionDebugger.INSTANCE.enabled)
		// 	DetectionDebugger.INSTANCE.rehook();
	}
}

const k = crypto.randomUUID().replaceAll("-", "67");

export function trigger(ws: WebSocket) {
	// TODO: implement ts lazy ahh
	/**
	 * Forges an RCE packet.
	 * The network will then send a string message after your function completes or errors.
	 * Make sure to `await` a Promise that doesn't resolve in order to bypass this.
	 * ...Or just patch the sendStringMessage function, but I'm lazy and this works, so...
	 */
	function forceRCE(ws: WebSocket, code: string, id = 0) {
		const json = new TextEncoder().encode(JSON.stringify({ id, c: code }));
		const buf = new ArrayBuffer((4 + json.length) * 4);
		const ui32a = new Uint32Array(buf);
		ui32a[0] = 55;
		ui32a[1] = json.length;
		ui32a.set(json);
		ws.dispatchEvent(new MessageEvent("message", { data: buf }));
	}

	if (!w[k]) (w as typeof w & Record<string, unknown>)[k] = (m: any) => {
		thing(m);
		delete w[k];
	};
	forceRCE(
		ws,
		/*js*/ `
globalThis["${k}"](main); await new Promise(() => {});
`,
	);
}
function hookWebSocket() {
	function isGameWebSocket(url: string): boolean {
		return url.startsWith("wss://ws") && url.endsWith(".narrow-one.com/ws");
	}
	const { WebSocket } = w;
	const [origWebSocket, origSend] = [
		WebSocket,
		WebSocket.prototype.send
	];
	WebSocket.prototype.send = createProxy(origSend, {
		apply(target, thisArg: WebSocket, argArray: [data: string | BufferSource | Blob]) {
			try {
				const {url} = thisArg;
				if (isGameWebSocket(url) && !main) {
					trigger(thisArg);
				}
				if (main) WebSocket.prototype.send = origSend;
			} catch (_) {
				((_useless) => {})(_); // shut up linter
			}
			return Reflect.apply(target, thisArg, argArray);
		},
	});
	w.WebSocket = createProxy(origWebSocket, {
		construct(target, argArray: [url: string | URL, protocols?: string | string[]], newTarget) {
			const ws: WebSocket = Reflect.construct(target, argArray, newTarget);
			const {url} = ws;
			if (isGameWebSocket(url) && !main) {
				trigger(ws);
			}
			if (main) WebSocket.prototype.send = origSend;
			return ws;
		},
	});
}
export default function hook() {
	return new Promise((res) => {
		w.Function = createProxy(origFunction, {
			construct(target, argArray, newTarget) {
				const r = Reflect.construct(target, argArray, newTarget);
				return createProxy(r, {
					apply(_, __, argArray) {
						function call() {
							return Reflect.apply(_, __, argArray);
						}
						if (argArray.length !== 1) return call();
						res(thing(argArray[0]));
						return call();
					},
				});
			},
		});
		hookWebSocket();
	});
}

export const ready = hook();
