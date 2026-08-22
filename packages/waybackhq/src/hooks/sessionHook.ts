import type { DecodedVelocity, TeleportTarget } from "@wq2/waybackhq-types/src/net/session";

import CancelableWrapper from "@vape/core/event/CancelableWrapper";

import Bus from "@/Bus";

import Refs, { ready } from "./game";
import { mcUI, ready as mUIReady } from "./minecraftUI";

export async function hookNewSession() {
	await mUIReady;
	mcUI.prototype.newSession = new Proxy(mcUI.prototype.newSession, {
		apply(target, thisArg, argArray) {
			Bus.emit("connect");
			return Reflect.apply(target, thisArg, argArray);
		},
	});
}

ready.then(hookNewSession);
