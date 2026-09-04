import { ready as sessionReady, session } from "@/utils/wrappers/session";

// import { ready as gameReady } from "./game";
import createProxy from "@vape/core/utils/helpers/proxy";

export async function hookNewSession() {
	await sessionReady;
	// note: unused
	session.prototype.join = createProxy(session.prototype.join, {
		apply(target, thisArg, argArray) {
			// Bus.emit("connect");
			return Reflect.apply(target, thisArg, argArray);
		},
	});
}

// gameReady.then(hookNewSession);
