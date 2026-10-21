import { Category } from "@vape/core";
import { Mod } from "@vape/core";

import Bus from "@/Bus";
import getMovement from "@/utils/movement/getMoveDir";
import game from "@/utils/refs/game";

export default class Fly extends Mod {
	public name = "Fly";
	public category = Category.BLATANT;

	readonly speedSetting = this.createSliderSetting("Speed", 10, 0.1, 100, 0.01);
	readonly verticalSpeedSetting = this.createSliderSetting("VerticalSpeed", 10, 0.1, 100, 0.1);

	@Bus.Subscribe("preStepVelocity")
	onPreStepVelocity() {
		const { player } = game;
		if (!player) return;
		player.rigidBody.fly = true;
	}

	@Bus.Subscribe("postStepVelocity")
	onPostStepVelocity(): void {
		const { player } = game;
		if (!player) return;
		player.rigidBody.fly = false;
		const [x, z] = getMovement(this.speedSetting.value());
		const {rigidBody: {velocity}} = player;
		velocity.x = x;
		velocity.z = z;
		const { inputManager } = player;
		const {keys} = inputManager;
		const [up, down] = [keys.get("flyUp").pressed, keys.get("flyDown").pressed];
		const vSpeed = this.verticalSpeedSetting.value();
		let yVelocity = 0;
		if (up && !down) {
			yVelocity = vSpeed;
		} else if (down && !up) {
			yVelocity = -vSpeed;
		}
		velocity.y = yVelocity;
	}

	getTag(): string {
		return `Normal ${this.speedSetting.value().toFixed(2)}`;
	}
}
