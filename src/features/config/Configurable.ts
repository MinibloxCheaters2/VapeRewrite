import { createSignal } from "solid-js";
import Mod from "../modules/api/Module";
import { updateLoadedConfig } from "./configs";
import type {
	AnySetting,
	ColorSettingValue,
	ColorSliderSetting,
	DropdownSetting,
	ModeLike,
	SliderSetting,
	SubmoduleItem,
	SubmoduleSetting,
	TextBoxSetting,
	ToggleSetting,
} from "./Settings";

export default class Configurable {
	/** Settings */
	public settings: AnySetting[] = [];

	// Helper methods to create settings
	protected createToggleSetting(
		name: string,
		defaultValue = false,
		visible?: () => boolean,
		target: AnySetting[] = this.settings,
	): ToggleSetting {
		const [value, setValueSignal] = createSignal(defaultValue);
		const setting: ToggleSetting = {
			name,
			type: "toggle",
			value,
			setValue: (value) => {
				setValueSignal(value);
				if (this instanceof Mod) updateLoadedConfig(this.name, name);
			},
			visible,
		};
		target.push(setting);
		return setting;
	}

	protected createSliderSetting(
		name: string,
		defaultValue: number,
		min: number,
		max: number,
		step?: number,
		visible?: () => boolean,
		target: AnySetting[] = this.settings,
	): SliderSetting {
		const [value, setValueSignal] = createSignal(defaultValue);
		const setting: SliderSetting = {
			name,
			type: "slider",
			value,
			setValue: (value) => {
				setValueSignal(value);
				if (this instanceof Mod)
					updateLoadedConfig((this as Mod).name, name);
			},
			min,
			max,
			step,
			visible,
		};
		target.push(setting);
		return setting;
	}

	protected createDropdownSetting<V extends ModeLike = string>(
		name: string,
		options: V[],
		defaultValue: V = options[0],
		visible?: () => boolean,
		target: AnySetting[] = this.settings,
	): DropdownSetting<V> {
		const [value, setValueSignal] = createSignal(
			defaultValue ?? options[0],
		);
		const setting: DropdownSetting<V> = {
			name,
			type: "dropdown",
			value,
			setValue: (value) => {
				setValueSignal(() => value);
				if (this instanceof Mod)
					updateLoadedConfig((this as Mod).name, name);
			},
			options,
			visible,
		};
		target.push(setting as unknown as DropdownSetting<ModeLike>);
		return setting;
	}

	protected createTextBoxSetting(
		name: string,
		defaultValue = "",
		placeholder?: string,
		visible?: () => boolean,
		target: AnySetting[] = this.settings,
	): TextBoxSetting {
		const [value, setValueSignal] = createSignal(defaultValue);
		const setting: TextBoxSetting = {
			name,
			type: "textbox",
			value,
			setValue: (value) => {
				setValueSignal(value);
				if (this instanceof Mod)
					updateLoadedConfig((this as Mod).name, name);
			},
			placeholder,
			visible,
		};
		target.push(setting);
		return setting;
	}

	protected createSubmoduleGroup(
		name: string,
		submoduleNames: string[],
		defaultSelected?: string,
		visible?: () => boolean,
	): SubmoduleSetting {
		const [value, setValueSignal] = createSignal(
			defaultSelected ?? submoduleNames[0],
		);

		const items: SubmoduleItem[] = submoduleNames.map((n) => ({
			name: n,
			settings: [],
		}));

		const setting: SubmoduleSetting = {
			type: "submodule",
			name,
			value,
			setValue: (v) => {
				setValueSignal(v);
				if (this instanceof Mod)
					updateLoadedConfig((this as Mod).name, name);
			},
			submodules: items,
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
		const [color, setColorSignal] = createSignal(value);

		const setting: ColorSliderSetting = {
			name,
			type: "colorslider",
			value: color,
			setValue: (value) => {
				setColorSignal(value);
				if (this instanceof Mod)
					updateLoadedConfig((this as Mod).name, name);
			},
			hue: () => color().h,
			sat: () => color().s,
			opacity: () => color().o,
			setColor: (h: number, s: number, v: number, o: number) => {
				setColorSignal({ h, s, v, o });
				if (this instanceof Mod)
					updateLoadedConfig((this as Mod).name, name);
			},
			visible,
		};
		this.settings.push(setting);
		return setting;
	}
}
