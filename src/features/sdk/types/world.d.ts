import type { BlockPos } from "./blockpos";
import { Block } from "./blocks";
import type { Entity, EntityPlayer } from "./entity";
import type { EnumDifficulty } from "./enums";
import type { CPacketLeaderboard } from "./packets";

export class Material {
	readonly air: boolean;
	isSolid(): boolean;
	isLiquid(): boolean;
	blocksMovement(): boolean;
}

export class BlockState {
	getBlock(): Block;
	getMaterial(): Material;
}

export declare class World {
	static mutableblockpos: BlockPos; /* = new BlockPos(0, 0, 0)*/
	static pos1: BlockPos; /* = new BlockPos(0, 0, 0)*/
	static pos2: BlockPos; /* = new BlockPos(0, 0, 0)*/
	players: Map<number, EntityPlayer>;
	totalTime: number;
	worldTime: number;
	tick: number;
	serverInterface: ServerInterface;
	loadedEntityList: Entity[];
	unloadedEntityList: Map<number, Entity>;
	loadedTileEntitiesMap: Map;
	tileEntitiesToBeRemoved: unknown[];
	chunkProvider: unknown[];
	ambientTickCountdown: number;
	scheduledUpdatesAreImmediate: boolean;
	leaderboards: Map<string, CPacketLeaderboard>;
	enchantmentHelper: EnchantmentHelper;
	difficulty: EnumDifficulty;
	simulationChunkSet: Set;
	teamMap: Map<string, Team>;
	/** IMPORTANT: USE DUMPS */
	entities: Map<number, Entity>;
	get isClient(): boolean;
	get isServer(): boolean;
	getBlockState(pos: BlockPos): BlockState;
	getBlock(pos: BlockPos): Block;
}

export declare class ClientWorld extends World {}
