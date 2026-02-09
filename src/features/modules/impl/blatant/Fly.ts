import { Subscribe } from "@/event/api/Bus";
import isKeyDown from "@/utils/key";
import getMoveDirection from "@/utils/movement";
import Refs from "@/utils/refs";
import Category from "../../api/Category";
import Mod from "../../api/Module";

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
		["Normal", "Infinite (Old AC)", "Jump", "Jetpack", "Glide"],
		"Normal",
	);

	// Speed settings (all modes)
	private speedSetting = this.createSliderSetting(
		"Speed",
		0.18,
		0.05,
		2.0,
		0.01,
	);
	private verticalSetting = this.createSliderSetting(
		"Vertical",
		0.12,
		0.05,
		1.0,
		0.01,
		() => {
			const mode = this.modeSetting.value();
			return mode !== "Glide"; // Hide for Glide mode
		},
	);

	// Normal mode settings
	private desyncSetting = this.createToggleSetting(
		"Desync",
		true,
		() => this.modeSetting.value() === "Normal",
	);

	// Infinite mode settings
	private lessVerticalMovement = this.createToggleSetting(
		"Less Glide",
		true,
		() => this.modeSetting.value() === "Infinite (Old AC)",
	);

	// Jump mode settings
	private jumpHeightSetting = this.createSliderSetting(
		"Jump Height",
		0.42,
		0.2,
		0.6,
		0.01,
		() => this.modeSetting.value() === "Jump",
	);
	private jumpIntervalSetting = this.createSliderSetting(
		"Jump Interval",
		10,
		5,
		20,
		1,
		() => this.modeSetting.value() === "Jump",
	);

	// Jetpack mode settings
	private jetpackBoostSetting = this.createSliderSetting(
		"Jetpack Boost",
		0.05,
		0.01,
		0.2,
		0.01,
		() => this.modeSetting.value() === "Jetpack",
	);
	private jetpackMaxSpeedSetting = this.createSliderSetting(
		"Max Speed",
		0.5,
		0.3,
		1.0,
		0.05,
		() => this.modeSetting.value() === "Jetpack",
	);

	// Glide mode settings
	private glideSpeedSetting = this.createSliderSetting(
		"Glide Speed",
		0.03,
		0.01,
		0.1,
		0.01,
		() => this.modeSetting.value() === "Glide",
	);
	private glideHorizontalMultiplierSetting = this.createSliderSetting(
		"Horizontal Multiplier",
		1.5,
		1.0,
		3.0,
		0.1,
		() => this.modeSetting.value() === "Glide",
	);

	// State
	private ticks = 0;
	private warned = false;
	private damageTimer = 0;
	private jumpTimer = 0;
	private stopTicks = 0;
	private damageStartY = 0; // Y coordinate when damage fly starts

	protected onEnable(): void {
		this.ticks = 0;
		this.warned = false;
		this.damageTimer = 0;
		this.jumpTimer = 0;
		this.stopTicks = 0;
		this.damageStartY = 0;

		const mode = this.modeSetting.value();

		// Show mode-specific warnings
		if (mode === "Infinite (Old AC)" && !this.warned) {
			Refs.game.chat.addChat({
				text: "Infinite Fly only works on servers using the old AC",
				color: "yellow",
			});
			Refs.game.chat.addChat({
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
		}

		this.ticks = 0;
		this.damageTimer = 0;
		this.jumpTimer = 0;
	}

	@Subscribe("tick")
	public onTick() {
		const { player } = Refs;
		if (!player) return;

		// Handle smooth stop for Infinite mode
		if (this.stopTicks > 0) {
			player.motion.y = 0.18;
			this.stopTicks--;
			return;
		}

		const mode = this.modeSetting.value();

		switch (mode) {
			case "Normal":
				this.normalFly();
				break;
			case "Infinite (Old AC)":
				this.infiniteFly();
				break;
			case "Jump":
				this.jumpFly();
				break;
			case "Jetpack":
				this.jetpackFly();
				break;
			case "Glide":
				this.glideFly();
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
	 * Uses special Y-axis control with glide to bypass old anticheat
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

	/**
	 * Jump Fly - Bunny hop in air
	 * Repeatedly jumps in air to bypass AC (can only go down)
	 */
	private jumpFly(): void {
		const { player } = Refs;
		this.ticks++;
		this.jumpTimer++;

		// Horizontal movement
		const dir = getMoveDirection(this.speedSetting.value());
		player.motion.x = dir.x;
		player.motion.z = dir.z;

		const goDown = isKeyDown("shift");

		// Jump at configured interval to maintain height
		if (this.jumpTimer >= this.jumpIntervalSetting.value()) {
			this.jumpTimer = 0;
			player.motion.y = this.jumpHeightSetting.value();
		}

		// Allow going down
		if (goDown) {
			player.motion.y = -this.verticalSetting.value();
			this.jumpTimer = 0; // Reset jump timer when going down
		}
	}

	/**
	 * Jetpack Fly - Boost upward like a jetpack
	 * Hold space to boost up, release to fall
	 */
	private jetpackFly(): void {
		const { player } = Refs;

		// Horizontal movement
		const dir = getMoveDirection(this.speedSetting.value());
		player.motion.x = dir.x;
		player.motion.z = dir.z;

		const goUp = isKeyDown("space");
		const goDown = isKeyDown("shift");

		const maxSpeed = this.jetpackMaxSpeedSetting.value();

		if (goUp) {
			// Boost upward
			player.motion.y += this.jetpackBoostSetting.value();
			// Cap max upward velocity
			if (player.motion.y > maxSpeed) {
				player.motion.y = maxSpeed;
			}
		} else if (goDown) {
			// Fast descent
			player.motion.y = -this.verticalSetting.value();
		} else {
			// Natural fall (gravity)
			player.motion.y -= 0.08;
			// Cap fall speed
			if (player.motion.y < -maxSpeed) {
				player.motion.y = -maxSpeed;
			}
		}
	}

	/**
	 * Glide Fly - Slow fall with horizontal control
	 * Glides down slowly while maintaining horizontal movement
	 */
	private glideFly(): void {
		const { player } = Refs;

		// Horizontal movement (configurable multiplier)
		const multiplier = this.glideHorizontalMultiplierSetting.value();
		const dir = getMoveDirection(this.speedSetting.value() * multiplier);
		player.motion.x = dir.x;
		player.motion.z = dir.z;

		const goDown = isKeyDown("shift");

		if (goDown) {
			// Faster descent
			player.motion.y = -0.3; // Fixed fast descent
		} else {
			// Slow glide down
			player.motion.y = -this.glideSpeedSetting.value();
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
			case "Jump":
				return `Jump ${speed}`;
			case "Jetpack":
				return `Jetpack ${speed}`;
			case "Glide":
				return `Glide ${speed}`;
			default:
				return mode;
		}
	}
}
