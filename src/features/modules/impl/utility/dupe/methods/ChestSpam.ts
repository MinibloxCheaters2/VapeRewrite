import { Subscribe } from "@/event/Bus";
import type { Tagged } from "@/features/config/Settings";
import Miniblox from "@/utils/refs/miniblox";
import Dupe from "../Dupe";

export default class ChestSpamDupe implements Tagged {
	tag = "Chest Spam";

	@Subscribe("gameTick")
	private onTick() {
		const { player, chat } = Miniblox;
		// TODO: would it work, even with your inventory?
		if (!player.openContainer || player.openContainer === player.inventoryContainer) {
			chat.addChat({
				text: "Open a chest to dupe!",
			});
			Dupe.INSTANCE.toggleSilently();
		}
	}
}
