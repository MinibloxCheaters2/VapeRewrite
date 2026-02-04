import type { Material } from "./materials";
import type { BlockPos } from "./blockpos";
import type World from "./world";
import type { AxisAlignedBB } from "./aliases";
import type { Box3 } from "three";
import type { BlockState } from "./world";

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

	getBoundingBox?(): Box3;

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
	setBlockBounds(
		minX: number,
		minY: number,
		minZ: number,
		maxX: number,
		maxY: number,
		maxZ: number,
	): void;
}

export interface BlockChest extends Block {
	// Chest block
	isTrapped?: boolean;
}

interface BlockAir extends Block {}
interface BlockStone extends Block {}
interface BlockDefault extends Block {}
interface BlockGrass extends Block {}
interface BlockDirt extends Block {}
interface BlockPodzol extends Block {}
interface BlockPlanks extends Block {}
interface BlockSapling extends Block {}
interface BlockLiquidWater extends Block {}
interface BlockLiquidLava extends Block {}
interface BlockFalling extends Block {}
interface BlockGravel extends Block {}
interface BlockOre extends Block {}
interface BlockLog extends Block {}
interface BlockStrippedLog extends Block {}
interface BlockStrippedWood extends Block {}
interface BlockWood extends Block {}
interface BlockLeaves extends Block {}
interface BlockGlass extends Block {}
interface BlockRedstoneBlock extends Block {}
interface BlockMarble extends Block {}
interface BlockMarble$1 extends Block {}
interface BlockSandStone extends Block {}
interface BlockBookshelf extends Block {}
interface BlockWorkbench extends Block {}
interface BlockTnt extends Block {}
interface BlockCake extends Block {}
interface BlockWeb extends Block {}
interface BlockFurnace extends Block {}
interface BlockShrub extends Block {}
interface BlockWool extends Block {}
interface BlockMushroom extends Block {}
interface BlockIce extends Block {}
interface BlockPackedIce extends Block {}
interface BlockSnowBlock extends Block {}
interface BlockJukebox extends Block {}
interface BlockPumpkin extends Block {}
interface BlockCarvedPumpkin extends Block {}
interface BlockHellstone extends Block {}
interface BlockSoulSand extends Block {}
interface BlockGlowstone extends Block {}
interface BlockMelon extends Block {}
interface BlockFire extends Block {}
interface BlockSlime extends Block {}
interface BlockRotatedPillar extends Block {}
interface BlockHardenedClay extends Block {}
interface BlockConcrete extends Block {}
interface BlockHugeMushroom extends Block {}
interface BlockHalfStoneSlab extends Block {}
interface BlockHalfWoodSlab extends Block {}
interface BlockHalfStoneSlab$1 extends Block {}
interface BlockHalfBrickSlab extends Block {}
interface BlockHalfSandstoneSlab extends Block {}
interface BlockStairs extends Block {}
interface BlockCactus extends Block {}
interface BlockLadder extends Block {}
interface BlockVine extends Block {}
interface BlockCommandBlock extends Block {}
interface BlockDoor extends Block {}
interface BlockCarpet extends Block {}
interface BlockMuck extends Block {}
interface BlockSnow extends Block {}
interface BlockEnchantmentTable extends Block {}
interface BlockEnderChest extends Block {}
interface BlockStandingSign extends Block {}
interface BlockWallSign extends Block {}
interface BlockPistonBase extends Block {}
interface BlockPistonExtension extends Block {}
interface BlockPistonMoving extends Block {}
interface BlockBarrier extends Block {}
interface BlockFarmland extends Block {}
interface BlockCrops extends Block {}
interface BlockCarrot extends Block {}
interface BlockPotato extends Block {}
interface BlockHellFungus extends Block {}
interface BlockRedstoneWire extends Block {}
interface BlockLever extends Block {}
interface BlockButtonStone extends Block {}
interface BlockButtonWood extends Block {}
interface BlockTorch extends Block {}
interface BlockWallTorch extends Block {}
interface BlockRedstoneTorch extends Block {}
interface BlockRedstoneWallTorch extends Block {}
interface BlockRedstoneRepeater extends Block {}
interface BlockRedstoneComparator extends Block {}
interface BlockRedstoneLight extends Block {}
interface BlockPressurePlate extends Block {}
interface BlockPressurePlateWeighted extends Block {}
interface BlockFence extends Block {}
interface BlockFenceGate extends Block {}
interface BlockWall extends Block {}
interface BlockPane extends Block {}
interface BlockStem extends Block {}
interface BlockCauldron extends Block {}
interface BlockTrapDoor extends Block {}
interface BlockLilyPad extends Block {}
interface BlockDragonEgg extends Block {}
interface BlockAnvil extends Block {}
interface BlockDispenser extends Block {}
interface BlockBed extends Block {}
interface BlockReed extends Block {}
interface BlockHellPortal extends Block {}
interface BlockCloud extends Block {}

