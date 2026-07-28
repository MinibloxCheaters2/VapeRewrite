import { Subscribe } from "@/event/Bus";
import Category from "../../../api/Category";
import Mod from "../../../api/Module";
import NormalSub from "./normal";

export default class Speed extends Mod {
	public name = "Speed";
	public category = Category.BLATANT;

	// TODO: new ac speed is probably easy
	private modesGroup = this.createSubmoduleGroup("Modes", [
		"Vanilla (Old AC / Planets)"
	], "Vanilla");

	public normalSub = new NormalSub(this, this.modesGroup.submodules[0].settings);

	private get mode(): string {
		return this.modesGroup.value();
	}

	public getTag(): string {
		switch (this.mode) {
			case "Normal":
				return this.normalSub.getTag();
			default:
				return this.mode;
		}
	}
}
