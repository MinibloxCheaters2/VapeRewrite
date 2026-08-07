import type { ClientEntityPlayer } from "@wq2/miniblox-sdk";
import Miniblox from "@/utils/refs/miniblox";
import Category from "../../api/Category";
import Mod from "../../api/Module";

/**
 * Timer Module - Accelerates game tick rate
 *
 * Speed 1.2x: Works short-term, long-term causes 0,0 teleport
 * Speed 2.0x+: Instant kick (packet rate limit)
 * TODO: properly implement this
 */
export default class Timer extends Mod {
	public name = "Timer";
	public category = Category.BLATANT;

	// Timer speed multiplier
	private speedSetting = this.createSliderSetting("Speed", 1.2, 1.0, 3.0, 0.1);

	// Original fixedUpdate function
	private originalFixedUpdate: (() => void) | null = null;
	private isHooked = false;

	protected onEnable(): void {}

	protected onDisable(): void {}

	/**
	 * Restore original fixedUpdate
	 */
	private unhookFixedUpdate(): void {
		if (!this.isHooked || !this.originalFixedUpdate) return;

		const { player } = Miniblox;
		if (!player) return;

		const playerProto = Object.getPrototypeOf(player) as ClientEntityPlayer;
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
