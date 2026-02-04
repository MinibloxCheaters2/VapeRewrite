import { Box3, Vector3, Vector3Like } from "three/src/Three.Core.js";
import { Entity } from "./entity";

export declare class PBBlockPos {
	x: number;
	y: number;
	z: number;
}

export declare class BlockPos {
	toProto(): PBBlockPos;
	static readonly ORIGIN: BlockPos;
	x: number;
	y: number;
	z: number;
	constructor(x: number, y: number, z: number);
	getX(): number;
	getY(): number;
	getZ(): number;
	static fromVector(u: Vector3): BlockPos;
	static fromJSON(u: Vector3Like): BlockPos;
	static fromProto(u: PBBlockPos): BlockPos;
	static fromString(u: string): BlockPos;
	toVec3(): Vector3;
	toArray(): [this["x"], this["y"], this["z"]];
	static fromArray(u: [number, number, number]): BlockPos;
	static fromEntity(u: Entity): BlockPos;
	toAABB(): Box3;
	set(x: number, y: number, z: number): void;
	add(u: number, h: number, p: number): BlockPos;
	subtract(u: number, h: number, p: number): BlockPos;

	// Utility methods for block iteration
	static getAllInBoxMutable(min: BlockPos, max: BlockPos): BlockPos[];
	up(n?: number): BlockPos;
	down(n?: number): BlockPos;
	north(n?: number): BlockPos;
	south(n?: number): BlockPos;
	west(n?: number): BlockPos;
	east(n?: number): BlockPos;
	offset(facing: any, n?: number): BlockPos;
}
