import Category from "@vape/core/features/modules/api/Category";
import Mod from "@vape/core/features/modules/api/Module";
import { SliderSetting } from "@vape/core/index";

import Bus from "@/Bus";
import Refs from "@/utils/Refs";
import getMovement from "@/utils/movement/getMoveDir";

let lol = 0;

export default class Fly extends Mod {
	public name = "Fly";
	public category = Category.BLATANT;

	readonly speedSetting: SliderSetting = this.createSliderSetting("Speed", 10, 0.1, 100, 0.01);

	@Bus.Subscribe("gameTick")
	onTick(): void {
		const {player} = Refs;
		if (!player) return;
		const [x, z] = getMovement(this.speedSetting.value());
		player.rigidBody.velocity.x = x;
		if (player.rigidBody.velocity.y < 0) {
			player.jump();
			// player.rigidBody.velocity.y = -player.rigidBody.velocity.y;
		}
		player.rigidBody.velocity.z = z;
	}

	getTag(): string {
		return `Normal ${this.speedSetting.value().toFixed(2)}`;
	}
}
