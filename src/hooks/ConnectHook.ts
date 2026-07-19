import Bus from "@/Bus";
import Miniblox from "@/utils/refs/miniblox";
import { waitForReact } from "@/utils/helpers/waitForReact";
import { Game } from "@wq2/miniblox-sdk";

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
