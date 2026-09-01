import type { Session } from "@wq2/waybackhq-types/src/net/session";
import Bus from "@/Bus";

import { ready as gameReady } from "./game";

const sessionPromise = import("@wq2/waybackhq-types/src/net/session");
export let session: typeof Session;
export const ready = sessionPromise.then(({ Session }) => {
	session = Session;
});

export async function hookNewSession() {
	await ready;
	// note: unused
	session.prototype.join = new Proxy(session.prototype.join, {
		apply(target, thisArg, argArray) {
			// Bus.emit("connect");
			return Reflect.apply(target, thisArg, argArray);
		},
	});
}

gameReady.then(hookNewSession);
