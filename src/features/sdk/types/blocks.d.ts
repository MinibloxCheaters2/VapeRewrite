// Block class definitions extracted from Impact
import type { Material } from "./materials";
import type { BlockPos } from "./blockpos";
import type World from "./world";
import type { AxisAlignedBB } from "./aliases";

export interface Block {
	name?: string;
	material: Material;
	slipperiness: number;
	blockHardness: number;
	blockResistance: number;
	enableStats: boolean;
	needsRandomTick: boolean;
	isBlockContainer: boolean;
	lightOpacity: number;
	lightValue: number;
	useNeighborBrightness: boolean;
	blockParticleGravity: number;
	
	getBoundingBox?(): {
		min: { x: number; y: number; z: number };
		max: { x: number; y: number; z: number };
	};
	
	isFullBlock(): boolean;
	isOpaqueCube(): boolean;
	isPassable(world: World, pos: BlockPos): boolean;
	getCollisionBoundingBox(world: World, pos: BlockPos): AxisAlignedBB | null;
	isCollidable(): boolean;
	canCollideCheck(state: any, hitIfLiquid: boolean): boolean;
	getMaterial(): Material;
	getBlockHardness(world: World, pos: BlockPos): number;
	setBlockUnbreakable(): this;
	getBlockBoundsMinX(): number;
	getBlockBoundsMaxX(): number;
	getBlockBoundsMinY(): number;
	getBlockBoundsMaxY(): number;
	getBlockBoundsMinZ(): number;
	getBlockBoundsMaxZ(): number;
	setLightOpacity(opacity: number): this;
	setLightLevel(level: number): this;
	setResistance(resistance: number): this;
	setHardness(hardness: number): this;
	setStepSound(sound: any): this;
	setBlockBounds(minX: number, minY: number, minZ: number, maxX: number, maxY: number, maxZ: number): void;
}

// Specific block types
export interface BlockAir extends Block {
	// Air block
}

export interface BlockChest extends Block {
	// Chest block
	isTrapped?: boolean;
}

export interface BlockDragonEgg extends Block {
	// Dragon egg block
}

export interface BlockTNT extends Block {
	// TNT block
}

export interface BlockLadder extends Block {
	// Ladder block
}

export interface BlockVine extends Block {
	// Vine block
}

export interface BlockWeb extends Block {
	// Web block
}

export interface BlockLiquid extends Block {
	// Liquid block (water, lava)
}

// Global Blocks registry
export declare const Blocks: {
	readonly air: BlockAir;
	readonly stone: Block;
	readonly grass: Block;
	readonly dirt: Block;
	readonly cobblestone: Block;
	readonly planks: Block;
	readonly bedrock: Block;
	readonly water: BlockLiquid;
	readonly lava: BlockLiquid;
	readonly sand: Block;
	readonly gravel: Block;
	readonly gold_ore: Block;
	readonly iron_ore: Block;
	readonly coal_ore: Block;
	readonly log: Block;
	readonly leaves: Block;
	readonly glass: Block;
	readonly lapis_ore: Block;
	readonly lapis_block: Block;
	readonly sandstone: Block;
	readonly wool: Block;
	readonly gold_block: Block;
	readonly iron_block: Block;
	readonly brick_block: Block;
	readonly tnt: BlockTNT;
	readonly bookshelf: Block;
	readonly mossy_cobblestone: Block;
	readonly obsidian: Block;
	readonly torch: Block;
	readonly fire: Block;
	readonly chest: BlockChest;
	readonly diamond_ore: Block;
	readonly diamond_block: Block;
	readonly crafting_table: Block;
	readonly farmland: Block;
	readonly furnace: Block;
	readonly ladder: BlockLadder;
	readonly snow_layer: Block;
	readonly ice: Block;
	readonly snow: Block;
	readonly cactus: Block;
	readonly clay: Block;
	readonly pumpkin: Block;
	readonly netherrack: Block;
	readonly soul_sand: Block;
	readonly glowstone: Block;
	readonly lit_pumpkin: Block;
	readonly web: BlockWeb;
	readonly tallgrass: Block;
	readonly deadbush: Block;
	readonly vine: BlockVine;
	readonly dragon_egg: BlockDragonEgg;
	readonly end_stone: Block;
	readonly emerald_ore: Block;
	readonly emerald_block: Block;
	readonly quartz_ore: Block;
	readonly quartz_block: Block;
	readonly stained_glass: Block;
	readonly stained_hardened_clay: Block;
	readonly barrier: Block;
	readonly slime: Block;
	readonly prismarine: Block;
	readonly sea_lantern: Block;
	readonly red_sandstone: Block;
	readonly purpur_block: Block;
	readonly purpur_pillar: Block;
	readonly end_bricks: Block;
	readonly magma: Block;
	readonly nether_wart_block: Block;
	readonly red_nether_brick: Block;
	readonly bone_block: Block;
	readonly structure_void: Block;
	[key: string]: Block;
};
