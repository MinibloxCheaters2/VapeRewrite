import { Subscribe } from "@/event/api/Bus";
import { dropItem } from "@/utils/inventory";
import Category from "../../api/Category";
import Mod from "../../api/Module";

export default class InventoryManager extends Mod {
	name = "InventoryManager";
	category = Category.INVENTORY;

	@Subscribe("gameTick")
	private onTick() {}
}
