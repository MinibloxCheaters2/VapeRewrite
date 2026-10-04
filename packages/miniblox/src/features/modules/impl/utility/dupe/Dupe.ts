import Category from "@vape/core/features/modules/api/Category";
import Mod from "@vape/core/features/modules/api/Module";

import { Subscribe } from "@/event/Bus";

/**
 * Dupes the held item using specific methods.
 */
export default class Dupe extends Mod {
	name = "Dupe";
	category = Category.UTILITY;
	static readonly INSTANCE = new Dupe();

	@Subscribe("playerTick")
	private onTick() {}
}
