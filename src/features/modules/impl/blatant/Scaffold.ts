import Category from "../../api/Category";
import Mod from "../../api/Module";

export default class Scaffold extends Mod {
	public name = "Scaffold";
	public category = Category.BLATANT;

	// Settings
	private towerSetting = this.createToggleSetting("Tower", false);
	private expandSetting = this.createSliderSetting("Expand", 0, 0, 5, 1);

	// TODO: scaffold module implementation
}
