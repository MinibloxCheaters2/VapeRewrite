import { Game } from "./game";
import { Abilities, GameMode } from "./gamemode";
import {
	CPacketPlayerReconciliation,
	CPacketRespawn,
	SPacketPlayerInput,
} from "./packet";
import {
	AttributeMap,
	Block,
	BlockChest,
	CombatTracker,
	CommandBlockLogic,
	Container,
	ContainerPlayer,
	DataWatcher,
	EffectsManager,
	EnumCreatureAttribute,
	FoodStats,
	GameProfile,
	Inventory,
	InventoryEnderChest,
	InventoryPlayer,
	ItemStack,
	PotionEffect,
	Profile,
	TileEntitySign,
} from "./undefined";
import { Box3Helper, Vector3, Group, Mesh, Object3D, Quaternion } from "three";
import World from "./world";
import { BlockPos } from "./blockpos";
import { AxisAlignedBB } from "./aliases";
import { EnumFacing } from "./math/facing";
import { DamageSource } from "./damageSource";

declare enum Perspective {
	FIRST_PERSON,
	THIRD_PERSON,
	THIRD_PERSON_FRONT,
}

declare interface IInterface {
	getGuiID(): string;
}

declare class ClientEntityPlayerOther extends EntityPlayer {
	otherPlayerMPPosRotationIncrements;
	otherPlayerPos: Vector3;
	otherPlayerYaw: number;
	otherPlayerPitch: number;
	isItemInUse: boolean;
}

