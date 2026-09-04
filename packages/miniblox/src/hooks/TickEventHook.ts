import type { Game, PlayerMovement } from "@wq2/miniblox-sdk";

import Cancelable from "@vape/core/event/Cancelable";

import Bus from "@/Bus";
import { waitForReact } from "@/utils/helpers/waitForReact";
import Miniblox from "@/utils/refs/miniblox";
import createProxy from "@vape/core/utils/helpers/proxy";

let origGameTick: Game["fixedUpdate"];
let origPlayerTick: PlayerMovement["fixedUpdate"];

export function hookGameTick() {
	const {game} = Miniblox;
	if (!game) return;
	origGameTick = game.fixedUpdate;
	game.fixedUpdate = createProxy(origGameTick, {
		apply(target, thisArg, argArray) {
			Bus.emit("gameTick");
			return Reflect.apply(target, thisArg, argArray);
		},
	});
}

export function hookPlayerTick() {
	const {player} = Miniblox;
	if (!player) return;
	origPlayerTick = player.fixedUpdate;
	player.fixedUpdate = createProxy(origPlayerTick, {
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
