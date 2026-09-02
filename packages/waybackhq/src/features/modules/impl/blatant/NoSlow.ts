import type { ClientPlayer } from "@wq2/waybackhq-types/src/client/clientplayer";

import Category from "@vape/core/features/modules/api/Category";
import Mod from "@vape/core/features/modules/api/Module";
import { mod as CPlr, ready } from "@/utils/wrappers/clientplayer";

import Refs from "@/hooks/game";

export default class NoSlow extends Mod {
	public name = "NoSlow";
	public category = Category.BLATANT;
	#orig: ClientPlayer["onLivingUpdate"];
	#hooked = false;
	#hook() {
		const { ClientPlayer } = CPlr;
		if (!this.#orig) this.#orig = ClientPlayer.prototype.onLivingUpdate;
		ClientPlayer.prototype.onLivingUpdate = new Proxy(this.#orig, {
			apply(target, thisArg: ClientPlayer, argArray: []) {
				const { itemInUse } = Refs.player;
				Refs.player.itemInUse = null;
				const r = Reflect.apply(target, thisArg, argArray);
				Refs.player.itemInUse = itemInUse;
				return r;
			},
		});
		this.#hooked = true;
	}
	onDisable() {
		if (this.#hooked) {
			Refs.player.onLivingUpdate = this.#orig;
			this.#hooked = false;
		}
	}
	onEnable() {
		if (!this.#hooked) {
			ready.then(this.#hook.bind(this));
		}
	}
}
