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

import { origArrayFrom } from "./gameHook";
import { showNotification } from "@vape/core/ui/notifications";

const w = (unsafeWindow ?? window) as typeof window;
export const origFunction = w.Function;

export let main;
export function thing(cls: any, contributed = false) {
	if (main !== undefined) return;
	if (cls == null) return;
	if (typeof cls !== "object" && "constructor" in cls) return;
	if (["cam", "assets"].every((x) => x in cls)) {
		main = cls;
		showNotification(
			"Hook",
			"All features should be available now",
			"info",
			0.5e3
		);
		if (!contributed) w.Function = origFunction;
		Array.from = origArrayFrom;
		expose("main", () => main);
		return main;
		// if (DetectionDebugger.INSTANCE.enabled)
		// 	DetectionDebugger.INSTANCE.rehook();
	}
}
export default function hook() {
	return new Promise((res) => {
		w.Function = new Proxy(origFunction, {
			construct(target, argArray, newTarget) {
				const r = Reflect.construct(target, argArray, newTarget);
				return new Proxy(r, {
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
	});
}

export const ready = hook();
