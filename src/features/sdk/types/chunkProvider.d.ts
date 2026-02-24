import type { BlockPos } from "./blockpos";
import type { Chunk } from "./chunk";

/** copied from https://github.com/Marcelektro/MCP-919/blob/main/src/minecraft/net/minecraft/world/chunk/IChunkProvider.java */
export interface IChunkProvider {
	/**
	 * Will return back a chunk, if it doesn't exist and it's not a MP client it will generates all the blocks for the
	 * specified chunk from the map seed and chunk seed
	 */
	provideChunk(x: number, z: number): Chunk;

	saveChunks(): Promise<void>;

	/** returns null on client */
	getPossibleCreatures(
		creatureType: EnumCreatureType,
		pos: BlockPos,
	): SpawnListEntry[] | null;

	getLoadedChunkCount(): number;

	unloadChunk(x: number, z: number): void;
	unloadAllChunks(): void;
}

export declare class ChunkProviderClient implements IChunkProvider {
	posToChunk: ChunkPosMap;
	dummyChunk: EmptyChunk;
	world: World;
	constructor(world: World);
	isLoaded(x: number, z: number): boolean;
	getLoadedChunkCount(): number;
	getLoadedChunkSet(): ChunkPosSet;
	loadChunk(x: number, z: number, packet: CPacketChunkData): Promise<Chunk>;
	unloadChunk(x: number, z: number): void;
	unloadAllChunks(): void;
	provideChunk(x: number, z: number): Chunk;
	saveChunks(): Promise<void>;
	getPossibleCreatures(_a: unknown, _b: unknown): null;
}
