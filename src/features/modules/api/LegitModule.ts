import { createSignal } from "solid-js";
import Bus from "@/Bus";
import Configurable from "@/features/config/Configurable";

export default abstract class LegitModule extends Configurable {
	/** The display name of this legit module. */
	public abstract name: string;
	/** Tooltip shown on hover in the Lua reference. */
	public readonly tooltip?: string;
	/** Optional custom size (e.g. 100x41 for stats labels). */
	public readonly customSize?: { width: number; height: number };

	readonly #stateSignal = createSignal(false, {
		name: "LegitModule state signal",
	});

	get enabled(): boolean {
		return this.#stateSignal[0]();
	}

	set enabled(value: boolean) {
		this.#stateSignal[1](value);
		if (value) {
			this.modNameForConfig = this.name;
			Bus.registerSubscriber(this);
		} else {
			Bus.unregisterSubscriber(this);
		}
		this.onToggle();
	}

	get enabledAccessor() {
		return this.#stateSignal[0];
	}

	public onToggle() {}

	/** Toggle this module on/off. */
	public toggle(): void {
		this.enabled = !this.enabled;
	}
}