// this actually exposed in the window object like a few other objects (i.e. window.Buffer).
export declare const Blocks: {
	readonly idToBlock: Map<number, Block>;
	readonly idToBlockState: Map<number, BlockState>;
	readonly blockStateToId: Map<BlockState, number>;
	readonly nameToBlock: Map<string, Block>;
	readonly air: BlockAir;
	readonly stone: BlockStone;
	readonly granite: BlockDefault;
	readonly polished_granite: BlockDefault;
	readonly diorite: BlockDefault;
	readonly polished_diorite: BlockDefault;
	readonly andesite: BlockDefault;
	readonly polished_andesite: BlockDefault;
	readonly grass_block: BlockGrass;
	readonly dirt: BlockDirt;
	readonly coarse_dirt: BlockDirt;
	readonly podzol: BlockPodzol;
	readonly cobblestone: BlockDefault;
	readonly oak_planks: BlockPlanks;
	readonly spruce_planks: BlockPlanks;
	readonly birch_planks: BlockPlanks;
	readonly jungle_planks: BlockPlanks;
	readonly acacia_planks: BlockPlanks;
	readonly dark_oak_planks: BlockPlanks;
	readonly oak_sapling: BlockSapling;
	readonly spruce_sapling: BlockSapling;
	readonly birch_sapling: BlockSapling;
	readonly jungle_sapling: BlockSapling;
	readonly acacia_sapling: BlockSapling;
	readonly dark_oak_sapling: BlockSapling;
	readonly bedrock: BlockDefault;
	readonly water: BlockLiquidWater;
	readonly lava: BlockLiquidLava;
	readonly sand: BlockFalling;
	readonly red_sand: BlockFalling;
	readonly gravel: BlockGravel;
	readonly gold_ore: BlockOre;
	readonly iron_ore: BlockOre;
	readonly coal_ore: BlockOre;
	readonly diamond_ore: BlockOre;
	readonly emerald_ore: BlockOre;
	readonly lapis_ore: BlockOre;
	readonly redstone_ore: BlockOre;
	readonly hell_marble_ore: BlockOre;
	readonly infernium_ore: BlockOre;
	readonly oak_log: BlockLog;
	readonly spruce_log: BlockLog;
	readonly birch_log: BlockLog;
	readonly jungle_log: BlockLog;
	readonly acacia_log: BlockLog;
	readonly dark_oak_log: BlockLog;
	readonly stripped_oak_log: BlockStrippedLog;
	readonly stripped_spruce_log: BlockStrippedLog;
	readonly stripped_birch_log: BlockStrippedLog;
	readonly stripped_jungle_log: BlockStrippedLog;
	readonly stripped_acacia_log: BlockStrippedLog;
	readonly stripped_dark_oak_log: BlockStrippedLog;
	readonly stripped_oak_wood: BlockStrippedWood;
	readonly stripped_spruce_wood: BlockStrippedWood;
	readonly stripped_birch_wood: BlockStrippedWood;
	readonly stripped_jungle_wood: BlockStrippedWood;
	readonly stripped_acacia_wood: BlockStrippedWood;
	readonly stripped_dark_oak_wood: BlockStrippedWood;
	readonly oak_wood: BlockWood;
	readonly spruce_wood: BlockWood;
	readonly birch_wood: BlockWood;
	readonly jungle_wood: BlockWood;
	readonly acacia_wood: BlockWood;
	readonly dark_oak_wood: BlockWood;
	readonly oak_leaves: BlockLeaves;
	readonly spruce_leaves: BlockLeaves;
	readonly birch_leaves: BlockLeaves;
	readonly jungle_leaves: BlockLeaves;
	readonly acacia_leaves: BlockLeaves;
	readonly dark_oak_leaves: BlockLeaves;
	readonly sponge: BlockDefault;
	readonly glass: BlockGlass;
	readonly white_stained_glass: BlockGlass;
	readonly orange_stained_glass: BlockGlass;
	readonly magenta_stained_glass: BlockGlass;
	readonly light_blue_stained_glass: BlockGlass;
	readonly yellow_stained_glass: BlockGlass;
	readonly lime_stained_glass: BlockGlass;
	readonly pink_stained_glass: BlockGlass;
	readonly gray_stained_glass: BlockGlass;
	readonly light_gray_stained_glass: BlockGlass;
	readonly cyan_stained_glass: BlockGlass;
	readonly purple_stained_glass: BlockGlass;
	readonly blue_stained_glass: BlockGlass;
	readonly brown_stained_glass: BlockGlass;
	readonly green_stained_glass: BlockGlass;
	readonly red_stained_glass: BlockGlass;
	readonly black_stained_glass: BlockGlass;
	readonly coal_block: BlockDefault;
	readonly iron_block: BlockDefault;
	readonly gold_block: BlockDefault;
	readonly diamond_block: BlockDefault;
	readonly emerald_block: BlockDefault;
	readonly infernium_block: BlockDefault;
	readonly lapis_block: BlockDefault;
	readonly redstone_block: BlockRedstoneBlock;
	readonly marble_block: BlockMarble;
	readonly marble_pillar: BlockDefault;
	readonly chiseled_marble_block: BlockMarble$1;
	readonly sandstone: BlockSandStone;
	readonly chiseled_sandstone: BlockSandStone;
	readonly smooth_sandstone: BlockSandStone;
	readonly cut_sandstone: BlockSandStone;
	readonly red_sandstone: BlockSandStone;
	readonly chiseled_red_sandstone: BlockSandStone;
	readonly smooth_red_sandstone: BlockSandStone;
	readonly note_block: BlockDefault;
	readonly bookshelf: BlockBookshelf;
	readonly workbench: BlockWorkbench;
	readonly bricks: BlockDefault;
	readonly tnt: BlockTnt;
	readonly mossy_cobblestone: BlockDefault;
	readonly obsidian: BlockDefault;
	readonly cake: BlockCake;
	readonly cobweb: BlockWeb;
	readonly furnace: BlockFurnace;
	readonly grass: BlockShrub;
	readonly dead_bush: BlockShrub;
	readonly fern: BlockShrub;
	readonly white_wool: BlockWool;
	readonly orange_wool: BlockWool;
	readonly magenta_wool: BlockWool;
	readonly light_blue_wool: BlockWool;
	readonly yellow_wool: BlockWool;
	readonly lime_wool: BlockWool;
	readonly pink_wool: BlockWool;
	readonly gray_wool: BlockWool;
	readonly light_gray_wool: BlockWool;
	readonly cyan_wool: BlockWool;
	readonly purple_wool: BlockWool;
	readonly blue_wool: BlockWool;
	readonly brown_wool: BlockWool;
	readonly green_wool: BlockWool;
	readonly red_wool: BlockWool;
	readonly black_wool: BlockWool;
	readonly poppy: BlockShrub;
	readonly dandelion: BlockShrub;
	readonly blue_orchid: BlockShrub;
	readonly allium: BlockShrub;
	readonly azure_bluet: BlockShrub;
	readonly red_tulip: BlockShrub;
	readonly orange_tulip: BlockShrub;
	readonly white_tulip: BlockShrub;
	readonly pink_tulip: BlockShrub;
	readonly oxeye_daisy: BlockShrub;
	readonly red_mushroom: BlockMushroom;
	readonly brown_mushroom: BlockMushroom;
	readonly ice: BlockIce;
	readonly packed_ice: BlockPackedIce;
	readonly snow_block: BlockSnowBlock;
	readonly clay: BlockDefault;
	readonly jukebox: BlockJukebox;
	readonly pumpkin: BlockPumpkin;
	readonly carved_pumpkin: BlockCarvedPumpkin;
	readonly jack_o_lantern: BlockDefault;
	readonly hellstone: BlockHellstone;
	readonly soul_sand: BlockSoulSand;
	readonly glowstone: BlockGlowstone;
	readonly melon: BlockMelon;
	readonly fire: BlockFire;
	readonly slime_block: BlockSlime;
	readonly hay_block: BlockRotatedPillar;
	readonly terracotta: BlockHardenedClay;
	readonly white_terracotta: BlockHardenedClay;
	readonly orange_terracotta: BlockHardenedClay;
	readonly magenta_terracotta: BlockHardenedClay;
	readonly light_blue_terracotta: BlockHardenedClay;
	readonly yellow_terracotta: BlockHardenedClay;
	readonly lime_terracotta: BlockHardenedClay;
	readonly pink_terracotta: BlockHardenedClay;
	readonly gray_terracotta: BlockHardenedClay;
	readonly light_gray_terracotta: BlockHardenedClay;
	readonly cyan_terracotta: BlockHardenedClay;
	readonly purple_terracotta: BlockHardenedClay;
	readonly blue_terracotta: BlockHardenedClay;
	readonly brown_terracotta: BlockHardenedClay;
	readonly green_terracotta: BlockHardenedClay;
	readonly red_terracotta: BlockHardenedClay;
	readonly black_terracotta: BlockHardenedClay;
	readonly white_concrete: BlockConcrete;
	readonly orange_concrete: BlockConcrete;
	readonly magenta_concrete: BlockConcrete;
	readonly light_blue_concrete: BlockConcrete;
	readonly yellow_concrete: BlockConcrete;
	readonly lime_concrete: BlockConcrete;
	readonly pink_concrete: BlockConcrete;
	readonly gray_concrete: BlockConcrete;
	readonly light_gray_concrete: BlockConcrete;
	readonly cyan_concrete: BlockConcrete;
	readonly purple_concrete: BlockConcrete;
	readonly blue_concrete: BlockConcrete;
	readonly brown_concrete: BlockConcrete;
	readonly green_concrete: BlockConcrete;
	readonly red_concrete: BlockConcrete;
	readonly black_concrete: BlockConcrete;
	readonly stone_bricks: BlockDefault;
	readonly smooth_stone: BlockDefault;
	readonly mossy_stone_bricks: BlockDefault;
	readonly cracked_stone_bricks: BlockDefault;
	readonly chiseled_stone_bricks: BlockDefault;
	readonly brown_mushroom_block: BlockHugeMushroom;
	readonly red_mushroom_block: BlockHugeMushroom;
	readonly stem_mushroom_block: BlockHugeMushroom;
	readonly hell_bricks: BlockDefault;
	readonly aquastone: BlockDefault;
	readonly aquastone_bricks: BlockDefault;
	readonly dark_aquastone: BlockDefault;
	readonly end_stone: BlockDefault;
	readonly end_stone_bricks: BlockDefault;
	readonly stone_slab: BlockHalfStoneSlab;
	readonly stone_brick_slab: BlockHalfStoneSlab;
	readonly smooth_stone_slab: BlockHalfStoneSlab;
	readonly marble_slab: BlockHalfStoneSlab;
	readonly oak_slab: BlockHalfWoodSlab;
	readonly spruce_slab: BlockHalfWoodSlab;
	readonly birch_slab: BlockHalfWoodSlab;
	readonly jungle_slab: BlockHalfWoodSlab;
	readonly acacia_slab: BlockHalfWoodSlab;
	readonly dark_oak_slab: BlockHalfWoodSlab;
	readonly cobblestone_slab: BlockHalfStoneSlab$1;
	readonly brick_slab: BlockHalfBrickSlab;
	readonly sandstone_slab: BlockHalfSandstoneSlab;
	readonly red_sandstone_slab: BlockHalfSandstoneSlab;
	readonly granite_slab: BlockHalfStoneSlab;
	readonly diorite_slab: BlockHalfStoneSlab;
	readonly andesite_slab: BlockHalfStoneSlab;
	readonly oak_stairs: BlockStairs;
	readonly spruce_stairs: BlockStairs;
	readonly birch_stairs: BlockStairs;
	readonly jungle_stairs: BlockStairs;
	readonly acacia_stairs: BlockStairs;
	readonly dark_oak_stairs: BlockStairs;
	readonly stone_stairs: BlockStairs;
	readonly cobblestone_stairs: BlockStairs;
	readonly brick_stairs: BlockStairs;
	readonly stone_brick_stairs: BlockStairs;
	readonly hell_brick_stairs: BlockStairs;
	readonly sandstone_stairs: BlockStairs;
	readonly smooth_sandstone_stairs: BlockStairs;
	readonly red_sandstone_stairs: BlockStairs;
	readonly smooth_red_sandstone_stairs: BlockStairs;
	readonly marble_stairs: BlockStairs;
	readonly smooth_marble_stairs: BlockStairs;
	readonly andesite_stairs: BlockStairs;
	readonly diorite_stairs: BlockStairs;
	readonly granite_stairs: BlockStairs;
	readonly polished_andesite_stairs: BlockStairs;
	readonly polished_diorite_stairs: BlockStairs;
	readonly polished_granite_stairs: BlockStairs;
	readonly end_stone_brick_stairs: BlockStairs;
	readonly aquastone_stairs: BlockStairs;
	readonly aquastone_brick_stairs: BlockStairs;
	readonly dark_aquastone_stairs: BlockStairs;
	readonly mossy_cobblestone_stairs: BlockStairs;
	readonly mossy_stone_brick_stairs: BlockStairs;
	readonly cactus: BlockCactus;
	readonly ladder: BlockLadder;
	readonly iron_ladder: BlockLadder;
	readonly vine: BlockVine;
	readonly sea_lantern: BlockDefault;
	readonly command_block: BlockCommandBlock;
	readonly oak_door: BlockDoor;
	readonly spruce_door: BlockDoor;
	readonly birch_door: BlockDoor;
	readonly jungle_door: BlockDoor;
	readonly acacia_door: BlockDoor;
	readonly dark_oak_door: BlockDoor;
	readonly iron_door: BlockDoor;
	readonly white_carpet: BlockCarpet;
	readonly orange_carpet: BlockCarpet;
	readonly magenta_carpet: BlockCarpet;
	readonly light_blue_carpet: BlockCarpet;
	readonly yellow_carpet: BlockCarpet;
	readonly lime_carpet: BlockCarpet;
	readonly pink_carpet: BlockCarpet;
	readonly gray_carpet: BlockCarpet;
	readonly light_gray_carpet: BlockCarpet;
	readonly cyan_carpet: BlockCarpet;
	readonly purple_carpet: BlockCarpet;
	readonly blue_carpet: BlockCarpet;
	readonly brown_carpet: BlockCarpet;
	readonly green_carpet: BlockCarpet;
	readonly red_carpet: BlockCarpet;
	readonly black_carpet: BlockCarpet;
	readonly muck: BlockMuck;
	readonly snow: BlockSnow;
	readonly enchanting_table: BlockEnchantmentTable;
	readonly chest: BlockChest;
	readonly ender_chest: BlockEnderChest;
	readonly acacia_sign: BlockStandingSign;
	readonly birch_sign: BlockStandingSign;
	readonly dark_oak_sign: BlockStandingSign;
	readonly jungle_sign: BlockStandingSign;
	readonly oak_sign: BlockStandingSign;
	readonly spruce_sign: BlockStandingSign;
	readonly acacia_wall_sign: BlockWallSign;
	readonly birch_wall_sign: BlockWallSign;
	readonly dark_oak_wall_sign: BlockWallSign;
	readonly jungle_wall_sign: BlockWallSign;
	readonly oak_wall_sign: BlockWallSign;
	readonly spruce_wall_sign: BlockWallSign;
	readonly sticky_piston: BlockPistonBase;
	readonly piston: BlockPistonBase;
	readonly piston_head: BlockPistonExtension;
	readonly moving_piston: BlockPistonMoving;
	readonly barrier: BlockBarrier;
	readonly farmland: BlockFarmland;
	readonly wheat: BlockCrops;
	readonly carrots: BlockCarrot;
	readonly potatoes: BlockPotato;
	readonly hell_fungus: BlockHellFungus;
	readonly redstone_wire: BlockRedstoneWire;
	readonly lever: BlockLever;
	readonly stone_button: BlockButtonStone;
	readonly oak_button: BlockButtonWood;
	readonly spruce_button: BlockButtonWood;
	readonly birch_button: BlockButtonWood;
	readonly jungle_button: BlockButtonWood;
	readonly acacia_button: BlockButtonWood;
	readonly dark_oak_button: BlockButtonWood;
	readonly torch: BlockTorch;
	readonly wall_torch: BlockWallTorch;
	readonly redstone_torch: BlockRedstoneTorch;
	readonly redstone_wall_torch: BlockRedstoneWallTorch;
	readonly repeater: BlockRedstoneRepeater;
	readonly comparator: BlockRedstoneComparator;
	readonly redstone_lamp: BlockRedstoneLight;
	readonly stone_pressure_plate: BlockPressurePlate;
	readonly oak_pressure_plate: BlockPressurePlate;
	readonly spruce_pressure_plate: BlockPressurePlate;
	readonly birch_pressure_plate: BlockPressurePlate;
	readonly jungle_pressure_plate: BlockPressurePlate;
	readonly acacia_pressure_plate: BlockPressurePlate;
	readonly dark_oak_pressure_plate: BlockPressurePlate;
	readonly light_weighted_pressure_plate: BlockPressurePlateWeighted;
	readonly heavy_weighted_pressure_plate: BlockPressurePlateWeighted;
	readonly oak_fence: BlockFence;
	readonly spruce_fence: BlockFence;
	readonly birch_fence: BlockFence;
	readonly jungle_fence: BlockFence;
	readonly acacia_fence: BlockFence;
	readonly dark_oak_fence: BlockFence;
	readonly hell_brick_fence: BlockFence;
	readonly oak_fence_gate: BlockFenceGate;
	readonly spruce_fence_gate: BlockFenceGate;
	readonly birch_fence_gate: BlockFenceGate;
	readonly jungle_fence_gate: BlockFenceGate;
	readonly acacia_fence_gate: BlockFenceGate;
	readonly dark_oak_fence_gate: BlockFenceGate;
	readonly andesite_wall: BlockWall;
	readonly blackstone_wall: BlockWall;
	readonly brick_wall: BlockWall;
	readonly cobblestone_wall: BlockWall;
	readonly diorite_wall: BlockWall;
	readonly end_stone_brick_wall: BlockWall;
	readonly granite_wall: BlockWall;
	readonly mossy_cobblestone_wall: BlockWall;
	readonly mossy_stone_brick_wall: BlockWall;
	readonly hell_brick_wall: BlockWall;
	readonly red_hell_brick_wall: BlockWall;
	readonly sandstone_wall: BlockWall;
	readonly stone_brick_wall: BlockWall;
	readonly red_sandstone_wall: BlockWall;
	readonly aquastone_wall: BlockWall;
	readonly iron_bars: BlockPane;
	readonly glass_pane: BlockPane;
	readonly white_stained_glass_pane: BlockPane;
	readonly orange_stained_glass_pane: BlockPane;
	readonly magenta_stained_glass_pane: BlockPane;
	readonly light_blue_stained_glass_pane: BlockPane;
	readonly yellow_stained_glass_pane: BlockPane;
	readonly lime_stained_glass_pane: BlockPane;
	readonly pink_stained_glass_pane: BlockPane;
	readonly gray_stained_glass_pane: BlockPane;
	readonly light_gray_stained_glass_pane: BlockPane;
	readonly cyan_stained_glass_pane: BlockPane;
	readonly purple_stained_glass_pane: BlockPane;
	readonly blue_stained_glass_pane: BlockPane;
	readonly brown_stained_glass_pane: BlockPane;
	readonly green_stained_glass_pane: BlockPane;
	readonly red_stained_glass_pane: BlockPane;
	readonly black_stained_glass_pane: BlockPane;
	readonly pumpkin_stem: BlockStem;
	readonly melon_stem: BlockStem;
	readonly cauldron: BlockCauldron;
	readonly water_cauldron: BlockCauldron;
	readonly oak_trapdoor: BlockTrapDoor;
	readonly spruce_trapdoor: BlockTrapDoor;
	readonly birch_trapdoor: BlockTrapDoor;
	readonly jungle_trapdoor: BlockTrapDoor;
	readonly acacia_trapdoor: BlockTrapDoor;
	readonly dark_oak_trapdoor: BlockTrapDoor;
	readonly iron_trapdoor: BlockTrapDoor;
	readonly lily_pad: BlockLilyPad;
	readonly dragon_egg: BlockDragonEgg;
	readonly anvil: BlockAnvil;
	readonly dispenser: BlockDispenser;
	readonly white_bed: BlockBed;
	readonly orange_bed: BlockBed;
	readonly magenta_bed: BlockBed;
	readonly light_blue_bed: BlockBed;
	readonly yellow_bed: BlockBed;
	readonly lime_bed: BlockBed;
	readonly pink_bed: BlockBed;
	readonly gray_bed: BlockBed;
	readonly light_gray_bed: BlockBed;
	readonly cyan_bed: BlockBed;
	readonly purple_bed: BlockBed;
	readonly blue_bed: BlockBed;
	readonly brown_bed: BlockBed;
	readonly green_bed: BlockBed;
	readonly red_bed: BlockBed;
	readonly black_bed: BlockBed;
	readonly reeds: BlockReed;
	readonly bone_block: BlockRotatedPillar;
	readonly hell_portal: BlockHellPortal;
	readonly cloud_block: BlockCloud;
	readonly [key: string]: Block;
};
