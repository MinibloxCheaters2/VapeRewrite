import Refs from "@/utils/refs";
import Category from "../../api/Category";
import Mod from "../../api/Module";

/**
 * Timer Module - Accelerates game tick rate
 *
 * Speed 1.2x: Works short-term, long-term causes 0,0 teleport
 * Speed 2.0x+: Instant kick (packet rate limit)
 */
export default class Timer extends Mod {
	public name = "Timer";
	public category = Category.BLATANT;

	// Timer speed multiplier
	private speedSetting = this.createSliderSetting(
		"Speed",
		1.2,
		1.0,
		3.0,
		0.1,
	);

	// Original fixedUpdate function
	private originalFixedUpdate: (() => void) | null = null;
	private isHooked = false;

	protected onEnable(): void {
		this.hookFixedUpdate();
	}

	protected onDisable(): void {
		this.unhookFixedUpdate();
	}

	/**
	 * Hook the game's fixedUpdate to call it multiple times per frame
	 */
	private hookFixedUpdate(): void {
		if (this.isHooked) return;

		const { player } = Refs;
		if (!player) return;

		// Get the player's fixedUpdate method
		const playerProto = Object.getPrototypeOf(player);
		if (!playerProto || !playerProto.fixedUpdate) return;

		// Store original function
		this.originalFixedUpdate = playerProto.fixedUpdate;
		this.isHooked = true;

		const self = this;
		let accumulator = 0;

		// Replace with accelerated version
		playerProto.fixedUpdate = function (this: typeof player) {
			if (!self.enabled || !self.originalFixedUpdate) {
				// If disabled, call original once
				self.originalFixedUpdate?.call(this);
				return;
			}

			const speed = self.speedSetting.value();

			// Accumulate the speed multiplier
			accumulator += speed;

			// Call fixedUpdate for each accumulated call
			while (accumulator >= 1.0) {
				self.originalFixedUpdate.call(this);
				accumulator -= 1.0;
			}
		};
	}

	/**
	 * Restore original fixedUpdate
	 */
	private unhookFixedUpdate(): void {
		if (!this.isHooked || !this.originalFixedUpdate) return;

		const { player } = Refs;
		if (!player) return;

		const playerProto = Object.getPrototypeOf(player);
		if (!playerProto) return;

		// Restore original function
		playerProto.fixedUpdate = this.originalFixedUpdate;
		this.isHooked = false;
		this.originalFixedUpdate = null;
	}

	public getTag(): string {
		return `${this.speedSetting.value().toFixed(1)}x`;
	}
}
