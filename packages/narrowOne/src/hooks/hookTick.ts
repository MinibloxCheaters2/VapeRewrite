import game from "@/utils/refs/game";
import { ready } from "./gameHook";
import Bus from "@/Bus";
import { showNotification } from "@vape/core/ui/notifications";
import { Cancelable } from "@vape/core/index";
import createProxy from "@vape/core/utils/helpers/proxy";

let origGameLoop, origPlayerLoop;

export default function hookGameTick() {
	const prototype = Object.getPrototypeOf(game.instance);
	// hooking the prototype instead,
	// so we hook every new game's loop function along with the current one.
	origGameLoop = prototype.loop;
	prototype.loop = createProxy(origGameLoop, {
		apply(target, thisArg, argArray) {
			Bus.emit("gameTick");
			return Reflect.apply(target, thisArg, argArray);
		},
	});
}
export function hookPlayerTick() {
	if (!game.player) {
		showNotification("Hooks", "player missing, can't hook player tick", "alert", 1.5e3);
		return;
	}
	const prototype = Object.getPrototypeOf(game.player);
	origPlayerLoop = prototype.loop;
	prototype.loop = createProxy(origPlayerLoop, {
		apply(target, thisArg, argArray) {
			const c = new Cancelable();
			Bus.emit("playerTick", c);
			if (!c.canceled)
				return Reflect.apply(target, thisArg, argArray);
		},
	});
}

// we only need game for this, main is extra.
ready.then(() => {
	hookGameTick();
	hookPlayerTick();
});
