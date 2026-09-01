import { ready as gameReady } from "./game";
import { ready as sessionReady, session } from "@/utils/wrappers/session";

export async function hookNewSession() {
	await sessionReady;
	// note: unused
	session.prototype.join = new Proxy(session.prototype.join, {
		apply(target, thisArg, argArray) {
			// Bus.emit("connect");
			return Reflect.apply(target, thisArg, argArray);
		},
	});
}

gameReady.then(hookNewSession);
