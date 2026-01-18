/**
 * tries to hide our store from the game.
 * @module
 */

import { storeName } from "../Client";

function replaceAndCopyFunction<OP, OR>(oldFunc: (...args: OP[]) => OR, newFunc: (r: OR) => OR) {
	return new Proxy(oldFunc, {
		apply(orig, origIden, origArgs) {
			const result = orig.apply(origIden, origArgs);
			newFunc(result);
			return result;
		},
		get(orig) {
			return orig;
		}
	});
}

Object.getOwnPropertyNames = replaceAndCopyFunction(Object.getOwnPropertyNames, function (list) {
	if (list.indexOf(storeName) != -1) list.splice(list.indexOf(storeName), 1);
	return list;
});

Object.getOwnPropertyDescriptors = replaceAndCopyFunction(Object.getOwnPropertyDescriptors, function (l) {
	delete l[storeName];
	return l;
});
