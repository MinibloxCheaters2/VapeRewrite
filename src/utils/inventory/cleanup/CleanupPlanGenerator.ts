import type { ItemSlot } from "../ItemSlot";
import { Slots } from "../ItemSlot";
import { InventoryCleanupPlan, type InventorySwap } from "./CleanupPlan";
import type { ItemSortChoice } from "./ItemCategorization";
import {
	categoryIsEmpty,
	getSortChoiceCategory,
	type ItemCategory,
	type ItemConstraintInfo,
	type ItemNumberConstraintGroup,
	ItemType,
} from "./ItemCategorization";
import type { ItemFacet } from "./ItemFacet";
import { getItemFacets } from "./ItemFacetFactory";
import {
	type ItemAmountConstraintProvider,
	ItemPacker,
	SatisfactionStatus,
} from "./ItemPacker";

export interface CleanupPlanPlacementTemplate {
	slotContentMap: Map<ItemSlot, ItemSortChoice>;
	itemAmountConstraintProvider: (item: ItemFacet) => ItemConstraintInfo[];
	forbiddenSlots: Set<ItemSlot>;
	forbiddenSlotsToFill: Set<ItemSlot>;
	isGreedy: boolean;
}

export class CleanupPlanGenerator implements ItemAmountConstraintProvider {
	private readonly availableItems: ItemSlot[];
	private readonly template: CleanupPlanPlacementTemplate;
	private readonly hotbarSwaps: InventorySwap[] = [];
	private readonly packer = new ItemPacker();
	private readonly currentLimit = new Map<string, number>();

	private readonly categoryToSlotsMap: Map<string, ItemSlot[]>;

	constructor(
		template: CleanupPlanPlacementTemplate,
		availableItems: ItemSlot[],
	) {
		this.availableItems = availableItems;
		this.template = template;

		this.categoryToSlotsMap = new Map();
		for (const [slot, sortChoice] of template.slotContentMap) {
			const category = getSortChoiceCategory(sortChoice);
			if (categoryIsEmpty(category)) continue;

			const key = categoryKey(category);
			const existing = this.categoryToSlotsMap.get(key);
			if (existing) {
				existing.push(slot);
			} else {
				this.categoryToSlotsMap.set(key, [slot]);
			}
		}
	}

	generatePlan(): InventoryCleanupPlan {
		const itemFacets: ItemFacet[] = [];
		for (const slot of this.availableItems) {
			const facets = getItemFacets(slot);
			itemFacets.push(...facets);
		}

		const facetsGroupedByType = new Map<
			string,
			{ category: ItemCategory; items: ItemFacet[] }
		>();
		for (const facet of itemFacets) {
			const key = categoryKey(facet.category);
			const existing = facetsGroupedByType.get(key);
			if (existing) {
				existing.items.push(facet);
			} else {
				facetsGroupedByType.set(key, {
					category: facet.category,
					items: [facet],
				});
			}
		}

		const sortedEntries = [...facetsGroupedByType.values()].sort(
			(a, b) =>
				getAllocationPriority(b.category.type) -
				getAllocationPriority(a.category.type),
		);

		for (const { category, items } of sortedEntries) {
			this.processItemCategory(category, items);
		}

		for (const slot of this.template.forbiddenSlots) {
			this.packer.usefulItems.add(slot);
		}

		return new InventoryCleanupPlan(
			this.packer.usefulItems,
			this.hotbarSwaps,
			this.groupItemsByType(),
		);
	}

	private processItemCategory(
		category: ItemCategory,
		availableItems: ItemFacet[],
	): void {
		const hotbarSlotsToFill = this.categoryToSlotsMap.get(
			categoryKey(category),
		);

		const prioritizedItemList = [...availableItems].sort((a, b) =>
			a.compareTo(b),
		);

		const requiredMoves = this.packer.packItems(
			prioritizedItemList,
			hotbarSlotsToFill ?? null,
			this.template.forbiddenSlots,
			this.template.forbiddenSlotsToFill,
			this,
		);

		for (const move of requiredMoves) {
			if (move instanceof Object && "slot" in move && "button" in move) {
				// It's a ClickAction (swap)
				const from = (move as { slot: ItemSlot }).slot;
				const toIndex = (move as { button: number }).button;
				const toSlot = findSlotByIndex(toIndex);
				if (toSlot) {
					this.hotbarSwaps.push({ from, to: toSlot });
				}
			}
		}
	}

	private groupItemsByType(): Map<string, ItemSlot[]> {
		const itemsByType = new Map<string, ItemSlot[]>();

		for (const slot of this.availableItems) {
			const stack = slot.getStack();
			if (!stack || stack.stackSize >= stack.getMaxStackSize()) continue;

			const key = `${stack.getItem().id}_${stack.stackSize}`;
			const existing = itemsByType.get(key);
			if (existing) {
				existing.push(slot);
			} else {
				itemsByType.set(key, [slot]);
			}
		}

		return itemsByType;
	}

	getSatisfactionStatus(item: ItemFacet): SatisfactionStatus {
		const constraints = this.template.itemAmountConstraintProvider(item);

		constraints.sort((a, b) => b.group.priority - a.group.priority);

		for (const constraintInfo of constraints) {
			const currentCount =
				this.currentLimit.get(
					constraintGroupKey(constraintInfo.group),
				) ?? 0;
			const projectedCount =
				currentCount + constraintInfo.amountAddedByItem;

			if (projectedCount > constraintInfo.group.acceptableRange.last) {
				return SatisfactionStatus.OVERSATURATED;
			} else if (
				currentCount < constraintInfo.group.acceptableRange.first
			) {
				return SatisfactionStatus.NOT_SATISFIED;
			}
		}

		return SatisfactionStatus.SATISFIED;
	}

	addItem(item: ItemFacet): void {
		const constraints = this.template.itemAmountConstraintProvider(item);

		for (const constraintInfo of constraints) {
			const key = constraintGroupKey(constraintInfo.group);
			const current = this.currentLimit.get(key) ?? 0;
			this.currentLimit.set(
				key,
				current + constraintInfo.amountAddedByItem,
			);
		}
	}
}

function categoryKey(cat: ItemCategory): string {
	return `${cat.type}_${cat.subtype}`;
}

function constraintGroupKey(group: ItemNumberConstraintGroup): string {
	return `${group.acceptableRange.first}_${group.acceptableRange.last}_${group.priority}`;
}

function getAllocationPriority(type: ItemType): number {
	switch (type) {
		case ItemType.ARMOR:
			return 50;
		case ItemType.SWORD:
			return 30;
		case ItemType.WEAPON:
			return 20;
		case ItemType.TOOL:
			return 10;
		case ItemType.BOW:
			return 5;
		case ItemType.ROD:
			return 5;
		case ItemType.FOOD:
			return 3;
		case ItemType.BLOCK:
			return 2;
		default:
			return 0;
	}
}

function findSlotByIndex(index: number): ItemSlot | null {
	const allSlots: ItemSlot[] = [...Slots.Hotbar, ...Slots.Inventory];
	return allSlots.find((s) => s.index === index) ?? null;
}
