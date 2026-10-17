import Category from "@vape/core/features/modules/api/Category";
import Mod from "@vape/core/features/modules/api/Module";
import createProxy from "@vape/core/utils/helpers/proxy";
import { Player } from "@wq2/narrow-one-types/src/game";

import gameRefs, { anyReady } from "@/utils/refs/game";

let origProto: Player, origDie: Player["die"];

export default class Godmode extends Mod {
	name = "Godmode";
	category = Category.UTILITY;
	#hook() {
		if (!origProto || !origDie) return;
		origProto.die = createProxy(origProto.die, {
			apply(target, thisArg: Player, argArray: [respawn?: boolean]) {
				if (!thisArg.hasOwnership) return Reflect.apply(target, thisArg, argArray);
				// for some reason, the server acts more like a relay than a server.
				// things you'd expect the server to have authority over (like the player dying),
				// are actually owned by the client.
				thisArg.health = Infinity;
				thisArg.dead = false;
				thisArg.updateHealthUi();
			},
		});
	}
	#unhook() {
		if (!origProto || !origDie) return;
		origProto.die = origDie;
	}
	protected onEnable(): void {
		anyReady.then(() => {
			if (origProto && origDie) return;
			const { player } = gameRefs;
			origProto = Object.getPrototypeOf(player);
			origDie = origProto.die;
			this.#hook();
		});
	}
	protected onDisable(): void {
		this.#unhook();
	}
}
