import type { ItemStack } from "@wq2/waybackhq-types/src/item/items";

import Category from "@vape/core/features/modules/api/Category";
import Mod from "@vape/core/features/modules/api/Module";

import Bus from "@/Bus";
import Refs from "@/hooks/game";

export default class NoSlow extends Mod {
	public name = "NoSlow";
	public category = Category.BLATANT;
	#itemInUse: ItemStack | null = null;

	@Bus.Subscribe("livingUpdate")
	onLivingUpdate() {
		if (!Refs.player) return;
		this.#itemInUse = Refs.player.itemInUse;
		Refs.player.itemInUse = null;
	}

	@Bus.Subscribe("afterLivingUpdate")
	afterLivingUpdate() {
		if (!Refs.player) return;
		Refs.player.itemInUse = this.#itemInUse;
	}
}