declare class ClientEntityPlayer extends PlayerMovement {
	perspective: Perspective;
	deltaFov: number;
	selectBox: Box3Helper;
	headInBlock: Block | null;
	lastHeadInBlock: Block | null;
	biome: string;
	lastReportedPos: Vector3;
	lastReportedYaw: number;
	lastReportedPitch: number;
	serverSneakState: boolean;
	serverSprintState: boolean;
	serverPunchState: boolean;
	serverBlockState: boolean;
	serverFlyState: boolean;
	serverMoveStrafe: number;
	serverMoveForward: number;
	lastItemUseTime: number;
	showDeathScreen: boolean;
	currentTile: BlockPos; //? is it a BlockPos
	prevInventory: Inventory;
	prevDefencePoints: number;
	game: Game;
	positionUpdateTicks: number;
	lastjump: number;
	constructor();
	init(socketId: string, p: Profile): void;
	checkInventoryChange(h?: boolean): void;
	resetPositionToBB(h?: boolean): void;
	addSelectBox(): void;
	respawn(packet?: CPacketRespawn): void;
	sendRespawnPacket(): void;
	renderCameraFOV(): void;
	renderCamera(dt: number): void;
	toggleCameraPerspective(): void;
	updatePlayerMesh(): void;
	sendPositionAndRotation(): void;
	sendActions(): void;
	sendAbilities(): void;
	onUpdateWalkingPlayer(): void;
	getMoveDirection(h: number): Vector3;
	updateClient(dt: number): void;
	updateSoundOrientation(): void;
	resetInventory(): void;
	onEnchantmentCritical(e: Entity): void;
	setXPStats(xp: number, total: number, level: number): void;
	openShop(): void;
	getClientModel(): CommandBlockLogic;
}
declare class PlayerMovement extends EntityPlayer {
	flyToggleTimer: number;
	sprintToggleTimer: number;
	sprintingTicksLeft: number;
	currentInput: SPacketPlayerInput | null;
	inputSequenceNumber: number;
	pendingInputs: SPacketPlayerInput[];
	serverDistance: number;
	/** **IMPORTANT**: USE DUMPS */
	moveStrafe: number;
	/** **IMPORTANT**: USE DUMPS */
	moveForward: number;
	jumping: boolean;
	constructor();
	reset(): void;
	updatePlayerMoveState(): void;
	reconcileServerPosition(serverPos: CPacketPlayerReconciliation): void;
	checkHeadInBlock(): void;
	getFovModifier(): number;
	fixedUpdate(): void;
}
declare class EntityPlayer extends EntityLivingBase {
	socketId: string | null;
	mode: GameMode;
	inventory: InventoryPlayer;
	inventoryEnderChest: InventoryEnderChest;
	abilities: Abilities;
	inventoryContainer: ContainerPlayer;
	openContainer: Container;
	punching: boolean;
	flySpeed: number;
	speedInAir: number;
	name: string;
	operator: boolean;
	effects: EffectsManager | null;
	foodStats: FoodStats;
	team: unknown | undefined;
	actualName: string;
	experienceLevel: number;
	lastXPSound: number;
	experienceTotal: number;
	experience: number;
	xpSeed: number;
	itemInUse: ItemStack | null;
	itemInUseCount: number;
	type: string;
	identifier: string;
	sleeping: boolean;
	sleepTimer: number;
	playerLocation: BlockPos | null;
	spawnChunk: BlockPos | null;
	spawnForced: boolean;
	home: unknown | undefined;
	xpCooldown: number;
	profile: GameProfile;
	kills: number;
	deaths: number;
	inventoryManager: unknown;
	fireTick: number;
	constructor(profile: Profile, world: World);
	isAdmin(): boolean;
	getItemInUse(): ItemStack;
	getItemInUseCount(): number;
	isUsingItem(): boolean;
	getItemInUseDuration(): number;
	stopUsingItem(): void;
	clearItemInUse(): void;
	isBlocking(): boolean;
	getHorizontalDirection(): EnumFacing;
	getEyeHeight(): number;
	canPlayerEdit(_?: unknown, __?: unknown, ___?: unknown): boolean;
	getActiveItemStack(): ItemStack;
	getInventoryEnderChest(): InventoryEnderChest;
	getEquipmentInSlot(h: unknown): unknown;
	onDeath(attackingPlayer: Entity): void;
	isSprinting(): boolean;
	attack(e: Entity): void;
	hasInferniumArmor(): boolean;
	onCriticalHit(entity: Entity): void;
	getJumpMovementFactor(): number;
	onPlayerUpdate(): void;
	checkCollisionWithEntities(): void;
	applyInput(input: SPacketPlayerInput, _unused?: boolean): void;
	addStat(h: unknown, p: unknown): void;
	addMovementStat(h: unknown, p: unknown, g: unknown): void;
	updateItemInUse(): void;
	/**
	 * gets the experience points of this entity
	 * @param _unused unused, this is called with `attackingPlayer` by EntityLivingBase#onDeath
	 */
	getExperiencePoints(_unused?: Entity): number;
	addExperience(xp: number): void;
	setExperience(h: unknown, p: unknown): void;
	xpBarCap(): number;
	removeExperienceLevel(h: unknown): void;
	addExperienceLevel(h: unknown): void;
	update(): void;
	setCurrentItemOrArmor(h: unknown, p: unknown): void;
	preparePlayerToSpawn(): void;
	setGamemode(gameMode: GameMode): boolean;
	displayGUIChest(chest: BlockChest): void;
	displayGui(h: IInterface): void;
	openEditSign(sign: TileEntitySign): void;
	closeScreen(): void;
	openEditCommandBlock(h: CommandBlockLogic): void;
	dropItemForPlayer(h: unknown, p?: boolean): unknown;
	dropItem(h: unknown, p: unknown, g: unknown, y?: boolean): unknown;
	joinEntityItemWithWorld(e: Entity): void;
	canHarvestBlock(h: unknown): boolean;
	getToolDigEfficiency(h: unknown): unknown;
	addExhaustion(h: unknown): void;
	getFoodStats(): FoodStats;
	canEat(h: unknown): boolean;
	shouldHeal(): boolean;
	setItemInUse(h: unknown, p: unknown): void;
	isInBed(): boolean;
	static getBedSpawnLocation(
		h: unknown,
		p: unknown,
		g: unknown,
	): Promise<Vector3>;
	updateItemUse(h: unknown, p: unknown): void;
	destroyCurrentEquippedItem(): void;
	onItemUseFinish(): void;
	handleStatusUpdate(h: unknown): void;
	setAbsorptionAmount(h: unknown): void;
	sendMessage(h: unknown, p: unknown): void;
	isPlayerSleeping(): boolean;
	isPlayerFullyAsleep(): boolean;
	getSleepTimer(): number;
	getBedLocation(): Vector3;
	isSpawnForced(): boolean;
	setSpawnPoint(h: unknown, p: unknown): void;
	wakeUpPlayer(h: unknown, p: unknown, g: unknown): void;
	trySleep(h: unknown): 0 | 4 | 3 | 2 | 5;
	isSpectator(): boolean;
	getCurrentEquippedItem(): ItemStack | null;
	interactFirst(h: unknown): boolean;
	interactWith(h: unknown): boolean;
	onTeamChanged(): void;
}
declare class EntityLivingBase extends Entity {
	activePotionsMap: Map<number, PotionEffect>;
	potionsNeedUpdate: boolean;
	absorptionAmount: number;
	health: number;
	maxHealth: number;
	attributeMap: AttributeMap;
	hurtTime: number;
	maxHurtTime: number;
	deathTime: number;
	revengeTimer: number;
	lastDamage: number;
	hurtResistantTime: number;
	maxHurtResistantTime: number;
	attackedAtYaw: number;
	attackingPlayer: EntityPlayer | null;
	recentlyHit: number;
	combatTracker: CombatTracker;
	landMovementFactor: number;
	jumpMovementFactor: number;
	limbSwingAmount: number;
	prevLimbSwingAmount: number;
	limbSwing: number;
	jumping: boolean;

