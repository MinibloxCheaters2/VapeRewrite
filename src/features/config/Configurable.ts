import { createSignal } from "solid-js";
import Mod from "../modules/api/Module";
import { updateLoadedConfig } from "./configs";
import type SubModule from "./SubModule";
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
	/** Module name for config persistence (used when not directly a Mod) */
	protected modNameForConfig?: string;

	private get modName(): string | undefined {
		if (this instanceof Mod) {
			if (this.name === "Sackfold") {
				return "Scaffold";
			} else {
				return this.name;
			}
		}
		return this.modNameForConfig;
	}

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
				if (this.modName) updateLoadedConfig(this.modName, name);
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
				if (this.modName) updateLoadedConfig(this.modName, name);
			},
			min,
			max,
			step,
			visible,
		};
		target.push(setting);
		return setting;
	}

	protected createDropdownSetting<const V extends ModeLike = string>(
		name: string,
		options: V[],
		defaultValue: V = options[0],
		visible?: () => boolean,
		target: AnySetting[] = this.settings,
	): DropdownSetting<V> {
		const [value, setValueSignal] = createSignal(defaultValue ?? options[0]);
		const setting: DropdownSetting<V> = {
			name,
			type: "dropdown",
			value,
			setValue: (value) => {
				setValueSignal(() => value);
				if (this.modName) updateLoadedConfig(this.modName, name);
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
				if (this.modName) updateLoadedConfig(this.modName, name);
			},
			placeholder,
			visible,
		};
		target.push(setting);
		return setting;
	}

	protected submoduleGroups = new Map<string, SubModule<any>[]>();

	protected createSubmoduleGroup<T extends SubModule<any>>(
		name: string,
		submodules: T[],
		defaultSelected?: string,
		visible?: () => boolean,
	): SubmoduleSetting {
		const items: SubmoduleItem[] = submodules.map((sm) => ({
			name: sm.name,
			settings: sm.settings,
		}));

		const initial = defaultSelected ?? (submodules[0]?.name ?? "");
		const [value, setValueSignal] = createSignal(initial);

		const setting: SubmoduleSetting = {
			type: "submodule",
			name,
			value,
			setValue: (v) => {
				const oldValue = value();
				setValueSignal(v);
				this.onSubmoduleChange(name, oldValue, v);
				if (this.modName) updateLoadedConfig(this.modName, name);
			},
			submodules: items,
			visible,
		};
		this.submoduleGroups.set(name, submodules);
		this.settings.push(setting);
		return setting;
	}

	protected onSubmoduleChange(groupName: string, oldValue: string, newValue: string): void {
		// Override in subclasses to handle sub-module lifecycle
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
				if (this.modName) updateLoadedConfig(this.modName, name);
			},
			hue: () => color().h,
			sat: () => color().s,
			opacity: () => color().o,
			setColor: (h: number, s: number, v: number, o: number) => {
				setColorSignal({ h, s, v, o });
				if (this.modName) updateLoadedConfig(this.modName, name);
			},
			visible,
		};
		this.settings.push(setting);
		return setting;
	}
}
