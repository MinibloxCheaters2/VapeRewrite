import { SlotActionType } from "@wq2/miniblox-sdk";
import { Priority, Subscribe } from "@/event/Bus";
import { findBestArmorPieces } from "@/utils/inventory/armor/ArmorEvaluation";
import { ArmorItemSlot, Slots } from "@/utils/inventory/ItemSlot";
import Miniblox from "@/utils/refs/miniblox";
import Category from "../../api/Category";
import Mod from "../../api/Module";

export default class AutoArmor extends Mod {
	name = "AutoArmor";
	category = Category.INVENTORY;

	private lastCheckTick = 0;

	@Subscribe("gameTick", Priority.NORMAL)
	private onTick() {
		const { player, playerController } = Miniblox;
		if (!player) return;

		const currentTick = Math.floor(Date.now() / 50);
		if (currentTick - this.lastCheckTick < 20) return;
		this.lastCheckTick = currentTick;

		const allSlots = Slots.All;
		const bestArmor = findBestArmorPieces(allSlots);

		const armorSlots = [
			ArmorItemSlot.FEET,
			ArmorItemSlot.LEGS,
			ArmorItemSlot.CHEST,
			ArmorItemSlot.HEAD,
		];

		for (let i = 0; i < 4; i++) {
			const armorSlot = armorSlots[i];
			const currentStack = armorSlot.getStack();
			const bestPiece = bestArmor.get(i);

			if (!bestPiece) continue;

			const bestStack = bestPiece.slot.getStack();
			if (!bestStack) continue;

			// Skip if already wearing the best armor
			if (currentStack && currentStack === bestStack) continue;

			// If the armor slot is occupied by a worse piece, drop it first
			if (currentStack) {
				playerController.windowClick(
					player.openContainer.windowId,
					armorSlot.index,
					1,
					SlotActionType.PICKUP_LEFT,
					player,
				);
			}

			// Swap the best armor into the slot
			playerController.windowClick(
				player.openContainer.windowId,
				bestPiece.slot.index,
				0,
				SlotActionType.PICKUP_RIGHT,
				player,
			);
		}
	}
}
