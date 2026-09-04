/**
 * JavaScript is genuinely so buns,
 * why tf do I have to fix my code to use this wrapper instead of just normal `new Proxy`.
 * For context, the entire reason I found out why this was bugged,
 * was because I KEPT GETTING DETECTED ON BLOXD WITH Trollium.
 * Looked deeper into the issue, and when you call `toString` on a `Proxy`,
 * it just returns something like `function () { [native code] }` EVEN ON JS FUNCTIONS!
 * This just proxies `toString` specifically.
 * TODO: more generic way to fix this?
 * @module
 */
export default function createProxy<T extends object>(obj: T, opts: ProxyHandler<T>): T {
	return new Proxy(obj, {
		...opts,
		get:
			typeof obj === "function"
				? (target, p, receiver) => {
						if (p === "toString") return Function.prototype.toString.bind(target);
						return opts.get?.(target, p, receiver) ?? Reflect.get(target, p, receiver);
					}
				: opts.get,
	});
}
