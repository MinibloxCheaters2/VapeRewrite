import { SliderSetting } from "@vape/core/features/config/Settings";
import Category from "@vape/core/features/modules/api/Category";
import Mod from "@vape/core/features/modules/api/Module";

import Bus from "@/Bus";
import { getMoveDir } from "@/utils/movement";

export default class Speed extends Mod {
	public name = "Speed";
	public category = Category.BLATANT;

	private readonly speedSetting: SliderSetting = this.createSliderSetting(
		"Speed",
		1,
		0.11,
		6.0,
		0.01,
	);

	@Bus.Subscribe("playerTick")
	onTick(): void {
		// const {
		// 	game: { localPlayer },
		// } = Refs;
		const dir = getMoveDir(this.speedSetting.value());
		const [x, z] = dir;

		// localPlayer.motionX = x;
		// localPlayer.motionZ = z;
	}

	onDisable(): void {
		// const {
		// 	game: { localPlayer },
		// } = Refs;
		// localPlayer.motionX = Math.max(Math.min(localPlayer.motionX, 0.3), -0.3);
		// localPlayer.motionZ = Math.max(Math.min(localPlayer.motionZ, 0.3), -0.3);
	}

	getTag(): string {
		return this.speedSetting.value().toFixed(2);
	}
}
