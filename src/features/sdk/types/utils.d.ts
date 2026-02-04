// Utility functions and classes extracted from Impact
import type { BlockPos } from "./blockpos";
import type { Vector3 } from "three";
import type { ItemStack, InventoryPlayer } from "./undefined";
import type World from "./world";
import type { RayTraceResult } from "./controller";

// Key press utility
export declare function keyPressed(key: string): boolean;

// Crafting utilities
export declare function canCraftItem(
	inventory: InventoryPlayer,
	recipe: any,
): boolean;
export declare function craftItem(
	inventory: InventoryPlayer,
	recipe: any,
	shiftDown: boolean,
): void;

export type ItemID = number;

export interface Result {
	count: number;
	id: ItemID;
}

export interface RecipeT {
	result: Result;
}

export interface IngredientsRecipe extends RecipeT {
	ingredients: ItemID[];
}

export interface ShapeRecipe extends RecipeT {
	inShape: ItemID[][];
}

export type Recipe = IngredientsRecipe | ShapeRecipe;

// Recipe registry
export declare const recipes: Record<number, Recipe[]>;

// Potion registry
export declare class Potion {
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

export declare const Potions: typeof Potion;

// Rank system
export declare const RANK: {
	LEVEL: Record<string, { permLevel: number; [key: string]: any }>;
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
	boxes: any[],
	boundingBox: any,
	offset: number,
): number;

export declare function calculateYOffset(
	boxes: any[],
	boundingBox: any,
	offset: number,
): number;

export declare function calculateZOffset(
	boxes: any[],
	boundingBox: any,
	offset: number,
): number;