	constructor(world: World);
	onKillCommand(): void;
	applyEntityAttributes(): void;
	getEntityAttribute(h: unknown): unknown;
	getAttributeMap(): AttributeMap;
	getCombatTracker(): unknown;
	lastDamager(): unknown;
	getHeldItem(): ItemStack | null;
	onEntityUpdate(): void;
	isChild(): boolean;
	isPlayer(): boolean;
	onDeathUpdate(): void;
	setOxygen(oxygen: number): void;
	getOxygen(): number;
	decreaseOxygenSupply(h: number): number;
	canBreatheUnderwater(): boolean;
	collideWithNearbyEntities(): void;
	canBePushed(): boolean;
	getAITarget(): unknown;
	getRevengeTimer(): number;
	setRevengeTarget(h: unknown): void;
	getLastAttacker(): unknown;
	getLastAttackerTime(): number;
	setLastAttacker(h: unknown): void;
	getAge(): number;
	collideWithEntity(e: Entity): void;
	setJumping(h: boolean): void;
	jump(): void;
	onItemPickup(h: unknown, p: unknown): void;
	canEntityBeSeen(e: Entity): boolean;
	isServerWorld(): boolean;
	isMovementBlocked(): boolean;
	updateEntityActionState(): void;
	renderBrokenItemStack(h: unknown): void;
	update(): void;
	dismountEntity(_: unknown): void;
	setPositionAndRotation2(
		x: number,
		y: number,
		z: number,
		yaw: number,
		pitch: number,
		S: unknown,
	): void;
	onLivingUpdate(): void;
	moveEntityWithHeading(strafe: number, forward: number): void;
	getAIMoveSpeed(): number;
	setAIMoveSpeed(speed: number): void;
	attackEntityAsMob(h: unknown): boolean;
	getEquipmentInSlot(h: unknown): void;
	getTotalArmorValue(): number;
	damageArmor(h: unknown): void;
	applyArmorCalculations(h: unknown, p: unknown): unknown;
	applyPotionDamageCalculations(h: unknown, p: unknown): unknown;
	damageEntity(h: Entity, p: unknown): void;
	getAbsorptionAmount(): number;
	setAbsorptionAmount(h: number): void;
	knockback(
		_unused_1: unknown,
		_unused_2: unknown,
		xM: number,
		yM: number,
	): void;
	getCreatureAttribute(): EnumCreatureAttribute;
	setBeenAttacked(): void;
	hasInferniumArmor(): boolean;
	getSoundPitch(): number;
	getMaxHealth(): number;
	getHealth(): number;
	setHealth(health: number): void;
	getFallSoundString(
		h: unknown,
	): "game.player.hurt.fall.big" | "game.player.hurt.fall.small";
	getHurtSound(): string;
	getDeathSound(): string;
	addRandomDrop(): void;
	dropFewItems(h: unknown, p: unknown): void;
	canDropLoot(): boolean;
	getInventory(): Inventory;
	getSoundVolume(): number;
	kill(): void;
	handleStatusUpdate(h: unknown): void;
	updatePotionEffects(): void;
	updatePotionMetadata(): void;
	resetPotionEffectMetadata(): void;
	clearActivePotions(): void;
	getActivePotionEffects(): PotionEffect[];
	isPotionActive(pot: Potion): boolean;
	getActivePotionEffect(h: unknown): unknown;
	addPotionEffect(h: unknown): void;
	isPotionApplicable(h: unknown): boolean;
	isEntityUndead(): boolean;
	removePotionEffectClient(h: unknown): void;
	removePotionEffect(h: unknown): void;
	onNewPotionEffect(h: unknown): void;
	onChangedPotionEffect(h: unknown, p: unknown): void;
	onFinishedPotionEffect(h: unknown): void;
	heal(add: number): void;
	getEyePositionVector(): Vector3;
	sendEnterCombat(): void;
	sendEndCombat(): void;
}

