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

import DetectionDebugger from "@/features/modules/impl/utility/DetectionDebugger";
import { expose } from "@vape/core/exposed";
import { origArrayFrom } from "./gameHook";

const w = (unsafeWindow ?? window) as typeof window;
export const origFunction = w.Function;

export let main;
export function thing(cls: any) {
	if (cls == null) return;
	if (typeof cls !== "object" && "constructor" in cls) return;
	if (["cam", "assets"].every((x) => x in cls)) {
		main = cls;
		w.Function = origFunction;
		Array.from = origArrayFrom;
		expose("main", () => main);
		// if (DetectionDebugger.INSTANCE.enabled)
		// 	DetectionDebugger.INSTANCE.rehook();
	}
}
export default function hook() {
	w.Function = new Proxy(origFunction, {
		construct(target, argArray, newTarget) {
			const r = Reflect.construct(target, argArray, newTarget);
			return new Proxy(r, {
				apply(_, __, argArray) {
					function call() {
						return Reflect.apply(_, __, argArray);
					}
					if (argArray.length !== 1) return call();
					thing(argArray[0]);
					return call();
				},
			});
		},
	});
}

hook();
