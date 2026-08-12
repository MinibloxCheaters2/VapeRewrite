import type { Block, BlockPos } from "@wq2/miniblox-sdk";
import { Subscribe } from "@/event/Bus";
import { type BlockHandler, blockHandlers } from "@/utils";
import Miniblox from "@/utils/refs/miniblox";
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

	static #eggStateId: number | undefined;

	static #getEggStateId(): number | undefined {
		if (this.#eggStateId !== undefined) return this.#eggStateId;
		const egg = Miniblox.Blocks.dragon_egg;
		for (const [state, id] of Miniblox.Blocks.blockStateToId) {
			if (state.getBlock() === egg) {
				this.#eggStateId = id;
				return id;
			}
		}
		return undefined;
	}

	#shouldBreakBlockPos(pos: BlockPos): boolean {
		const { world } = Miniblox;
		if (world === undefined) return false;
		const eggStateId = Breaker.#getEggStateId();
		if (eggStateId === undefined) return false;
		return Miniblox.Blocks.blockStateToId.get(world.getBlockState(pos)) === eggStateId;
	}

	#handlerForBlock(block: Block): BlockHandler {
		// TODO(Breaker): no one would want to really use breaker outside of EggWars,
		//  but we should add a sort of packet mine for this.
		return block === Miniblox.Blocks.dragon_egg
			? blockHandlers.rightClick
			: blockHandlers.breakBlock;
	}

	@Subscribe("playerTick")
	private onTick() {
		if (!this.#couldBreakAnything()) {
			this.toggleSilently();
			Miniblox.chat.addChat({
				text: "this goobener has breaker on but made it break NOTHING. Screw your module, I'm disabling it.",
			});
			return;
		}
		const { BlockPos, player, world, Blocks } = Miniblox;
		const offset = this.#range;
		const start = player.getPosition().subtract(offset, offset, offset);
		const end = player.getPosition().add(offset, offset, offset);
		for (const block of BlockPos.getAllInBoxMutable(start, end)) {
			if (world.getBlock(block) instanceof Blocks.dragon_egg.constructor)
				blockHandlers.rightClick(block);
		}
	}
}
