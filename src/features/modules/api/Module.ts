import { type Accessor, createSignal } from "solid-js";
import Bus from "@/Bus";
import { addBind, removeBind, setBind } from "@/features/binds/handler";
import type { Category } from "./Category";

const NO_BIND = "";

const TOGGLE_CALLBACK = (m: Mod) => () => m.toggle();

// Setting types
export interface BaseSetting {
	name: string;
	type: string;
}

export interface ToggleSetting extends BaseSetting {
	type: "toggle";
	value: Accessor<boolean>;
	setValue: (value: boolean) => void;
}

export interface SliderSetting extends BaseSetting {
	type: "slider";
	value: Accessor<number>;
	setValue: (value: number) => void;
	min: number;
	max: number;
	step?: number;
}

export interface DropdownSetting extends BaseSetting {
	type: "dropdown";
	value: Accessor<string>;
	setValue: (value: string) => void;
	options: string[];
}

export interface TextBoxSetting extends BaseSetting {
	type: "textbox";
	value: Accessor<string>;
	setValue: (value: string) => void;
	placeholder?: string;
}

export interface ColorSliderSetting extends BaseSetting {
	type: "colorslider";
	hue: Accessor<number>;
	sat: Accessor<number>;
	value: Accessor<number>;
	opacity: Accessor<number>;
	setColor: (h: number, s: number, v: number, o: number) => void;
}

export type ModuleSetting =
	| ToggleSetting
	| SliderSetting
	| DropdownSetting
	| TextBoxSetting
	| ColorSliderSetting;

export default abstract class Mod {
	/** The name of this module. */
	public abstract name: string;
	/** What category this module is in */
	public abstract category: Category;

	/** Module settings */
	public settings: ModuleSetting[] = [];

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

	// Helper methods to create settings
	protected createToggleSetting(
		name: string,
		defaultValue = false,
	): ToggleSetting {
		const [value, setValue] = createSignal(defaultValue);
		const setting: ToggleSetting = {
			name,
			type: "toggle",
			value,
			setValue,
		};
		this.settings.push(setting);
		return setting;
	}

	protected createSliderSetting(
		name: string,
		defaultValue: number,
		min: number,
		max: number,
		step?: number,
	): SliderSetting {
		const [value, setValue] = createSignal(defaultValue);
		const setting: SliderSetting = {
			name,
			type: "slider",
			value,
			setValue,
			min,
			max,
			step,
		};
		this.settings.push(setting);
		return setting;
	}

	protected createDropdownSetting(
		name: string,
		options: string[],
		defaultValue?: string,
	): DropdownSetting {
		const [value, setValue] = createSignal(defaultValue || options[0]);
		const setting: DropdownSetting = {
			name,
			type: "dropdown",
			value,
			setValue,
			options,
		};
		this.settings.push(setting);
		return setting;
	}

	protected createTextBoxSetting(
		name: string,
		defaultValue = "",
		placeholder?: string,
	): TextBoxSetting {
		const [value, setValue] = createSignal(defaultValue);
		const setting: TextBoxSetting = {
			name,
			type: "textbox",
			value,
			setValue,
			placeholder,
		};
		this.settings.push(setting);
		return setting;
	}

	protected createColorSliderSetting(
		name: string,
		defaultHue = 0.5,
		defaultSat = 1,
		defaultValue = 1,
		defaultOpacity = 1,
	): ColorSliderSetting {
		const [hue, setHue] = createSignal(defaultHue);
		const [sat, setSat] = createSignal(defaultSat);
		const [value, setValue] = createSignal(defaultValue);
		const [opacity, setOpacity] = createSignal(defaultOpacity);

		const setting: ColorSliderSetting = {
			name,
			type: "colorslider",
			hue,
			sat,
			value,
			opacity,
			setColor: (h: number, s: number, v: number, o: number) => {
				setHue(h);
				setSat(s);
				setValue(v);
				setOpacity(o);
			},
		};
		this.settings.push(setting);
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
