// Material types for blocks
export class Material {
	readonly air: boolean;
	isSolid(): boolean;
	isLiquid(): boolean;
	blocksMovement(): boolean;
	getCanBurn(): boolean;
	isReplaceable(): boolean;
	isOpaque(): boolean;
	isToolNotRequired(): boolean;
	getMobilityFlag(): number;
}

// Global Materials registry
export declare const Materials: {
	readonly air: Material;
	readonly grass: Material;
	readonly ground: Material;
	readonly wood: Material;
	readonly rock: Material;
	readonly iron: Material;
	readonly anvil: Material;
	readonly water: Material;
	readonly lava: Material;
	readonly leaves: Material;
	readonly plants: Material;
	readonly vine: Material;
	readonly sponge: Material;
	readonly cloth: Material;
	readonly fire: Material;
	readonly sand: Material;
	readonly circuits: Material;
	readonly carpet: Material;
	readonly glass: Material;
	readonly redstoneLight: Material;
	readonly tnt: Material;
	readonly coral: Material;
	readonly ice: Material;
	readonly packedIce: Material;
	readonly snow: Material;
	readonly craftedSnow: Material;
	readonly cactus: Material;
	readonly clay: Material;
	readonly gourd: Material;
	readonly dragonEgg: Material;
	readonly portal: Material;
	readonly cake: Material;
	readonly web: Material;
	readonly piston: Material;
	readonly barrier: Material;
	readonly structureVoid: Material;
};
