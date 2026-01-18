import { Vector3 } from "three/src/Three.Core.js";
import { Axis, AxisDirection } from "./axis";

declare class EnumFacing {
	index: number;
	opposite: number;
	horizontalIndex: number;
	name: string;
	axisDirection: AxisDirection;
	axis: Axis;
	directionVec: Vector3;

	static readonly DOWN: EnumFacing;
	static readonly UP: EnumFacing;
	static readonly NORTH: EnumFacing;
	static readonly SOUTH: EnumFacing;
	static readonly WEST: EnumFacing;
	static readonly EAST: EnumFacing;
	static readonly getByName: {
		[name: string]: EnumFacing;
	};
	static readonly VALUES: EnumFacing[];
	static readonly HORIZONTALS: EnumFacing[];

	constructor(
		index: number,
		opposite: number,
		horizontalIndex: number,
		name: string,
		axisDirection: AxisDirection,
		axis: Axis,
		directionVec: Vector3,
	);
	getOpposite(): EnumFacing;
	getHorizontalIndex(): this["horizontalIndex"];
	isHorizontal(): this["axis"]["isHorizontal"];
	toJSON(): this["name"];
	valueOf(): this["name"];
	toProto(): this["name"];
	getAxis(): this["axis"];
	getIndex(): this["index"];
	rotateAround(u: Axis): EnumFacing;
	rotateY(): EnumFacing;
	rotateX(): EnumFacing;
	rotateZ(): EnumFacing;
	rotateYCCW(): EnumFacing;
	getFrontOffsetX(): number;
	getFrontOffsetY(): number;
	getFrontOffsetZ(): number;
	static getHorizontal(idx: number): EnumFacing;
	static random(): EnumFacing;
	static fromIndex(index: number): EnumFacing;
	static fromVector(vec: Vector3): EnumFacing;
	toVector(): Vector3;
	static toVector(facing: EnumFacing): Vector3;
	toArray(): [number, number, number];
	static fromAngle(angle: number): EnumFacing;
	static fromJSON(json: string): EnumFacing;
	static fromDirectionAndAxis(
		axisDirection: AxisDirection,
		axis: Axis,
	): EnumFacing;
	toAngleRadians(): number;
}
