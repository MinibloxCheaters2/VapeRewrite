import type { BlockPos } from "./blockpos";
import type { Entity, EntityPlayer } from "./entity";
import type { CPacketLeaderboard } from "./packets";

export interface Material {
	readonly air: boolean;
	isSolid(): boolean;
	isLiquid(): boolean;
	blocksMovement(): boolean;
}

export interface Block {
	name?: string;
	material: Material;
	getBoundingBox?(): {
		min: { x: number; y: number; z: number };
		max: { x: number; y: number; z: number };
	};
	isFullBlock(): boolean;
	isOpaqueCube(): boolean;
	isPassable(world: World, pos: BlockPos): boolean;
	getCollisionBoundingBox(world: World, pos: BlockPos): any;
}

export interface BlockState {
	getBlock(): Block;
	getMaterial(): Material;
}

export default class World {
	static mutableblockpos: BlockPos;
	static pos1: BlockPos;
	static pos2: BlockPos;
	players: Map<number, EntityPlayer>;
	totalTime: number;
	worldTime: number;
	tick: number;
	serverInterface: any;
	loadedEntityList: Entity[];
	unloadedEntityList: Map<number, Entity>;
	loadedTileEntitiesMap: any;
	tileEntitiesToBeRemoved: any[];
	chunkProvider: any[];
	ambientTickCountdown: number;
	scheduledUpdatesAreImmediate: boolean;
	leaderboards: Map<string, any>;
	enchantmentHelper: any;
	difficulty: any;
	simulationChunkSet: Set<any>;
	teamMap: Map<string, any>;
	/** IMPORTANT: USE DUMPS */
	entities: Map<number, Entity>;
	get isClient(): boolean;
	get isServer(): boolean;
	getBlockState(pos: BlockPos): BlockState;
	getBlock(pos: BlockPos): Block;
}

export declare class ClientWorld extends World {}
