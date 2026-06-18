import Bus from "@/Bus";
import { Subscribe } from "@/event/Bus";
import Refs from "@/utils/helpers/refs";
import isKeyDown from "@/utils/input/key";
import DesyncManager from "@/utils/movement/DesyncManager";
import getMoveDirection from "@/utils/movement/movement";
import Category from "../../api/Category";
import Mod from "../../api/Module";

/**
 * Fly Module - Multiple fly modes for different bypass methods
 *
 * Modes:
 * - Normal: Standard creative-like fly (detected by new AC)
 * - Infinite (Old AC): Bypass for old anticheat servers
 * - Gifbubble (Old AC): Vulcan fly ahh
 */
export default class Fly extends Mod {
	public name = "Fly";
	public category = Category.BLATANT;

	// Mode selection as submodules with nested settings
	private modesGroup = this.createSubmoduleGroup(
		"Modes",
		["Normal", "Infinite (Old AC)"],
		"Normal",
	);

	// Settings inside "Normal" submodule
	private normalSub = this.modesGroup.submodules[0];
	private desyncSetting = this.createToggleSetting(
		"Desync",
		true,
		undefined,
		this.normalSub.settings,
	);
	private speedSetting = this.createSliderSetting(
		"Speed",
		0.18,
		0.05,
		2.0,
		0.01,
		undefined,
		this.normalSub.settings,
	);

	// Settings inside "Infinite (Old AC)" submodule
	private infiniteSub = this.modesGroup.submodules[1];
	private lessVerticalMovement = this.createToggleSetting(
		"Less Vertical Movement",
		true,
		undefined,
		this.infiniteSub.settings,
	);

	// Module-level setting (shared across modes)
	private verticalSetting = this.createSliderSetting(
		"Vertical",
		0.12,
		0.05,
		1.0,
		0.01,
	);

	private desynced = false;

	private get mode(): string {
		return this.modesGroup.value();
	}

	private get desync(): boolean {
		return this.desyncSetting.value();
	}

	private get lessVertical(): boolean {
		return this.lessVerticalMovement.value();
	}

	// State
	private ticks = 0;
	private warned = false;

	protected onEnable(): void {
		this.ticks = 0;

		// Show mode-specific warnings
		if (this.mode === "Infinite (Old AC)" && !this.warned) {
			Refs.chat.addChat({
				text: "Infinite Fly only works on servers using the old AC",
				color: "yellow",
			});
			Refs.chat.addChat({
				text: "(KitPvP, Skywars, Eggwars, Bridge Duels use new AC)",
				color: "gray",
			});
			this.warned = true;
		}
	}

	protected onDisable(): void {
		if (this.desynced) {
			DesyncManager.desync = false;
			this.desynced = false;
		}
		const { player } = Refs;

		// Smooth stop for certain modes
		if (this.mode === "Normal") {
			// Clamp motion to prevent sudden drops
			player.motion.x = Math.max(Math.min(player.motion.x, 0.3), -0.3);
			player.motion.z = Math.max(Math.min(player.motion.z, 0.3), -0.3);
		}

		// Infinite mode smooth stop
		if (this.mode === "Infinite (Old AC)" && this.lessVertical) {
			let stopTicks = 4;
			Bus.onceB("gameTick", () => {
				const { player } = Refs;

				// Handle smooth stop for Infinite mode
				if (stopTicks > 0) {
					player.motion.y = 0.18;
					stopTicks--;
				}
				return stopTicks <= 0;
			});
		}

		this.ticks = 0;
	}

	@Subscribe("gameTick")
	public onTick() {
		switch (this.mode) {
			case "Normal":
				this.normalFly();
				break;
			case "Infinite (Old AC)":
				this.infiniteFly();
				break;
		}
	}

	private normalFly(): void {
		if (this.desync && !DesyncManager.desync) {
			DesyncManager.desync = true;
			this.desynced = true;
		}
		const { player } = Refs;
		const dir = getMoveDirection(this.speedSetting.value());

		player.motion.x = dir.x;
		player.motion.z = dir.z;

		const goUp = isKeyDown("space");
		const goDown = isKeyDown("shift");

		player.motion.y = goUp
			? this.verticalSetting.value()
			: goDown
				? -this.verticalSetting.value()
				: 0;
	}

	/**
	 * Infinite Fly - Old AC bypass
	 * Uses special Y-axis control to bypass the old AntiCheat
	 */
	private infiniteFly(): void {
		const { player } = Refs;
		this.ticks++;

		const dir = getMoveDirection(this.speedSetting.value());
		player.motion.x = dir.x;
		player.motion.z = dir.z;

		const goUp = isKeyDown("space");
		const goDown = isKeyDown("alt");

		// First 6 ticks: stay still (unless moving up/down)
		if (this.ticks <= 6 && !goUp && !goDown) {
			player.motion.y = 0;
			return;
		}

		// Manual up/down control
		if (goUp || goDown) {
			player.motion.y = goUp
				? this.verticalSetting.value()
				: -this.verticalSetting.value();
		} // Go up only every 2 ticks, barely helps.
		else if (!this.lessVertical || this.ticks % 2 === 0) {
			player.motion.y = 0.18;
		}
	}

	public getTag(): string {
		const mode = this.mode;
		const speed = this.speedSetting.value().toFixed(2);

		switch (mode) {
			case "Normal":
				return `Normal ${speed}`;
			case "Infinite (Old AC)":
				return `Infinite ${speed}`;
			default:
				return mode;
		}
	}
}
