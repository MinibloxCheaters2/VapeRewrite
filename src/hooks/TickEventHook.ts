import Bus from "@/Bus";
import Cancelable from "@/event/Cancelable";
import waitForLoad from "@/ui/wait";
import Refs from "@/utils/helpers/refs";

let origGameTick: () => void;
let origPlayerTick: () => void;

export function hookGameTick() {
	origGameTick = Refs.game.fixedUpdate;
	Refs.game.fixedUpdate = new Proxy(origGameTick, {
		apply(target, thisArg, argArray) {
			Bus.emit("gameTick");
			return Reflect.apply(target, thisArg, argArray);
		},
	});
}

export function hookPlayerTick() {
	origPlayerTick = Refs.player.fixedUpdate;
	Refs.player.fixedUpdate = new Proxy(origPlayerTick, {
		apply(target, thisArg, argArray) {
			const c = new Cancelable();
			Bus.emit("playerTick", c);
			if (!c.canceled) return Reflect.apply(target, thisArg, argArray);
		},
	});
}

waitForLoad().then(() => {
	hookGameTick();
	hookPlayerTick();
});
