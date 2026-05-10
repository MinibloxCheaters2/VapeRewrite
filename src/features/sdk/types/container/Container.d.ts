import type { EntityPlayer } from "../entity";
import type { InventoryBasic, InventoryPlayer } from "../inventory";
import type { ItemStack } from "../items";
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
	 * @returns `(a & 3) | ((b & 3) << 2)`
	 */
	static getButtonType(a: number, b: number): number;
	/**
	 * Checks if a drag mode is valid for the player.
	 * @param mode the drag mode
	 * @param player the player executing this drag mode
	 * @returns if the drag mode is valid (mode 0 and 1 are unconditionally permitted, and mode 2 is only permitted when in creative)
	 */
	static isValidDragMode(mode: number, player: EntityPlayer): boolean;
	/** resets the drag state variables. sets {@linkcode Container.dragEvent dragEvent} to 0 and clears all items in {@linkcode Container.dragSlots dragSlots} */
	resetDrag(): void;
	static canAddItemToSlot(
		slot: Slot,
		other: Slot,
		stackSizeMatters: boolean,
	): boolean;
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
	updateProgressBar(_id: number, _data: number): void;
	getNextTransactionID(_player: InventoryPlayer): number;
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
