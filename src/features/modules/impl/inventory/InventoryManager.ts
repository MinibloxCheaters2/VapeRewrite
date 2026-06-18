import { Subscribe } from "@/event/Bus";
// import { dropItem } from "@/utils/inventory";
import Category from "../../api/Category";
import Mod from "../../api/Module";

export default class InventoryManager extends Mod {
	name = "InventoryManager";
	category = Category.INVENTORY;

	// TODO(InventoryManager): implement item scoring and stuff
	@Subscribe("gameTick")
	private onTick() {}
}
