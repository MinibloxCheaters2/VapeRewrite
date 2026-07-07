import type {
	AnySetting,
	SliderSetting,
	ToggleSetting,
} from "@/features/config/Settings";
import SubModule from "@/features/config/SubModule";
import Refs from "@/utils/helpers/refs";
import isKeyDown from "@/utils/input/key";
import DesyncManager from "@/utils/movement/DesyncManager";
import getMoveDirection from "@/utils/movement/movement";
import type Fly from "./index";

export default class NormalSub extends SubModule {
	readonly desyncSetting: ToggleSetting = this.createToggleSetting("Desync", true);
	readonly speedSetting: SliderSetting;

	constructor(fly: Fly, target: AnySetting[]) {
		super(fly, target);
		this.desyncSetting = this.createToggleSetting("Desync", true);
		this.speedSetting = this.createSliderSetting(
			"Speed",
			0.18,
			0.05,
			2.0,
			0.01,
		);
	}

	onTick(fly: Fly): void {
		if (this.desyncSetting.value() && !DesyncManager.desync) {
			DesyncManager.desync = true;
			fly.desynced = true;
		}
		const { player } = Refs;
		const dir = getMoveDirection(this.speedSetting.value());

		player.motion.x = dir.x;
		player.motion.z = dir.z;

		const goUp = isKeyDown("space");
		const goDown = isKeyDown("shift");

		player.motion.y = goUp
			? fly.verticalSetting.value()
			: goDown
				? -fly.verticalSetting.value()
				: 0;
	}

	onDisable(_fly: Fly): void {
		const { player } = Refs;
		player.motion.x = Math.max(Math.min(player.motion.x, 0.3), -0.3);
		player.motion.z = Math.max(Math.min(player.motion.z, 0.3), -0.3);
	}

	getTag(): string {
		return `Normal ${this.speedSetting.value().toFixed(2)}`;
	}
}
