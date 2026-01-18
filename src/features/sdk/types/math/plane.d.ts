import { EnumFacing } from "./facing";

type directionStr = "horizontal" | "vertical";

declare class Plane {
	static HORIZONTAL: Plane;
	static VERTICAL: Plane;

	facings: EnumFacing[];
	direction: directionStr;
	constructor(direction: directionStr);
	init(): void;
	static getHorizontal(): EnumFacing[];
	static randomHorizontal(): EnumFacing[];
	static getVertical(): EnumFacing[];
	random(): EnumFacing;
	equals(other: Plane): boolean;
}
