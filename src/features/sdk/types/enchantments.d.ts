import type { DamageSource } from "./damageSource";
import type { Entity, EntityLivingBase } from "./entity";
import type { EnumCreatureAttribute } from "./enums";
import type { ItemStack } from "./items";

export enum EnumEnchantmentType {
	ARMOR,
	ARMOR_FEET,
	ARMOR_LEGS,
	ARMOR_TORSO,
	ARMOR_HEAD,
	WEAPON,
	DIGGER,
	FISHING_ROD,
	BREAKABLE,
	BOW,
}

export abstract class Enchantment {
	/**
	 * Initialized in {@linkcode Enchantment.init init} to be every non-null enchantment in {@linkcode Enchantment.enchantmentsList enchantmentsList}
	 */
	static readonly enchantmentsBookList: Enchantment[];
	/** "map array" of enchantment ID -> enchantment object. used for checking duplicates in the constructor */
	static readonly enchantmentsList: Enchantment[];
	/** map of enchantment name -> enchantment. in MCP-919, the map key would be a resource location. */
	static readonly locationEnchantments: Map<string, Enchantment>;
	readonly effectId: number;
	readonly weight: number;
	readonly type: EnumEnchantmentType;
	readonly name: string;

	/**
	 * Constructs an enchantment and puts it in the lookup tables {@linkcode Enchantment.enchantmentsList enchantmentsList} and {@linkcode Enchantment.locationEnchantments locationEnchantments}.
	 * @param enchantmentId an Enchantment ID **UNIQUE** to this enchantment.
	 * 	If another enchantment is constructed with the same ID already, the constructor will throw an error.
	 * 	This is erroneously called an effectID in the fields.
	 */
	constructor(
		enchantmentId: number,
		name: string,
		weight: number,
		type: EnumEnchantmentType,
	);

	static getEnchantmentById(id: number): Enchantment | null;
	static getEnchantmentByLocation(
		location,
	): ReturnType<(typeof Enchantment)["locationEnchantments"]["get"]>;
	/** gets all location enchantments. Yet another Searge fallback name exposing the fact that this is Minecraft ported to the browser! */
	static func_181077_c(): ReturnType<
		(typeof Enchantment)["locationEnchantments"]["keys"]
	>;
	getWeight(): this["weight"];
	getMinLevel(): number;
	getMaxLevel(): number;
	getMinEnchantability(level: number): number;
	getMaxEnchantability(level: number): number;
	calcModifierDamage(level: number, source: DamageSource): number;
	calcDamageByCreature(
		level: number,
		creatureType: EnumCreatureAttribute,
	): number;
	canApplyTogether(other: Enchantment): boolean;
	setName(name: string): this;
	getName(): this["name"];
	/**
	 * @param level enchantment level
	 * @returns `{translated enchantment name} {roman numeral of level}`
	 */
	getTranslatedName(level: number): `${string} ${string}`;
	canApply(on: ItemStack): boolean;
	onEntityDamaged(
		user: EntityLivingBase,
		target: Entity,
		level: number,
	): void;
	onUserHurt(user: EntityLivingBase, attacker: Entity, level: number): void;
	static init(): void;
	/**
	 * @param n number to convert to Roman numeral
	 * @returns a roman numeral for numbers `1-20`. anything out of the range is just `n.toString()`
	 */
	static getRomanNumber(n: number): string;
}

export class EnchantmentProtection extends Enchantment {
	protectionType: number;
	static readonly protectionName = [
		"all",
		"fire",
		"fall",
		"explosion",
		"projectile",
	];
	static readonly baseEnchantability = [1, 10, 5, 5, 3];
	static readonly levelEnchantability = [11, 8, 6, 8, 6];
	static readonly thresholdEnchantability = [20, 12, 10, 12, 15];
	constructor(
		enchantmentId: number,
		name: string,
		weight: number,
		protectionType: number,
	);
	getMinEnchantability(level: number): number;
	getMaxEnchantability(level: number): number;
	getMaxLevel(): number;
	calcModifierDamage(level: number, source: DamageSource): number;
	canApplyTogether(other: Enchantment): boolean;
	static getFireTimeForEntity(e: EntityLivingBase, fireTime: number): number;
	/** gets blast fire time. Vector can't make a block game without pasting from Minecraft, so obviously this is from MCP. */
	static func_92092_a(e: EntityLivingBase, fireTime: number): number;
}
class EnchantmentDigging extends Enchantment {
	constructor(enchantmentId: number, name: string, weight: number);
	getMinEnchantability(level: number): number;
	getMaxEnchantability(level: number): number;
	getMaxLevel(): number;
	canApply(on: ItemStack): boolean;
}
class EnchantmentDurability extends Enchantment {
	constructor(enchantmentId: number, name: string, weight: number);
	getMinEnchantability(level: number): number;
	getMaxEnchantability(level: number): number;
	getMaxLevel(): number;
	canApply(on: ItemStack): boolean;
	static negateDamage(item: ItemStack, bound: number): boolean;
}
class EnchantmentFireAspect extends Enchantment {
	constructor(enchantmentId: number, name: string, weight: number);
	getMinEnchantability(level: number): number;
	getMaxEnchantability(level: number): number;
	getMaxLevel(): number;
}
class EnchantmentKnockback extends Enchantment {
	constructor(enchantmentId: number, name: string, weight: number);
	getMinEnchantability(level: number): number;
	getMaxEnchantability(level: number): number;
	getMaxLevel(): number;
}
class EnchantmentLootBonus extends Enchantment {
	constructor(
		enchantmentId: number,
		name: string,
		weight: number,
		type: EnumEnchantmentType,
	);
	getMinEnchantability(level: number): number;
	getMaxEnchantability(level: number): number;
	getMaxLevel(): number;
	canApplyTogether(other: Enchantment): boolean;
}

