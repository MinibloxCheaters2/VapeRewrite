// Enum definitions extracted from Impact

export enum EnumDifficulty {
	PEACEFUL = 0,
	EASY = 1,
	NORMAL = 2,
	HARD = 3,
}

export enum Equipment_Slot {
	MAIN_HAND = 0,
	OFF_HAND = 1,
	FEET = 2,
	LEGS = 3,
	CHEST = 4,
	HEAD = 5,
}

export enum EnumCreatureAttribute {
	UNDEFINED = 0,
	UNDEAD = 1,
	ARTHROPOD = 2,
}

export declare class EnumFacing {
	static readonly DOWN: EnumFacing;
	static readonly UP: EnumFacing;
	static readonly NORTH: EnumFacing;
	static readonly SOUTH: EnumFacing;
	static readonly EAST: EnumFacing;
	static readonly WEST: EnumFacing;
	static readonly VALUES: EnumFacing[];

	getIndex(): number;
	getOpposite(): EnumFacing;
	toVector(): { x: number; y: number; z: number };
	getAxis(): "X" | "Y" | "Z";
}
