import type { ClientPlayer } from "@wq2/waybackhq-types/src/client/clientplayer";

import Category from "@vape/core/features/modules/api/Category";
import Mod from "@vape/core/features/modules/api/Module";
import { EntityLivingBase } from "@wq2/waybackhq-types/src/entity/entityliving";

import Bus from "@/Bus";
import Refs from "@/hooks/game";

export default class NoSlow extends Mod {
	public name = "NoSlow";
	public category = Category.BLATANT;
	#origOnLivingUpdate: EntityLivingBase["onLivingUpdate"];
	#hook() {
		this.#origOnLivingUpdate = Refs.player.onLivingUpdate;
		Refs.player.onLivingUpdate = new Proxy(this.#origOnLivingUpdate, {
			apply(target, thisArg, argArray) {
				const ts = thisArg as ClientPlayer;
				const origSprintToggleTimer = ts.sprintToggleTimer;
				const usingItem = ts.isUsingItem();
				if (usingItem) {
					ts.movementInput.moveStrafe *= 1.2;
					ts.movementInput.moveForward *= 1.2;
				}
				const r = Reflect.apply(target, thisArg, argArray);
				if (usingItem) {
					ts.sprintToggleTimer = origSprintToggleTimer;
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
