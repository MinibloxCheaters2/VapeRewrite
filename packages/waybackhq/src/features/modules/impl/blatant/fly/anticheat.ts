import type Fly from "./index";
import type { SliderSetting } from "@vape/core/features/config/Settings";

import SubModule from "@vape/core/features/config/SubModule";

import Bus from "@/Bus";
import Refs from "@/hooks/game";
import { getMoveDir } from "@/utils/movement";

enum StateThing {
	FLAG,
	MOVE,
}

export default class NormalSub extends SubModule<Fly> {
	readonly speedSetting: SliderSetting = this.createSliderSetting("Speed", 1, 0.11, 6.0, 0.01);
	#state = StateThing.FLAG;

	@Bus.Subscribe("playerTick")
	onTick(): void {
		if (this.#state === StateThing.FLAG) {
			const { session, localPlayer: player } = Refs.game;
			session.movementSequence -= 1e-3;
			player.posY += 0.03;
			session.sendMove();
			player.posY -= 0.03;
			return;
		}
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

	getTag(): string {
		return `Normal ${this.speedSetting.value().toFixed(2)}`;
	}
}
