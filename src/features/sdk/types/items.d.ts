import type { Block } from "./undefined";
import type { Entity } from "./entity";

// Base Item class
export interface Item {
	name: string;
	maxStackSize: number;
	maxDamage: number;
	hasSubtypes: boolean;
	
	getUnlocalizedName(): string;
	getItemStackDisplayName(stack: ItemStack): string;
	onItemUse(stack: ItemStack, player: Entity, world: any, pos: any, side: any, hitX: number, hitY: number, hitZ: number): boolean;
	onItemRightClick(stack: ItemStack, world: any, player: Entity): ItemStack;
	getMaxItemUseDuration(stack: ItemStack): number;
	getItemUseAction(stack: ItemStack): string;
	onPlayerStoppedUsing(stack: ItemStack, world: any, player: Entity, timeLeft: number): void;
	hitEntity(stack: ItemStack, target: Entity, attacker: Entity): boolean;
	onBlockDestroyed(stack: ItemStack, world: any, block: Block, pos: any, player: Entity): boolean;
	canHarvestBlock(block: Block): boolean;
	getStrVsBlock(stack: ItemStack, block: Block): number;
}

// ItemBlock - Placeable blocks
export interface ItemBlock extends Item {
	block: Block;
	getBlock(): Block;
	placeBlockAt(stack: ItemStack, player: Entity, world: any, pos: any, side: any, hitX: number, hitY: number, hitZ: number, metadata: number): boolean;
}

// ItemSword - Swords
export interface ItemSword extends Item {
	attackDamage: number;
	weaponMaterial: string;
	getAttackDamage(): number;
}

// ItemBow - Bows
export interface ItemBow extends Item {
	maxItemUseDuration: number;
}

// ItemArmor - Armor pieces
export interface ItemArmor extends Item {
	armorType: number;
	damageReduceAmount: number;
	maxDamage: number;
	renderIndex: number;
	material: string;
	
	getArmorMaterial(): string;
	getColor(stack: ItemStack): number;
	removeColor(stack: ItemStack): void;
	hasColor(stack: ItemStack): boolean;
}

// ItemFood - Food items
export interface ItemFood extends Item {
	healAmount: number;
	saturationModifier: number;
	isWolfsFavoriteMeat: boolean;
	alwaysEdible: boolean;
	
	getHealAmount(stack: ItemStack): number;
	getSaturationModifier(stack: ItemStack): number;
}

// ItemTool - Tools (pickaxe, axe, shovel, hoe)
export interface ItemTool extends Item {
	efficiencyOnProperMaterial: number;
	damageVsEntity: number;
	toolMaterial: string;
	
	getToolMaterial(): string;
	getStrVsBlock(stack: ItemStack, block: Block): number;
}

// ItemPickaxe - Pickaxes
export interface ItemPickaxe extends ItemTool {
	// Inherits from ItemTool
}

// ItemAppleGold - Golden apples
export interface ItemAppleGold extends ItemFood {
	// Inherits from ItemFood
}

// ItemStack - Stack of items
export interface ItemStack {
	item: Item;
	stackSize: number;
	itemDamage: number;
	
	getItem(): Item;
	getDisplayName(): string;
	getEnchantmentTagList(): any[];
	hasEffect(): boolean;
	isItemEnchanted(): boolean;
	isItemEnchantable(): boolean;
	getMaxStackSize(): number;
	isStackable(): boolean;
	isItemDamaged(): boolean;
	getItemDamage(): number;
	getMaxDamage(): number;
	attemptDamageItem(amount: number, random: any): boolean;
	damageItem(amount: number, entity: Entity): void;
	hitEntity(target: Entity, player: Entity): void;
	onBlockDestroyed(world: any, block: Block, pos: any, player: Entity): void;
	canHarvestBlock(block: Block): boolean;
	interactWithEntity(player: Entity, target: Entity): boolean;
	copy(): ItemStack;
	areItemStackTagsEqual(other: ItemStack): boolean;
	areItemStacksEqual(other: ItemStack): boolean;
	isItemEqual(other: ItemStack): boolean;
	getTooltip(player: Entity, advanced: boolean): string[];
	hasDisplayName(): boolean;
	getDisplayName(): string;
	setStackDisplayName(name: string): ItemStack;
	clearCustomName(): void;
	hasTagCompound(): boolean;
	getTagCompound(): any;
	setTagCompound(nbt: any): void;
}

// Global Items registry
export declare const Items: {
	readonly emerald_sword: Item;
	readonly diamond_sword: ItemSword;
	readonly iron_sword: ItemSword;
	readonly stone_sword: ItemSword;
	readonly wooden_sword: ItemSword;
	readonly bow: ItemBow;
	readonly arrow: Item;
	readonly golden_apple: ItemAppleGold;
	readonly apple: ItemFood;
	readonly bread: ItemFood;
	readonly cooked_beef: ItemFood;
	readonly cooked_porkchop: ItemFood;
	readonly diamond_helmet: ItemArmor;
	readonly diamond_chestplate: ItemArmor;
	readonly diamond_leggings: ItemArmor;
	readonly diamond_boots: ItemArmor;
	readonly iron_helmet: ItemArmor;
	readonly iron_chestplate: ItemArmor;
	readonly iron_leggings: ItemArmor;
	readonly iron_boots: ItemArmor;
	readonly chainmail_helmet: ItemArmor;
	readonly chainmail_chestplate: ItemArmor;
	readonly chainmail_leggings: ItemArmor;
	readonly chainmail_boots: ItemArmor;
	readonly diamond_pickaxe: ItemPickaxe;
	readonly iron_pickaxe: ItemPickaxe;
	readonly stone_pickaxe: ItemPickaxe;
	readonly wooden_pickaxe: ItemPickaxe;
	readonly ender_pearl: Item;
	readonly snowball: Item;
	readonly egg: Item;
	readonly flint_and_steel: Item;
	readonly fire_charge: Item;
	// Add more items as needed
	[key: string]: Item;
};
