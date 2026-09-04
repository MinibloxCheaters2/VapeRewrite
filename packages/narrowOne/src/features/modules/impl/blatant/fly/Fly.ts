import Category from "@vape/core/features/modules/api/Category";
import Mod from "@vape/core/features/modules/api/Module";
import { SliderSetting } from "@vape/core/index";

import Bus from "@/Bus";
import Refs from "@/utils/Refs";

export default class Fly extends Mod {
	public name = "Fly";
	public category = Category.BLATANT;

	readonly speedSetting: SliderSetting = this.createSliderSetting("Speed", 1, 0.11, 6.0, 0.01);

	// @Bus.Subscribe("playerTick")
	// onTick(): void {
	// }

	protected onEnable(): void {
		// TODO: better impl
		Refs.player.rigidBody.fly = true;
		Refs.player.flySpeed = 5;
	}

	protected onDisable(): void {
		Refs.player.rigidBody.fly = false;
		Refs.player.flySpeed = 0;
	}

	getTag(): string {
		return `Normal ${this.speedSetting.value().toFixed(2)}`;
	}
}
