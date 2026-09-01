import type { ClientPlayer } from "@wq2/waybackhq-types/src/client/clientplayer";

import Category from "@vape/core/features/modules/api/Category";
import Mod from "@vape/core/features/modules/api/Module";

import Bus from "@/Bus";
import Refs from "@/hooks/game";

export default class NoSlow extends Mod {
	public name = "NoSlow";
	public category = Category.BLATANT;
	#origOnLivingUpdate: ClientPlayer["onLivingUpdate"];
	#hook() {
		this.#origOnLivingUpdate = Refs.player.onLivingUpdate;
		Refs.player.onLivingUpdate = new Proxy(this.#origOnLivingUpdate, {
			apply(target, thisArg: ClientPlayer, argArray: []) {
				const { itemInUse } = Refs.player;
				Refs.player.itemInUse = null;
				const r = Reflect.apply(target, thisArg, argArray);
				Refs.player.itemInUse = itemInUse;
				return r;
			}
		});
	}
	@Bus.Subscribe("join")
	private onJoin(): void {
		this.#hook();
	}
}
