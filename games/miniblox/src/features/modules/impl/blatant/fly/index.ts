import { Category } from "@vape-rewrite/core";
import { Mod } from "@vape-rewrite/core";

import NormalSub from "./normal";

export default class Fly extends Mod {
	public name = "Fly";
	public category = Category.BLATANT;

	public normalSub = new NormalSub(this, "Normal");
	private modesGroup = this.createSubmoduleGroup("Modes", [this.normalSub]);

	public verticalSetting = this.createSliderSetting("Vertical", 1, 0.05, 100, 0.01);
}
