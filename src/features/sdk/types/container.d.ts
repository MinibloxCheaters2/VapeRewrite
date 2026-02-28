import { InventoryBasic } from "./inventory";
import Slot from "./slot";

// Container types
export class Container {
	windowId: number;
	inventorySlots: Slot[];
	numRows: number;
	getLowerChestInventory(): InventoryBasic;
	getSizeInventory(): number;
}

export class ContainerChest extends Container {
	numRows: number;
	getLowerChestInventory(): InventoryBasic;
}
