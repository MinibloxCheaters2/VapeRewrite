import type { Vector3 } from "three";
import type { BlockPos } from "./blockpos";
import type { Block } from "./blocks";
import type { Chunk } from "./chunk";
import type { IChunkProvider } from "./chunkProvider";
import type { Entity, EntityPlayer } from "./entity";
import type { EnumDifficulty } from "./enums";
import type { GameScene } from "./gameScene";
import type { CPacketLeaderboard } from "./packets";
import type { Game } from "./game";

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
	static mutableblockpos: BlockPos;
	static pos1: BlockPos;
	static pos2: BlockPos;
	players: Map<number, EntityPlayer>;
	totalTime: number;
	worldTime: number;
	tick: number;
	serverInterface: ServerInterface;
	loadedEntityList: Entity[];
	unloadedEntityList: Map<number, Entity>;
	loadedTileEntitiesMap: BlockPosMap;
	tileEntitiesToBeRemoved: unknown[];
	chunkProvider: IChunkProvider;
	ambientTickCountdown: number;
	scheduledUpdatesAreImmediate: boolean;
	leaderboards: Map<string, CPacketLeaderboard>;
	enchantmentHelper: EnchantmentHelper;
	difficulty: EnumDifficulty;
	/** absolutely references this, it only gets initialized. probably some thing for the server? */
	simulationChunkSet: Set<unknown>;
	teamMap: Map<string, Team>;
	/** IMPORTANT: USE DUMPS */
	entities: Map<number, Entity>;
	dimensionId: number;
	constructor(dimension: number);
	get isClient(): boolean;
	get isServer(): boolean;
	getActualHeight(): 256 | 128;
	getVisibleChunks(): void;
	getVisibleChunkCount(): void;
	getTeams(): Team[];
	addTeam(name: string, displayName: string): void;
	removeTeam(id: string): void;
	emptyTeam(id: string): void;
	joinTeam(id: string, ...members: EntityPlayer[]): void;
	leaveTeam(id: string, ...members: EntityPlayer[]): void;
	modifyTeam(id: string, which: string, value: string): void;
	getMobLimit(): number;
	getActiveChunkCount(): number;
	getActiveChunks(): void;
	updateAllPlayersSleepingFlag(): void;
	isBlockLoaded(bp: BlockPos, idk?: boolean): boolean;
	isChunkLoaded(x: number, z: number, idk: boolean): boolean;
	isAreaLoaded(start: Vector3, end: Vector3, p?: boolean): boolean;
	extendedLevelsInChunkCache(): boolean;
	isAreaLoadedCoord(
		sX: number,
		sY: number,
		sZ: number,
		eX: number,
		eY: number,
		eZ: number,
		clB: boolean,
	): boolean;
	getChunk(pos: BlockPos): Chunk;
	getChunkByID(x: number, z: number): Chunk;
	getBlock(pos: BlockPos): Block;
	getBlockState(pos: BlockPos): BlockState;
	setAir(pos: BlockPos, h?: number): void;
	setAirXYZ(x: number, y: number, z: number): void;
	isAir(pos: BlockPos): boolean;
	areaPassesCheck(
		min: BlockPos,
		max: BlockPos,
		checkFn: (b: Block) => boolean,
	): boolean;
	setBlockState(pos: BlockPos, state: BlockState, p?: number): boolean;
	setBlockRaw(pos: BlockPos, state: BlockState): void;
	notifyBlockOfStateChange(pos: ChunkPos, idk: unknown): void;
	notifyNeighborsOfStateChange(pos: ChunkPos, idk: unknown): void;
	notifyNeighborsOfStateExcept(
		u: ChunkPos,
		idk: unknown,
		facing: EnumFacing,
	): void;
	playSoundAtEntity(
		entity: Entity,
		name: string,
		volume?: number,
		pitch?: number,
	): void;
	playSoundAtPosition(
		pos: BlockPos,
		volume: number | undefined,
		pitch: number | undefined,
		name: string,
	): void;
	playSound(pos: BlockPos, volume?: number, pitch?: number): void;
	playSoundAtPositionClientSidePredicted(
		name: string,
		vol: number | undefined,
		pitch: number | undefined,
		pos: BlockPos,
		plr: EntityPlayer,
	): void;
	playPlaceSoundAtPositionClientSidePredicted(
		block: Block,
		pos: Vector3,
		plr: EntityPlayer,
	): void;
	spawnEntityInWorld(e: Entity): boolean;
	setEntityState(_a: unknown, _b: unknown): void;
	getEntityTracker(): void;
	loadEntities(entities: Entity[]): void;
	onEntityAdded(entity: Entity): void;
	markChunkDirty(pos: BlockPos): void;
	addItem(_a: unknown, _b: unknown): null;
	getEntityItem(u: Item, pos: Vector3, yOffset: number): EntityItem;
	getServer(): void;
	getConfigurationManager(): void;
	resetUpdateEntityTick(): void;
	getTopSolidOrLiquidBlock(pos: BlockPos): BlockPos;
	canBlockBePlaced(
		block: Block,
		pos: BlockPos,
		bl: boolean,
		_unused: unknown,
	): boolean;
	checkNoEntityCollision(box: Box3, _unused: unknown): boolean;
	emitToAllNearExcept(
		_a: unknown,
		_b: unknown,
		_c: unknown,
		_d: unknown,
		_e: unknown,
		_f: unknown,
		_g: unknown,
	): void;
	playSoundToNearExcept(
		player: EntityPlayer,
		pos: BlockPos,
		vol: number,
		pitch: number,
		name: string,
	): void;
	getCollidingBoundingBoxes(entity: Entity, box: Box3): Box3[];
	isAnyLiquid(box: Box3): boolean;
	isFlammableWithin(box: Box3): boolean;
	handleMaterialAcceleration(box: Box3, _a: unknown, e: Entity): boolean;
	getEntitiesWithinAABBExcludingEntity(
		excludedID: number,
		box: Box3,
	): Entity[];
	getEntitiesInAABBexcluding(
		excludedID: number | null,
		box: Box3,
		idk?: null,
	): Entity[];
	getDifficulty(): EnumDifficulty;
	setDifficulty(difficulty: EnumDifficulty): void;
	updatePlayerInventory(_a: unknown): void;
	onEntityRemoved(e: Entity): void;
	removeEntity(e: Entity): void;
	updateEntities(): void;
	isValid(v: Vector3): boolean;
	getTileEntity(pos: BlockPos): TileEntity | null;
	addTileEntity(u: TileEntity): void;
	addTileEntities(entities: TileEntity[]): void;
	removeTileEntity(pos: BlockPos): void;
	markTileEntityForRemoval(tileEntity: TileEntity): void;
	unloadEntities(entities: Entity[]): void;
	addBlockEvent(
		pos: BlockPos,
		idk: unknown,
		idk2: unknown,
		idk3: unknown,
	): void;
	reconcileBlock(_a: unknown, _b: unknown): void;
	forceBlockUpdateTick(block: Block, pos: BlockPos): void;
	getRenderDistanceChunks(): void;
	setActivePlayerChunksAndCheckLight(): void;
	static doesBlockHaveSolidTopSurface(world: World, pos: BlockPos): boolean;
	isBlockNormalCube(pos: BlockPos, idk: boolean): boolean;
	getLightBrightness(_a: unknown): 15 | -15;
	isBlockIndirectlyGettingPowered(facing: EnumFacing): number;
	isSidePowered(pos: BlockPos, idk: unknown): boolean;
	getRedstonePower(pos: BlockPos, idk: unknown): number;
	getStrongPowerWithDirection(pos: BlockPos, dir: EnumFacing): number;
	isBlockPowered(u: BlockPos): boolean;
	getStrongPower(pos: BlockPos, bl?: boolean): number;
	scheduleUpdate(_a: unknown, _b: unknown, _c: unknown): void;
	updateBlockTick(_a: unknown, _b: unknown, _c: unknown, _d: unknown): void;
	getEntitiesWithinAABB(
		eType: string | null,
		box: Box3,
		_?: unknown,
	): Entity[];
	findNearestEntityWithinAABB(
		eType: string,
		box: Box3,
		from_: Entity,
	): Entity | null;
	isBlockTickPending(_a: unknown, _b: unknown): boolean;
	updateComparatorOutputLevel(pos: BlockPos, idk: unknown): void;
	spawnParticle(
		particleType: EnumParticleTypes,
		xO: number,
		yO: number,
		zO: number,
		idk1: unknown,
		idk2: unknown,
		idk3: unknown,
		...v: unknown[]
	): void;
	getClosestPlayerToEntity(entity: Entity, max: number): EntityPlayer | null;
	getClosestPlayer(
		x: number,
		y: number,
		z: number,
		max: number,
	): EntityPlayer | null;
	isAnyPlayerWithinRangeAt(
		x: number,
		y: number,
		z: number,
		maxDist: number,
	): boolean;
	getSpawnPoint(): BlockPos;
	countEntities(creatureClass: unknown): number;
	getChunkProvider(): ChunkProvider;
	getSpawnListEntryForTypeAt(idk: unknown, idk2: unknown): unknown;
	/**
	 * @param idk1 passed to chunkProvider.getPossibleCreatures
	 * @param idk if (creature.entityClass == idk.entityClass)
	 */
	canCreatureTypeSpawnHere(
		idk1: unknown,
		idk: {
			entityClass: unknown;
		},
		idk2: unknown,
	): boolean;
	playersIterator(): MapIterator<EntityPlayer>;
	getPlayerCount(): number;
	getPlayerById(id: number): EntityPlayer;
	getAllPlayerNames(): string[];
	getEntityCount(): number;
	getLivingEntityCount(): number;
	getLiveBlock(pos: BlockPos): LiveBlock;
	sendMessageToAllPlayers(_a: unknown, _b: unknown): void;
	sendAnnouncementToAllPlayers(..._a: unknown[]): void;
	getBlockDensity(idk: unknown, box: Box3): number;
	createExplosion(
		entity: Entity,
		x: number,
		y: number,
		z: number,
		explosionSize: number,
		smoking: boolean,
	): Explosion;
	newExplosion(
		exploder: Entity,
		x: number,
		y: number,
		z: number,
		explosionSize: number,
		flaming: boolean,
		smoking: boolean,
	): Explosion;
	isAABBInMaterial(box: Box3, material: Material): boolean;
	updateEntity(entity: Entity, h?: boolean): void;
	handleEvent(_a: unknown): void;
	isDaytime(): boolean;
	canSeeSky(pos: BlockPos): boolean;
	ensureSpawnPoint(): void;
	checkBlockCollision(box: Box3): boolean;
	isSpawnChunk(x: number, y: number): boolean;
	getLightFromNeighbors(_a: unknown): number;
	getCommandRegistry(): null;
	getMobGriefing(): boolean;
	removePlayerEntityDangerously(entity: Entity): void;
}