declare class RenderEntity extends Group {
	rotYaw: Quaternion;
	rotPitch: Quaternion;
	entity: Entity;
	debugMesh: Mesh;
}

declare class RenderLivingEntity extends RenderEntity {
	nameTag: Group;
	skeleton: Group;
	torso: Object3D;
	leftElbowJoint: Object3D;
	rightElbowJoint: Object3D;
	leftShoulder: Object3D;
	rightShoulder: Object3D;
	leftShoulderJoint: Object3D;
	rightShoulderJoint: Object3D;
	rightHand: Object3D;
	leftKneeJoint: Object3D;
	rightKneeJoint: Object3D;
	leftHip: Object3D;
	rightHip: Object3D;
	leftHipJoint: Object3D;
	rightHipJoint: Object3D;
	headPivot: Group;
	neck: Object3D;
	body: Group;
	armorMesh: Mesh;
	meshes: Mesh[];
	item;
	lastActiveItem;
	handMesh: Mesh;
	handTesr;
	prevCustomName: string;
}

declare class RenderPlayer extends RenderLivingEntity {
	model: ModelPlayer;
	capeMesh;
	hatMesh;
	punchingT;
	canvas: HTMLCanvasElement;
}

declare class Entity {
	static nextEntityID: number;
	mesh: RenderPlayer;
	id: number;
	world: World;
	pos: Vector3;
	prevPos: Vector3;
	serverPos: Vector3;
	noPhysics: boolean;
	yaw: number;
	pitch: number;
	prevYaw: number;
	prevPitch: number;
	ticksExisted: number;
	dead: boolean;
	width: number;
	height: number;
	boundingBox: AxisAlignedBB;
	isAirborne: boolean;
	inWeb: boolean;
	inWater: boolean;
	inLava: boolean;
	inCloud: boolean;
	fire: number;
	fireResistance: number;
	immuneToFire: boolean;
	onGround: boolean;
	isCollided: boolean;
	isCollidedVertically: boolean;
	isCollidedHorizontally: boolean;
	stepHeight: number;
	fallDistance: number;
	sneak: boolean;
	riddenByEntity: Entity | null;
	ridingEntity: Entity | null;
	inPortal: boolean;
	velocityChanged: boolean;
	timeUntilPortal: number;
	dataWatcher: DataWatcher;
	invulnerable: boolean;
	dimension: number;
	motion: Vector3;
	nextStepDistance: number;
	distanceWalkedModified: number;
	distanceWalkedOnStepModified: number;
	portalCounter: number;
	portalBlock: BlockPos | null;
	lastUpdate: number;
	constructor(world: World, profile?: Profile);
	onKillCommand(): void;
	getDisplayName(): string;
	getName(): string;
	isInWater(): boolean;
	isInLava(): boolean;
	isEating(): boolean;
	setEating(eating: boolean): void;
	entityInit(): void;
	getDataWatcher(): DataWatcher;
	dwReadB(id: number): boolean;
	dwSetB(id: number, state: boolean): void;
	getCustomNameTag(): string;
	setCustomNameTag(v: string): void;
	getAlwaysRenderNameTag(): boolean;
	setAlwaysRenderNameTag(v: boolean): void;
	onDataWatcherUpdate(id: number): void;
	equals(other: unknown): boolean;
	getEntityBoundingBox(): AxisAlignedBB;
	getRotationYawHead(): number;
	setSize(width: number, height: number): void;
	setVelocity(x: number, y: number, z: number): void;
	setPositionAndUpdate(x: number, y: number, z: number): void;
	setPosition(vec: Vector3): void;
	setPosition(x: number, y: number, z: number): void;
	setPositionAndRotation(
		x: number,
		y: number,
		z: number,
		yaw: number,
		pitch: number,
	): void;
	setPositionAndRotation2(
		x: number,
		y: number,
		z: number,
		yaw: number,
		pitch: number,
		_: unknown,
		S?: boolean,
	): void;
	setRotation(yaw: number, pitch: number): void;
	setLocationAndAngles(
		x: number,
		y: number,
		z: number,
		yaw?: number,
		pitch?: number,
	): void;
	offsetBBox(offset: Vector3): this["boundingBox"];
	setEntityBoundingBox(box: AxisAlignedBB): void;
	resetPositionToBB(): void;
	getEyeHeight(): number;
	getPartialTicks(): number;
	update(): void;
	kill(): void;
	preparePlayerToSpawn(): void;
	getMaxInPortalTime(): number;
	setWorld(world: World): void;
	travelToDimension(dimension: string): void;
	copyDataFromOld(oldEntity: Entity): void;
	onEntityUpdate(): void;
	setCurrentItemOrArmor(i: number, v: ItemStack | null): void;
	isBurning(): boolean;
	/**
	 * returns null if this isn't a {@linkcode EntityLivingBase}
	 */
	getInventory(): Inventory | null;
	toJSON(): {
		id: number;
		pos: Vector3;
		onGround: boolean;
	};
	fromJSON(u: { id: number; pos: Vector3; onGround: boolean }): void;
	testSneaking(u: unknown, h: unknown): void;
	testStepUp(u: unknown, h: unknown, p: unknown): boolean;
	handleWaterMovement(): boolean;
	fall(distance: number, damageMultiplier: number): void;
	updateFallState(
		y: number,
		onGround: boolean,
		block: Block | null,
		pos: BlockPos,
	): void;
	handleStatusUpdate(u: unknown): void;
	canBePushed(): boolean;
	isSilent(): boolean;
	isOnLadder(): boolean;
	getLadderSpeed(): 0.2 | 0.3;
	canTriggerWalking(): boolean;
	isOffsetPositionInLiquid(u: unknown, h: unknown, p: unknown): boolean;
	isLiquidPresentInAABB(u: AxisAlignedBB): boolean;
	moveFlying(dX: number, dY: number, dZ: number): void;
	moveEntity(dX: number, dY: number, dZ: number): void;
	playSound(x: number, y: number, z: number): void;
	applyEntityCollision(entity: Entity): void;
	addVelocity(x: number, y: number, z: number): void;
	dealFireDamage(damage: number): void;
	setFire(ticks: number): void;
	doBlockCollisions(): void;
	isOpenBlockSpace(u: Vector3): boolean;
	isEntityInsideOpaqueBlock(): boolean;
	isInsideOfMaterial(u: unknown): boolean;
	pushOutOfBlocks(x: number, y: number, z: number): boolean;
	canBeCollidedWith(): boolean;
	onCollideWithPlayer(u: unknown): void;
	getLook(): unknown;
	canCommandSenderUseCommand(u: unknown, h: unknown): boolean;
	getEyePos(): Vector3;
	canAttackWithItem(): boolean;
	hitByEntity(u: unknown): boolean;
	attackEntityFrom(source: DamageSource, amount: number): boolean;
	setBeenAttacked(): void;
	isEntityInvulnerable(u: unknown): boolean;
	onKillEntity(u: unknown): void;
	setOnFireFromLava(): void;
	setDead(): void;
	isEntityAlive(): boolean;
	setEntityState(u: unknown, h: unknown): void;
	onChunkLoad(): void;
	dropItem2(u: unknown, h: unknown): unknown;
	dropItemWithOffset(u: unknown, h: unknown, p: number): unknown;
	getDistanceSqToEntity(u: unknown): unknown;
	setSprinting(sprinting: boolean): void;
	isSprinting(): boolean;
	isInvisible(): boolean;
	/**
	 * Checks if this entity is invisible to the {@link player}
	 * @param player the player to check if this entity is invisible to
	 */
	isInvisibleTo(player: Entity): boolean;
	setInvisible(invisible: boolean): void;
	entityDropItem(stack: ItemStack, offsetY: number): EntityItem;
	doesEntityNotTriggerPressurePlate(): boolean;
	getHorizontalFacing(): unknown;
	getPosition(): BlockPos;
	getExplosionResistance(
		u: unknown,
		h: unknown,
		p: unknown,
		g: unknown,
	): unknown;
	verifyExplosion(
		explosion: unknown,
		worldObj: World,
		x: number,
		y: number,
		z: number,
	): boolean;
	isImmuneToExplosions(): boolean;
	getDistance(x: number, y: number, z: number): number;
	resetHeight(): void;
	getMaxFallHeight(): number;
	writeEntityToNBT(nbt: unknown): void;
	readEntityFromNBT(nbt: unknown): void;
	writeToNBT(u: unknown): void;
	getCollisionBorderSize(): number;
	readFromNBT(u: unknown): void;
	isOverworld(): boolean;
	interactFirst(u: unknown): boolean;
	applyEnchantments(u: unknown, h: unknown): void;
	isRiding(): boolean;
	getYOffset(): number;
	getMountedYOffset(): number;
	updateRiderPosition(): void;
	updateRidden(): void;
	mountEntity(e: Entity | null): void;
	updatePortal(u: unknown): void;
	getPortalCooldown(): number;
}

