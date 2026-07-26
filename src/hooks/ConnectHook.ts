import type { ClientSocket } from "@wq2/miniblox-sdk";
import Bus from "@/Bus";
import { waitForReact } from "@/utils/helpers/waitForReact";
import Miniblox from "@/utils/refs/miniblox";

let orig: (typeof ClientSocket)["connect"] | undefined;

export function hookConnect() {
	const { ClientSocket } = Miniblox;
	if (!ClientSocket) return;
	orig = ClientSocket.connect;
	ClientSocket.connect = new Proxy(orig, {
		apply(target, thisArg, argArray) {
			Bus.emit("connect");
			return Reflect.apply(target, thisArg, argArray);
		},
	});
}

waitForReact().then(hookConnect);
