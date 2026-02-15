import { EntityPlayer } from "./entity";
import { ItemStack } from "./items";

type Crafter = unknown;

export declare class InventoryBasic {
	inventoryTitle: string;
	slotsCount: number;
	inventoryContents: ItemStack[];
	crafters: Crafter[] | null;
	constructor(inventoryTitle: string, slotsCount: number);
	/**
	 * adds a new crafter to the inventory.
	 * if this.crafters is null, we set it to an empty array.
	 * in either case, `this.crafters.push(crafter)` is called.
	 */
	func_110134_a(crafter: Crafter): void;
	getInventory(): this["inventoryContents"];
	getStackInSlot(slot: number): ItemStack | null;
	decrStackSize(idx: number, count: number): ItemStack | null;
	func_174894_a(stack: ItemStack): ItemStack;
	removeStackFromSlot(idx: number): ItemStack | null;
	setInventorySlotContents(idx: number, stack: ItemStack): void;
	getSizeInventory(): this["slotsCount"];
	getName(): this["inventoryTitle"];
	getDisplayName(): string;
	getInventoryStackLimit(): number;
	markDirty(): void;
	isUseableByPlayer(plr: EntityPlayer): boolean;
	openInventory(plr: EntityPlayer): void;
	closeInventory(plr: EntityPlayer): void;
	isItemValidForSlot(index: number, stack: ItemStack): boolean;
	getField(id: number): number;
	setField(id: number, value: number): void;
	getFieldCount(): number;
	clear(): void;
}
