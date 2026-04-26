export declare enum TypeOfHit {
	MISS = 0,
	BLOCK = 1,
	ENTITY = 2,
}
export declare class RayTraceResult {
	typeOfHit: TypeOfHit;
	hitVec: Vector3 | null;
	block: BlockPos | null;
	side: EnumFacing | null;
	entity: Entity | null;
	constructor(
		typeOfHit: TypeOfHit,
		hitVec: Vector3 | null,
		block: BlockPos | null,
		side: EnumFacing | null,
		entity: Entity | null,
	);
}
