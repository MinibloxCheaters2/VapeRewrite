import type { ItemStack } from "@wq2/miniblox-sdk";
import remapObj from "../../helpers/remapProxy";
import mappings from "../../mapping/mappings";
import Miniblox from "../../refs/miniblox";
import type { ItemSlot } from "../ItemSlot";

export interface ArmorPiece {
	readonly slot: ItemSlot;
	readonly slotType: number;
	readonly defensePoints: number;
	readonly toughness: number;
	readonly knockbackResistance: number;
	readonly damageReduction: number;
	readonly enchantmentScore: number;
	readonly durabilityRatio: number;
}

const EXPECTED_DAMAGE = 6.0;

const DAMAGE_REDUCTION_ENCHANTMENTS = [0, 1, 2, 3];
const ENCHANTMENT_FACTORS = [1.2, 0.4, 0.39, 0.38];
const ENCHANTMENT_DAMAGE_REDUCTION = [0.04, 0.08, 0.15, 0.08];

const OTHER_ENCHANTMENTS = [4, 7, 6, 5, 3];
const OTHER_ENCHANTMENT_PER_LEVEL = [3.0, 1.0, 0.1, 0.05, 0.01];

function getEnchantmentLevel(stack: ItemStack, effectId: number): number {
	const nbt = stack.getEnchantmentTagList();
	if (!nbt) return 0;
	let total = 0;
	for (const { id, lvl } of nbt) {
		if (id === effectId) total += lvl;
	}
	return total;
}

function getDamageFactor(
	damage: number,
	defensePoints: number,
	toughness: number,
): number {
	const f = 2.0 + toughness / 4.0;
	const g = Math.min(
		Math.max(defensePoints - damage / f, defensePoints * 0.2),
		20.0,
	);
	return 1.0 - g / 25.0;
}

function getThresholdedEnchantmentDamageReduction(stack: ItemStack): number {
	const { Enchantments } = Miniblox;
	let sum = 0;
	const enchIds = [
		Enchantments.protection?.effectId,
		Enchantments.projectileProtection?.effectId,
		Enchantments.fireProtection?.effectId,
		Enchantments.blastProtection?.effectId,
	];
	for (let i = 0; i < DAMAGE_REDUCTION_ENCHANTMENTS.length; i++) {
		const effectId = enchIds[i];
		if (effectId == null) continue;
		const lvl = getEnchantmentLevel(stack, effectId);
		sum += lvl * ENCHANTMENT_FACTORS[i] * ENCHANTMENT_DAMAGE_REDUCTION[i];
	}
	return sum;
}

function getEnchantmentThreshold(stack: ItemStack): number {
	const { Enchantments } = Miniblox;
	const enchIds = [
		Enchantments.featherFalling?.effectId,
		Enchantments.thorns?.effectId,
		(
			Enchantments as unknown as Record<
				string,
				{ effectId: number } | undefined
			>
		).respiration?.effectId,
		(
			Enchantments as unknown as Record<
				string,
				{ effectId: number } | undefined
			>
		).aquaAffinity?.effectId,
		Enchantments.unbreaking?.effectId,
	];
	let sum = 0;
	for (let i = 0; i < OTHER_ENCHANTMENTS.length; i++) {
		const effectId = enchIds[i];
		if (effectId == null) continue;
		const lvl = getEnchantmentLevel(stack, effectId);
		sum += lvl * OTHER_ENCHANTMENT_PER_LEVEL[i];
	}
	return sum;
}

interface ArmorItemProxy {
	damageReduceAmount: number;
	armorType: number;
	toughness: number;
}

function getArmorProps(stack: ItemStack): ArmorItemProxy {
	const proxied = remapObj(
		stack.getItem(),
		mappings.ItemArmor,
	) as unknown as ArmorItemProxy;
	return {
		damageReduceAmount: proxied?.damageReduceAmount ?? 0,
		armorType: proxied?.armorType ?? 0,
		toughness: proxied?.toughness ?? 0,
	};
}

function getThresholdedDamageReduction(
	stack: ItemStack,
	defensePointsExcludingSlot: number,
	toughnessExcludingSlot: number,
): number {
	const { damageReduceAmount: armorDefense, toughness: armorToughness } =
		getArmorProps(stack);

	const parameters = {
		defensePoints: defensePointsExcludingSlot + armorDefense,
		toughness: toughnessExcludingSlot + armorToughness,
	};

	return (
		getDamageFactor(
			EXPECTED_DAMAGE,
			parameters.defensePoints,
			parameters.toughness,
		) *
		(1 - getThresholdedEnchantmentDamageReduction(stack))
	);
}

