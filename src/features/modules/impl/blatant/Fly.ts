import { Subscribe } from "@/event/api/Bus";
import isKeyDown from "@/utils/key";
import getMoveDirection from "@/utils/movement";
import Refs from "@/utils/refs";
import Category from "../../api/Category";
import Mod from "../../api/Module";
import Bus from "@/Bus";

/**
 * Fly Module - Multiple fly modes for different bypass methods
 *
 * Modes:
 * - Normal: Standard creative-like fly (detected by new AC)
 * - Infinite (Old AC): Bypass for old anticheat servers
 * - Jump: Bunny hop in air to bypass AC
 * - Jetpack: Boost upward like a jetpack
 * - Glide: Slow fall with horizontal control
 */
export default class Fly extends Mod {
	public name = "Fly";
	public category = Category.BLATANT;

	// Mode selection
	private modeSetting = this.createDropdownSetting(
		"Mode",
		["Normal", "Infinite (Old AC)", "Gifbubble (Old AC)"],
		"Normal",
	);

	// Speed settings (all modes)
	private speedSetting = this.createSliderSetting(
		"Speed",
		0.18,
		0.05,
		2.0,
		0.01,
		() => this.modeSetting.value() !== "Gifbubble (Old AC)",
	);
	private verticalSetting = this.createSliderSetting(
		"Vertical",
		0.12,
		0.05,
		1.0,
		0.01,
		() => {
			const mode = this.modeSetting.value();
			return mode !== "Gifbubble (Old AC)"; // Hide for Glide mode
		},
	);

	// Infinite mode settings
	private lessVerticalMovement = this.createToggleSetting(
		"Less Glide",
		true,
		() => this.modeSetting.value() === "Infinite (Old AC)",
	);

	// State
	private ticks = 0;
	private warned = false;
	private stopTicks = 0;

	protected onEnable(): void {
		this.ticks = 0;
		this.warned = false;

		const mode = this.modeSetting.value();

		// Show mode-specific warnings
		if (mode === "Infinite (Old AC)" && !this.warned) {
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
		const { player } = Refs;
		const mode = this.modeSetting.value();

		// Smooth stop for certain modes
		if (mode === "Normal" && player) {
			// Clamp motion to prevent sudden drops
			player.motion.x = Math.max(Math.min(player.motion.x, 0.3), -0.3);
			player.motion.z = Math.max(Math.min(player.motion.z, 0.3), -0.3);
		}

		// Infinite mode smooth stop
		if (mode === "Infinite (Old AC)" && this.lessVerticalMovement.value()) {
			this.stopTicks = 4;
			function handler() {
				const { player } = Refs;
				if (!player) {
					Bus.off("tick", handler);
				}

				// Handle smooth stop for Infinite mode
				if (this.stopTicks > 0) {
					player.motion.y = 0.18;
					this.stopTicks--;
				} else {
					Bus.off("tick", handler);
				}
			}
			Bus.on("tick", handler);
		}

		this.ticks = 0;
	}

	@Subscribe("tick")
	public onTick() {
		const mode = this.modeSetting.value();

		switch (mode) {
			case "Normal":
				this.normalFly();
				break;
			case "Infinite (Old AC)":
				this.infiniteFly();
				break;
			case "Gifbubble (Old AC)":
				break;
		}
	}

	/**
	 * Normal Fly - Standard creative-like fly
	 * Uses desync to attempt bypass
	 */
	private normalFly(): void {
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
		}
		// Go up only every 2 ticks, barely helps.
		else if (!this.lessVerticalMovement.value() || this.ticks % 2 === 0) {
			player.motion.y = 0.18;
		}
	}

	public getTag(): string {
		const mode = this.modeSetting.value();
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
