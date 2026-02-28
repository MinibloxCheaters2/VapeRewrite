import { Subscribe } from "@/event/api/Bus";
import type { BlockPos } from "@/features/sdk/types/blockpos";
import type { Block /*, Blocks*/ } from "@/features/sdk/types/blocks";
import { c2s } from "@/utils/packetRefs";
import Refs from "@/utils/refs";
import Category from "../../api/Category";
import Mod from "../../api/Module";
import { blockHandlers, handleInRange, withBlock } from "@/utils";

export default class Breaker extends Mod {
	public name = "Breaker";
	public category = Category.WORLD;

	private rangeSetting = this.createSliderSetting("Range", 10, 1, 20, 0.5);
	private notifySetting = this.createToggleSetting("Notify", true);

	private lastBreakTime = 0;
	private breakDelay = 100;

	get range() {
		return this.rangeSetting.value();
	}

	get notify() {
		return this.notifySetting.value();
	}

	@Subscribe("gameTick")
	public onTick() {
		const now = Date.now();

		if (now - this.lastBreakTime < this.breakDelay) {
			return;
		}

		handleInRange(this.range, withBlock(b => b instanceof Refs.Blocks.dragon_egg.constructor), pos => {
			blockHandlers.rightClick(pos);
			this.lastBreakTime = now;
			if (this.notify) {
				Refs.chat.addChat({
					text: "[Breaker] Egg broken!",
					color: "green",
				});
			}
		});
	}

	public getTag(): string {
		return `${this.range} block${this.range === 1 ? "" : "s"}`;
	}
}
