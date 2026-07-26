export type Constructor = (...args: never) => unknown | (HasProto & { name: string });

export interface HasProto {
	__proto__: Constructor;
}

export function getParent(obj: HasProto): Constructor | undefined {
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
if we do `B.__proto__`, we will see class `A`, which we can then get its name from `.constructor.name`.
now, let's do `A.__proto__`, we will see it is a function.
We stop as soon as we see a function,
since that then signifies that we are in a class that doesn't extend anything.
*/
export function getInheritanceTree(obj: HasProto): Set<Constructor> {
	const tree = new Set<Constructor>();
	let cur: HasProto = obj;
	while (cur != null) {
		const parent = getParent(cur);
		if (parent == null) {
			break;
		}
		tree.add(parent);
		cur = parent as HasProto;
		if (cur == null) break;
	}
	return tree;
}

export function iofForeign<T extends HasProto>(
	obj: HasProto,
	predicate: (c: Constructor) => boolean,
): obj is T {
	const tree = getInheritanceTree(obj);
	if (Array.from(tree).find(predicate)) {
		return true;
	}
	return false;
}
