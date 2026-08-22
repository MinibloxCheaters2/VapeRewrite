import Category from "@vape/core/features/modules/api/Category";
import Mod from "@vape/core/features/modules/api/Module";

import { Subscribe } from "@/event/Bus";
import Miniblox from "@/utils/refs/miniblox";

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
