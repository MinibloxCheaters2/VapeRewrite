import { InventoryBasic } from "./inventory";

// Container types
export interface Container {
	windowId: number;
	inventorySlots: Slot[];
	numRows: number;
	getLowerChestInventory(): InventoryBasic;
	getSizeInventory(): number;
}

export interface ContainerChest extends Container {
	numRows: number;
	getLowerChestInventory(): InventoryBasic;
}
