import Bus from "@/Bus";
import type { AnySetting, ToggleSetting } from "@/features/config/Settings";
import SubModule from "@/features/config/SubModule";
import isKeyDown from "@/utils/input/key";
import getMoveDirection from "@/utils/movement/movement";
import Miniblox from "@/utils/refs/miniblox";
import type Fly from "./index";

export default class InfiniteSub extends SubModule {
	public lessVerticalSetting!: ToggleSetting;

	constructor(fly: Fly, target: AnySetting[]) {
		super(fly, target);
		this.lessVerticalSetting = this.createToggleSetting(
			"Less Vertical Movement",
			true,
		);
	}

	onTick(fly: Fly, speed: number): void {
		const { player } = Miniblox;
		fly.ticks++;

		const dir = player.getMoveDirection(speed);
		player.motion.x = dir.x;
		player.motion.z = dir.z;

		const goUp = isKeyDown("space");
		const goDown = isKeyDown("alt");

		if (fly.ticks <= 6 && !goUp && !goDown) {
			player.motion.y = 0;
			return;
		}

		if (goUp || goDown) {
			player.motion.y = goUp
				? fly.verticalSetting.value()
				: -fly.verticalSetting.value();
		} else if (!this.lessVerticalSetting.value() || fly.ticks % 2 === 0) {
			player.motion.y = 0.18;
		}
	}

	onDisable(_fly: Fly): void {
		if (this.lessVerticalSetting.value()) {
			let stopTicks = 4;
			Bus.onceB("gameTick", () => {
				const { player } = Miniblox;
				if (stopTicks > 0) {
					player.motion.y = 0.18;
					stopTicks--;
				}
				return stopTicks <= 0;
			});
		}
	}

	getTag(speed: number): string {
		return `Infinite ${speed.toFixed(2)}`;
	}
}
