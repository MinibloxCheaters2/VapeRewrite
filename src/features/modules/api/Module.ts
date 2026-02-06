import { type Accessor, createSignal } from "solid-js";
import Bus from "@/Bus";
import { addBind, removeBind, setBind } from "@/features/binds/handler";
import { showNotification } from "@/ui/notifications";
import type { Category } from "./Category";

const NO_BIND = "";

const TOGGLE_CALLBACK = (m: Mod) => () => m.toggle();

// Setting types
export interface BaseSetting<V> {
	name: string;
	type: string;
	value: Accessor<V>;
	setValue(value: V): void;
	/** Optional visibility condition - if returns false, setting is hidden */
	visible?: () => boolean;
}

export interface ToggleSetting extends BaseSetting<boolean> {
	type: "toggle";
}

export interface SliderSetting extends BaseSetting<number> {
	type: "slider";
	min: number;
	max: number;
	step?: number;
}

export interface Tagged {
	tag: string;
}

export type ModeLike = string | Tagged;

export function getName(m: ModeLike): string {
	if (typeof m === "string") {
		return m;
	}
	// Tagged
	return m.tag;
}

export interface DropdownSetting<V extends ModeLike = string>
	extends BaseSetting<V> {
	type: "dropdown";
	value: Accessor<V>;
	setValue: (value: V) => void;
	options: V[];
}

export interface TextBoxSetting extends BaseSetting<string> {
	type: "textbox";
	placeholder?: string;
}

interface ColorSettingValue {
	h: number;
	s: number;
	v: number;
	o: number;
}

export interface ColorSliderSetting extends BaseSetting<ColorSettingValue> {
	type: "colorslider";
	hue: () => number;
	sat: () => number;
	opacity: () => number;
	setColor: (h: number, s: number, v: number, o: number) => void;
}

export type ModuleSetting =
	| ToggleSetting
	| SliderSetting
	| DropdownSetting<ModeLike>
	| TextBoxSetting
	| ColorSliderSetting;

export default abstract class Mod {
	/** The name of this module. */
	public abstract name: string;
	/** What category this module is in */
	public abstract category: Category;

	/** Module settings */
	public settings: ModuleSetting[] = [];

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

	// Helper methods to create settings
	protected createToggleSetting(
		name: string,
		defaultValue = false,
		visible?: () => boolean,
	): ToggleSetting {
		const [value, setValue] = createSignal(defaultValue);
		const setting: ToggleSetting = {
			name,
			type: "toggle",
			value,
			setValue,
			visible,
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
		visible?: () => boolean,
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
			visible,
		};
		this.settings.push(setting);
		return setting;
	}

	protected createDropdownSetting<V extends ModeLike = string>(
		name: string,
		options: V[],
		defaultValue?: (typeof options)[0],
		visible?: () => boolean,
	): DropdownSetting<V> {
		const [value, setValue] = createSignal(defaultValue ?? options[0]);
		const setting: DropdownSetting<V> = {
			name,
			type: "dropdown",
			value,
			setValue,
			options,
			visible,
		};
		this.settings.push(setting);
		return setting;
	}

	protected createTextBoxSetting(
		name: string,
		defaultValue = "",
		placeholder?: string,
		visible?: () => boolean,
	): TextBoxSetting {
		const [value, setValue] = createSignal(defaultValue);
		const setting: TextBoxSetting = {
			name,
			type: "textbox",
			value,
			setValue,
			placeholder,
			visible,
		};
		this.settings.push(setting);
		return setting;
	}

	protected createColorSliderSetting(
		name: string,
		value: ColorSettingValue = {
			h: 0.5,
			s: 1,
			v: 1,
			o: 1,
		},
		visible?: () => boolean,
	): ColorSliderSetting {
		const [color, setColor] = createSignal(value);

		const setting: ColorSliderSetting = {
			name,
			type: "colorslider",
			value: color,
			setValue: setColor,
			hue: () => color().h,
			sat: () => color().s,
			opacity: () => color().o,
			setColor: (h: number, s: number, v: number, o: number) =>
				setColor({ h, s, v, o }),
			visible,
		};
		this.settings.push(setting);
		return setting;
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
