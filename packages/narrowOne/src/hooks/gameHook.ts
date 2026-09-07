/**
 * Hooks Array.from to get the game object.
 * Note: the game object CAN AND WILL change, so we don't restore the original function.
 * We can get the main object (which contains this) easier,
 * but that takes a bit longer due to it not firing always.
 * @module
 */

import createProxy from "@vape/core/utils/helpers/proxy";

/** used in mainHook.ts to remove the `Array.from` hook */
export let origArrayFrom = Array.from;
/** don't use this, use the one from Refs instead. */
export let gameObj: any;
export default function hook() {
	return new Promise<typeof gameObj>((res) => {
		Array.from = createProxy(origArrayFrom, {
			apply(target, thisArg: any, argArray: [ArrayLike<unknown>]) {
				const r: Array<unknown> = Reflect.apply(target, thisArg, argArray);
				const n = r[0];
				if (!n || typeof n !== "object") return r;
				const g = "game" in n && n.game;
				if (!g) return r;
				gameObj = g;
				res(g);
				return r;
			},
		});
	});
}
export const ready = hook();
