import type { Accessor } from "solid-js";

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

export interface ColorSettingValue {
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

export type AnySetting =
	| ToggleSetting
	| SliderSetting
	| DropdownSetting<ModeLike>
	| TextBoxSetting
	| ColorSliderSetting;
