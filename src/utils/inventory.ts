import { SlotActionType } from "@wq2/miniblox-sdk";
import Refs from "./helpers/refs";

export function dropItem(index: number) {
	const { player, playerController } = Refs;
	const windowId = player.openContainer.windowId;
	playerController.windowClick(
		windowId,
		index,
		0,
		SlotActionType.PICKUP_LEFT,
		player,
	);
	playerController.windowClick(
		windowId,
		-999,
		0,
		SlotActionType.PICKUP_LEFT,
		player,
	);
}
