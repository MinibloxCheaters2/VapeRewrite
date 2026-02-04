export type DataWatcher = unknown;
export type Inventory = unknown;
export type Profile = unknown;
export type GameProfile = unknown;
export type InventoryEnderChest = unknown;
export type ContainerPlayer = unknown;
export type EffectsManager = unknown;
export type FoodStats = unknown;
export type AttributeMap = unknown;
export type CombatTracker = unknown;
export type EnumCreatureAttribute = unknown;
export type TileEntitySign = unknown;
export type CommandBlockLogic = unknown;
export type BlockChest = unknown;

export type PotionEffect = unknown;

// Re-export from dedicated files
export type { Block, Material, BlockState } from "./world";
export type { Item, ItemStack, ItemBlock, ItemSword, ItemBow, ItemArmor, ItemFood, ItemTool, ItemPickaxe, ItemAppleGold } from "./items";

// Container types
export interface Container {
	windowId: number;
	inventorySlots: any[];
	numRows?: number;
	getLowerChestInventory?(): any;
	getSizeInventory?(): number;
}

export interface ContainerChest extends Container {
	numRows: number;
	getLowerChestInventory(): any;
}

// Inventory types
export interface InventoryPlayer {
	currentItem: number;
	main: (ItemStack | null)[];
	armor: (ItemStack | null)[];
	getCurrentItem(): ItemStack | null;
	hasItem?(item: Item): boolean;
	getStackInSlot(slot: number): ItemStack | null;
	setInventorySlotContents(slot: number, stack: ItemStack | null): void;
	addItemStackToInventory(stack: ItemStack): boolean;
	decrStackSize(slot: number, amount: number): ItemStack | null;
	removeStackFromSlot(slot: number): ItemStack | null;
	clear(): void;
	getSizeInventory(): number;
	getInventoryStackLimit(): number;
	canHarvestBlock(block: Block): boolean;
	armorItemInSlot(slot: number): ItemStack | null;
	getTotalArmorValue(): number;
	damageArmor(damage: number): void;
	dropAllItems(): void;
	markDirty(): void;
	isUseableByPlayer(player: any): boolean;
	hasCustomName(): boolean;
	isItemValidForSlot(slot: number, stack: ItemStack): boolean;
}



