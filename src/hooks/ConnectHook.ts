import type { Game } from "@wq2/miniblox-sdk";
import Bus from "@/Bus";
import { waitForReact } from "@/utils/helpers/waitForReact";
import Miniblox from "@/utils/refs/miniblox";

let orig: Game["connect"];

export function hookConnect() {
	orig = Miniblox.game.connect;
	Miniblox.game.connect = new Proxy(orig, {
		apply(target, thisArg, argArray) {
			Bus.emit("connect");
			return Reflect.apply(target, thisArg, argArray);
		},
	});
}

waitForReact().then(hookConnect);
