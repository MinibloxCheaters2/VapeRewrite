/**
 * Hooks Array.from to get the game object.
 * Note: the game object CAN AND WILL change, so we don't restore the original function.
 * We can get the main object (which contains this) easier,
 * but that takes a bit longer due to it not firing always.
 * @module
 */

/** used in mainHook.ts to remove the `Array.from` hook */
export let origArrayFrom = Array.from;
/** don't use this, use the one from Refs instead. */
export let game;
export default function hook() {
	return new Promise<typeof game>((res) => {
		Array.from = new Proxy(origArrayFrom, {
			apply(target, thisArg, argArray) {
				const [obj] = argArray;
				if (obj?.next && obj?.next()?.value?.game) {
					game = obj.next().value.game;
					Array.from = origArrayFrom;
					res(game);
				}
				return Reflect.apply(target, thisArg, argArray);
			},
		});
	});
}
export const ready = hook();
