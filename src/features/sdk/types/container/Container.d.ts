import type { EntityPlayer } from "../entity";
import type { InventoryBasic } from "../inventory";
import { ItemStack } from "../items";
import type Slot from "../slot";
import type { ICrafting } from "../undefined";

export class Container {
	windowId: number;
	transactionID: number;
	dragMode: number;
	dragEvent: number;
	crafters: Array<ICrafting>;
	playerList: Set<EntityPlayer>;
	inventoryItemStacks: ItemStack[];
	inventorySlots: (Slot | null)[];
	dragSlots: Set<Slot>;

	addSlotToContainer(slot: Slot): Slot;
	onCraftGuiOpened(u): void;
	/** every ItemStack from {@linkcode Container.inventorySlots} */
	getInventory(): ItemStack[];
	detectAndSendChanges(): void;
	enchantItem(_u, _h): boolean;
	getSlot(id: number): Slot | undefined;
	transferStackInSlot(_u, id): ItemStack | null;
	static extractDragMode(from: number): number;
	static getDragEvent(from: number): number;
	/**
	 * seems to only be used with dragging in GuiContainer.
	 * @param a 0-2, which correspond to PICKUP_LEFT, PICKUP_RIGHT, and SWAP.
	 * @param b seems to only be used with this.dragSplittingLimit
	 * @returns
	 */
	static getButtonType(a: number, b: number) {
		return (a & 3) | ((b & 3) << 2);
	}
	static isValidDragMode(mode: number, player: EntityPlayer) {
		if (mode === 0 || mode === 1) {
			return true;
		} else {
			return mode === 2 && player.abilities.creative;
		}
	}
	resetDrag() {
		this.dragEvent = 0;
		this.dragSlots.clear();
	}
	static canAddItemToSlot(
		slot: Slot,
		other: Slot,
		stackSizeMatters: boolean,
	) {
		let g = slot == null || !slot.getHasStack();
		if (
			slot?.getHasStack() &&
			other?.isItemEqual(slot.getStack()) &&
			ItemStack.areItemStackTagsEqual(slot.getStack(), other)
		) {
			g |=
				slot.getStack().stackSize +
					(stackSizeMatters ? 0 : other.stackSize) <=
				other.getMaxStackSize();
		}
		return g;
	}
	static computeStackSize(
		slots: Set<Slot>,
		dragMode: number,
		dragStack: ItemStack,
		slotStackSize: number,
	): void;
	canDragIntoSlot(_u): boolean;
	slotClick(
		slotId: number,
		clickedButton: number,
		mode: number,
		player: EntityPlayer,
	): ItemStack | null;
	canMergeSlot(_u, _h): boolean;
	retrySlotClick(
		slotId: number,
		clickedButton: number,
		_modeUnused: number,
		player: EntityPlayer,
	): void;
	onContainerClosed(player: EntityPlayer): void;
	onCraftMatrixChanged(_u): void;
	putStackInSlot(id: number, stack: ItemStack): void;
	putStacksInSlots(stacks: ItemStack[]): void;
	updateProgressBar(_u, _h) {}
	getNextTransactionID(_u): number;
	getCanCraft(player: EntityPlayer): boolean;
	setCanCraft(target: EntityPlayer, canCraft: boolean): void;
	mergeItemStack(
		stack: ItemStack,
		startIndex: number,
		endIndex: number,
		reverseDirection: boolean,
	): boolean;
	static calcRedstone(inv: InventoryBasic): number;
	static calcRedstone(anythingElse: unknown): 0;
	static calcRedstone(inv: InventoryBasic): number;
	static calcRedstoneFromInventory(inv: null): 0;
	static calcRedstoneFromInventory(inv: InventoryBasic | null): number;
}
