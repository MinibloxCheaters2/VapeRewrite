import type { BlockPos } from "./blockpos";
import type { Block } from "./blocks";
import type { Entity, EntityPlayer } from "./entity";
import type { EnumDifficulty } from "./enums";
import type { GameScene } from "./gameScene";
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
	chunkProvider: ChunkProvider;
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
	getActualHeight(): 128 | 256;
	getVisibleChunks(): void;
	getVisibleChunkCount(): void;
	getTeams(): Team[];
	addTeam(id: string, team: any): void;
	removeTeam(id: string): void;
	emptyTeam(id: string): void;
	joinTeam(id: string, ...members: unknown[]): void;
	leaveTeam(id: string, ...h: unknown[]): void;
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
	getChunk(pos: BlockPos): any;
	getChunkByID(u: any, h: any): any;
	getBlock(pos: BlockPos): any;
	getBlockState(pos: BlockPos): any;
	setAir(u: any, h?: number): void;
	setAirXYZ(u: any, h: any, p: any): void;
	isAir(pos: BlockPos): any;
	areaPassesCheck(u: any, h: any, p: any): boolean;
	setBlockState(pos: BlockPos, state: BlockState, p?: number): boolean;
	setBlockRaw(pos: BlockPos, state: BlockState): void;
	notifyBlockOfStateChange(pos: ChunkPos, idk: unknown): void;
	notifyNeighborsOfStateChange(pos: ChunkPos, idk: unknown): void;
	notifyNeighborsOfStateExcept(
		u: ChunkPos,
		idk: any,
		facing: EnumFacing,
	): void;
	playSoundAtEntity(
		entity: Entity,
		name: string,
		volume?: number,
		pitch?: number,
	): void;
	playSoundAtPosition(
		pos: any,
		volume: number | undefined,
		pitch: number | undefined,
		name: string,
	): void;
	playSound(pos: any, volume?: number, pitch?: number): void;
	playSoundAtPositionClientSidePredicted(
		pos: any,
		vol: number | undefined,
		pitch: number | undefined,
		name: string,
		y: any,
	): void;
	playPlaceSoundAtPositionClientSidePredicted(u: any, h: any, p: any): void;
	spawnEntityInWorld(e: Entity): boolean;
	setEntityState(_a: unknown, _b: unknown): void;
	getEntityTracker(): void;
	loadEntities(entities: Entity[]): void;
	onEntityAdded(entity: Entity): void;
	markChunkDirty(pos: BlockPos): void;
	addItem(_a: unknown, _b: unknown): null;
	getEntityItem(u: Item, pos: Vector3, yOffset: number): any;
	getServer(): void;
	getConfigurationManager(): void;
	resetUpdateEntityTick(): void;
	getTopSolidOrLiquidBlock(pos: BlockPos): any;
	canBlockBePlaced(u: any, pos: BlockPos, bl: boolean, _unused: unknown): any;
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
		_a: unknown,
		_b: unknown,
		_c: unknown,
		_d: unknown,
		_e: unknown,
	): void;
	getCollidingBoundingBoxes(entity: Entity, box: Box3): Box3[];
	isAnyLiquid(box: Box3): boolean;
	isFlammableWithin(box: Box3): boolean;
	handleMaterialAcceleration(box: Box3, _a: unknown, e: Entity): boolean;
	getEntitiesWithinAABBExcludingEntity(u: any, h: any): any[];
	getEntitiesInAABBexcluding(idk1: unknown, box: Box3, idk2: unknown): any[];
	getDifficulty(): EnumDifficulty;
	setDifficulty(u: EnumDifficulty): void;
	updatePlayerInventory(_a: unknown): void;
	onEntityRemoved(e: Entity): void;
	removeEntity(e: Entity): void;
	updateEntities(): void;
	isValid(v: Vector3): boolean;
	getTileEntity(pos: BlockPos): any;
	addTileEntity(u: TileEntity): void;
	addTileEntities(entities: TileEntity[]): void;
	removeTileEntity(pos: BlockPos): void;
	markTileEntityForRemoval(u: any): void;
	unloadEntities(entities: Entity[]): void;
	addBlockEvent(
		pos: BlockPos,
		idk: unknown,
		idk2: unknown,
		idk3: unknown,
	): void;
	reconcileBlock(_a: unknown, _b: unknown): void;
	forceBlockUpdateTick(_a: unknown, _b: unknown): void;
	getRenderDistanceChunks(): void;
	setActivePlayerChunksAndCheckLight(): void;
	static doesBlockHaveSolidTopSurface(u: any, h: any): boolean;
	isBlockNormalCube(pos: BlockPos, idk: boolean): boolean;
	getLightBrightness(_a: unknown): 15 | -15;
	isBlockIndirectlyGettingPowered(facing: EnumFacing): number;
	isSidePowered(idk: unknown, idk2: unknown): boolean;
	getRedstonePower(pos: BlockPos, idk: unknown): any;
	getStrongPowerWithDirection(u: any, h: any): any;
	isBlockPowered(u: BlockPos): boolean;
	getStrongPower(pos: BlockPos, bl: boolean): any;
	scheduleUpdate(u: any, h: any, p: any): void;
	updateBlockTick(u: any, h: any, p: any, g: any): void;
	getEntitiesWithinAABB(idk: unknown, box: Box3, p: any): Entity[];
	findNearestEntityWithinAABB(idk: unknown, box: Box3, from_: Entity): any;
	isBlockTickPending(u: any, h: any): boolean;
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
	getClosestPlayerToEntity(entity: Entity, max: number): any;
	getClosestPlayer(x: number, y: number, z: number, max: number): any;
	isAnyPlayerWithinRangeAt(
		x: number,
		y: number,
		z: number,
		maxDist: number,
	): boolean;
	getSpawnPoint(): any;
	countEntities(idk: unknown): number;
	getChunkProvider(): ChunkProvider;
	getSpawnListEntryForTypeAt(u: any, h: any): any;
	canCreatureTypeSpawnHere(u: any, h: any, p: any): boolean;
	playersIterator(): MapIterator<EntityPlayer>;
	getPlayerCount(): number;
	getPlayerById(u: any): any;
	getAllPlayerNames(): any[];
	getEntityCount(): number;
	getLivingEntityCount(): number;
	getLiveBlock(pos: BlockPos): any;
	sendMessageToAllPlayers(u: any, h: any): void;
	sendAnnouncementToAllPlayers(...u: any[]): void;
	getBlockDensity(idk: unknown, box: Box3): number;
	createExplosion(u: any, h: any, p: any, g: any, y: any, x: any): any;
	newExplosion(u: any, h: any, p: any, g: any, y: any, x: any, S: any): any;
	isAABBInMaterial(box: Box3, h: any): boolean;
	updateEntity(entity: Entity, h?: boolean): void;
	handleEvent(u: any): void;
	isDaytime(): boolean;
	canSeeSky(pos: BlockPos): any;
	ensureSpawnPoint(): void;
	checkBlockCollision(box: Box3): boolean;
	isSpawnChunk(x: number, y: number): boolean;
	getLightFromNeighbors(_a: unknown): number;
	getCommandRegistry(): null;
	getMobGriefing(): boolean;
	removePlayerEntityDangerously(entity: Entity): void;
}

