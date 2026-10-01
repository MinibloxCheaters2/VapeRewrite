// import gameRefs from "@/utils/refs/game";
import Category from "@vape/core/features/modules/api/Category"
import Mod from "@vape/core/features/modules/api/Module"

export default class Test extends Mod {
	name = "Test";
	category = Category.UTILITY;
	protected onEnable(): void {
		// TODO: figure out game instances and stuff
	}
}
