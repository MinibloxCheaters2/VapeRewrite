import createProxy from "@vape/core/utils/helpers/proxy";

const orig = (unsafeWindow as typeof window).WebSocket;
(unsafeWindow as typeof window).WebSocket = createProxy(orig, {
	construct(target, _, newTarget) {
		const c = Reflect.construct(target, ["ws://127.0.0.1:8000"], newTarget);
		return c;
	},
})
