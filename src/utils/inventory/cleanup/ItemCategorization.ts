import type { ItemStack } from "@wq2/miniblox-sdk";
import Miniblox from "../../refs/miniblox";
import {
	getFoodHealAmount,
	getFoodSaturationModifier,
	instanceOf,
	instanceOfAxe,
} from "../runtimeClasses";

export enum ItemType {
	NONE = "NONE",
	SWORD = "SWORD",
	WEAPON = "WEAPON",
	TOOL = "TOOL",
	BOW = "BOW",
	ARROW = "ARROW",
	FOOD = "FOOD",
	BLOCK = "BLOCK",
	THROWABLE = "THROWABLE",
	PEARL = "PEARL",
	BUCKET = "BUCKET",
	POTION = "POTION",
	ARMOR = "ARMOR",
	GAPPLE = "GAPPLE",
	ROD = "ROD",
}

export interface ItemCategory {
	readonly type: ItemType;
	readonly subtype: number;
}

export function categoryEquals(a: ItemCategory, b: ItemCategory): boolean {
	return a.type === b.type && a.subtype === b.subtype;
}

export function categoryIsEmpty(cat: ItemCategory): boolean {
	return cat.type === ItemType.NONE;
}

const _NONE_CATEGORY: ItemCategory = { type: ItemType.NONE, subtype: 0 };

export function getDefaultCategory(type: ItemType): ItemCategory {
	return { type, subtype: 0 };
}

export enum ItemFunction {
	WEAPON_LIKE,
	FOOD,
}

export interface ItemConstraintInfo {
	group: ItemNumberConstraintGroup;
	amountAddedByItem: number;
}

export interface ItemNumberConstraintGroup {
	acceptableRange: { first: number; last: number };
	priority: number;
	equals(other: ItemNumberConstraintGroup): boolean;
	hashCode(): number;
}

export class ItemCategoryConstraintGroup implements ItemNumberConstraintGroup {
	readonly acceptableRange: { first: number; last: number };
	readonly priority: number;
	readonly category: ItemCategory;

	constructor(
		acceptableRange: { first: number; last: number },
		priority: number,
		category: ItemCategory,
	) {
		this.acceptableRange = acceptableRange;
		this.priority = priority;
		this.category = category;
	}

	equals(other: ItemNumberConstraintGroup): boolean {
		if (!(other instanceof ItemCategoryConstraintGroup)) return false;
		return categoryEquals(this.category, other.category);
	}

	hashCode(): number {
		return this.category.type.charCodeAt(0) * 31 + this.category.subtype;
	}
}

export class ItemFunctionCategoryConstraintGroup implements ItemNumberConstraintGroup {
	readonly acceptableRange: { first: number; last: number };
	readonly priority: number;
	readonly function: ItemFunction;

	constructor(
		acceptableRange: { first: number; last: number },
		priority: number,
		fn: ItemFunction,
	) {
		this.acceptableRange = acceptableRange;
		this.priority = priority;
		this.function = fn;
	}

	equals(other: ItemNumberConstraintGroup): boolean {
		if (!(other instanceof ItemFunctionCategoryConstraintGroup)) return false;
		return this.function === other.function;
	}

	hashCode(): number {
		return this.function;
	}
}

export function getEnchantmentLevel(stack: ItemStack, effectId: number): number {
	const nbt = stack.getEnchantmentTagList();
	if (!nbt) return 0;
	let total = 0;
	for (const { id, lvl } of nbt) {
		if (id === effectId) total += lvl;
	}
	return total;
}

export function getEnchantmentCount(stack: ItemStack): number {
	const nbt = stack.getEnchantmentTagList();
	if (!nbt) return 0;
	return nbt.length;
}

export function estimateEnchantmentValue(
	stack: ItemStack,
	entries: Array<{ effectId: number; weight: number }>,
): number {
	let sum = 0;
	for (const { effectId, weight } of entries) {
		sum += getEnchantmentLevel(stack, effectId) * weight;
	}
	return sum;
}

export function isSword(stack: ItemStack): boolean {
	return stack.getItem() instanceof Miniblox.ItemSword;
}

export function isAxe(stack: ItemStack): boolean {
	return instanceOfAxe(stack.getItem());
}

export function isPickaxe(stack: ItemStack): boolean {
	return instanceOf(stack.getItem(), "iron_pickaxe");
}

