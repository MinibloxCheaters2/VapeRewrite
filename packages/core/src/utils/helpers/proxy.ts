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
export default function createProxy<T extends object>(target: T, handler: ProxyHandler<T>): T {
	return new Proxy(target, {
		...handler,
		get(target, p, receiver) {
			// TODO: no easy way of allowing handler.get to return something bound
			// to a separate thisArg
			const orig = (handler.get ?? Reflect.get)(target, p, receiver);
			return typeof orig === "function" ? orig.bind(target) : orig;
		}
	});
}
