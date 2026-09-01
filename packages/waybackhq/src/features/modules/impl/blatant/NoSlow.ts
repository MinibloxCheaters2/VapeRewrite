import type { MovementInput } from "@wq2/waybackhq-types/src/client/clientplayer";

import Category from "@vape/core/features/modules/api/Category";
import Mod from "@vape/core/features/modules/api/Module";

import Bus from "@/Bus";
import Refs from "@/hooks/game";

export default class NoSlow extends Mod {
	public name = "NoSlow";
	public category = Category.BLATANT;
	#orig: MovementInput["update"];
	#hook() {
		this.#orig = Refs.player.movementInput.update;
		Refs.player.movementInput.update = new Proxy(this.#orig, {
			apply(target, thisArg: MovementInput, argArray) {
				const r = Reflect.apply(target, thisArg, argArray);
				if (Refs.player.isUsingItem()) {
					thisArg.moveStrafe *= 5;
					thisArg.moveForward *= 5;
				}
				return r;
			},
		});
	}
	@Bus.Subscribe("join")
	private onJoin(): void {
		this.#hook();
	}
}
