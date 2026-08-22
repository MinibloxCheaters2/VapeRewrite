import type Fly from "./index";
import type { SliderSetting } from "@vape/core/features/config/Settings";

import SubModule from "@vape/core/features/config/SubModule";

import Bus from "@/Bus";
import Refs from "@/hooks/game";
import { getMoveDir } from "@/utils/movement";

export default class NormalSub extends SubModule<Fly> {
	readonly speedSetting: SliderSetting = this.createSliderSetting("Speed", 1, 0.11, 6.0, 0.01);

	@Bus.Subscribe("playerTick")
	onTick(): void {
		const { input, localPlayer: player } = Refs.game;
		const [x, z] = getMoveDir(this.speedSetting.value());

		player.motionX = x;
		player.motionZ = z;

		const goUp = input.keys.has(input.binds.jump);
		const goDown = input.keys.has(input.binds.sneak);

		player.motionY = goUp
			? this.parent.verticalSetting.value()
			: goDown
				? -this.parent.verticalSetting.value()
				: 0;
	}

	onDisable(): void {
		const { localPlayer: player } = Refs.game;
		player.motionX = Math.max(Math.min(player.motionX, 0.3), -0.3);
		player.motionZ = Math.max(Math.min(player.motionZ, 0.3), -0.3);
	}

	getTag(): string {
		return `Normal ${this.speedSetting.value().toFixed(2)}`;
	}
}
