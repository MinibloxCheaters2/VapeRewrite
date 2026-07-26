import type { ItemSlot } from "../ItemSlot";
import {
	isArrow,
	isAxe,
	isBlockItem,
	isBow,
	isFood,
	isHoe,
	isPickaxe,
	isRod,
	isShovel,
	isSword,
	isThrowable,
} from "./ItemCategorization";
import {
	ArrowItemFacet,
	BlockItemFacet,
	BowItemFacet,
	FoodItemFacet,
	type ItemFacet,
	MiningToolItemFacet,
	RodItemFacet,
	SwordItemFacet,
	ThrowableItemFacet,
	WeaponItemFacet,
} from "./ItemFacet";

export function getItemFacets(slot: ItemSlot): ItemFacet[] {
	const stack = slot.getStack();
	if (!stack) return [];

	const facets: ItemFacet[] = [];

	facets.push(new WeaponItemFacet(slot));

	if (isSword(stack)) {
		facets.push(new SwordItemFacet(slot));
	} else if (isBlockItem(stack)) {
		facets.push(new BlockItemFacet(slot));
	} else if (isFood(stack)) {
		facets.push(new FoodItemFacet(slot));
	} else if (isBow(stack)) {
		facets.push(new BowItemFacet(slot));
	} else if (isRod(stack)) {
		facets.push(new RodItemFacet(slot));
	} else if (isArrow(stack)) {
		facets.push(new ArrowItemFacet(slot));
	} else if (isThrowable(stack)) {
		facets.push(new ThrowableItemFacet(slot));
	} else if (
		isAxe(stack) ||
		isPickaxe(stack) ||
		isShovel(stack) ||
		isHoe(stack)
	) {
		facets.push(new MiningToolItemFacet(slot));
	}

	return facets;
}
