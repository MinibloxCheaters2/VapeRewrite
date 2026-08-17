import type { ItemStack } from "@wq2/miniblox-sdk";
import Miniblox from "../../refs/miniblox";
import type { ItemSlot } from "../ItemSlot";
import { getFoodHealAmount, getFoodSaturationModifier, instanceOfAxe } from "../runtimeClasses";
import type { ItemCategory } from "./ItemCategorization";
import {
	getDefaultCategory,
	getEnchantmentLevel,
	ItemType,
	isAxe,
	isHoe,
	isPickaxe,
	isShovel,
	isSword,
} from "./ItemCategorization";

export class ItemFacet {
	readonly itemSlot: ItemSlot;

	constructor(itemSlot: ItemSlot) {
		this.itemSlot = itemSlot;
	}

	get itemStack(): ItemStack | null {
		return this.itemSlot.getStack();
	}

	get category(): ItemCategory {
		return getDefaultCategory(ItemType.NONE);
	}

	get isInHotbar(): boolean {
		return this.itemSlot.slotType === "HOTBAR" || this.itemSlot.slotType === "OFFHAND";
	}

	shouldKeep(): boolean {
		return false;
	}

	compareTo(other: ItemFacet): number {
		return (this.isInHotbar ? 0 : 1) - (other.isInHotbar ? 0 : 1);
	}
}

export class WeaponItemFacet extends ItemFacet {
	get category(): ItemCategory {
		return getDefaultCategory(ItemType.WEAPON);
	}

	private static estimateDamage(stack: ItemStack): number {
		const { ItemSword, Enchantments } = Miniblox;
		let attackDamage = 1;
		let attackSpeed = 4;

		const item = stack.getItem();
		if (item instanceof ItemSword) {
			attackDamage = item.attackDamage + 1;
			attackSpeed = 1.6;
		} else if (instanceOfAxe(item)) {
			attackDamage = (item as { damageVsEntity?: number }).damageVsEntity ?? 1;
			attackDamage += 1;
			attackSpeed = 0.8;
		} else {
			attackDamage = 1;
			attackSpeed = 4;
		}

		const sharpnessId = Enchantments.sharpness?.effectId;
		if (sharpnessId != null) {
			attackDamage += getEnchantmentLevel(stack, sharpnessId) * 1.25;
		}

		const smiteId = Enchantments.smite?.effectId;
		if (smiteId != null) {
			attackDamage += getEnchantmentLevel(stack, smiteId) * 2.5;
		}

		const knockbackId = Enchantments.knockback?.effectId;
		if (knockbackId != null) {
			attackDamage += getEnchantmentLevel(stack, knockbackId) * 0.5;
		}

		const fireAspectId = Enchantments.fireAspect?.effectId;
		if (fireAspectId != null) {
			const lvl = getEnchantmentLevel(stack, fireAspectId);
			attackDamage += Math.max(lvl * 4 - 1, 0) * 0.33;
		}

		const p = 0.85 ** (1 / 20);
		const bigT = 20 / attackSpeed;
		const probAdj = p ** Math.ceil(bigT * 0.9);

		return attackDamage * attackSpeed * probAdj;
	}

	private static secondaryValue(stack: ItemStack): number {
		const { Enchantments } = Miniblox;
		let sum = 0;

		const lootingId = Enchantments.looting?.effectId;
		if (lootingId != null) sum += getEnchantmentLevel(stack, lootingId) * 0.05;

		const unbreakingId = Enchantments.unbreaking?.effectId;
		if (unbreakingId != null) sum += getEnchantmentLevel(stack, unbreakingId) * 0.05;

		const ench = stack.getEnchantmentTagList();
		if (ench) {
			for (const { id, lvl } of ench) {
				// mending (enchantment id varies by version)
				if (id === 70) sum += lvl * 0.1;
				// sweeping edge
				if (id === 22) sum += lvl * 0.2;
			}
		}

		return sum;
	}

