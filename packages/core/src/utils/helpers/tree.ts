export type Constructor = (...args: never) => unknown;

export function getParent(obj: any): Constructor | undefined {
	const proto = Object.getPrototypeOf(obj);
	if (proto instanceof Function) {
		return undefined; // this itself extends off of nothing.
	}
	return proto;
}

/**
Ok so basically,
let us define 2 classes:
```js
class A {} // what we will extend
class B extends A {} // which extends something.
```
if we do get the prototype of `B`,
we will see class `A`, which we can then get its name from `.constructor.name`.
now, let's do that for `A`, we will see it is a function.
We stop as soon as we see a function,
since that then signifies that we are in a class that doesn't extend anything.
*/
export function getInheritanceChain(obj: any): Set<Constructor> {
	const tree = new Set<Constructor>();
	let cur: any = obj;
	while (cur != null) {
		const parent = getParent(cur);
		if (parent == null) {
			break;
		}
		tree.add(parent);
		cur = parent;
		if (cur == null) break;
	}
	return tree;
}
