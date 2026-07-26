import type { InventoryAction } from "../InventoryAction";
import { ClickAction } from "../InventoryAction";
import type { ItemSlot } from "../ItemSlot";
import type { ItemFacet } from "./ItemFacet";

export enum SatisfactionStatus {
	NOT_SATISFIED = 0,
	SATISFIED = 1,
	OVERSATURATED = 2,
}

export interface ItemAmountConstraintProvider {
	getSatisfactionStatus(item: ItemFacet): SatisfactionStatus;
	addItem(item: ItemFacet): void;
}

/**
 * After the discovery phase (find all items, group them by type, sort them by usefulness),
 * this class tries to fit the given requirements and packs items into their target slots.
 */
export class ItemPacker {
	private readonly alreadyAllocatedItems = new Set<ItemSlot>();
	readonly usefulItems = new Set<ItemSlot>();

	/**
	 * Takes items from the itemsToFillIn list until it has collected enough items.
	 * Items are marked as useful and fill in hotbar slots if there are still slots to fill.
	 */
	packItems(
		itemsToFillIn: ItemFacet[],
		hotbarSlotsToFill: ItemSlot[] | null,
		forbiddenSlots: Set<ItemSlot>,
		forbiddenSlotsToFill: Set<ItemSlot>,
		constraintProvider: ItemAmountConstraintProvider,
	): InventoryAction[] {
		const moves: InventoryAction[] = [];
		const requiredStackCount = hotbarSlotsToFill?.length ?? 0;

		let currentStackCount = 0;
		let _currentItemCount = 0;

		const leftHotbarSlotIterator = hotbarSlotsToFill?.[Symbol.iterator]();

		for (const filledInItem of itemsToFillIn) {
			const constraintsSatisfied =
				constraintProvider.getSatisfactionStatus(filledInItem);
			const allStacksFilled = currentStackCount >= requiredStackCount;

			if (
				(allStacksFilled &&
					constraintsSatisfied === SatisfactionStatus.SATISFIED) ||
				constraintsSatisfied === SatisfactionStatus.OVERSATURATED
			) {
				continue;
			}

			const filledInItemSlot = filledInItem.itemSlot;

			if (this.alreadyAllocatedItems.has(filledInItemSlot)) {
				continue;
			}

			this.usefulItems.add(filledInItemSlot);
			constraintProvider.addItem(filledInItem);

			const stack = filledInItemSlot.getStack();
			_currentItemCount += stack?.stackSize ?? 0;
			currentStackCount++;

			if (
				leftHotbarSlotIterator == null ||
				forbiddenSlots.has(filledInItemSlot)
			) {
				continue;
			}

			const targetSlot = this.fillItemIntoSlot(
				filledInItemSlot,
				leftHotbarSlotIterator,
			);

			if (targetSlot && !forbiddenSlotsToFill.has(targetSlot)) {
				moves.push(
					ClickAction.performSwap(filledInItemSlot, targetSlot.index),
				);
			}
		}

		// Keep items that should be kept
		for (const item of itemsToFillIn) {
			if (item.shouldKeep()) {
				this.usefulItems.add(item.itemSlot);
			}
		}

		return moves;
	}

	/**
	 * Packs the given item into a good slot in the target slots.
	 */
	private fillItemIntoSlot(
		filledInItemSlot: ItemSlot,
		leftTargetSlotsToFill: IterableIterator<ItemSlot>,
	): ItemSlot | null {
		for (const hotbarSlotToFill of leftTargetSlotsToFill) {
			if (filledInItemSlot === hotbarSlotToFill) {
				this.alreadyAllocatedItems.add(hotbarSlotToFill);
				return null;
			}

			const aStack = filledInItemSlot.getStack();
			const bStack = hotbarSlotToFill.getStack();
			const areStacksSame =
				aStack &&
				bStack &&
				aStack.stackSize === bStack.stackSize &&
				aStack.getItem() === bStack.getItem();

			if (areStacksSame) {
				this.alreadyAllocatedItems.add(hotbarSlotToFill);
				continue;
			}

			this.alreadyAllocatedItems.add(filledInItemSlot);
			this.alreadyAllocatedItems.add(hotbarSlotToFill);
			return hotbarSlotToFill;
		}

		return null;
	}
}
