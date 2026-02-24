import type { ClientWorld, World } from "./world";

declare class EntityFX extends Entity {
	sprite: Sprite;
	mesh_: Mesh;
	particleTextureIndexX: number;
	particleTextureIndexY: number;
	particleTextureJitterX: number;
	particleTextureJitterY: number;
	particleAge: number;
	particleMaxAge: number;
	particleScale: number;
	particleGravity: number;
	particleRed: number;
	particleGreen: number;
	particleBlue: number;
	particleAlpha: number;
	constructor(
		world: World,
		xP: number,
		yP: number,
		zP: number,
		bl: boolean,
		initialYM?: number,
		initialZM?: number,
	);
	multiplyVelocity(multiplier: number): this;
	multipleParticleScaleBy(v: number): this;
	setRBGColorF(h: number, p: number, g: number): void;
	getRedColorF(): this["particleRed"];
	getGreenColorF(): this["particleGreen"];
	getBlueColorF(): this["particleBlue"];
	getAlpha(): this["particleAlpha"];
	canTriggerWalking(): boolean;
	entityInit(): void;
	update(): void;
	renderParticle(scene: GameScene, entity: Entity, g: number): void;
	remove(obj: Object3D): void;
	getFXLayer(): number;
	setParticleTextureIndex(idx: number): void;
	nextTextureIndexX(): void;
	canAttackWithItem(): boolean;
}
declare class EnumParticleTypes {
	static PARTICLES: Map<number, EnumParticleTypes>;
	static PARTICLE_NAMES: string[];
	static EXPLOSION_NORMAL: EnumParticleTypes;
	static EXPLOSION_LARGE: EnumParticleTypes;
	static EXPLOSION_HUGE: EnumParticleTypes;
	static FIREWORKS_SPARK: EnumParticleTypes;
	static WATER_BUBBLE: EnumParticleTypes;
	static WATER_SPLASH: EnumParticleTypes;
	static WATER_WAKE: EnumParticleTypes;
	static SUSPENDED: EnumParticleTypes;
	static SUSPENDED_DEPTH: EnumParticleTypes;
	static CRIT: EnumParticleTypes;
	static CRIT_MAGIC: EnumParticleTypes;
	static SMOKE_NORMAL: EnumParticleTypes;
	static SMOKE_LARGE: EnumParticleTypes;
	static SPELL: EnumParticleTypes;
	static SPELL_INSTANT: EnumParticleTypes;
	static SPELL_MOB: EnumParticleTypes;
	static SPELL_MOB_AMBIENT: EnumParticleTypes;
	static SPELL_WITCH: EnumParticleTypes;
	static DRIP_WATER: EnumParticleTypes;
	static DRIP_LAVA: EnumParticleTypes;
	static VILLAGER_ANGRY: EnumParticleTypes;
	static VILLAGER_HAPPY: EnumParticleTypes;
	static TOWN_AURA: EnumParticleTypes;
	static NOTE: EnumParticleTypes;
	static PORTAL: EnumParticleTypes;
	static ENCHANTMENT_TABLE: EnumParticleTypes;
	static FLAME: EnumParticleTypes;
	static LAVA: EnumParticleTypes;
	static FOOTSTEP: EnumParticleTypes;
	static CLOUD: EnumParticleTypes;
	static REDSTONE: EnumParticleTypes;
	static SNOWBALL: EnumParticleTypes;
	static SNOW_SHOVEL: EnumParticleTypes;
	static SLIME: EnumParticleTypes;
	static HEART: EnumParticleTypes;
	static BARRIER: EnumParticleTypes;
	static ITEM_CRACK: EnumParticleTypes;
	static BLOCK_CRACK: EnumParticleTypes;
	static BLOCK_DUST: EnumParticleTypes;
	static WATER_DROP: EnumParticleTypes;
	static ITEM_TAKE: EnumParticleTypes;
	static MOB_APPEARANCE: EnumParticleTypes;
	static COLOR: EnumParticleTypes;
	particleName: string;
	particleID: number;
	shouldIgnoreRange: boolean;
	argumentCount: number;
	constructor(
		name: string,
		id: number,
		ignoreRange: boolean,
		argCount?: number,
	);
	static getParticleNames(): (typeof EnumParticleTypes)["PARTICLE_NAMES"];
	getParticleName(): this["particleName"];
	getParticleID(): this["particleID"];
	getArgumentCount(): this["argumentCount"];
	getShouldIgnoreRange(): this["shouldIgnoreRange"];
	hasArguments(): boolean;
	static getParticleFromId(id: number): EnumParticleTypes | undefined;
}

declare class EffectRenderer {
	scene: GameScene;
	isGuiPlayerRenderer: boolean;
	fxLayers: EntityFX[][][];
	particleEmitters: EntityParticleEmitter[];
	particleTypes: Map<number, EntityFXFactory>;
	constructor(scene: GameScene, isGuiPlayerRenderer?: boolean);
	registerVanillaParticles(): void;
	registerParticle(id: number, h: EntityFXFactory): void;
	emitParticleAtEntity(
		world: World,
		entity: Entity,
		particleType: EnumParticleTypes,
	): void;
	spawnEffectParticle(
		world: ClientWorld,
		particle: EnumParticleTypes,
		xOff: number,
		yOff: number,
		zOff: number,
		idk1: unknown,
		idk2: unknown,
		idk3: unknown,
		pos: Vector3,
		...w: unknown[]
	): void;
	addEffect(e: EntityFX): void;
	updateEffects(): void;
	updateEffectLayer(layer: number): void;
	updateEffectAlphaLayer(alphaLayer: EntityFX[]): void;
	/** calls entity.update() within a try clause */
	tickParticle(entity: EntityFX): void;
	renderParticles(e: Entity, n?: number): void;
	addBlockDestroyEffects(pos: Vector3, state: BlockState, world: World): void;
	addBlockHitEffects(pos: BlockPos, facing: EnumFacing, world: World): void;
	/**
	 * if the math.random is less than the particle chance setting / 100, or the react location is `/account`.
	 */
	canSpawnParticle(): boolean;
}
