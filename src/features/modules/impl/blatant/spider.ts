// idk if this works lmao
import { Subscribe } from "@/event/api/Bus";
import Refs from "@/utils/refs";
import Category from "../../api/Category";
import Mod from "../../api/Module";

export default class Spider extends Mod {
	public name = "Spider";
	public category = Category.BLATANT;

	private climbSpeedSetting = this.createSliderSetting(
		"Climb Speed",
		0.2,
		0.05,
		0.5,
		0.05,
	);
	private wallDetectRangeSetting = this.createSliderSetting(
		"Wall Range",
		0.3,
		0.1,
		0.6,
		0.05,
	);
	private autoClimbSetting = this.createToggleSetting("Auto Climb", false);

	get climbSpeed() {
		return this.climbSpeedSetting.value();
	}

	get wallDetectRange() {
		return this.wallDetectRangeSetting.value();
	}

	get autoClimb() {
		return this.autoClimbSetting.value();
	}

	private isNearWall(): boolean {
		const { player, game } = Refs;
		if (!player || !game) return false;

		const range = this.wallDetectRange;
		const { BlockPos } = Refs;

		// Check all 4 cardinal directions
		const directions = [
			{ x: range, z: 0 },
			{ x: -range, z: 0 },
			{ x: 0, z: range },
			{ x: 0, z: -range },
		];

		const playerX = Math.floor(player.pos.x);
		const playerY = Math.floor(player.pos.y);
		const playerZ = Math.floor(player.pos.z);

		for (const dir of directions) {
			const checkPos = new BlockPos(
				playerX + Math.sign(dir.x),
				playerY,
				playerZ + Math.sign(dir.z),
			);

			const block = game.world.getBlockState(checkPos).getBlock();
			const { Materials } = Refs;

			if (Materials && block.material !== Materials.air) {
				return true;
			}
		}

		return false;
	}

	private isCollidingHorizontally(): boolean {
		const { player } = Refs;
		if (!player) return false;

		const box = player.boundingBox;
		const expandedBox = box.expand(this.wallDetectRange, 0, this.wallDetectRange);

		const { game } = Refs;
		if (!game) return false;

		const collidingBlocks = game.world.getCollisionBoxes(expandedBox);
		return collidingBlocks.length > 0;
	}

	@Subscribe("tick")
	public onTick() {
		const { player } = Refs;
		if (!player) return;

		const nearWall = this.isNearWall() || this.isCollidingHorizontally();

		if (!nearWall) return;

		const shouldClimb =
			this.autoClimb || player.motionY < 0 || player.onGround;

		if (shouldClimb) {
			// Climb Climb Climb!!
			player.motion.y = this.climbSpeed;
		}
	}

	public getTag(): string {
		return `${this.climbSpeed.toFixed(2)}`;
	}
}
