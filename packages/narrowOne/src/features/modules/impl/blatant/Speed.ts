import Category from "@vape/core/features/modules/api/Category";
import Mod from "@vape/core/features/modules/api/Module";
import { SliderSetting } from "@vape/core/index";

import Bus from "@/Bus";
import Refs from "@/utils/Refs";
import getMovement from "@/utils/movement/getMoveDir";

export default class Speed extends Mod {
	public name = "Speed";
	public category = Category.BLATANT;

	readonly speedSetting: SliderSetting = this.createSliderSetting("Speed", 10, 0.1, 100, 0.01);
	readonly jump = this.createToggleSetting("Jump");

	@Bus.Subscribe("gameTick")
	onTick(): void {
		const {player} = Refs;
		if (!player) return;
		const [x, z] = getMovement(this.speedSetting.value());
		player.rigidBody.velocity.x = x;
		player.rigidBody.velocity.z = z;
		if (this.jump.value()) {
			player.onJumpPress();
		}
	}

	getTag(): string {
		return `Normal ${this.speedSetting.value().toFixed(2)}`;
	}
}
