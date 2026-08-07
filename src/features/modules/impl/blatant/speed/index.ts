import Category from "../../../api/Category";
import Mod from "../../../api/Module";
import Normal from "./normal";

export default class Speed extends Mod {
	public name = "Speed";
	public category = Category.BLATANT;

	// TODO: new ac speed is probably easy
	public normal = new Normal(this, "Normal");
	private modesGroup = this.createSubmoduleGroup("Modes", [this.normal]);
}