class EnchantmentArrowDamage extends Enchantment {
	constructor(enchantmentId: number, name: string, weight: number);
	getMinEnchantability(level: number): number;
	getMaxEnchantability(level: number): number;
	getMaxLevel(): number;
}
class EnchantmentArrowFire extends Enchantment {
	constructor(enchantmentId: number, name: string, weight: number);
	getMinEnchantability(level: number): number;
	getMaxEnchantability(level: number): number;
	getMaxLevel(): number;
}
class EnchantmentArrowInfinite extends Enchantment {
	constructor(enchantmentId: number, name: string, weight: number);
	getMinEnchantability(level: number): number;
	getMaxEnchantability(level: number): number;
	getMaxLevel(): number;
}
class EnchantmentArrowKnockback extends Enchantment {
	constructor(enchantmentId: number, name: string, weight: number);
	getMinEnchantability(level: number): number;
	getMaxEnchantability(level: number): number;
	getMaxLevel(): number;
}

// biome-ignore lint/complexity/noStaticOnlyClass: This is how Miniblox does it...
export class Enchantments {
	static readonly protection = new EnchantmentProtection(
		0,
		"protection",
		10,
		0,
	);
	static readonly fireProtection = new EnchantmentProtection(
		1,
		"fire_protection",
		5,
		1,
	);
	static readonly featherFalling = new EnchantmentProtection(
		2,
		"feather_falling",
		5,
		2,
	);
	static readonly blastProtection = new EnchantmentProtection(
		3,
		"blast_protection",
		2,
		3,
	);
	static readonly projectileProtection = new EnchantmentProtection(
		4,
		"projectile_protection",
		5,
		4,
	);
	static readonly thorns = new EnchantmentThorns(7, "thorns", 1);
	static readonly sharpness = new EnchantmentDamage(16, "sharpness", 10, 0);
	static readonly smite = new EnchantmentDamage(17, "smite", 5, 1);
	static readonly baneOfArthropods = new EnchantmentDamage(
		18,
		"bane_of_arthropods",
		5,
		2,
	);
	static readonly knockback = new EnchantmentKnockback(19, "knockback", 5);
	static readonly fireAspect = new EnchantmentFireAspect(
		20,
		"fire_aspect",
		2,
	);
	static readonly looting = new EnchantmentLootBonus(
		21,
		"looting",
		2,
		EnumEnchantmentType.WEAPON,
	);
	static readonly efficiency = new EnchantmentDigging(32, "efficiency", 10);
	static readonly silkTouch = new EnchantmentUntouching(33, "silk_touch", 1);
	static readonly unbreaking = new EnchantmentDurability(34, "unbreaking", 5);
	static readonly fortune = new EnchantmentLootBonus(
		35,
		"fortune",
		2,
		EnumEnchantmentType.DIGGER,
	);
	static readonly power = new EnchantmentArrowDamage(48, "power", 10);
	static readonly punch = new EnchantmentArrowKnockback(49, "punch", 2);
	static readonly flame = new EnchantmentArrowFire(50, "flame", 2);
	static readonly infinity = new EnchantmentArrowInfinite(51, "infinity", 1);
	static readonly luckOfTheSea = new EnchantmentLootBonus(
		61,
		"luck_of_the_sea",
		2,
		EnumEnchantmentType.FISHING_ROD,
	);
	/** does nothing basically I forgor */
	static init(): void;
}
class EnchantmentThorns extends Enchantment {
	constructor(effectId: number, name: string, weight: number);
	getMinEnchantability(level: number): number;
	getMaxEnchantability(level: number): number;
	getMaxLevel(): number;
	canApply(on: ItemStack): boolean;
	onUserHurt(user: EntityLivingBase, attacker: Entity, level: number): void;
	static func_92094_a(n: number): boolean;
	static func_92095_b(n: number): number;
}
class EnchantmentUntouching extends Enchantment {
	constructor(effectId: number, name: string, weight: number);
	getMinEnchantability(level: number): number;
	getMaxEnchantability(level: number): number;
	getMaxLevel(): number;
	canApplyTogether(other: Enchantment): boolean;
	canApply(on: ItemStack): boolean;
}
class EnchantmentDamage extends Enchantment {
	readonly damageType: number;
	constructor(
		enchantmentId: number,
		name: string,
		weight: number,
		damageType: number,
	);
	getMinEnchantability(n): number;
	getMaxEnchantability(n: number): number;
	getMaxLevel(): number;
	calcDamageByCreature(
		level: number,
		creatureType: EnumCreatureAttribute,
	): number;
	getName(): string;
	canApplyTogether(other: Enchantment): boolean;
	canApply(on: ItemStack): boolean;
	/**
	 * Does nothing, only a boolean check that is never used.
	 * In MCP-919, it would give the user slowness on attack if damageType was 2 and the target was an "arthropod" creature
	 */
	onEntityDamaged(
		user: EntityLivingBase,
		target: Entity,
		level: number,
	): void;
}
