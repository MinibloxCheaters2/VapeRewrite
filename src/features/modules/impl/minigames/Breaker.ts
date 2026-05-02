import { Subscribe } from "@/event/api/Bus";
import type { BlockPos } from "@/features/sdk/types/blockpos";
import type { Block } from "@/features/sdk/types/blocks";
import {
	type BlockHandler,
	blockHandlers,
	handleInRange,
	withBlock,
} from "@/utils";
import Refs from "@/utils/helpers/refs";
import Category from "../../api/Category";
import Mod from "../../api/Module";

export default class Breaker extends Mod {
	name = "Breaker";
	category = Category.MINIGAMES;
	#rangeSetting = this.createSliderSetting("Range", 4, 1, 4, 0.1);
	#breakEggsSetting = this.createToggleSetting("Eggs", true);
	// #breakBedsSetting = this.createToggleSetting("Beds", false);

	get #range() {
		return this.#rangeSetting.value();
	}

	get #breakEggs() {
		return this.#breakEggsSetting.value();
	}

	#couldBreakAnything() {
		return this.#breakEggs;
	}

	#shouldBreakBlock(block: Block): boolean {
		return block === Refs.Blocks.dragon_egg;
	}
	#shouldBreakBlockPos(pos: BlockPos): boolean {
		const block = Refs.world?.getBlock?.(pos);
		if (block === undefined) return false;
		return this.#shouldBreakBlock(block);
	}

	#handlerForBlock(block: Block): BlockHandler {
		// TODO(Breaker): no one would want to really use breaker outside of EggWars,
		//  but we should add a sort of packet mine for this.
		return block === Refs.Blocks.dragon_egg
			? blockHandlers.rightClick
			: blockHandlers.breakBlock;
	}

	@Subscribe("gameTick")
	private onTick() {
		if (!this.#couldBreakAnything()) {
			this.toggleSilently();
			Refs.chat.addChat({
				text: "this goobener has breaker on but made it break NOTHING. Screw your module, I'm disabling it.",
			});
			return;
		}
		handleInRange(
			this.#range,
			this.#shouldBreakBlockPos,
			withBlock(this.#handlerForBlock),
		);
	}
}
