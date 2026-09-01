import Category from "@vape/core/features/modules/api/Category";
import Mod from "@vape/core/features/modules/api/Module";
import { SliderSetting } from "@vape/core/index";

import Bus from "@/Bus";

export default class Fly extends Mod {
	public name = "Fly";
	public category = Category.BLATANT;

	readonly speedSetting: SliderSetting = this.createSliderSetting("Speed", 1, 0.11, 6.0, 0.01);

	@Bus.Subscribe("playerTick")
	onTick(): void {
		// TODO
	}

	onDisable(): void {}

	getTag(): string {
		return `Normal ${this.speedSetting.value().toFixed(2)}`;
	}
}
