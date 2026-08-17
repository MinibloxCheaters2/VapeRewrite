import type { Item, Items } from "@wq2/miniblox-sdk";
import Miniblox from "../refs/miniblox";

export function instanceOf<T extends keyof typeof Items>(
	item: Item,
	of: T,
): item is (typeof Items)[T] {
	return item instanceof Miniblox.Items[of].constructor;
}

export function instanceOfAxe(item: Item): boolean {
	const Items = Miniblox.Items;
	return (
		item instanceof Items.iron_axe.constructor &&
		!(item instanceof Items.iron_pickaxe.constructor) &&
		!(item instanceof Items.iron_shovel.constructor)
	);
}

export function getFoodHealAmount(item: Item): number {
	if (!instanceOf(item, "apple")) return 0;
	return item.healAmount ?? 0;
}

export function getFoodSaturationModifier(item: Item): number {
	if (!instanceOf(item, "apple")) return 0;
	return item.saturationModifier ?? 0;
}
