declare class Explosion {
	isFlaming: boolean;
	isSmoking: boolean;
	/** not used anywhere, I assume it's left over from minecraft code. */
	explosionRNG: undefined;
	worldObj: World;
	explosionX: number;
	explosionY: number;
	explosionZ: number;
	exploder: Entity;
	explosionSize: number;
	affectedBlockPositions: BlockPos[];
	playerKnockbackMap: Map<Entity, Vector3$1>;
	constructor(
		world: World,
		exploder: Entity,
		x: number,
		y: number,
		z: number,
		explosionSize: number,
		flaming: boolean,
		smoking: boolean,
		affectedBlockPositions?: BlockPos[],
	);
	doExplosionA(): void;
	doExplosionB(bl: boolean): void;
	getPlayerKnockbackMap(): Map<Entity, Vector3$1>;
	getExplosivePlacedBy(): Entity | null;
	/**
	 * Clears `affectedBlockPositions` by setting its length field to `0`.
	 * Prime example #67 of Miniblox being skidded from MCP
	 */
	func_180342_d(): void;
	getAffectedBlockPositions(): BlockPos[];
}
