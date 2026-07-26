/**
 * Hides the exposed store from the game.
 * @module
 */

import { exposedName } from "@/utils/mapping/names";

function replaceAndCopyFunction<OP, OR>(oldFunc: (...args: OP[]) => OR, newFunc: (r: OR) => OR) {
	return new Proxy(oldFunc, {
		apply(orig, origID, origArgs) {
			const result = orig.apply(origID, origArgs);
			newFunc(result);
			return result;
		},
		get(orig, prop, receiver) {
			return Reflect.get(orig, prop, receiver);
		},
	});
}

function spliceIt<T>(arr: T[], item: T): T[] | [] {
	const idx = arr.indexOf(item);
	if (idx === -1) return [];
	return arr.splice(idx, 1);
}

Object.getOwnPropertyNames = replaceAndCopyFunction(Object.getOwnPropertyNames, (list) => {
	spliceIt(list, exposedName);
	return list;
});

Object.getOwnPropertyDescriptors = replaceAndCopyFunction(Object.getOwnPropertyDescriptors, (l) => {
	delete l[exposedName];
	return l;
});
