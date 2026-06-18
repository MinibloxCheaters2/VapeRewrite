import { Subscribe } from "@/event/Bus";
import Category from "../../../api/Category";
import Mod from "../../../api/Module";

/**
 * Dupes the held item using specific methods.
 */
export default class Dupe extends Mod {
	name = "Dupe";
	category = Category.UTILITY;
	static readonly INSTANCE = new Dupe();

	@Subscribe("gameTick")
	private onTick() {}
}