	compareTo(other: ItemFacet): number {
		const aStack = this.itemStack;
		const bStack = other.itemStack;
		if (!aStack) return -1;
		if (!bStack) return 1;

		const aDamage = WeaponItemFacet.estimateDamage(aStack);
		const bDamage = WeaponItemFacet.estimateDamage(bStack);
		if (aDamage !== bDamage) return aDamage - bDamage;

		const aSecondary = WeaponItemFacet.secondaryValue(aStack);
		const bSecondary = WeaponItemFacet.secondaryValue(bStack);
		if (aSecondary !== bSecondary) return aSecondary - bSecondary;

		const aIsSword = isSword(aStack) ? 1 : 0;
		const bIsSword = isSword(bStack) ? 1 : 0;
		if (aIsSword !== bIsSword) return aIsSword - bIsSword;

		return this.isInHotbar ? 1 : 0;
	}
}

export class SwordItemFacet extends WeaponItemFacet {
	override get category(): ItemCategory {
		return getDefaultCategory(ItemType.SWORD);
	}
}

export class MiningToolItemFacet extends ItemFacet {
	static readonly MASK_AXE = 1 << 0;
	static readonly MASK_PICKAXE = 1 << 1;
	static readonly MASK_SHOVEL = 1 << 2;
	static readonly MASK_HOE = 1 << 3;

	private get miningToolType(): number {
		const stack = this.itemStack;
		if (!stack) return 0;
		let bits = 0;
		if (isAxe(stack)) bits |= MiningToolItemFacet.MASK_AXE;
		if (isPickaxe(stack)) bits |= MiningToolItemFacet.MASK_PICKAXE;
		if (isShovel(stack)) bits |= MiningToolItemFacet.MASK_SHOVEL;
		if (isHoe(stack)) bits |= MiningToolItemFacet.MASK_HOE;
		return bits;
	}

	private get miningSpeed(): number {
		const stack = this.itemStack;
		if (!stack) return 0;
		return 1;
	}

	override get category(): ItemCategory {
		return { type: ItemType.TOOL, subtype: this.miningToolType };
	}

	private static toolValue(stack: ItemStack): number {
		const { Enchantments } = Miniblox;
		let sum = 0;

		const efficiencyId = Enchantments.efficiency?.effectId;
		if (efficiencyId != null) {
			const lvl = getEnchantmentLevel(stack, efficiencyId);
			sum += lvl * lvl + 1;
		}

		const silkTouchId = Enchantments.silkTouch?.effectId;
		if (silkTouchId != null) sum += getEnchantmentLevel(stack, silkTouchId) * 1.0;

		const fortuneId = Enchantments.fortune?.effectId;
		if (fortuneId != null) sum += getEnchantmentLevel(stack, fortuneId) * 0.33;

		const unbreakingId = Enchantments.unbreaking?.effectId;
		if (unbreakingId != null) sum += getEnchantmentLevel(stack, unbreakingId) * 0.2;

		return sum;
	}

	compareTo(other: ItemFacet): number {
		const aStack = this.itemStack;
		const bStack = other.itemStack;
		if (!aStack) return -1;
		if (!bStack) return 1;

		if (other instanceof MiningToolItemFacet) {
			if (this.miningSpeed !== other.miningSpeed) return this.miningSpeed - other.miningSpeed;
		}

		const aValue = MiningToolItemFacet.toolValue(aStack);
		const bValue = MiningToolItemFacet.toolValue(bStack);
		if (aValue !== bValue) return aValue - bValue;

		return this.isInHotbar ? 1 : 0;
	}
}

export class BowItemFacet extends ItemFacet {
	private static bowValue(stack: ItemStack): number {
		const { Enchantments } = Miniblox;
		let sum = 0;

		const powerId = Enchantments.power?.effectId;
		if (powerId != null) sum += getEnchantmentLevel(stack, powerId) * 0.25;

		const punchId = Enchantments.punch?.effectId;
		if (punchId != null) sum += getEnchantmentLevel(stack, punchId) * 0.33;

		const flameId = Enchantments.flame?.effectId;
		if (flameId != null) sum += getEnchantmentLevel(stack, flameId) * 3.6;

		const infinityId = Enchantments.infinity?.effectId;
		if (infinityId != null) sum += getEnchantmentLevel(stack, infinityId) * 4.0;

		const unbreakingId = Enchantments.unbreaking?.effectId;
		if (unbreakingId != null) sum += getEnchantmentLevel(stack, unbreakingId) * 0.1;

		return sum;
	}

