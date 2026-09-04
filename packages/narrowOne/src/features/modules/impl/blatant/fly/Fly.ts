import Category from "@vape/core/features/modules/api/Category";
import Mod from "@vape/core/features/modules/api/Module";

import Bus from "@/Bus";
import getMovement from "@/utils/movement/getMoveDir";
import Refs from "@/utils/Refs";


export default class Fly extends Mod {
	public name = "Fly";
	public category = Category.BLATANT;

	readonly speedSetting = this.createSliderSetting("Speed", 10, 0.1, 100, 0.01);
	readonly verticalSpeedSetting = this.createSliderSetting("VerticalSpeed", 10, 0.1, 100, 0.1);
	readonly bypassValue = this.createSliderSetting("BypassValue", 5, 0, 1, 0.01);

	@Bus.Subscribe("gameTick")
	onTick(): void {
		const { player } = Refs;
		if (!player) return;
		const [x, z] = getMovement(this.speedSetting.value());
		const {rigidBody: {velocity}} = player;
		velocity.x = x;
		velocity.z = z;
		const { inputManager } = player;
		const {keys} = inputManager;
		const [up, down] = [keys.get("flyUp").pressed, keys.get("flyDown").pressed];
		const vSpeed = this.verticalSpeedSetting.value();
		let yVelocity;
		if (up && !down) {
			yVelocity = vSpeed;
		} else if (down && !up) {
			yVelocity = -vSpeed;
		}
		if (yVelocity !== undefined) {
			velocity.y = yVelocity;
		} else if (velocity.y < this.bypassValue.value()) {
			velocity.y = -velocity.y;
		}
	}

	getTag(): string {
		return `Normal ${this.speedSetting.value().toFixed(2)}`;
	}
}