export function isShovel(stack: ItemStack): boolean {
	return instanceOf(stack.getItem(), "iron_shovel");
}

export function isHoe(stack: ItemStack): boolean {
	return instanceOf(stack.getItem(), "iron_hoe");
}

export function isMiningTool(stack: ItemStack): boolean {
	return isAxe(stack) || isPickaxe(stack) || isShovel(stack) || isHoe(stack);
}

export function isFood(stack: ItemStack): boolean {
	return instanceOf(stack.getItem(), "apple");
}

export function isBlockItem(stack: ItemStack): boolean {
	return stack.getItem() instanceof Miniblox.ItemBlock;
}

export function isBow(stack: ItemStack): boolean {
	return stack.getItem() instanceof Miniblox.ItemBow;
}

export function isRod(stack: ItemStack): boolean {
	return instanceOf(stack.getItem(), "fishing_rod");
}

export function isThrowable(stack: ItemStack): boolean {
	const item = stack.getItem();
	return instanceOf(item, "snowball") || instanceOf(item, "egg") || instanceOf(item, "ender_pearl");
}

export function isPearl(stack: ItemStack): boolean {
	return instanceOf(stack.getItem(), "ender_pearl");
}

export function isArrow(stack: ItemStack): boolean {
	return instanceOf(stack.getItem(), "arrow");
}

export function isPotion(stack: ItemStack): boolean {
	return instanceOf(stack.getItem(), "potion");
}

export function isPlayerArmor(stack: ItemStack): boolean {
	return stack.getItem() instanceof Miniblox.ItemArmor;
}

export function getFoodNutrition(stack: ItemStack): number {
	return getFoodHealAmount(stack.getItem());
}

export function getFoodSaturation(stack: ItemStack): number {
	return getFoodSaturationModifier(stack.getItem());
}

export enum ItemSortChoice {
	SWORD = "Sword",
	WEAPON = "Weapon",
	BOW = "Bow",
	AXE = "Axe",
	PICKAXE = "Pickaxe",
	SHOVEL = "Shovel",
	HOE = "Hoe",
	ROD = "Rod",
	WATER = "Water",
	LAVA = "Lava",
	MILK = "Milk",
	PEARL = "Pearl",
	GAPPLE = "Gapple",
	FOOD = "Food",
	POTION = "Potion",
	BLOCK = "Block",
	THROWABLES = "Throwables",
	IGNORE = "Ignore",
	NONE = "None",
}

export function getSortChoiceCategory(choice: ItemSortChoice): ItemCategory {
	switch (choice) {
		case ItemSortChoice.SWORD:
			return getDefaultCategory(ItemType.SWORD);
		case ItemSortChoice.WEAPON:
			return getDefaultCategory(ItemType.WEAPON);
		case ItemSortChoice.BOW:
			return getDefaultCategory(ItemType.BOW);
		case ItemSortChoice.AXE:
			return { type: ItemType.TOOL, subtype: 1 << 0 };
		case ItemSortChoice.PICKAXE:
			return { type: ItemType.TOOL, subtype: 1 << 1 };
		case ItemSortChoice.SHOVEL:
			return { type: ItemType.TOOL, subtype: 1 << 2 };
		case ItemSortChoice.HOE:
			return { type: ItemType.TOOL, subtype: 1 << 3 };
		case ItemSortChoice.ROD:
			return getDefaultCategory(ItemType.ROD);
		case ItemSortChoice.WATER:
			return getDefaultCategory(ItemType.BUCKET);
		case ItemSortChoice.LAVA:
			return { type: ItemType.BUCKET, subtype: 1 };
		case ItemSortChoice.MILK:
			return { type: ItemType.BUCKET, subtype: 2 };
		case ItemSortChoice.PEARL:
			return getDefaultCategory(ItemType.PEARL);
		case ItemSortChoice.GAPPLE:
			return getDefaultCategory(ItemType.GAPPLE);
		case ItemSortChoice.FOOD:
			return getDefaultCategory(ItemType.FOOD);
		case ItemSortChoice.POTION:
			return getDefaultCategory(ItemType.POTION);
		case ItemSortChoice.BLOCK:
			return getDefaultCategory(ItemType.BLOCK);
		case ItemSortChoice.THROWABLES:
			return getDefaultCategory(ItemType.THROWABLE);
		case ItemSortChoice.IGNORE:
		case ItemSortChoice.NONE:
			return getDefaultCategory(ItemType.NONE);
	}
}
