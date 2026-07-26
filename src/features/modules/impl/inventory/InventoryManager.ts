import { Priority, Subscribe } from "@/event/Bus";
import type { InventoryCleanupPlan } from "@/utils/inventory/cleanup/CleanupPlan";
import {
	CleanupPlanGenerator,
	type CleanupPlanPlacementTemplate,
} from "@/utils/inventory/cleanup/CleanupPlanGenerator";
import {
	type ItemCategory,
	ItemCategoryConstraintGroup,
	type ItemConstraintInfo,
	ItemSortChoice,
	ItemType,
} from "@/utils/inventory/cleanup/ItemCategorization";
import {
	ClickAction,
	type InventoryAction,
} from "@/utils/inventory/InventoryAction";
import {
	ArmorItemSlot,
	HotbarItemSlot,
	type ItemSlot,
	Slots,
} from "@/utils/inventory/ItemSlot";
import Miniblox from "@/utils/refs/miniblox";
import Category from "../../api/Category";
import Mod from "../../api/Module";

interface ScheduledAction {
	action: InventoryAction;
	tickDelay: number;
	priority: Priority;
}

export default class InventoryManager extends Mod {
	name = "InventoryManager";
	category = Category.INVENTORY;

	private scheduledActions: ScheduledAction[] = [];
	private currentTick = 0;

	private readonly maxBlocks = 512;
	private readonly maxArrows = 128;
	private readonly maxThrowables = 64;
	private readonly maxFoodPoints = 200;
	private readonly maxWaterBuckets = 2;
	private readonly maxLavaBuckets = 2;
	private readonly maxMilkBuckets = 2;

	private readonly hotbarSlots: ItemSortChoice[] = [
		ItemSortChoice.WEAPON,
		ItemSortChoice.BOW,
		ItemSortChoice.PICKAXE,
		ItemSortChoice.AXE,
		ItemSortChoice.NONE,
		ItemSortChoice.FOOD,
		ItemSortChoice.BLOCK,
		ItemSortChoice.BLOCK,
	];

	@Subscribe("gameTick", Priority.NORMAL)
	private onTick() {
		const { player } = Miniblox;
		if (!player) return;

		this.currentTick++;

		// Process scheduled actions
		if (this.scheduledActions.length > 0) {
			const readyActions = this.scheduledActions.filter(
				(a) => this.currentTick >= a.tickDelay,
			);
			if (readyActions.length > 0) {
				const action = readyActions[0];
				action.action.performAction();
				this.scheduledActions = this.scheduledActions.filter(
					(a) => a !== action,
				);
			}
			return;
		}

		// Generate and execute cleanup plan
		const inventorySlots = this.findNonEmptySlotsInInventory();
		if (inventorySlots.length === 0) return;

		const template = this.buildCleanupTemplate();
		const plan = new CleanupPlanGenerator(
			template,
			inventorySlots,
		).generatePlan();

		// Priority 1: Hotbar swaps
		if (this.processHotbarSwaps(plan)) return;

		// Priority 2: Stack merging
		if (this.processStackMerging(plan)) return;

		// Priority 3: Item disposal
		if (this.processItemDisposal(plan, inventorySlots)) return;
	}

	private processHotbarSwaps(plan: InventoryCleanupPlan): boolean {
		const swap = plan.swaps[0];
		if (!swap) return false;

		this.scheduleAction(
			ClickAction.performSwap(swap.from, swap.to.index),
			Priority.NORMAL,
		);
		return true;
	}

	private processStackMerging(plan: InventoryCleanupPlan): boolean {
		const stacksToMerge = plan.findSlotsToMerge();
		const slotToMerge = stacksToMerge[0];
		if (!slotToMerge) return false;

		const mergeActions = ClickAction.performMergeStack(slotToMerge);
		for (const action of mergeActions) {
			this.scheduleAction(action, Priority.NORMAL);
		}
		return true;
	}

	private processItemDisposal(
		plan: InventoryCleanupPlan,
		currentSlots: ItemSlot[],
	): boolean {
		const itemsToThrowOut = plan.findItemsToThrowOut(currentSlots);
		const itemToThrow = itemsToThrowOut[0];
		if (!itemToThrow) return false;

		this.scheduleAction(
			ClickAction.performThrow(itemToThrow),
			Priority.LOW,
		);
		return true;
	}

	private scheduleAction(
		action: InventoryAction,
		priority: Priority,
		tickDelay = 0,
	) {
		this.scheduledActions.push({
			action,
			tickDelay: this.currentTick + tickDelay,
			priority,
		});
		this.scheduledActions.sort(
			(a, b) => (b.priority as number) - (a.priority as number),
		);
	}

	private findNonEmptySlotsInInventory(): ItemSlot[] {
		const slots: ItemSlot[] = [];
		for (const slot of Slots.All) {
			if (slot.getHasStack()) {
				slots.push(slot);
			}
		}
		return slots;
	}

	private buildCleanupTemplate(): CleanupPlanPlacementTemplate {
		const slotContentMap = new Map<ItemSlot, ItemSortChoice>();
		for (let i = 0; i < 9; i++) {
			slotContentMap.set(HotbarItemSlot.ALL[i], this.hotbarSlots[i]);
		}

		const forbiddenSlots = new Set<ItemSlot>([...ArmorItemSlot.ALL]);

		return {
			slotContentMap,
			itemAmountConstraintProvider: (facet) => this.getConstraints(facet),
			forbiddenSlots,
			forbiddenSlotsToFill: new Set<ItemSlot>(),
			isGreedy: true,
		};
	}

	private getConstraints(facet: {
		category: ItemCategory;
		itemStack: { stackSize: number } | null;
	}): ItemConstraintInfo[] {
		const constraints: ItemConstraintInfo[] = [];
		const stackSize = facet.itemStack?.stackSize ?? 0;

		const cat = facet.category;
		let desiredAmount: number;

		if (cat.type === ItemType.BLOCK) {
			desiredAmount = this.maxBlocks;
		} else if (cat.type === ItemType.THROWABLE) {
			desiredAmount = this.maxThrowables;
		} else if (cat.type === ItemType.ARROW) {
			desiredAmount = this.maxArrows;
		} else if (cat.type === ItemType.BUCKET && cat.subtype === 0) {
			desiredAmount = this.maxWaterBuckets;
		} else if (cat.type === ItemType.BUCKET && cat.subtype === 1) {
			desiredAmount = this.maxLavaBuckets;
		} else if (cat.type === ItemType.BUCKET && cat.subtype === 2) {
			desiredAmount = this.maxMilkBuckets;
		} else if (cat.type === ItemType.FOOD) {
			desiredAmount = this.maxFoodPoints;
		} else {
			desiredAmount = cat.type === ItemType.NONE ? 1 : 1;
		}

		constraints.push({
			group: new ItemCategoryConstraintGroup(
				{ first: desiredAmount, last: Number.MAX_SAFE_INTEGER },
				10,
				facet.category,
			),
			amountAddedByItem: stackSize,
		});

		return constraints;
	}
}
