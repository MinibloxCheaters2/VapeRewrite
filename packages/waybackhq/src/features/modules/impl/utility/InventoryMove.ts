import { Category } from "@vape/core/features/modules/api/Category";
import Mod from "@vape/core/features/modules/api/Module";
import { Game } from "@wq2/waybackhq-types/src/game";

import Refs from "@/hooks/game";

let orig: Game["updateLocalInput"];

export default class InventoryMove extends Mod {
	name = "InventoryMove";
	category = Category.UTILITY;
	protected onEnable(): void {
		orig = Refs.game.updateLocalInput;
		Refs.game.updateLocalInput = new Proxy(orig, {
			apply(target, thisArg: Game, argArray: []) {
				const oldScreen = thisArg.currentScreen;
				thisArg.currentScreen = null;
				const r = Reflect.apply(target, thisArg, argArray);
				thisArg.currentScreen = oldScreen;
			},
		});
	}
	protected onDisable(): void {
		Refs.game.updateLocalInput = orig;
	}
}
