/**
 * Rotation test basically
 * @module
 */
import Category from "@vape/core/features/modules/api/Category";
import Mod from "@vape/core/features/modules/api/Module";

import Bus from "@/Bus";
import RotationManager, { RotationPlan } from "@/utils/aiming/rotate";
import Rotation from "@/utils/aiming/rotation";
import { SETTING } from "@/utils/movement/MovementCorrection";

export default class Derp extends Mod {
	public name = "Derp";
	public category = Category.BLATANT;
	private movementCorrection = this.createDropdownSetting("MovementCorrection", SETTING);

	@Bus.Subscribe("playerTick")
	onTick() {
		const current = RotationManager.activeRotation;
		RotationManager.scheduleRotation(
			new RotationPlan(
				new Rotation(current.yaw + 5, (current.pitch + 2) % 90),
				this.movementCorrection.value().value,
				1,
			),
		);
	}
}
