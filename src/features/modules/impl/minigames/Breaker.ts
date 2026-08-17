import { Subscribe } from "@/event/Bus";
import { blockHandlers } from "@/utils";
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