	override get category(): ItemCategory {
		return getDefaultCategory(ItemType.BOW);
	}

	compareTo(other: ItemFacet): number {
		const aStack = this.itemStack;
		const bStack = other.itemStack;
		if (!aStack) return -1;
		if (!bStack) return 1;

		const aVal = BowItemFacet.bowValue(aStack);
		const bVal = BowItemFacet.bowValue(bStack);
		if (aVal !== bVal) return aVal - bVal;

		return this.isInHotbar ? 1 : 0;
	}
}

export class FoodItemFacet extends ItemFacet {
	override get category(): ItemCategory {
		return getDefaultCategory(ItemType.FOOD);
	}

	compareTo(other: ItemFacet): number {
		const aStack = this.itemStack;
		const bStack = other.itemStack;
		if (!aStack) return -1;
		if (!bStack) return 1;

		const aNutrition = getFoodHealAmount(aStack.getItem());
		const bNutrition = getFoodHealAmount(bStack.getItem());

		if (aNutrition !== bNutrition) return aNutrition - bNutrition;

		const aSat = getFoodSaturationModifier(aStack.getItem());
		const bSat = getFoodSaturationModifier(bStack.getItem());

		if (aSat !== bSat) return aSat - bSat;

		return this.isInHotbar ? 1 : 0;
	}
}

export class BlockItemFacet extends ItemFacet {
	override get category(): ItemCategory {
		return getDefaultCategory(ItemType.BLOCK);
	}

	compareTo(_other: ItemFacet): number {
		return this.isInHotbar ? 1 : 0;
	}
}

export class PrimitiveItemFacet extends ItemFacet {
	readonly _category: ItemCategory;
	readonly worth: number;

	constructor(itemSlot: ItemSlot, category: ItemCategory, worth = 0) {
		super(itemSlot);
		this._category = category;
		this.worth = worth;
	}

	override get category(): ItemCategory {
		return this._category;
	}

	compareTo(other: ItemFacet): number {
		if (other instanceof PrimitiveItemFacet) {
			if (this.worth !== other.worth) return this.worth - other.worth;
		}
		return this.isInHotbar ? 1 : 0;
	}
}

export class ThrowableItemFacet extends ItemFacet {
	override get category(): ItemCategory {
		return getDefaultCategory(ItemType.THROWABLE);
	}

	compareTo(_other: ItemFacet): number {
		return this.isInHotbar ? 1 : 0;
	}
}

export class ArrowItemFacet extends ItemFacet {
	override get category(): ItemCategory {
		return getDefaultCategory(ItemType.ARROW);
	}

	compareTo(_other: ItemFacet): number {
		return this.isInHotbar ? 1 : 0;
	}
}

export class RodItemFacet extends ItemFacet {
	private static rodValue(stack: ItemStack): number {
		const { Enchantments } = Miniblox;
		const unbreakingId = Enchantments.unbreaking?.effectId;
		if (unbreakingId != null) return getEnchantmentLevel(stack, unbreakingId) * 0.4;
		return 0;
	}

	override get category(): ItemCategory {
		return getDefaultCategory(ItemType.ROD);
	}

	compareTo(other: ItemFacet): number {
		const aStack = this.itemStack;
		const bStack = other.itemStack;
		if (!aStack) return -1;
		if (!bStack) return 1;

		const aVal = RodItemFacet.rodValue(aStack);
		const bVal = RodItemFacet.rodValue(bStack);
		if (aVal !== bVal) return aVal - bVal;

		return this.isInHotbar ? 1 : 0;
	}
}

export class GodAxeFacet extends ItemFacet {
	override shouldKeep(): boolean {
		return true;
	}
}

export class SharpAxeFacet extends WeaponItemFacet {
	override shouldKeep(): boolean {
		return true;
	}
}
