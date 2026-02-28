import { Subscribe } from "@/event/api/Bus";
import Category from "../../api/Category";
import Mod from "../../api/Module";
import { blockHandlers, oneInRange } from "@/utils";
import type { AllBlocks } from "@/features/sdk/types/blocks";
import type { BlockPos } from "@/features/sdk/types/blockpos";
import Refs from "@/utils/helpers/refs";

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
		const chest = oneInRange(this.#range, pos => {
			const { world, Blocks } = Refs;
			return !this.#lootedPositions.includes(pos) && world.getBlock(pos) instanceof Blocks.chest.constructor;
		});
		if (chest) {
			this.#lootedPositions.push(chest);
			blockHandlers.rightClick(chest);
			return;
		}
	}
}
