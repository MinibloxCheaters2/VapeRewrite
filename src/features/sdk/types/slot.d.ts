import type { EntityPlayer } from "./entity";
import type { InventoryBasic } from "./inventory";
import type { ItemStack } from "./items";

export default class Slot {
	slotIndex: number;
	inventory: InventoryBasic;
	slotNumber: number;
	xDisplayPosition: number;
	yDisplayPosition: number;
	/**
	 * @param inventory The inventory we want to extract a slot from.
	 * @param index The index of the slot in the inventory.
	 * @param _xDisplayPos unused parameter left over from MCP code.
	 * @param _yDisplayPos unused parameter left over from MCP code.
	 */
	constructor(inventory, index, _xDisplayPos, _yDisplayPos);
	/**
	 * if p2 has more items than p1, onCrafting(item,countIncrease) is called
	 */
	onSlotChange(p1: ItemStack | null, p2: ItemStack | null): void;
	onCrafting(stack: ItemStack, amount: number): void;
	onCrafting(stack: ItemStack): void;
	onPickupFromSlot(plr: EntityPlayer, stack: ItemStack): void;
	isItemValid(stack: ItemStack): boolean;
	getStack(): ItemStack;
	getHasStack(): boolean;
	putStack(stack: ItemStack): void;
	onSlotChanged(): void;
	getSlotStackLimit(): number;
	getItemStackLimit(stack: ItemStack): number;
	getSlotTexture(): string | null;
	decrStackSize(count: number): ItemStack | null;
	canTakeStack(player: EntityPlayer): boolean;
	canBeHovered(): boolean;
	isHere(inv: InventoryBasic, slot: number): boolean;
}
