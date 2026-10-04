import Category from "@vape/core/features/modules/api/Category";
import Mod from "@vape/core/features/modules/api/Module";

export default class Phase extends Mod {
	public name = "Phase";
	public category = Category.BLATANT;
	// All functionality will be in hooking-replacements
}
