import type { BlockPos } from "@wq2/miniblox-sdk";
import { Subscribe } from "@/event/api/Bus";
import { blockHandlers, oneInRange } from "@/utils";
import Refs from "@/utils/helpers/refs";
import Category from "../../api/Category";
import Mod from "../../api/Module";

export default class ChestAura extends Mod {
	name = "ChestAura";
	category = Category.MINIGAMES;

	#rng = this.createSliderSetting("Range", 0.5, 1.5, 6.5, 0.5);
	#lootedPositions: BlockPos[] = [];

	get #range() {
		return this.#rng.value();
	}

	// TODO(ChestAura): clear on world change or disconnect

	@Subscribe("playerTick")
	private onPlayerTick() {
		const { Blocks, world } = Refs;
		if (world === undefined) return;
		const chest = oneInRange(this.#range, (pos) => {
			return (
				!this.#lootedPositions.includes(pos) &&
				world.getBlock(pos) instanceof Blocks.chest.constructor
			);
		});
		if (chest) {
			this.#lootedPositions.push(chest);
			blockHandlers.rightClick(chest);
			return;
		}
	}
}
