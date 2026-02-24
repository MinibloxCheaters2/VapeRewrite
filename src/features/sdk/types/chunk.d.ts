import type { Block } from "./blocks";

export declare class Chunk {
	xPosition: number;
	zPosition: number;
	isChunkLoaded: boolean;
	isDummyChunk: boolean;
	cells: Cell[];
	blockBiomeArray: number[];
	/** can't find any uses of this, assuming a boolean. */
	updateSkylightColumns: boolean;
	/**
	 * index with `z << 4 | x` (z is the Z position and X is the x position)
	 */
	heightMap: number[];
	chunkTileEntityMap: BlockPosMap;
	entityLists: Entity[][];
	isModified: boolean;
	heightMapMinimum: number;
	hasEntities: boolean;
	lastSaveTime: number;
	culled: boolean;
	culledCells: Cell[];
	world: World;
	constructor(world: World, xPosition: number, zPosition: number);
	getHeight(pos: BlockPos): number;
	getHeightValue(x: number, z: number): number;
	getTopFilledSegment(): number;
	generateHeightMap(): void;
	getBlock(x: number, y: number, z: number): Block;
	getBlockState(pos: BlockPos): BlockState;
	setBlockState(pos: BlockPos, blockStateId: number): boolean;
	setChunkModified(): void;
	createNewTileEntity(pos: BlockPos): TileEntity;
	addTileEntity(tileEntity: TileEntity): void;
	removeTileEntity(tileEntity: TileEntity): void;
	getTileEntity(tileEntity: TileEntity, bl?: boolean): TileEntity;
	onChunkLoad(): void;
	onChunkUnload(): void;
	getEntitiesWithinAABBForEntity(
		excludedID: number | null,
		box: Box3,
		arr: Entity[],
		idk: null,
	): void;
	getEntitiesOfTypeWithinAABB(
		eType: string | null,
		box: Box3,
		arr: Entity[],
	): void;
	isEmpty(): boolean;
	getHeightMap(): number[];
	setHeightMap(heightMap: number[]): void;
	getTileEntityMap(): this["chunkTileEntityMap"];
	getEntityLists(): this["entityLists"];
	setHasEntities(hasEntities: boolean): void;
	setLastSaveTime(lastSaveTime: number): void;
	addEntity(box: Box3): void;
	removeEntity(entity: Entity): void;
	removeEntityAtIndex(entity: Entity, idx: number): void;
	canSeeSky(fromPos: BlockPos): boolean;
	updateCulledState(pos: BlockPos): void;
	cullChunk(): Promise<void>;
	toProto(dimension: number): Promise<CPacketChunkData>;
	static fromProto(world: World, packet: CPacketChunkData): Chunk;
	/** @param cellX gets used in for (let i = cellX; i < y; i += 16) and then this.cells gets indexed by i >> 4 inside of it */
	getAreLevelsEmpty(cellX: number, y: number): boolean;
}
export declare class EmptyChunk extends Chunk {
	isDummyChunk: boolean;
	constructor(world: World, x: number, z: number);
	getHeightValue(_x: number, _z: number): number;
	setBlockState(_x: number, _z: number): boolean;
	getBlock(x: number, y: number, z: number): Block;
	addEntity(entity: Entity): void;
	removeEntity(entity: Entity): void;
	removeEntityAtIndex(entity: Entity, idx: number): void;
	canSeeSky(pos: BlockPos): boolean;
	addTileEntity(tileEntity: TileEntity): void;
	removeTileEntity(tileEntity: TileEntity): void;
	onChunkLoad(): void;
	onChunkUnload(): void;
	getEntitiesWithinAABBForEntity(
		excludedID: number | null,
		box: Box3,
		arr: Entity[],
		idk: null,
	): void;
	isEmpty(): boolean;
}
