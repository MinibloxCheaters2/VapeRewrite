import { SlotActionType } from "@wq2/miniblox-sdk";
import Miniblox from "./refs/miniblox";

export function dropItem(index: number) {
	const { player, playerController } = Miniblox;
	const windowId = player.openContainer.windowId;
	playerController.windowClick(windowId, index, 0, SlotActionType.PICKUP_LEFT, player);
	playerController.windowClick(windowId, -999, 0, SlotActionType.PICKUP_LEFT, player);
}
