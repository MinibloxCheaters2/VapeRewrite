import { SlotActionType } from "@wq2/miniblox-sdk";
import { Priority, Subscribe } from "@/event/Bus";
import { findBestArmorPieces } from "@/utils/inventory/armor/ArmorEvaluation";
import { ClickAction } from "@/utils/inventory/InventoryAction";
import { ArmorItemSlot, Slots } from "@/utils/inventory/ItemSlot";
import Miniblox from "@/utils/refs/miniblox";
import Category from "../../api/Category";
import Mod from "../../api/Module";

export default class AutoArmor extends Mod {
	name = "AutoArmor";
	category = Category.INVENTORY;

	private lastCheckTick = 0;

	@Subscribe("playerTick", Priority.NORMAL)
	private onTick() {
		const { player } = Miniblox;
		if (!player) return;

		if (player.openContainer !== player.inventoryContainer) return;

		const currentTick = Math.floor(Date.now() / 50);
		if (currentTick - this.lastCheckTick < 20) return;
		this.lastCheckTick = currentTick;

		const bestArmor = findBestArmorPieces(Slots.All);

		for (let i = 0; i < ArmorItemSlot.ALL.length; i++) {
			const armorSlot = ArmorItemSlot.ALL[i];
			const bestPiece = bestArmor.get(3 - i);
			if (!bestPiece) continue;

			const bestStack = bestPiece.slot.getStack();
			if (!bestStack) continue;

			const currentStack = armorSlot.getStack();
			if (currentStack && currentStack === bestStack) continue;

			this.dropHeld();

			if (currentStack) {
				ClickAction.performPickup(armorSlot).performAction();
				this.dropHeld();
			}

			ClickAction.performPickup(bestPiece.slot).performAction();
			ClickAction.performPickup(armorSlot).performAction();
		}
	}

	private dropHeld(): void {
		const { player, playerController } = Miniblox;
		if (!player) return;

		playerController.windowClick(
			player.openContainer.windowId,
			-999,
			0,
			SlotActionType.PICKUP_LEFT,
			player,
		);
	}
}
