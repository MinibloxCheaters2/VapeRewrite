import type { BlockPos } from "./blockpos";
import type { Entity, EntityPlayer } from "./entity";
import type { CPacketLeaderboard } from "./packets";

export default class World {
	static mutableblockpos = new BlockPos(0, 0, 0);
	static pos1 = new BlockPos(0, 0, 0);
	static pos2 = new BlockPos(0, 0, 0);
	players = new Map<number, EntityPlayer>;
	totalTime = 0;
	worldTime = 0;
	tick = 0;
	serverInterface = new ServerInterface;
	loadedEntityList = [];
	unloadedEntityList = new Map<number, Entity>;
	loadedTileEntitiesMap = new BlockPosMap;
	tileEntitiesToBeRemoved = [];
	chunkProvider = [];
	ambientTickCountdown = 0;
	scheduledUpdatesAreImmediate = false;
	leaderboards = new Map<string, CPacketLeaderboard>;
	enchantmentHelper = new EnchantmentHelper;
	difficulty: EnumDifficulty = EnumDifficulty.NORMAL;
	simulationChunkSet = new Set;
	teamMap = new Map<string, Team>;
	/** IMPORTANT: USE DUMPS */
	entities: Map<number, Entity>;
	get isClient(): boolean;
	get isServer(): boolean;
}

export declare class ClientWorld extends World {}
