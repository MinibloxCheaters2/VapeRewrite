import type { Box3, Vector3 } from "three";
import type { InventoryPlayer } from "./undefined";
import type World from "./world";
import type { RayTraceResult } from "./controller";
import { Potion } from "./potion";

export declare function keyPressed(key: string): boolean;

export declare function canCraftItem(
	inventory: InventoryPlayer,
	recipe: Recipe,
): boolean;

export declare function craftItem(
	inventory: InventoryPlayer,
	recipe: Recipe,
	shiftDown: boolean,
): void;

export type ItemID = number;

export interface Result {
	count: number;
	id: ItemID;
}

export type Shape = ItemID[][];
export type OptionalShape = (ItemID | undefined)[][];

export interface WithResult {
	result: Result;
}

export interface WithIngredients extends WithResult {
	ingredients: ItemID[];
}

export interface WithShape extends WithResult {
	inShape: Shape;
}

export interface WithOptionalShape extends WithResult {
	inShape: OptionalShape;
}

export interface WithOptionalShapeAndIngredients extends WithResult {
	inShape?: Shape;
	ingredients?: ItemID[];
}

export type Recipe =
	| WithIngredients
	| WithShape
	| WithOptionalShape
	| WithOptionalShapeAndIngredients;

// Recipe registry
export declare type RecipeRegistry = Record<number, Recipe[]>;

// Potion registry
export declare class Potions {
	getId(): number;
	static readonly jump: Potion;
	static readonly blindness: Potion;
	static readonly speed: Potion;
	static readonly slowness: Potion;
	static readonly haste: Potion;
	static readonly miningFatigue: Potion;
	static readonly strength: Potion;
	static readonly instantHealth: Potion;
	static readonly instantDamage: Potion;
	static readonly jumpBoost: Potion;
	static readonly nausea: Potion;
	static readonly regeneration: Potion;
	static readonly resistance: Potion;
	static readonly fireResistance: Potion;
	static readonly waterBreathing: Potion;
	static readonly invisibility: Potion;
	static readonly nightVision: Potion;
	static readonly weakness: Potion;
	static readonly poison: Potion;
	static readonly wither: Potion;
	static readonly healthBoost: Potion;
	static readonly absorption: Potion;
	static readonly saturation: Potion;
}

export interface Level {
	owner: RankLevel;
	admin: RankLevel;
	goat: RankLevel;
	janitor: RankLevel;
	mod: RankLevel;
	helper: RankLevel;
	youtube: RankLevel;
	builder: RankLevel;
	og: RankLevel;
	immortal: RankLevel;
	legend: RankLevel;
	pro: RankLevel;
	[rank: string]: RankLevel;
}

export interface RankLevel {
	/** CSS Color string */
	color: string;
	permLevel: number;
	rankLevel: number;
}

// Rank system
export declare const RANK: {
	LEVEL: Level;
};

// Ray tracing
export declare function rayTraceBlocks(
	start: Vector3,
	end: Vector3,
	stopOnLiquid: boolean,
	ignoreBlockWithoutBoundingBox: boolean,
	returnLastUncollidableBlock: boolean,
	world: World,
): RayTraceResult | null;

// Block collision utilities
export declare function calculateXOffset(
	self: Box3,
	other: Box3,
	offset: number,
): number;

export declare function calculateYOffset(
	self: Box3,
	other: Box3,
	offset: number,
): number;

export declare function calculateZOffset(
	self: Box3,
	other: Box3,
	offset: number,
): number;