function createArmorPiece(slot: ItemSlot, stack: ItemStack): ArmorPiece {
	const { damageReduceAmount: defensePoints, armorType: slotType } =
		getArmorProps(stack);
	const maxDmg = stack.getMaxDamage();
	const durabilityRatio =
		maxDmg > 0 ? (maxDmg - stack.getItemDamage()) / maxDmg : 1;

	const nbt = stack.getEnchantmentTagList();
	let enchantmentScore = 0;
	if (nbt) {
		for (const { lvl } of nbt) {
			enchantmentScore += lvl;
		}
	}

	return {
		slot,
		slotType,
		defensePoints,
		toughness: 0,
		knockbackResistance: 0,
		damageReduction: defensePoints,
		enchantmentScore,
		durabilityRatio,
	};
}

function groupArmorByType(slots: ItemSlot[]): Map<number, ArmorPiece[]> {
	const groups = new Map<number, ArmorPiece[]>();
	const { ItemArmor } = Miniblox;

	for (const slot of slots) {
		const stack = slot.getStack();
		if (!stack) continue;
		const item = stack.getItem();
		if (!(item instanceof ItemArmor)) continue;

		const piece = createArmorPiece(slot, stack);
		const existing = groups.get(piece.slotType) ?? [];
		existing.push(piece);
		groups.set(piece.slotType, existing);
	}

	return groups;
}

export interface ArmorKitParameters {
	defensePoints: Map<number, number>;
	toughness: Map<number, number>;
}

export function getParametersForSlots(
	currentKit: Map<number, ArmorPiece | null>,
): ArmorKitParameters {
	let totalDefense = 0;
	let totalToughness = 0;

	for (const piece of currentKit.values()) {
		if (piece) {
			totalDefense += piece.defensePoints;
			totalToughness += piece.toughness;
		}
	}

	const defensePoints = new Map<number, number>();
	const toughness = new Map<number, number>();

	for (const [slotType, piece] of currentKit) {
		if (piece) {
			defensePoints.set(slotType, totalDefense - piece.defensePoints);
			toughness.set(slotType, totalToughness - piece.toughness);
		} else {
			defensePoints.set(slotType, totalDefense);
			toughness.set(slotType, totalToughness);
		}
	}

	return { defensePoints, toughness };
}

function createComparator(
	currentKit: Map<number, ArmorPiece | null>,
): (a: ArmorPiece, b: ArmorPiece) => number {
	const params = getParametersForSlots(currentKit);

	return (a: ArmorPiece, b: ArmorPiece): number => {
		const aStack = a.slot.getStack();
		if (!aStack) return 0;
		const bStack = b.slot.getStack();
		if (!bStack) return 0;
		const aDamageReduction = getThresholdedDamageReduction(
			aStack,
			params.defensePoints.get(a.slotType) ?? 0,
			params.toughness.get(a.slotType) ?? 0,
		);
		const bDamageReduction = getThresholdedDamageReduction(
			bStack,
			params.defensePoints.get(b.slotType) ?? 0,
			params.toughness.get(b.slotType) ?? 0,
		);

		const aEnchantThreshold = Math.round(
			getEnchantmentThreshold(aStack) * 1000,
		);
		const bEnchantThreshold = Math.round(
			getEnchantmentThreshold(bStack) * 1000,
		);

		if (aDamageReduction !== bDamageReduction)
			return aDamageReduction - bDamageReduction;
		if (aEnchantThreshold !== bEnchantThreshold)
			return aEnchantThreshold - bEnchantThreshold;
		if (a.enchantmentScore !== b.enchantmentScore)
			return a.enchantmentScore - b.enchantmentScore;
		if (a.durabilityRatio !== b.durabilityRatio)
			return a.durabilityRatio - b.durabilityRatio;
		return 0;
	};
}

export function findBestArmorPieces(
	slots: ItemSlot[],
): Map<number, ArmorPiece | null> {
	const armorByType = groupArmorByType(slots);
	const currentBestPieces = new Map<number, ArmorPiece | null>();

	for (const [slotType, pieces] of armorByType) {
		currentBestPieces.set(
			slotType,
			pieces.reduce(
				(best, piece) =>
					piece.defensePoints > (best?.defensePoints ?? 0)
						? piece
						: best,
				null as ArmorPiece | null,
			),
		);
	}

	for (let pass = 0; pass < 2; pass++) {
		const comparator = createComparator(currentBestPieces);

		currentBestPieces.clear();
		for (const [slotType, pieces] of armorByType) {
			currentBestPieces.set(
				slotType,
				pieces.reduce(
					(best, piece) =>
						!best || comparator(piece, best) > 0 ? piece : best,
					null as ArmorPiece | null,
				),
			);
		}
	}

	return currentBestPieces;
}
