import Category from "../../api/Category";
import Mod from "../../api/Module";

export default class Scaffold extends Mod {
	public name = "Scaffold";
	public category = Category.BLATANT;

	// Settings
	private towerSetting = this.createToggleSetting("Tower", false);
	private safeWalkSetting = this.createToggleSetting("Safe Walk", true);
	private sprintSetting = this.createToggleSetting("Sprint", false);
	private delaySetting = this.createSliderSetting("Delay", 0, 0, 10, 1);
	private expandSetting = this.createSliderSetting("Expand", 0, 0, 5, 1);
	private rotationsSetting = this.createDropdownSetting(
		"Rotations",
		["None", "Normal", "Snap"],
		"Normal",
	);

	// TODO: scaffold module implementation
}
