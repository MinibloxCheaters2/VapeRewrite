import Category from "@vape/core/features/modules/api/Category";
import Mod from "@vape/core/features/modules/api/Module";

import AntiCheatSub from "./anticheat";
import NormalSub from "./normal";

export default class Fly extends Mod {
	public name = "Fly";
	public category = Category.BLATANT;

	public normalSub = new NormalSub(this, "Normal");
	public antiCheatSub = new AntiCheatSub(this, "AntiCheat");
	private modesGroup = this.createSubmoduleGroup("Modes", [this.normalSub, this.antiCheatSub]);

	public verticalSetting = this.createSliderSetting("Vertical", 1, 0.05, 100, 0.01);
}
