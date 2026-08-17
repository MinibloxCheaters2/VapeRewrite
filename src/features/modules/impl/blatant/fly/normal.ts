import { Subscribe } from "@/event/Bus";
import type { SliderSetting } from "@/features/config/Settings";
import SubModule from "@/features/config/SubModule";
import isKeyDown from "@/utils/input/key";
import getMoveDirection from "@/utils/movement/movement";
import Miniblox from "@/utils/refs/miniblox";
import type Fly from "./index";

export default class NormalSub extends SubModule<Fly> {
	readonly speedSetting: SliderSetting = this.createSliderSetting("Speed", 1, 0.11, 6.0, 0.01);

	@Subscribe("playerTick")
	onTick(): void {
		const { player } = Miniblox;
		const dir = getMoveDirection(this.speedSetting.value());

		player.motion.x = dir.x;
		player.motion.z = dir.z;

		const goUp = isKeyDown("Space");
		const goDown = isKeyDown("LeftShift");

		player.motion.y = goUp
			? this.parent.verticalSetting.value()
			: goDown
				? -this.parent.verticalSetting.value()
				: 0;
	}

	onDisable(): void {
		const { player } = Miniblox;
		player.motion.x = Math.max(Math.min(player.motion.x, 0.3), -0.3);
		player.motion.z = Math.max(Math.min(player.motion.z, 0.3), -0.3);
	}

	getTag(): string {
		return `Normal ${this.speedSetting.value().toFixed(2)}`;
	}
}
