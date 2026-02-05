/**
 * tries to hide our store from the game.
 * @module
 */

import { fgExposedName, storeName } from "@/utils/names";

function replaceAndCopyFunction<OP, OR>(
	oldFunc: (...args: OP[]) => OR,
	newFunc: (r: OR) => OR,
) {
	return new Proxy(oldFunc, {
		apply(orig, origID, origArgs) {
			const result = orig.apply(origID, origArgs);
			newFunc(result);
			return result;
		},
		get(orig) {
			return orig;
		},
	});
}

function spliceIt<T>(arr: T[], item: T): T[] | [] {
	const idx = arr.indexOf(item);
	if (idx === -1) return [];
	return arr.splice(idx, 1);
}

Object.getOwnPropertyNames = replaceAndCopyFunction(
	Object.getOwnPropertyNames,
	(list) => {
		spliceIt(list, storeName);
		spliceIt(list, fgExposedName);
		return list;
	},
);

Object.getOwnPropertyDescriptors = replaceAndCopyFunction(
	Object.getOwnPropertyDescriptors,
	(l) => {
		delete l[storeName];
		delete l[fgExposedName];
		return l;
	},
);
