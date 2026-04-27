import { Subscribe } from "@/event/api/Bus";
import Refs from "@/utils/helpers/refs";
import Category from "../../api/Category";
import Mod from "../../api/Module";

export default class AutoClicker extends Mod {
	name = "AutoClicker";
	category = Category.COMBAT;

	@Subscribe("gameTick")
	private onTick() {
		const { playerController, player } = Refs;
		if (playerController.objectMouseOver.block || player.isUsingItem())
			return;
		if (playerController.key.leftClick) playerController.leftClick();
	}
}
