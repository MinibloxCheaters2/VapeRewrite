import { createSignal } from "solid-js";
import Bus from "@/Bus";
import { addBind, removeBind, setBind } from "@/features/binds/handler";
import Configurable from "@/features/config/Configurable";
import type { BaseSetting } from "@/features/config/Settings";
import { showNotification } from "@/ui/notifications";
import { dynamicIsland } from "../DynamicIsland";
import type { Category } from "./Category";

const NO_BIND = "";

const TOGGLE_CALLBACK = (m: Mod) => () => m.toggle();

export default abstract class Mod extends Configurable {
	/** The name of this module. */
	public abstract name: string;
	/** What category this module is in */
	public abstract category: Category;

	/** Is the module enabled / on? */
	private stateSignal = createSignal(false, {
		name: "Module state signal",
	});

	/** Some text to show after the module, i.e. the mode, this CAN BE UNDEFINED. */
	private tagSignal = createSignal<string | undefined>();

	/** What is this module bound to? */
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

	get tagAccessor() {
		return this.tagSignal[0];
	}

	get bind() {
		return this.bindSignal[0]();
	}

	get tag() {
		return this.tagSignal[0]();
	}

	set tag(value: string | undefined) {
		this.tagSignal[1](value);
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

	private tagBy<S extends BaseSetting<V>, V>(setting: S): S {
		this.tag = setting.name;
		this.tagSignal[1](setting.name);
		return setting;
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
		showNotification(
			this.name,
			this.enabled ? "Enabled" : "Disabled",
			"info",
			2000,
		);

		// Show Dynamic Island if enabled (show for both enable and disable)
		try {
			console.log("Dynamic Island check:", dynamicIsland);
			if (dynamicIsland) {
				dynamicIsland.show({
					duration: 1000,
					width: 300,
					height: 60,
					elements: [
						{
							type: "text",
							content: this.name,
							x: 10,
							y: -8,
							color: "#fff",
							size: 18,
							bold: true,
						},
						{
							type: "text",
							content: this.enabled ? "ENABLED" : "DISABLED",
							x: 10,
							y: 12,
							color: this.enabled ? "#0FB3A0" : "#ff4444",
							size: 12,
							bold: true,
						},
						{
							type: "toggle",
							state: this.enabled,
							x: -100,
							y: 0,
							size: 30,
							animate: true,
						},
					],
				});
			}
		} catch (e) {
			console.error("Dynamic Island error:", e);
		}
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
