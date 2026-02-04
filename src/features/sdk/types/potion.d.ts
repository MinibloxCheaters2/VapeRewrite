import { Entity } from "./entity";

export declare class Potions {
	static moveSpeed: Potion;
	static moveSlowdown: Potion;
	static digSpeed: Potion;
	static digSlowdown: Potion;
	static damageBoost: Potion;
	static heal: Potion;
	static harm: Potion;
	static jump: Potion;
	static confusion: Potion;
	static regeneration: Potion;
	static resistance: Potion;
	static fireResistance: Potion;
	static waterBreathing: Potion;
	static invisibility: Potion;
	static blindness: Potion;
	static nightVision: Potion;
	static hunger: Potion;
	static weakness: Potion;
	static poison: Potion;
	static wither: Potion;
	static healthBoost: Potion;
	static absorption: Potion;
	static saturation: Potion;
}

export declare class Potion {
	static potionTypes: Potion[];
	static potionMap: Map;
	id: number;
	attributeModifierMap: Map<unknown, AttributeModifier>;
	isBadEffect: boolean;
	liquidColor: unknown;
	name: string;
	statusIconIndex: number;
	effectiveness: number;
	usable: boolean;

	getLiquidColor(): this["liquidColor"];
	getName(): this["name"];
	setPotionName(name: string): this;
	hasStatusIcon(): boolean;
	getStatusIconIndex(): this["statusIconIndex"];
	getDurationString(): string | undefined;
	getEffectiveness(): this["effectiveness"];
	setEffectiveness(effectiveness: number): this;
	isUsable(): this["usable"];
	registerPotionAttributeModifier(u, h, p, g): this;
	getAttributeModifierMap(): this["attributeModifierMap"];
	removeAttributesModifiersFromEntity(u, entity: Entity, p): void;
	applyAttributesModifiersToEntity(u, entity: Entity, p): void;
	getAttributeModifierAmount(amplifier: number, modifier: AttributeModifier);
}
