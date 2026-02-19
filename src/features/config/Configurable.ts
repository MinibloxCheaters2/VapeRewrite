import { createSignal } from "solid-js";
import type {
	ColorSettingValue,
	ColorSliderSetting,
	DropdownSetting,
	ModeLike,
	ModuleSetting,
	SliderSetting,
	TextBoxSetting,
	ToggleSetting,
} from "./Settings";

export default class Configurable {
	/** Module settings */
	public settings: ModuleSetting[] = [];

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
}
