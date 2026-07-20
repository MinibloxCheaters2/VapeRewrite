import type { Game, PlayerMovement } from "@wq2/miniblox-sdk";
import Bus from "@/Bus";
import Cancelable from "@/event/Cancelable";
import { waitForReact } from "@/utils/helpers/waitForReact";
import Miniblox from "@/utils/refs/miniblox";

let origGameTick: Game["fixedUpdate"];
let origPlayerTick: PlayerMovement["fixedUpdate"];

export function hookGameTick() {
	origGameTick = Miniblox.game.fixedUpdate;
	Miniblox.game.fixedUpdate = new Proxy(origGameTick, {
		apply(target, thisArg, argArray) {
			Bus.emit("gameTick");
			return Reflect.apply(target, thisArg, argArray);
		},
	});
}

export function hookPlayerTick() {
	origPlayerTick = Miniblox.player.fixedUpdate;
	Miniblox.player.fixedUpdate = new Proxy(origPlayerTick, {
		apply(target, thisArg, argArray) {
			const c = new Cancelable();
			Bus.emit("playerTick", c);
			if (!c.canceled) return Reflect.apply(target, thisArg, argArray);
		},
	});
}

waitForReact().then(() => {
	hookGameTick();
	hookPlayerTick();
});
