/**
 * tries to hide our store from the game.
 * @module
 */

import { storeName } from "../Client";

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

Object.getOwnPropertyNames = replaceAndCopyFunction(
	Object.getOwnPropertyNames,
	(list) => {
		if (list.indexOf(storeName) !== -1)
			list.splice(list.indexOf(storeName), 1);
		return list;
	},
);

Object.getOwnPropertyDescriptors = replaceAndCopyFunction(
	Object.getOwnPropertyDescriptors,
	(l) => {
		delete l[storeName];
		return l;
	},
);
