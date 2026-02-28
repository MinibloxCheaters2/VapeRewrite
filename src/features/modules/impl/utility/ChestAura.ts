import { Subscribe } from "@/event/api/Bus";
import Category from "../../api/Category";
import Mod from "../../api/Module";
import { blockHandlers, oneInRange } from "@/utils/blockHandlers";
import { Blocks } from "@/features/sdk/types/blocks";
import { BlockPos } from "@/features/sdk/types/blockpos";
import Refs from "@/utils/refs";

export default class ChestAura extends Mod {
	name = "ChestAura";
	category = Category.UTILITY;

	#rng = this.createSliderSetting("Range", 0.5, 1.5, 6.5, 0.5);
	#lootedPositions: BlockPos[] = [];

	get #range() {
		return this.#rng.value();
	}

	@Subscribe("playerTick")
	private onPlayerTick() {
		const chest = oneInRange(this.#range, pos => !this.#lootedPositions.includes(pos) && Refs.world.getBlock(pos) instanceof Blocks.chest.constructor);
		if (chest) blockHandlers.rightClick(chest);
	}
}
