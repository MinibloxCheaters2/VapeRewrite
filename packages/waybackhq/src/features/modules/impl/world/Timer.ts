import Category from "@vape/core/features/modules/api/Category";
import Mod from "@vape/core/features/modules/api/Module";

import Refs from "@/hooks/game";

export default class Timer extends Mod {
	public name = "Timer";
	public category = Category.BLATANT;

	// Timer speed multiplier
	private speedSetting = this.createSliderSetting("Speed", 1.2, 1.0, 3.0, 0.1);
	#origTPS: number;

	protected onEnable(): void {
		const { timer } = Refs;
		if (!timer) return;
		this.#origTPS = timer.ticksPerSecond;
		timer.ticksPerSecond = this.#origTPS * this.speedSetting.value();
	}

	protected onDisable(): void {
		const { timer } = Refs;
		if (!timer) return;
		timer.ticksPerSecond = this.#origTPS;
	}

	public getTag(): string {
		return `${this.speedSetting.value().toFixed(1)}x`;
	}
}
