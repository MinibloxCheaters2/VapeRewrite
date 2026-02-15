import { Subscribe } from "@/event/api/Bus";
import Refs from "@/utils/refs";
import Category from "../../api/Category";
import Mod from "../../api/Module";

export default class LiquidWalk extends Mod {
	public name = "LiquidWalk";
	public category = Category.WORLD;

	// Settings
	private speedSetting = this.createSliderSetting(
		"Speed",
		1.0,
		0.5,
		2.0,
		0.1,
	);
	private bounceSetting = this.createToggleSetting("Bounce", true);
	private bounceHeightSetting = this.createSliderSetting(
		"Bounce Height",
		0.5,
		0.1,
		1.0,
		0.1,
		() => this.bounceSetting.value(),
	);
	private waterOnlySetting = this.createToggleSetting("Water Only", false);

	get speed() {
		return this.speedSetting.value();
	}

	get bounce() {
		return this.bounceSetting.value();
	}

	get bounceHeight() {
		return this.bounceHeightSetting.value();
	}

	get waterOnly() {
		return this.waterOnlySetting.value();
	}

	private isInLiquid(testY: number): boolean {
		const { player, game, Materials } = Refs;
		if (!player || !game || !Materials) return false;

		const { BlockPos } = Refs;
		const pos = new BlockPos(
			Math.floor(player.pos.x),
			Math.floor(testY),
			Math.floor(player.pos.z),
		);

		const block = game.world.getBlockState(pos).getBlock();
		return (
			block.material === Materials.water ||
			(!this.waterOnly && block.material === Materials.lava)
		);
	}

	private isLiquidBelow(): boolean {
		const { player } = Refs;
		if (!player) return false;

		return this.isInLiquid(player.pos.y - 0.1);
	}

	private isLiquidAtFeet(): boolean {
		const { player } = Refs;
		if (!player) return false;

		return this.isInLiquid(player.pos.y);
	}

	@Subscribe("tick")
	public onTick() {
		const { player } = Refs;
		if (!player) return;

		const atLiquid = this.isLiquidAtFeet();
		const belowLiquid = this.isLiquidBelow();

		if ((atLiquid || belowLiquid) && player.motion.y < 0) {
			player.motion.y = 0;

			if (this.bounce && atLiquid) {
				player.motion.y = this.bounceHeight;
			}
		}

		if (belowLiquid || atLiquid) {
			player.motion.x *= this.speed;
			player.motion.z *= this.speed;
		}
	}

	public getTag(): string {
		return this.waterOnly ? "Water" : "Liquid";
	}
}
