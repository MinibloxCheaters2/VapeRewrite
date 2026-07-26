import { SlotActionType } from "@wq2/miniblox-sdk";
import type { Priority } from "@/event/Bus";
import Miniblox from "../refs/miniblox";
import type { ItemSlot } from "./ItemSlot";

export interface InventoryAction {
	canPerformAction(): boolean;
	performAction(): boolean;
}

export class ClickAction implements InventoryAction {
	constructor(
		readonly slot: ItemSlot,
		readonly button: number,
		readonly actionType: SlotActionType,
	) {}

	static performThrow(slot: ItemSlot): ClickAction {
		return new ClickAction(slot, 1, SlotActionType.PICKUP_LEFT);
	}

	static performQuickMove(slot: ItemSlot): ClickAction {
		return new ClickAction(slot, 0, SlotActionType.QUICK_MOVE);
	}

	static performSwap(from: ItemSlot, toIndex: number): ClickAction {
		return new ClickAction(from, toIndex, SlotActionType.SWAP);
	}

	static performPickupAll(slot: ItemSlot): ClickAction {
		return new ClickAction(slot, 0, SlotActionType.PICKUP_LEFT);
	}

	static performPickup(slot: ItemSlot): ClickAction {
		return new ClickAction(slot, 0, SlotActionType.PICKUP_LEFT);
	}

	static performMergeStack(slot: ItemSlot): ClickAction[] {
		return [
			ClickAction.performPickup(slot),
			ClickAction.performPickupAll(slot),
			ClickAction.performPickup(slot),
		];
	}

	canPerformAction(): boolean {
		return true;
	}

	performAction(): boolean {
		const { player, playerController } = Miniblox;
		if (!player) return false;

		const slotId = this.getSlotId();
		playerController.windowClick(
			player.openContainer.windowId,
			slotId,
			this.button,
			this.actionType,
			player,
		);
		return true;
	}

	private getSlotId(): number {
		if ("serverIndex" in this.slot) {
			return (this.slot as { serverIndex: number }).serverIndex;
		}
		return this.slot.index;
	}
}

export interface InventoryChain {
	actions: InventoryAction[];
	priority: Priority;
}

export function sortSchedule(schedule: InventoryChain[]): InventoryChain[] {
	return schedule.sort((a, b) => {
		const priorityDiff = (b.priority as number) - (a.priority as number);
		return priorityDiff;
	});
}
