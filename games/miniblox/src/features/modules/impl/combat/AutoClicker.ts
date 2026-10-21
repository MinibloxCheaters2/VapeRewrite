import { Category } from "@vape-rewrite/core";
import { Mod } from "@vape-rewrite/core";

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
