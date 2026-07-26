import type { ItemStack, Slot } from "@wq2/miniblox-sdk";
import Miniblox from "../refs/miniblox";

export enum ItemSlotType {
	HOTBAR = "HOTBAR",
	OFFHAND = "OFFHAND",
	ARMOR = "ARMOR",
	INVENTORY = "INVENTORY",
}

export interface ItemSlot {
	readonly slotType: ItemSlotType;
	readonly index: number;
	getStack(): ItemStack | null;
	getHasStack(): boolean;
}

function getAllSlots(): (Slot | null)[] {
	const { player } = Miniblox;
	if (!player?.inventoryContainer?.inventorySlots) return [];
	return player.inventoryContainer.inventorySlots;
}

export class HotbarItemSlot implements ItemSlot {
	readonly slotType = ItemSlotType.HOTBAR;
	readonly index: number;

	constructor(hotbarIndex: number) {
		if (hotbarIndex < 0 || hotbarIndex > 8)
			throw new RangeError(`Invalid hotbar index: ${hotbarIndex}`);
		this.index = hotbarIndex;
	}

	getStack(): ItemStack | null {
		const slots = getAllSlots();
		const slot = slots[this.serverIndex];
		return slot?.getStack() ?? null;
	}

	getHasStack(): boolean {
		const slots = getAllSlots();
		const slot = slots[this.serverIndex];
		return slot?.getHasStack() ?? false;
	}

	get serverIndex(): number {
		return 36 + this.index;
	}

	static OFFHAND: OffhandItemSlot = null as unknown as OffhandItemSlot;
	static readonly ALL: HotbarItemSlot[] = Array.from(
		{ length: 9 },
		(_, i) => new HotbarItemSlot(i),
	);
}

export class OffhandItemSlot implements ItemSlot {
	readonly slotType = ItemSlotType.OFFHAND;
	readonly index = 40;

	getStack(): ItemStack | null {
		const slots = getAllSlots();
		const slot = slots[this.index];
		return slot?.getStack() ?? null;
	}

	getHasStack(): boolean {
		const slots = getAllSlots();
		const slot = slots[this.index];
		return slot?.getHasStack() ?? false;
	}
}

// Must be after OffhandItemSlot declaration to avoid forward reference
HotbarItemSlot.OFFHAND = new OffhandItemSlot();

export class InventoryItemSlot implements ItemSlot {
	readonly slotType = ItemSlotType.INVENTORY;
	readonly index: number;

	constructor(inventoryIndex: number) {
		if (inventoryIndex < 0 || inventoryIndex > 26)
			throw new RangeError(`Invalid inventory index: ${inventoryIndex}`);
		this.index = inventoryIndex;
	}

	getStack(): ItemStack | null {
		const slots = getAllSlots();
		const slot = slots[this.serverIndex];
		return slot?.getStack() ?? null;
	}

	getHasStack(): boolean {
		const slots = getAllSlots();
		const slot = slots[this.serverIndex];
		return slot?.getHasStack() ?? false;
	}

	get serverIndex(): number {
		return 9 + this.index;
	}

	static readonly ALL: InventoryItemSlot[] = Array.from(
		{ length: 27 },
		(_, i) => new InventoryItemSlot(i),
	);
}

export class ArmorItemSlot implements ItemSlot {
	readonly slotType = ItemSlotType.ARMOR;
	readonly index: number;

	constructor(armorIndex: number) {
		if (armorIndex < 0 || armorIndex > 3)
			throw new RangeError(`Invalid armor index: ${armorIndex}`);
		this.index = armorIndex;
	}

	getStack(): ItemStack | null {
		const slots = getAllSlots();
		const slot = slots[this.index];
		return slot?.getStack() ?? null;
	}

	getHasStack(): boolean {
		const slots = getAllSlots();
		const slot = slots[this.index];
		return slot?.getHasStack() ?? false;
	}

	static readonly HEAD = new ArmorItemSlot(3);
	static readonly CHEST = new ArmorItemSlot(2);
	static readonly LEGS = new ArmorItemSlot(1);
	static readonly FEET = new ArmorItemSlot(0);
	static readonly ALL: ArmorItemSlot[] = [
		ArmorItemSlot.FEET,
		ArmorItemSlot.LEGS,
		ArmorItemSlot.CHEST,
		ArmorItemSlot.HEAD,
	];
}

export const Slots = {
	Hotbar: HotbarItemSlot.ALL,
	Inventory: InventoryItemSlot.ALL,
	HotbarAndInventory: [...HotbarItemSlot.ALL, ...InventoryItemSlot.ALL],
	Armor: ArmorItemSlot.ALL,
	All: [
		...HotbarItemSlot.ALL,
		HotbarItemSlot.OFFHAND,
		...InventoryItemSlot.ALL,
		...ArmorItemSlot.ALL,
	],
};
