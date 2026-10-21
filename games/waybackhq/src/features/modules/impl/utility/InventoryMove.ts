import { Category } from "@vape-rewrite/core";
import { Mod } from "@vape-rewrite/core";
import { Game } from "@wq2/waybackhq-types/src/game";

import Refs, { ready } from "@/hooks/game";
import { createProxy } from "@vape-rewrite/core";

let orig: Game["updateLocalInput"];

export default class InventoryMove extends Mod {
	name = "InventoryMove";
	category = Category.UTILITY;
	static #hook() {
		orig = Refs.game.updateLocalInput;
		Refs.game.updateLocalInput = createProxy(orig, {
			apply(target, thisArg: Game, argArray: []) {
				const oldScreen = thisArg.currentScreen;
				thisArg.currentScreen = null;
				const r = Reflect.apply(target, thisArg, argArray);
				thisArg.currentScreen = oldScreen;
				return r;
			},
		});
	}
	protected onEnable(): void {
		ready.then(InventoryMove.#hook);
	}
	protected onDisable(): void {
		Refs.game.updateLocalInput = orig;
	}
}
