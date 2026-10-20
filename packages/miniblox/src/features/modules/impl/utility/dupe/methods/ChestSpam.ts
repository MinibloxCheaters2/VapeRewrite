import type { Tagged } from "@vape/core/src/features/config/Settings";

import { Subscribe } from "@/event/Bus";
import Miniblox from "@/utils/refs/miniblox";

import Dupe from "../Dupe";

export default class ChestSpamDupe implements Tagged {
	tag = "Chest Spam";

	@Subscribe("playerTick")
	private onTick() {
		const { player, chat } = Miniblox;
		if (!player.openContainer || player.openContainer === player.inventoryContainer) {
			chat.addChat({
				text: "Open a chest to dupe!",
			});
			Dupe.INSTANCE.toggleSilently();
		}
	}
}