declare class EntityArrow extends Entity {
	type: "arrow";
	identifier: EntityName;
	shootingEntity: Entity;
	lastPos: Vector3;
	lastVel: Vector3;
	prevVel: Vector3;
	vel: Vector3;
	acc: Vector3;
	damage: number;
	knockbackStrength: number;
	canBePickedUp: boolean;
	inGround: boolean;
	ticksInGround: number;
	ticksInAir: number;
	xTile: number;
	yTile: number;
	zTile: number;
	inTile: boolean;
	arrowShake: number;
	lastArrowShake: number;
	constructor(
		world: World,
		shootingEntity: Entity,
		idk: number | Vector3,
		idk2: number,
		idk3: number,
	);
	setDamage(h: number): void;
	getDamage(): number;
	setKnockbackStrength(h: number): void;
	setThrowableHeading(
		mX: number,
		mY: number,
		mZ: number,
		y: number,
		x: number,
	): void;
	setIsCritical(h: boolean): void;
	getIsCritical(): boolean;
}

declare enum EntityName {
	UNDEFINED,
	ITEM,
	PLAYER,
	ARROW,
	SNOWBALL,
	ENDER_PEARL,
	EGG,
	POTION,
	ITEM_FRAME,
	FALLING_BLOCK,
	TNT,
	FIREBALL,
	PIG,
	COW,
	CHICKEN,
	SHEEP,
	ZOMBIE,
	ZOMBIE_COWMAN,
	SKELETON,
	CREEPER,
	SLIME,
	SPIDER,
	BOAT,
	SNOWMAN,
	GHOST,
}

declare class EntityItem extends Entity {
	identifier: EntityName.ITEM;
	age: number;
	delayBeforeCanPickup: number;
	health: number;
	constructor(world: World, stack?: ItemStack, pos?: Vector3);
	setEntityItemStack(stack: ItemStack): void;
	canTriggerWalking(): false;
	setPickupDelay(delay: number): void;
	setDefaultPickupDelay(): void;
}
