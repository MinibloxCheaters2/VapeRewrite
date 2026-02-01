import { createSignal } from "solid-js";
import Bus from "@/Bus";
import { addBind, removeBind, setBind } from "@/features/binds/handler";
import type { Category } from "./Category";

const NO_BIND = "";

const TOGGLE_CALLBACK = (m: Mod) => () => m.toggle();

export default abstract class Mod {
	/** The name of this module. */
	public abstract name: string;
	/** What category this module is in */
	public abstract category: Category;

	private stateSignal = createSignal(false, {
		name: "Module state signal",
	});

	private bindSignal = createSignal(NO_BIND, {
		name: "Module bind signal",
	});

	#keyID: string;

	get KEY_ID() {
		this.#keyID ??= `mod${this.name}`;
		return this.#keyID;
	}

	get bindAccessor() {
		return this.bindSignal[0];
	}

	get bind() {
		return this.bindSignal[0]();
	}

	#updateBind(orig: string, newBind: string) {
		if (newBind === NO_BIND) {
			removeBind(orig, this.KEY_ID);
		} else {
			if (orig === NO_BIND) {
				addBind(newBind, this.KEY_ID, TOGGLE_CALLBACK(this));
			} else {
				setBind(orig, newBind, this.KEY_ID);
			}
		}
	}

	set bind(value: string) {
		this.#updateBind(this.bindSignal[0](), value);

		this.bindSignal[1](value);
	}

	get stateAccessor() {
		return this.stateSignal[0];
	}

	/**
	 * Do NOT override this, override {@link onEnable} instead
	 * This registers the module and calls {@link onEnable}.
	 */
	private onEnableInternal(): void {
		Bus.registerSubscriber(this);
		this.onEnable();
	}

	/**
	 * Do NOT override this, override {@link onEnable} instead.
	 * This deregisters the module and calls {@link onDisable}.
	 */
	private onDisableInternal(): void {
		Bus.unregisterSubscriber(this);
		this.onDisable();
	}

	/** Called when the module is enabled. */
	protected onEnable(): void {}

	/** Called when the module is disabled. */
	protected onDisable(): void {}

	/** Toggles this module without sending a notification. */
	public toggleSilently(): void {
		this.enabled = !this.enabled;
	}

	/** Toggles this module and sends a notification. */
	public toggle(): void {
		this.toggleSilently();
		// TODO: implement toggle notifications and dynamic island stuff here
	}

	private set state(value: boolean) {
		this.stateSignal[1](value);
	}

	private get state(): boolean {
		return this.stateSignal[0]();
	}

	set enabled(value: boolean) {
		this.state = value;
		if (value) {
			this.onEnableInternal();
		} else {
			this.onDisableInternal();
		}
	}

	get enabled(): boolean {
		return this.state;
	}
}
