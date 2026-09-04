import type { ClientSocket } from "@wq2/miniblox-sdk";

import Bus from "@/Bus";
import { waitForReact } from "@/utils/helpers/waitForReact";
import Miniblox from "@/utils/refs/miniblox";

import { hookReceivePacket } from "./PacketHook";
import createProxy from "@vape/core/utils/helpers/proxy";

let orig: (typeof ClientSocket)["connect"] | undefined;

export function hookConnect() {
	if (orig) return;
	const { ClientSocket } = Miniblox;
	if (!ClientSocket) return;
	orig = ClientSocket.connect;
	ClientSocket.connect = createProxy(orig, {
		apply(target, thisArg, argArray) {
			hookReceivePacket();
			Bus.emit("connect");
			return Reflect.apply(target, thisArg, argArray);
		},
	});
}

waitForReact().then(hookConnect);
