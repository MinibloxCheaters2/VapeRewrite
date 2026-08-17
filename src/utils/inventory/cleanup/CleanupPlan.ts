import type { ItemSlot } from "../ItemSlot";

export interface InventorySwap {
	readonly from: ItemSlot;
	readonly to: ItemSlot;
}

export class InventoryCleanupPlan {
	readonly usefulItems: Set<ItemSlot>;
	readonly swaps: InventorySwap[];
	readonly mergeableItems: Map<string, ItemSlot[]>;

	constructor(
		usefulItems: Set<ItemSlot>,
		swaps: InventorySwap[],
		mergeableItems: Map<string, ItemSlot[]>,
	) {
		this.usefulItems = usefulItems;
		this.swaps = swaps;
		this.mergeableItems = mergeableItems;
	}

	/**
	 * Returns items that are NOT in the useful set (items to throw out).
	 */
	findItemsToThrowOut(itemSlots: ItemSlot[]): ItemSlot[] {
		return itemSlots.filter((it) => !this.usefulItems.has(it));
	}

	/**
	 * Find item slots that should be double-clicked to merge them.
	 */
	findSlotsToMerge(): ItemSlot[] {
		const itemsToMerge: ItemSlot[] = [];

		for (const [_key, mergeableSlots] of this.mergeableItems) {
			const maxStackSize = this.getMaxStackSize(mergeableSlots[0]);

			if (!this.canMerge(mergeableSlots, maxStackSize)) continue;

			const stacks = mergeableSlots.map((slot) => ({
				slot,
				count: slot.getStack()?.stackSize ?? 0,
			}));
			stacks.sort((a, b) => a.count - b.count);

			this.mergeStacks(itemsToMerge, stacks, maxStackSize);
		}

		return itemsToMerge;
	}

	private canMerge(items: ItemSlot[], maxStackSize: number): boolean {
		let totalCount = 0;
		for (const item of items) {
			totalCount += item.getStack()?.stackSize ?? 0;
		}
		const mergedStackCount = Math.ceil(totalCount / maxStackSize);
		return items.length > mergedStackCount;
	}

	private mergeStacks(
		result: ItemSlot[],
		stacks: Array<{ slot: ItemSlot; count: number }>,
		maxStackSize: number,
	): void {
		if (stacks.length <= 1) return;

		while (stacks.length > 0 && stacks[stacks.length - 1].count + stacks[0].count > maxStackSize) {
			stacks.pop();
		}

		const itemToDoubleClick = stacks.pop();
		if (!itemToDoubleClick) return;

		result.push(itemToDoubleClick.slot);

		let itemsToRemove = maxStackSize - itemToDoubleClick.count;

		while (itemsToRemove > 0 && stacks.length > 0) {
			const stack = stacks[0];
			const count = stack.count;
			const transferredItems = Math.min(count, itemsToRemove);

			if (count <= itemsToRemove) {
				stacks.shift();
			} else {
				stack.count -= transferredItems;
			}

			itemsToRemove -= transferredItems;
		}

		this.mergeStacks(result, stacks, maxStackSize);
	}

	private getMaxStackSize(slot: ItemSlot): number {
		const stack = slot.getStack();
		if (!stack) return 64;
		return stack.getMaxStackSize();
	}
}
