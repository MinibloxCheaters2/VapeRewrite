import Category from "../../api/Category";
import Mod from "../../api/Module";

export default class TextGUIModule extends Mod {
	public name = "TextGUI";
	public category = Category.RENDER;

	// Settings
	private fontSizeSetting = this.createSliderSetting(
		"Font Size",
		14,
		8,
		32,
		1,
	);
	private fontFamilySetting = this.createDropdownSetting(
		"Font",
		["Arial", "Verdana", "Courier New", "Georgia", "Times New Roman"],
		"Arial",
	);
	private rainbowSetting = this.createToggleSetting("Rainbow", false);
	private textColorSetting = this.createColorSliderSetting("Text Color", {
		h: 0,
		s: 0,
		v: 0.78,
		o: 1,
	});
	private shadowColorSetting = this.createColorSliderSetting("Shadow Color", {
		h: 0,
		s: 0,
		v: 0,
		o: 0.8,
	});

	// Getters for settings
	public get fontSize() {
		return this.fontSizeSetting.value();
	}

	public get fontFamily() {
		return this.fontFamilySetting.value();
	}

	public get rainbow() {
		return this.rainbowSetting.value();
	}

	public get textColor() {
		return this.textColorSetting.value();
	}

	public get shadowColor() {
		return this.shadowColorSetting.value();
	}
}
