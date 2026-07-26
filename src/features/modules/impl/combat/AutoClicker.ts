import { Subscribe } from "@/event/Bus";
import Miniblox from "@/utils/refs/miniblox";
import Category from "../../api/Category";
import Mod from "../../api/Module";

export default class AutoClicker extends Mod {
	name = "AutoClicker";
	category = Category.COMBAT;

	@Subscribe("gameTick")
	private onTick() {
		const { playerController, player } = Miniblox;
		if (playerController.objectMouseOver.block || player.isUsingItem()) return;
		if (playerController.key.leftClick) playerController.leftClick();
	}
}