export declare class ClientWorld extends World {
	private game: Game;
	private scene: GameScene;
	entityMesh: Map;
	leaderboardToMesh: Map;
	private entitySpawnQueue: Entity[];
	/** another relic, but this time I can't find it in MCP-919? */
	chunkRenderBlockUpdateListener: undefined;
	chunkProvider: ChunkProviderClient;
	constructor(game: Game, scene: GameScene, dimension: number);
	get isClient(): boolean;
	get isServer(): boolean;
	addPlayer(plr: EntityPlayer): void;
	addTileEntity(tile: TileEntity): void;
	removeTileEntity(pos: BlockPos): void;
	setBlockState(
		pos: BlockPos,
		state: BlockState,
		flags?: number,
		preRender?: boolean,
	): boolean;
	playSoundAtEntity(
		entity: Entity,
		name: string,
		volume?: number,
		pitch?: number,
	): void;
	playSoundAtPosition(
		name: string,
		pos: BlockPos,
		volume?: number,
		pitch?: number,
	): void;
	playSound(name: string, volume?: number, pitch?: number): void;
	displayBarrierParticles(x: number, y: number, z: number): void;
	spawnParticle(
		particle: EnumParticleTypes,
		xOff: number,
		yOff: number,
		zOff: number,
		idk1: unknown,
		idk2: unknown,
		idk3: unknown,
		pos: Vector3,
		...v: unknown[]
	): void;
	getEntitiesWithinAABB(eType: string | null, box: Box3): Entity[];
	update(): void;
	spawnEntityInWorld(h: Entity): boolean;
	onEntityAdded(entity: Entity): void;
	removeEntity(entity: Entity): void;
	onEntityRemoved(entity: Entity): void;
	removeEntityFromWorld(entity: Entity): Entity;
	removeAllEntities(): void;
	isBlockLoaded(bp: BlockPos): boolean;
	handleBlockUpdate(bpJSON: CPacketBlockUpdate): void;
	getRenderDistanceChunks(): number;
	clear(): void;
}