export declare class ClientWorld extends World {
	scene: GameScene;
	entityMesh: Map;
	leaderboardToMesh: Map;
	entitySpawnQueue: Entity[];
	chunkRenderBlockUpdateListener;
	chunkProvider: ChunkProviderClient;
	get isClient(): true;
	get isServer(): false;
	addPlayer(h: EntityPlayer): void;
	playSoundAtEntity(
		entity: Entity,
		name: string,
		volume = 1,
		pitch = 1,
	): void;
	playSoundAtPosition(pos, volume = 1, pitch = 1, name: string): void;
	playSound(pos, volume = 1, pitch = 1): void;
	displayBarrierParticles(x: number, y: number, z: number): void;
	/** calls with `this` as the world argument {@linkcode EffectRenderer.spawnEffectParticle}. */
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
	update(): void;
	spawnEntityInWorld(e: Entity): boolean;
	onEntityAdded(h: Entity): void;
	removeEntity(h: Entity): void;
	onEntityRemoved(h: Entity): void;
	removeEntityFromWorld(e: Entity): Entity;
	removeAllEntities(): void;
	// there's an extra parameter but I forgor
	isBlockLoaded(pos: BlockPos): boolean;
	handleBlockUpdate(pos: { x: number; y: number; z: number }): void;
	getRenderDistanceChunks(): number;
	clear(): void;
}
