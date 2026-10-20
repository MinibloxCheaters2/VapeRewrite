import Category from "@vape/core/src/features/modules/api/Category";
import Mod from "@vape/core/src/features/modules/api/Module";
import { SliderSetting } from "@vape/core/src/index";

import Bus from "@/Bus";
import game from "@/utils/refs/game";
import getMovement from "@/utils/movement/getMoveDir";
import calculateMoveSpeed from "@/utils/movement/calculateMoveSpeed";

export default class Speed extends Mod {
	public name = "Speed";
	public category = Category.BLATANT;

	readonly speedSetting: SliderSetting = this.createSliderSetting("Speed", 10, 0.1, 100, 0.01);
	readonly jump = this.createToggleSetting("Jump");

	@Bus.Subscribe("preStepVelocity")
	onTick(): void {
		const {player} = game;
		if (!player) return;
		const moveSpeed = calculateMoveSpeed(player, {
			ignoreColliderSlowdown: false,
			ignoreFlagWalkSpeed: false,
			ignoreSlipperyColliders: false,
			ignoreUnwalkableColliders: false
		});
		const [x, z] = getMovement(moveSpeed + this.speedSetting.value());
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
