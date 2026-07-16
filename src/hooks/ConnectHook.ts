import Bus from "@/Bus";
import Refs from "@/utils/helpers/refs";
import { Game } from "@wq2/miniblox-sdk";

let orig: Game["connect"];

export function hookConnect() {
	orig = Refs.game.connect;
	Refs.game.connect = new Proxy(orig, {
		apply(target, thisArg, argArray) {
			Bus.emit("connect");
			return Reflect.apply(target, thisArg, argArray);
		},
	});
}

hookConnect();
